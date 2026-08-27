/**
 * 🛡️ ANTI-BLOCKING EDGE PROXY & NETWORK RESILIENCE SERVICE (LEAKFINDER SAAS)
 * Gerencia requisições com rotação de User-Agent, corrida de timeout (AbortController),
 * múltiplos proxies de contingência (CORS / Cloudflare bypass) e zero erros não-tratados.
 */

const REALISTIC_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
];

export interface ProxyFetchResult {
  ok: boolean;
  status: number;
  data: string;
  source: 'DIRECT_FETCH' | 'ALLORIGINS_PROXY' | 'CORSPROXY_FALLBACK' | 'SIMULATION_CACHE';
  latencyMs: number;
  error?: string;
}

export class EdgeProxyService {
  private static getRandomUserAgent(): string {
    const idx = Math.floor(Math.random() * REALISTIC_USER_AGENTS.length);
    return REALISTIC_USER_AGENTS[idx];
  }

  /**
   * Executa uma requisição HTTP resiliente com corrida de 3 níveis de contingência anti-bloqueio.
   */
  public static async fetchResilient(url: string, timeoutMs = 4500): Promise<ProxyFetchResult> {
    const startTime = Date.now();
    const userAgent = this.getRandomUserAgent();

    // TIER 1: Requisição Direta com AbortController
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,application/json,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        return {
          ok: true,
          status: response.status,
          data: text,
          source: 'DIRECT_FETCH',
          latencyMs: Date.now() - startTime
        };
      }
    } catch {
      // Ignora erro silenciosamente e cai para Tier 2
    }

    // TIER 2: Proxy AllOrigins (CORS & Header Bypass)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        return {
          ok: true,
          status: response.status,
          data: text,
          source: 'ALLORIGINS_PROXY',
          latencyMs: Date.now() - startTime
        };
      }
    } catch {
      // Ignora e cai para Tier 3
    }

    // TIER 3: Proxy CorsProxy.io Fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(corsProxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        return {
          ok: true,
          status: response.status,
          data: text,
          source: 'CORSPROXY_FALLBACK',
          latencyMs: Date.now() - startTime
        };
      }
    } catch {
      // Fallback final
    }

    // TIER 4: Graceful Degradation (Sem quebrar a aplicação)
    return {
      ok: false,
      status: 504,
      data: '',
      source: 'SIMULATION_CACHE',
      latencyMs: Date.now() - startTime,
      error: 'Tempo limite ou proteção de firewall da loja. Ativando telemetria de contingência.'
    };
  }

  /**
   * Helper seguro para busca de /products.json com garantia de retorno de objeto ou null
   */
  public static async fetchProductsJsonSafe(domain: string): Promise<any[] | null> {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const url = `https://${cleanDomain}/products.json?limit=30`;

    const result = await this.fetchResilient(url, 4000);
    if (!result.ok || !result.data) {
      return null;
    }

    try {
      const parsed = JSON.parse(result.data);
      if (parsed && Array.isArray(parsed.products)) {
        return parsed.products;
      }
    } catch {
      return null;
    }

    return null;
  }
}
