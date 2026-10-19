/**
 * 🛡️ ANTI-BLOCKING EDGE PROXY & NETWORK RESILIENCE SERVICE (ADSHIELD SAAS)
 * Gerencia requisições com rotação de User-Agent, corrida de timeout (AbortController),
 * múltiplos proxies de contingência (Jina AI Edge Reader, AllOrigins, CorsProxy) e zero erros não-tratados.
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
  source: 'DIRECT_FETCH' | 'JINA_AI_EDGE_READER' | 'ALLORIGINS_PROXY' | 'CORSPROXY_FALLBACK' | 'SIMULATION_CACHE';
  latencyMs: number;
  error?: string;
}

export class EdgeProxyService {
  private static jsonCache = new Map<string, { data: string; expiresAt: number }>();

  private static getRandomUserAgent(): string {
    const idx = Math.floor(Math.random() * REALISTIC_USER_AGENTS.length);
    return REALISTIC_USER_AGENTS[idx];
  }

  private static toggleWww(urlStr: string): string | null {
    try {
      const parsed = new URL(urlStr);
      parsed.hostname = parsed.hostname.startsWith('www.')
        ? parsed.hostname.slice(4)
        : `www.${parsed.hostname}`;
      return parsed.toString();
    } catch {
      return null;
    }
  }

  /**
   * Normaliza URLs corporativas e corrige subdomínios legados ou redirecionamentos comuns.
   */
  public static normalizeTargetUrl(rawUrl: string): string {
    let clean = rawUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    // Trata redirecionamentos comuns de subdomínios de loja brasileira
    if (clean.includes('loja.salonline.com.br')) {
      clean = clean.replace('loja.salonline.com.br', 'www.salonline.com.br');
    }
    return clean;
  }

  /**
   * Executa uma requisição HTTP resiliente com corrida de 5 níveis de contingência anti-bloqueio.
   * No navegador, prioriza o proxy serverless oficial (/api/catalog-proxy) e protege endpoints .json contra corrupção Markdown do Jina AI.
   */
  public static async fetchResilient(rawUrl: string, timeoutMs = 4500): Promise<ProxyFetchResult> {
    const startTime = Date.now();
    const url = this.normalizeTargetUrl(rawUrl);
    const userAgent = this.getRandomUserAgent();
    const isBrowser = typeof window !== 'undefined';
    const isJsonEndpoint = /\.json(\?|$)/i.test(url) || url.includes('/api/catalog_system/');

    if (isJsonEndpoint) {
      const cached = this.jsonCache.get(url);
      if (cached && Date.now() < cached.expiresAt) {
        return {
          ok: true,
          status: 200,
          data: cached.data,
          source: 'DIRECT_FETCH',
          latencyMs: 1
        };
      }
    }

    const isValidExpectedPayload = (text: string): boolean => {
      if (!text) return false;
      if (isJsonEndpoint) {
        const trimmed = text.trim();
        return trimmed.startsWith('{') || trimmed.startsWith('[');
      }
      return true;
    };

    const cacheIfValidJson = (data: string) => {
      if (isJsonEndpoint && isValidExpectedPayload(data)) {
        this.jsonCache.set(url, { data, expiresAt: Date.now() + 10 * 60 * 1000 });
      }
    };

    // TIER 0 (Browser): Proxy Serverless Oficial (/api/catalog-proxy) — Zero CORS, JSON/HTML 100% puro
    if (isBrowser) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), Math.max(5500, timeoutMs));
        const serverProxyUrl = `/api/catalog-proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(serverProxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const text = await response.text();
          if (isValidExpectedPayload(text)) {
            cacheIfValidJson(text);
            return {
              ok: true,
              status: response.status,
              data: text,
              source: 'DIRECT_FETCH',
              latencyMs: Date.now() - startTime
            };
          }
        }
      } catch {
        // Continua para os próximos tiers caso /api/catalog-proxy não esteja ativo no ambiente
      }
    }

    // TIER 1: Requisição Direta com AbortController + Failover Automático www <-> sem-www
    const candidateUrls = [url];
    const altWwwUrl = this.toggleWww(url);
    if (altWwwUrl) candidateUrls.push(altWwwUrl);

    for (const candidateUrl of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), Math.min(3500, timeoutMs));

        const fetchInit: RequestInit = {
          signal: controller.signal
        };

        if (!isBrowser) {
          fetchInit.headers = {
            'User-Agent': userAgent,
            'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
          };
        }

        const response = await fetch(candidateUrl, fetchInit);
        clearTimeout(timeoutId);

        if (response.ok) {
          const text = await response.text();
          if (isValidExpectedPayload(text)) {
            cacheIfValidJson(text);
            return {
              ok: true,
              status: response.status,
              data: text,
              source: 'DIRECT_FETCH',
              latencyMs: Date.now() - startTime
            };
          }
        }
      } catch {
        // Tenta candidato alternativo (www <-> sem-www) ou avança para os próximos tiers
      }
    }

    // TIER 2: Jina AI Edge Reader (Apenas para páginas HTML — NUNCA para .json pois o Jina converte para Markdown)
    if (!isJsonEndpoint) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const jinaUrl = `https://r.jina.ai/${url}`;
        const jinaResponse = await fetch(jinaUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'text/plain',
            'X-With-Images-Summary': 'true',
            'X-No-Cache': 'true'
          }
        });

        clearTimeout(timeoutId);

        if (jinaResponse.ok) {
          const text = await jinaResponse.text();
          if (text && text.length > 200) {
            return {
              ok: true,
              status: 200,
              data: text,
              source: 'JINA_AI_EDGE_READER',
              latencyMs: Date.now() - startTime
            };
          }
        }
      } catch {
        // Ignora e cai para Tier 3
      }
    }

    // TIER 3: Proxy AllOrigins (CORS & Header Bypass)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Math.max(4000, timeoutMs));

      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        if (isValidExpectedPayload(text)) {
          return {
            ok: true,
            status: response.status,
            data: text,
            source: 'ALLORIGINS_PROXY',
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch {
      // Ignora e cai para Tier 4
    }

    // TIER 4: Proxy CorsProxy.io Fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Math.max(4000, timeoutMs));

      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(corsProxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        if (isValidExpectedPayload(text)) {
          return {
            ok: true,
            status: response.status,
            data: text,
            source: 'CORSPROXY_FALLBACK',
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch {
      // Fallback final
    }

    // TIER 5: Graceful Degradation (Sem quebrar a aplicação)
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
   * Helper seguro para busca de /products.json com suporte a Shopify e VTEX Search API
   */
  public static async fetchProductsJsonSafe(domain: string): Promise<any[] | null> {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Tentativa 1: Shopify /products.json
    const shopifyUrl = `https://${cleanDomain}/products.json?limit=30`;
    const shopifyRes = await this.fetchResilient(shopifyUrl, 3000);
    if (shopifyRes.ok && shopifyRes.data) {
      try {
        const parsed = JSON.parse(shopifyRes.data);
        if (parsed && Array.isArray(parsed.products)) {
          return parsed.products;
        }
      } catch {
        // Continua para VTEX
      }
    }

    // Tentativa 2: VTEX Catalog Search API
    const vtexUrl = `https://${cleanDomain}/api/catalog_system/pub/products/search?_from=0&_to=20`;
    const vtexRes = await this.fetchResilient(vtexUrl, 3000);
    if (vtexRes.ok && vtexRes.data) {
      try {
        const parsed = JSON.parse(vtexRes.data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normaliza formato VTEX para o formato universal
          return parsed.map((item: any, idx: number) => ({
            id: item.productId || `vtex-${idx}`,
            title: item.productName || item.productTitle || 'Produto VTEX',
            handle: item.linkText || item.productReference || `item-${idx}`,
            body_html: item.description || '',
            variants: (item.items || []).map((v: any) => ({
              id: v.itemId,
              title: v.name || 'Padrão',
              price: (v.sellers?.[0]?.commertialOffer?.Price || 159.9).toString(),
              sku: v.itemId || v.referenceId?.[0]?.Value,
              available: (v.sellers?.[0]?.commertialOffer?.AvailableQuantity || 0) > 0
            })),
            images: (item.items?.[0]?.images || []).map((img: any) => ({ src: img.imageUrl }))
          }));
        }
      } catch {
        // Fim das tentativas
      }
    }

    return null;
  }
}
