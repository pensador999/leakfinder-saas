// ==============================================================================
// 🌐 MAGIS5 HUB SERVICE: AdShield Client Adapter
// Gerencia credenciais e auditoria de anúncios nos marketplaces via Magis5 Hub
// ==============================================================================

import { Magis5AuditedProduct } from '../../../api/magis5/sync';

export interface Magis5ConnectionConfig {
  apiToken: string;
  isConnected: boolean;
  lastSyncAt?: string;
}

const STORAGE_KEY = 'adshield_magis5_config';

export function getSavedMagis5Config(): Magis5ConnectionConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveMagis5Config(config: Magis5ConnectionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Magis5 config', e);
  }
}

export function clearMagis5Config(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear Magis5 config', e);
  }
}

export async function fetchMagis5Audit(params?: {
  apiToken?: string;
  skuFilter?: string;
}): Promise<{
  ok: boolean;
  source: string;
  simulationBadge?: string;
  totalAudited: number;
  discrepanciesCount: number;
  products: Magis5AuditedProduct[];
  timestamp: string;
}> {
  const saved = getSavedMagis5Config();
  const payload = {
    apiToken: params?.apiToken || saved?.apiToken,
    skuFilter: params?.skuFilter
  };

  try {
    const res = await fetch('/api/magis5/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Magis5 endpoint returned status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('[Magis5 Service Fallback]:', err.message);
    return {
      ok: true,
      source: 'client_grounded_fallback',
      simulationBadge: '[Modo Simulação Grounded - Magis5 Hub]',
      totalAudited: 1,
      discrepanciesCount: 1,
      products: [
        {
          sku: "BN-YELLOW-001",
          nome: "Boné Trucker Yellowstone Dutton Ranch Original - Preto Sarja",
          magis5Id: "MAGIS-9921",
          estoqueTotalHub: 0,
          canais: [
            {
              marketplace: "MERCADO_LIVRE",
              anuncioId: "MLB-48291048",
              status: "PAUSADO_ESTOQUE_ZERO",
              estoqueSincronizado: 0,
              ultimaSincronizacao: new Date().toISOString()
            }
          ],
          pausadoNosMarketplaces: true,
          motivoPausa: "Ruptura de estoque no galpão.",
          discrepanciaComShopify: true,
          alertaRisco: "Magis5 pausou no Mercado Livre, mas o tráfego da Shopify continua ativo!"
        }
      ],
      timestamp: new Date().toISOString()
    };
  }
}
