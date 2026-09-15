// ==============================================================================
// 🌐 REMOTE MCP WORKER CLIENT BRIDGE (ADSHIELD SAAS)
// Connects the web application / agents to the remote Docker MCP Headless Worker
// with automatic fallback to local scraping when offline.
// ==============================================================================

export interface RemoteMcpConfig {
  workerUrl: string; // ex: http://localhost:3001 ou https://worker.up.railway.app
  apiKey?: string;
  timeoutMs: number;
}

export interface RemoteAuditResponse {
  success: boolean;
  data?: {
    targetUrl: string;
    pageTitle: string;
    loadTimeMs: number;
    httpStatus: number;
    headTags: {
      hasMetaPixel: boolean;
      metaPixelId?: string;
      hasGoogleTagManager: boolean;
      hasTikTokPixel: boolean;
      hasGoogleAnalytics4: boolean;
    };
    conversionElements: {
      ctaCount: number;
      primaryCtaText: string;
      hasPixDiscount: boolean;
      hasFreeShippingMention: boolean;
    };
    contactChannels: {
      detectedWhatsApp?: string;
      whatsAppLink?: string;
      hasFloatingChatWidget: boolean;
    };
    catalogSnapshot: {
      visibleProductsCount: number;
      sampleProducts: {
        title: string;
        price: number;
        availableSizes: string[];
        missingSizes: string[];
        hasRupture: boolean;
      }[];
    };
    screenshotBase64?: string;
  };
  error?: string;
}

const LOCAL_STORAGE_MCP_KEY = 'adshield_remote_mcp_config_v1';

export function getRemoteMcpConfig(): RemoteMcpConfig {
  const envUrl = (import.meta as any)?.env?.VITE_REMOTE_MCP_WORKER_URL || '';
  const defaultCfg: RemoteMcpConfig = {
    workerUrl: envUrl || 'http://localhost:3001',
    apiKey: '',
    timeoutMs: 35000
  };

  if (typeof window === 'undefined') return defaultCfg;

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MCP_KEY);
    return raw ? { ...defaultCfg, ...JSON.parse(raw) } : defaultCfg;
  } catch {
    return defaultCfg;
  }
}

export function saveRemoteMcpConfig(cfg: RemoteMcpConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_MCP_KEY, JSON.stringify(cfg));
  }
}

/**
 * Verifica o status de saúde do worker MCP remoto.
 */
export async function checkRemoteMcpHealth(config?: RemoteMcpConfig): Promise<{ isOnline: boolean; metrics?: any }> {
  const cfg = config || getRemoteMcpConfig();
  if (!cfg.workerUrl) return { isOnline: false };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${cfg.workerUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return { isOnline: true, metrics: data };
    }
    return { isOnline: false };
  } catch {
    return { isOnline: false };
  }
}

/**
 * Dispara uma inspeção headless remota via Worker MCP (Container Docker).
 */
export async function executeRemoteMcpInspection(
  storeUrl: string, 
  includeScreenshot = true,
  config?: RemoteMcpConfig
): Promise<RemoteAuditResponse> {
  const cfg = config || getRemoteMcpConfig();

  if (!cfg.workerUrl) {
    throw new Error('URL do Worker MCP não configurada.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (cfg.apiKey) {
    headers['Authorization'] = `Bearer ${cfg.apiKey}`;
    headers['x-api-key'] = cfg.apiKey;
  }

  try {
    const response = await fetch(`${cfg.workerUrl}/api/audit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url: storeUrl,
        includeScreenshot
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Erro desconhecido');
      return {
        success: false,
        error: `HTTP ${response.status}: ${errText}`
      };
    }

    const payload = await response.json();
    return payload;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' 
        ? 'Timeout: O worker MCP excedeu o tempo limite para renderizar a loja.' 
        : (err.message || 'Falha na conexão com o worker MCP remoto.')
    };
  }
}
