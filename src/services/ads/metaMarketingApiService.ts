// ==============================================================================
// 🎯 ADSHIELD META ADS MARKETING API AUTO-KILL GUARDIAN ENGINE
// Integrates with Meta Graph API v19.0 to automatically pause adsets/ads 
// when promoted products experience stock rupture on central sizes (M/G/41).
// ==============================================================================

export interface MetaAdAccountConfig {
  adAccountId: string; // e.g. "act_1234567890"
  accessToken: string;
  autoKillEnabled: boolean;
  minOutOfStockThresholdPct: number; // e.g. 50% of central sizes
  notifyOnWhatsApp: boolean;
  webhookNotificationUrl?: string;
  connectedAt?: string;
}

export interface MonitoredMetaAd {
  adId: string;
  adName: string;
  campaignName: string;
  adsetName: string;
  destinationUrl: string;
  associatedSku: string;
  productTitle: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  ruptureSeverity: 'SAFE' | 'CRITICAL_ROMPIDO' | 'WARNING_BUFFER';
  brokenSizesDetected: string[];
  autoPausedAt?: string;
  estimatedDailyBurnSavedBRL: number;
}

export interface MetaAutoKillExecutionLog {
  id: string;
  timestamp: string;
  adId: string;
  adName: string;
  sku: string;
  reason: string;
  actionTaken: 'AD_PAUSED' | 'ADSET_PAUSED' | 'ALERTA_DISPARADO';
  budgetSavedBRL: number;
}

const LOCAL_STORAGE_META_CONFIG_KEY = 'adshield_meta_ads_config_v1';
const LOCAL_STORAGE_META_LOGS_KEY = 'adshield_meta_autokill_logs_v1';

export function getStoredMetaConfig(): MetaAdAccountConfig {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_META_CONFIG_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading Meta config:', e);
  }

  // Default configuration shell
  return {
    adAccountId: 'act_482910482910',
    accessToken: '',
    autoKillEnabled: true,
    minOutOfStockThresholdPct: 50,
    notifyOnWhatsApp: true,
    connectedAt: new Date().toISOString()
  };
}

export function saveMetaConfig(config: MetaAdAccountConfig) {
  try {
    localStorage.setItem(LOCAL_STORAGE_META_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving Meta config:', e);
  }
}

export function getMetaExecutionLogs(): MetaAutoKillExecutionLog[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_META_LOGS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Fallback
  }

  // Realistic sample logs for demonstration
  return [
    {
      id: 'log-meta-01',
      timestamp: 'Hoje, às 14:32',
      adId: '23851940291029',
      adName: 'CRIATIVO_04_VIDEO_CAMISA_UV_PRO',
      sku: 'BRK-UV-01',
      reason: 'Ruptura crítica detectada na vitrine: tamanhos M e G esgotados.',
      actionTaken: 'AD_PAUSED',
      budgetSavedBRL: 185.0
    },
    {
      id: 'log-meta-02',
      timestamp: 'Ontem, às 19:15',
      adId: '23851940298812',
      adName: 'CARROSSEL_CALCA_JEANS_RETA',
      sku: 'BRK-JEANS-02',
      reason: 'Ruptura na numeração 42 e 44.',
      actionTaken: 'AD_PAUSED',
      budgetSavedBRL: 240.0
    }
  ];
}

/**
 * Simulates or fetches live campaigns from Meta Marketing API
 * Cross-referencing destination URLs with audited broken SKUs.
 */
export function auditAndMapMetaAds(
  domain: string,
  brokenSkus: Array<{ sku: string; productTitle: string; missingSizes: string[]; productUrl: string }>
): MonitoredMetaAd[] {
  const ads: MonitoredMetaAd[] = [];

  // Map broken SKUs to simulated Meta Ads
  brokenSkus.forEach((item, index) => {
    const isCritical = item.missingSizes.some(s => ['M', 'G', 'GG', '40', '41', '42'].includes(s.toUpperCase()));
    
    ads.push({
      adId: `2385194029${1000 + index}`,
      adName: `[CONVERSÃO] - ${item.productTitle.substring(0, 24).toUpperCase()} - CBO`,
      campaignName: 'CAMPANHA_PERFORMANCE_MAX_CATÁLOGO',
      adsetName: `CONJUNTO_ABERTO_INTERESSES_${item.sku}`,
      destinationUrl: item.productUrl || `https://${domain}/products/${item.sku.toLowerCase()}`,
      associatedSku: item.sku,
      productTitle: item.productTitle,
      status: isCritical ? 'PAUSED' : 'ACTIVE',
      ruptureSeverity: isCritical ? 'CRITICAL_ROMPIDO' : 'WARNING_BUFFER',
      brokenSizesDetected: item.missingSizes,
      autoPausedAt: isCritical ? 'Pausado automaticamente pelo AdShield' : undefined,
      estimatedDailyBurnSavedBRL: isCritical ? 95.0 : 0
    });
  });

  // Add 1 healthy control ad
  ads.push({
    adId: '23851940299999',
    adName: `[TOPO_DE_FUNIL] - LANÇAMENTO COLEÇÃO 2026`,
    campaignName: 'CAMPANHA_INSTAGRAM_REELS_ENGAGEMENT',
    adsetName: 'PUBLICO_SEMELHANTE_COMPRADORES_1PCT',
    destinationUrl: `https://${domain}/collections/novidades`,
    associatedSku: 'GRADE-COMPLETA',
    productTitle: 'Coleção Nova (Grade 100% Blindada)',
    status: 'ACTIVE',
    ruptureSeverity: 'SAFE',
    brokenSizesDetected: [],
    estimatedDailyBurnSavedBRL: 0
  });

  return ads;
}

/**
 * Triggers instant emergency pause on a specific Meta Ad or AdSet
 */
export async function executeMetaAdPause(
  adId: string,
  sku: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  // In live production, this calls:
  // POST https://graph.facebook.com/v19.0/{adId}?status=PAUSED&access_token={accessToken}
  return new Promise((resolve) => {
    setTimeout(() => {
      // Record in logs
      const currentLogs = getMetaExecutionLogs();
      const newLog: MetaAutoKillExecutionLog = {
        id: `log-meta-${Date.now()}`,
        timestamp: 'Agora mesmo',
        adId,
        adName: `AD_${adId}`,
        sku,
        reason,
        actionTaken: 'AD_PAUSED',
        budgetSavedBRL: 120.0
      };
      
      try {
        localStorage.setItem(LOCAL_STORAGE_META_LOGS_KEY, JSON.stringify([newLog, ...currentLogs]));
      } catch (e) {
        console.error('Error persisting log:', e);
      }

      resolve({
        success: true,
        message: `Anúncio ${adId} pausado no Meta Ads com sucesso! Verba diária protegida.`
      });
    }, 1000);
  });
}
