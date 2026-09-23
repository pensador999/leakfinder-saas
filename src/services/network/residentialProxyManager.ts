/**
 * 🛡️ RESIDENTIAL PROXY & ASN ROTATION MANAGER (ADSHIELD RESILIENCE ENGINE 2026.4)
 * 
 * Blindagem contra WAF (Cloudflare 1020, Akamai, DataDome e AWS WAF):
 * 1. Simulação de IPs Residenciais Brasileiros (Vivo, Claro, TIM)
 * 2. Suporte a Sessões Sticky (10 min por loja) ou Rotação por Requisição
 * 3. Detecção Automática de Desafios WAF (Cloudflare Turnstile, 403, 429)
 * 4. Fallback com Comutação Imediata de Nó em caso de Bloqueio
 * 5. Coerência de Headers HTTP/2 e Client Hints (sec-ch-ua)
 */

export interface ProxyNodeConfig {
  id: string;
  provider: 'BRIGHT_DATA' | 'SMARTPROXY' | 'DECAPROXY' | 'CUSTOM_SOCKS5' | 'DIRECT_DEV';
  host: string;
  port: number;
  username?: string;
  password?: string;
  country: string; // 'BR'
  asnCarrier?: 'VIVO_TELEFONICA' | 'CLARO_NET' | 'TIM_BRASIL' | 'GENERIC_RESIDENTIAL';
  isHealthy: boolean;
  lastUsedAt?: number;
}

export interface ProxyRequestHeaders {
  'User-Agent': string;
  'Accept': string;
  'Accept-Language': string;
  'sec-ch-ua': string;
  'sec-ch-ua-mobile': string;
  'sec-ch-ua-platform': string;
  'Upgrade-Insecure-Requests': string;
  'Cache-Control': string;
}

export class ResidentialProxyManager {
  private static stickySessions = new Map<string, { proxyUrl: string; expiresAt: number }>();

  /**
   * Lista de operadoras residenciais do Brasil para mascaramento de ASN
   */
  private static BRAZILIAN_CARRIER_ASNS = [
    { code: 'AS27699', name: 'TELEFÔNICA BRASIL S.A (VIVO FIBRA)', label: 'VIVO_TELEFONICA' as const },
    { code: 'AS28573', name: 'CLARO BRASIL (NET FIBRA)', label: 'CLARO_NET' as const },
    { code: 'AS26615', name: 'TIM BRASIL TELECOMUNICAÇÕES', label: 'TIM_BRASIL' as const }
  ];

  /**
   * Gera cabeçalhos consistentes para simular um navegador Google Chrome desktop no Brasil
   */
  public static getConsistentClientHeaders(): ProxyRequestHeaders {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache'
    };
  }

  /**
   * Obtém ou cria uma sessão Sticky de proxy para o domínio da loja (duração: 10 minutos)
   */
  public static getStickyProxyForDomain(domain: string): {
    proxyUrl: string;
    carrierName: string;
    isStickySession: boolean;
    hasRealCredentials?: boolean;
  } {
    const cleanDomain = domain.replace(/https?:\/\//, '').split('/')[0];
    const now = Date.now();
    const existing = this.stickySessions.get(cleanDomain);

    if (existing && existing.expiresAt > now) {
      return {
        proxyUrl: existing.proxyUrl,
        carrierName: 'VIVO_TELEFONICA (Sticky Session Ativa)',
        isStickySession: true,
        hasRealCredentials: true
      };
    }

    // Cria nova sessão residencial de 10 minutos
    const carrierIdx = Math.floor(Math.random() * this.BRAZILIAN_CARRIER_ASNS.length);
    const carrier = this.BRAZILIAN_CARRIER_ASNS[carrierIdx];
    const sessionId = `session_${Math.random().toString(36).slice(2, 10)}`;

    const env = typeof process !== 'undefined' ? process.env : {};
    const hasRealCredentials = Boolean(env.RESIDENTIAL_PROXY_USER && env.RESIDENTIAL_PROXY_PASS);
    const proxyUser = env.RESIDENTIAL_PROXY_USER || 'adshield_dev_user';
    const proxyPass = env.RESIDENTIAL_PROXY_PASS || 'adshield_dev_pass';
    const proxyHost = env.RESIDENTIAL_PROXY_HOST || 'br.residential.proxy-network.io';
    const proxyPort = env.RESIDENTIAL_PROXY_PORT || '8080';

    const proxyUrl = `http://${proxyUser}-${carrier.code}-${sessionId}:${proxyPass}@${proxyHost}:${proxyPort}`;

    // Guarda por 10 minutos
    this.stickySessions.set(cleanDomain, {
      proxyUrl,
      expiresAt: now + (10 * 60 * 1000)
    });

    return {
      proxyUrl,
      carrierName: `${carrier.label} (${carrier.name})`,
      isStickySession: false,
      hasRealCredentials
    };
  }

  /**
   * Fornece os argumentos de inicialização para o Chromium no Puppeteer
   */
  public static getBrowserLaunchArgs(domain?: string): string[] {
    const baseArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--lang=pt-BR,pt'
    ];

    const env = typeof process !== 'undefined' ? process.env : {};
    if (domain && env.RESIDENTIAL_PROXY_HOST && env.RESIDENTIAL_PROXY_USER) {
      const hostOnly = env.RESIDENTIAL_PROXY_HOST;
      baseArgs.push(`--proxy-server=http://${hostOnly}`);
    }

    return baseArgs;
  }

  /**
   * Detecta se o HTML ou resposta retornada contém um desafio WAF (Cloudflare, Akamai ou DataDome)
   */
  public static isWafChallengeDetected(html: string, statusCode: number): boolean {
    if (statusCode === 403 || statusCode === 429) {
      return true;
    }
    const lower = (html || '').toLowerCase();
    const challengePatterns = [
      'just a moment...',
      'cloudflare ray id',
      'checking your browser',
      'cf-turnstile',
      'challenges.cloudflare.com',
      'access denied | error 1020',
      'datadome',
      'incident id',
      'verify you are a human'
    ];

    return challengePatterns.some(pattern => lower.includes(pattern));
  }

  /**
   * Força a invalidação da sessão sticky atual para comutar para um novo nó de IP
   */
  public static rotateIpImmediately(domain: string): void {
    const cleanDomain = domain.replace(/https?:\/\//, '').split('/')[0];
    this.stickySessions.delete(cleanDomain);
  }
}

