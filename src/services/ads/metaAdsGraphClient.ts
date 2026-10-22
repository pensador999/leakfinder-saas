/**
 * 🎯 META ADS GRAPH API CLIENT (ADSHIELD RESILIENCE ENGINE 2026.4)
 * 
 * Comunicação oficial com a Meta Graph API v19.0 / v20.0:
 * 1. Pausa atômica de Anúncios e Conjuntos de Anúncios em < 3 segundos
 * 2. Mapeamento de links de destino (creative link_data e url_tags)
 * 3. Suporte a modo real (com token de produção) e modo de alta fidelidade
 */

export interface MetaGraphApiResponse {
  success: boolean;
  adId?: string;
  adSetId?: string;
  status: 'PAUSED' | 'ACTIVE' | 'ERROR';
  latencyMs: number;
  error?: string;
  isSimulated?: boolean;
}

export interface MetaAdEntity {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  adsetId: string;
  campaignId: string;
  destinationUrl?: string;
  dailyBudgetBrl?: number;
}

export class MetaAdsGraphClient {
  private static GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

  /**
   * Pausa um anúncio individual no Meta Ads via Graph API
   */
  public static async pauseAd(adId: string, accessToken?: string): Promise<MetaGraphApiResponse> {
    const startTime = Date.now();
    const token = accessToken || process.env.META_SYSTEM_USER_ACCESS_TOKEN || '';

    // Modo de Simulação / Desenvolvimento caso não haja token real configurado
    if (!token || token.startsWith('mock_') || token === 'simulated') {
      const latencyMs = Math.floor(Math.random() * 25) + 15; // 15ms a 40ms de latência simulada
      return {
        success: true,
        adId,
        status: 'PAUSED',
        latencyMs,
        isSimulated: true
      };
    }

    try {
      const endpoint = `${this.GRAPH_API_BASE}/${adId}?status=PAUSED&access_token=${encodeURIComponent(token)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AdShield-Autonomous-OS/2026.4'
        }
      });

      const latencyMs = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          adId,
          status: 'PAUSED',
          latencyMs,
          isSimulated: false
        };
      }

      return {
        success: false,
        adId,
        status: 'ERROR',
        latencyMs,
        error: data.error?.message || `Meta API error HTTP ${response.status}`,
        isSimulated: false
      };
    } catch (err: any) {
      return {
        success: false,
        adId,
        status: 'ERROR',
        latencyMs: Date.now() - startTime,
        error: err.message || String(err),
        isSimulated: false
      };
    }
  }

  /**
   * Pausa um conjunto de anúncios inteiro (AdSet) caso o produto represente a verba total
   */
  public static async pauseAdSet(adSetId: string, accessToken?: string): Promise<MetaGraphApiResponse> {
    const startTime = Date.now();
    const token = accessToken || process.env.META_SYSTEM_USER_ACCESS_TOKEN || '';

    if (!token || token.startsWith('mock_') || token === 'simulated') {
      const latencyMs = Math.floor(Math.random() * 25) + 18;
      return {
        success: true,
        adSetId,
        status: 'PAUSED',
        latencyMs,
        isSimulated: true
      };
    }

    try {
      const endpoint = `${this.GRAPH_API_BASE}/${adSetId}?status=PAUSED&access_token=${encodeURIComponent(token)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const latencyMs = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          adSetId,
          status: 'PAUSED',
          latencyMs,
          isSimulated: false
        };
      }

      return {
        success: false,
        adSetId,
        status: 'ERROR',
        latencyMs,
        error: data.error?.message || `Meta API error HTTP ${response.status}`
      };
    } catch (err: any) {
      return {
        success: false,
        adSetId,
        status: 'ERROR',
        latencyMs: Date.now() - startTime,
        error: err.message || String(err)
      };
    }
  }

  /**
   * Action: Stock-Shield Stop-Loss — Pausa automaticamente conjunto de anúncios / anúncio em ruptura física
   */
  public static async pauseAdOnStockout(targetId: string, accessToken?: string): Promise<MetaGraphApiResponse> {
    if (targetId.startsWith('adset_')) {
      return this.pauseAdSet(targetId, accessToken);
    }
    return this.pauseAd(targetId, accessToken);
  }
}

export const metaAdsGraphClient = MetaAdsGraphClient;

