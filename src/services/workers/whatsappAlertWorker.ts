import type { MonitoredStore, StoreSnapshotDelta } from '../swarm/autonomousSwarmEngine.ts';
import type { AgentDiagnosticResult } from '../../types/index.ts';
import { calculateStoreFinancialGrounding } from '../ai/storeFinancialGroundingEngine.ts';
import { isCatalogProductBroken } from '../siteInspector.ts';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { StoreLocaleId } from '../../i18n/marketProfiles.ts';

export interface WhatsAppAlertPayload {
  to: string;
  message: string;
  priority: 'HIGH' | 'CRITICAL' | 'NORMAL';
  metadata: {
    storeId: string;
    storeUrl: string;
    score: number;
  };
}

export interface WhatsAppGatewayConfig {
  provider: 'DIRECT_LINK' | 'EVOLUTION_API' | 'Z_API' | 'GENERIC_WEBHOOK' | 'SIMULATION';
  endpointUrl: string;
  apiToken?: string;
  instanceName?: string;
  defaultPhone?: string;
}

const LOCAL_GATEWAY_CONFIG_KEY = 'adshield_whatsapp_gateway_config';
let memoryGatewayConfig: WhatsAppGatewayConfig | null = null;

export function getWhatsAppGatewayConfig(): WhatsAppGatewayConfig {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const stored = localStorage.getItem(LOCAL_GATEWAY_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch {
    // fallback to memory or default
  }
  if (memoryGatewayConfig) {
    return memoryGatewayConfig;
  }
  return {
    provider: 'DIRECT_LINK',
    endpointUrl: '',
    apiToken: '',
    instanceName: 'adshield-bot',
    defaultPhone: '5534991351122'
  };
}

export function saveWhatsAppGatewayConfig(config: WhatsAppGatewayConfig): void {
  memoryGatewayConfig = config;
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(LOCAL_GATEWAY_CONFIG_KEY, JSON.stringify(config));
    }
  } catch {
    // non-fatal in serverless/Node
  }
}

export function buildWhatsAppDirectUrl(phone: string, message: string): string {
  const raw = String(phone || '').trim();
  const digits = raw.replace(/\D/g, '');
  const hasExplicitInternationalPrefix = raw.startsWith('+') && !digits.startsWith('55');
  const canonicalPhone = hasExplicitInternationalPrefix || digits.startsWith('55') ? digits : `55${digits}`;
  return `https://api.whatsapp.com/send?phone=${canonicalPhone}&text=${encodeURIComponent(message)}`;
}

interface WhatsAppLocaleCopy {
  headerTitle: string;
  storeLabel: string;
  auditTimeLabel: string;
  deltaHeader: string;
  brokenHeader: string;
  missingPrefix: string;
  estimatedLossLabel: string;
  perMonthSuffix: string;
  recommendationLabel: string;
  recommendationText: string;
  shieldedHeader: string;
  shieldedText: string;
  shoppingShieldText: (count: number) => string;
  legalAlertHeader: string;
  legalDefaultText: string;
  fullDashboardLabel: string;
}

const WHATSAPP_LOCALE_COPY: Record<StoreLocaleId, WhatsAppLocaleCopy> = {
  'pt-BR': {
    headerTitle: '🛡️ *ADSHIELD INTEL • RELATÓRIO EXECUTIVO DIÁRIO*',
    storeLabel: '🏢 Loja',
    auditTimeLabel: '⏱️ Horário da Auditoria: *07:00 (Grounding 100%)*',
    deltaHeader: '📈 *Evolução nas últimas 24h:*',
    brokenHeader: '🚨 *Produtos em Anúncio com Grade Esgotada:*',
    missingPrefix: 'Sem',
    estimatedLossLabel: '💰 *Perda Estimada:*',
    perMonthSuffix: '/mês em queima de mídia.',
    recommendationLabel: '👉 *Recomendação:*',
    recommendationText: 'Repor tamanhos ou pausar criativo no Meta Ads.',
    shieldedHeader: '✅ *Catálogo Blindado:*',
    shieldedText: 'Nenhuma ruptura crítica detectada nas grades principais.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield:* ${count} produto(s) com Schema OutOfStock afetando lances de PMax.`,
    legalAlertHeader: '⚖️ *Alerta Legal (Decreto 7.962/13):*',
    legalDefaultText: 'Ajustes no rodapé necessários',
    fullDashboardLabel: '🔗 *Painel Completo:*'
  },
  'en-US': {
    headerTitle: '🛡️ *ADSHIELD INTEL • DAILY EXECUTIVE BRIEFING*',
    storeLabel: '🏢 Store',
    auditTimeLabel: '⏱️ Audit Timestamp: *07:00 AM (100% Grounding)*',
    deltaHeader: '📈 *24h Performance Delta:*',
    brokenHeader: '🚨 *Advertised Products with Core Size Stockouts:*',
    missingPrefix: 'Missing',
    estimatedLossLabel: '💰 *Estimated Ad Bleed:*',
    perMonthSuffix: '/mo in wasted ad spend.',
    recommendationLabel: '👉 *Recommended Action:*',
    recommendationText: 'Restock core sizes or pause active Meta Ads creatives.',
    shieldedHeader: '✅ *Shielded Catalog:*',
    shieldedText: 'Zero critical stockouts detected across core size grids.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield:* ${count} product(s) with OutOfStock Schema impacting PMax bidding.`,
    legalAlertHeader: '⚖️ *Compliance Alert (FTC / CCPA / ADA):*',
    legalDefaultText: 'Footer disclosure adjustments recommended',
    fullDashboardLabel: '🔗 *Full Control Tower:*'
  },
  'en-GB': {
    headerTitle: '🛡️ *ADSHIELD INTEL • DAILY EXECUTIVE BRIEFING*',
    storeLabel: '🏢 Store',
    auditTimeLabel: '⏱️ Audit Timestamp: *07:00 AM (100% Grounding)*',
    deltaHeader: '📈 *24h Performance Delta:*',
    brokenHeader: '🚨 *Advertised Products with Core Size Stockouts:*',
    missingPrefix: 'Missing',
    estimatedLossLabel: '💰 *Estimated Ad Bleed:*',
    perMonthSuffix: '/mo in wasted ad spend.',
    recommendationLabel: '👉 *Recommended Action:*',
    recommendationText: 'Restock core sizes or pause active Meta Ads creatives.',
    shieldedHeader: '✅ *Shielded Catalogue:*',
    shieldedText: 'Zero critical stockouts detected across core size grids.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield:* ${count} product(s) with OutOfStock Schema impacting PMax bidding.`,
    legalAlertHeader: '⚖️ *Compliance Alert (UK GDPR / Consumer Rights):*',
    legalDefaultText: 'Footer disclosure adjustments recommended',
    fullDashboardLabel: '🔗 *Full Control Tower:*'
  },
  'de-DE': {
    headerTitle: '🛡️ *ADSHIELD INTEL • TÄGLICHER EXECUTIVE-BERICHT*',
    storeLabel: '🏢 Shop',
    auditTimeLabel: '⏱️ Prüfungszeitpunkt: *07:00 Uhr (100% Grounding)*',
    deltaHeader: '📈 *Entwicklung der letzten 24 Std.:*',
    brokenHeader: '🚨 *Beworbene Produkte mit Kerngrößen-Ausfall:*',
    missingPrefix: 'Fehlt',
    estimatedLossLabel: '💰 *Geschätzter Werbeverlust:*',
    perMonthSuffix: '/Monat an verbranntem Ad-Budget.',
    recommendationLabel: '👉 *Empfehlung:*',
    recommendationText: 'Größen nachfüllen oder Meta-Ads-Creatives pausieren.',
    shieldedHeader: '✅ *Katalog Geschützt:*',
    shieldedText: 'Keine kritischen Größenausfälle im Hauptsortiment erkannt.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield:* ${count} Produkt(e) mit OutOfStock-Schema beeinträchtigen PMax-Gebote.`,
    legalAlertHeader: '⚖️ *Rechtlicher Hinweis (Impressumspflicht / DSGVO / BFSG):*',
    legalDefaultText: 'Anpassungen im Footer erforderlich',
    fullDashboardLabel: '🔗 *Vollständiges Dashboard:*'
  },
  'fr-FR': {
    headerTitle: '🛡️ *ADSHIELD INTEL • RAPPORT EXÉCUTIF QUOTIDIEN*',
    storeLabel: '🏢 Boutique',
    auditTimeLabel: '⏱️ Heure de l’Audit : *07h00 (Grounding 100%)*',
    deltaHeader: '📈 *Évolution sur les dernières 24h :*',
    brokenHeader: '🚨 *Produits Sponsorisés avec Rupture de Tailles Clés :*',
    missingPrefix: 'Manque',
    estimatedLossLabel: '💰 *Perte Publicitaire Estimée :*',
    perMonthSuffix: '/mois en budget publicitaire gaspillé.',
    recommendationLabel: '👉 *Recommandation :*',
    recommendationText: 'Réapprovisionner les tailles ou mettre en pause les publicités Meta Ads.',
    shieldedHeader: '✅ *Catalogue Blindé :*',
    shieldedText: 'Aucune rupture critique détectée sur les grilles principales.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield :* ${count} produit(s) avec Schema OutOfStock impactant les enchères PMax.`,
    legalAlertHeader: '⚖️ *Alerte Légale (LCEN / RGPD / EAA) :*',
    legalDefaultText: 'Ajustements des mentions légales requis en pied de page',
    fullDashboardLabel: '🔗 *Tableau de Bord Complet :*'
  },
  'es-ES': {
    headerTitle: '🛡️ *ADSHIELD INTEL • INFORME EJECUTIVO DIARIO*',
    storeLabel: '🏢 Tienda',
    auditTimeLabel: '⏱️ Hora de la Auditoría: *07:00 (Grounding 100%)*',
    deltaHeader: '📈 *Evolución en las últimas 24h:*',
    brokenHeader: '🚨 *Productos en Anuncio con Tallas Agotadas:*',
    missingPrefix: 'Sin',
    estimatedLossLabel: '💰 *Pérdida Estimada:*',
    perMonthSuffix: '/mes en gasto publicitario desperdiciado.',
    recommendationLabel: '👉 *Recomendación:*',
    recommendationText: 'Reponer tallas o pausar creatividades en Meta Ads.',
    shieldedHeader: '✅ *Catálogo Blindado:*',
    shieldedText: 'Sin rupturas críticas detectadas en las tallas principales.',
    shoppingShieldText: (count) => `🛍️ *Google Shopping Shield:* ${count} producto(s) con Schema OutOfStock afectando pujas de PMax.`,
    legalAlertHeader: '⚖️ *Alerta Legal (LSSI-CE / RGPD / EAA):*',
    legalDefaultText: 'Ajustes legales recomendados en el pie de página',
    fullDashboardLabel: '🔗 *Panel Completo:*'
  }
};

/**
 * Builds high-converting, grounded executive alert messages for store owners
 */
export function formatDailyWhatsAppExecutiveSummary(
  store: MonitoredStore | any,
  diagnostic: AgentDiagnosticResult | any,
  delta?: StoreSnapshotDelta | any,
  locale?: StoreLocaleId
): string {
  const realSiteData = diagnostic?.realSiteData || diagnostic?.siteData || {};
  const resolvedLocale: StoreLocaleId =
    (locale && WHATSAPP_LOCALE_COPY[locale] ? locale : undefined) ||
    (realSiteData?.detectedMarketLocale && WHATSAPP_LOCALE_COPY[realSiteData.detectedMarketLocale as StoreLocaleId]
      ? (realSiteData.detectedMarketLocale as StoreLocaleId)
      : 'pt-BR');
  const copy = WHATSAPP_LOCALE_COPY[resolvedLocale] || WHATSAPP_LOCALE_COPY['pt-BR'];

  const score = diagnostic?.growthScore ?? diagnostic?.overallHealthScore ?? 80;
  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const brokenSkus = catalogIssues.filter(isCatalogProductBroken);
  const siteDataWithLocale = {
    ...realSiteData,
    detectedMarketLocale: resolvedLocale
  };
  const normalizedInput = diagnostic?.input || {
    siteUrl: realSiteData.url || store?.storeUrl || '',
    niche: store?.niche || 'MODA_VESTUARIO'
  };
  const finances = calculateStoreFinancialGrounding(siteDataWithLocale, normalizedInput, diagnostic?.social);
  const brandTitle = store?.brandName || store?.storeName || realSiteData.brandName || 'Store';

  let message = `${copy.headerTitle}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `${copy.storeLabel}: *${brandTitle}* (${finances.tierLabel})\n`;
  message += `📊 AdShield Score: *${score}/100* ${score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴'}\n`;
  message += `${copy.auditTimeLabel}\n\n`;

  if (delta && typeof delta.scoreDelta === 'number' && delta.scoreDelta !== 0) {
    message += `${copy.deltaHeader}\n`;
    const isPtDelta = /evolução|alerta de queda|subiu|caiu/i.test(delta.evolutionSummary || '');
    if (resolvedLocale !== 'pt-BR' && (isPtDelta || !delta.evolutionSummary)) {
      const sign = delta.scoreDelta > 0 ? `+${delta.scoreDelta}` : `${delta.scoreDelta}`;
      const localizedDelta =
        resolvedLocale === 'de-DE'
          ? `AdShield Score veränderte sich um ${sign} Punkte.`
          : resolvedLocale === 'fr-FR'
          ? `Le score AdShield a évolué de ${sign} points.`
          : resolvedLocale === 'es-ES'
          ? `El AdShield Score varió ${sign} puntos.`
          : `AdShield Score shifted by ${sign} points.`;
      message += `${localizedDelta}\n\n`;
    } else {
      message += `${delta.evolutionSummary}\n\n`;
    }
  }

  if (brokenSkus.length > 0) {
    message += `${copy.brokenHeader}\n`;
    brokenSkus.slice(0, 3).forEach((sku: any, idx: number) => {
      const rawSizes = sku.brokenCoreSizes?.length ? sku.brokenCoreSizes : (sku.missingSizes || []);
      const localizedSizes = (Array.isArray(rawSizes) ? rawSizes : []).map((tok: string) => {
        if (!tok || resolvedLocale === 'pt-BR') return tok;
        const u = tok.trim().toUpperCase();
        if (u === 'ESGOTADO') return resolvedLocale === 'de-DE' ? 'AUSVERKAUFT' : resolvedLocale === 'fr-FR' ? 'ÉPUISÉ' : resolvedLocale === 'es-ES' ? 'AGOTADO' : 'SOLD OUT';
        if (u === 'ÚNICO (ESGOTADO)' || u === 'UNICO (ESGOTADO)') return resolvedLocale === 'de-DE' ? 'EINHEITSGRÖSSE (AUSVERKAUFT)' : resolvedLocale === 'fr-FR' ? 'TAILLE UNIQUE (ÉPUISÉ)' : resolvedLocale === 'es-ES' ? 'TALLA ÚNICA (AGOTADO)' : 'ONE SIZE (SOLD OUT)';
        if (u === 'ESTOQUE_FANTASMA_SUSPEITO' || u === 'ESTOQUE_FANTASMA') return resolvedLocale === 'de-DE' ? 'GEISTERBESTAND' : resolvedLocale === 'fr-FR' ? 'STOCK FANTÔME' : resolvedLocale === 'es-ES' ? 'STOCK FANTASMA' : 'GHOST INVENTORY';
        return tok;
      });
      message += `${idx + 1}. *${sku.productTitle}* (${copy.missingPrefix}: ${localizedSizes.join(', ')})\n`;
    });
    message += `\n${copy.estimatedLossLabel} ${finances.financialRisk.formattedAdWaste}${copy.perMonthSuffix}\n`;
    message += `${copy.recommendationLabel} ${copy.recommendationText}\n\n`;
  } else {
    message += `${copy.shieldedHeader} ${copy.shieldedText}\n\n`;
  }

  if (realSiteData.googleShoppingShield && realSiteData.googleShoppingShield.discrepantProductsCount > 0) {
    message += `${copy.shoppingShieldText(realSiteData.googleShoppingShield.discrepantProductsCount)}\n\n`;
  }

  if (realSiteData.legalCompliance && !realSiteData.legalCompliance.isFullyCompliant) {
    const rawLegalDesc = realSiteData.legalCompliance.violations?.[0]?.description || '';
    const isPtLegal = /ausência|rodapé|cnpj|arrependimento/i.test(rawLegalDesc);
    const legalDesc = resolvedLocale !== 'pt-BR' && (!rawLegalDesc || isPtLegal)
      ? copy.legalDefaultText
      : (rawLegalDesc || copy.legalDefaultText);
    message += `${copy.legalAlertHeader} ${legalDesc}\n\n`;
  }

  message += `${copy.fullDashboardLabel} https://adshield.ai/dashboard?store=${encodeURIComponent(store?.storeUrl || '')}`;

  return message;
}

/**
 * Dispatches a WhatsApp alert message via configured gateway (Evolution API / Z-API / Webhook)
 */
export async function dispatchWhatsAppAlert(
  payload: WhatsAppAlertPayload,
  config?: WhatsAppGatewayConfig
): Promise<{ success: boolean; dispatchId: string; directUrl?: string; error?: string }> {
  const gateway = config || getWhatsAppGatewayConfig();
  const directUrl = buildWhatsAppDirectUrl(payload.to, payload.message);

  // If Direct Link mode: immediately ready for 1-click WhatsApp opening
  if (gateway.provider === 'DIRECT_LINK') {
    return {
      success: true,
      dispatchId: `direct-wpp-${Date.now()}`,
      directUrl
    };
  }

  // If simulation mode or missing endpoint
  if (gateway.provider === 'SIMULATION' || !gateway.endpointUrl) {
    return {
      success: true,
      dispatchId: `sim-wpp-${Date.now()}`,
      directUrl
    };
  }

  try {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    let body: any = {};

    if (gateway.provider === 'EVOLUTION_API') {
      headers['apikey'] = gateway.apiToken || '';
      body = {
        number: payload.to.replace(/\D/g, ''),
        text: payload.message
      };
    } else if (gateway.provider === 'Z_API') {
      headers['Client-Token'] = gateway.apiToken || '';
      body = {
        phone: payload.to.replace(/\D/g, ''),
        message: payload.message
      };
    } else {
      // Generic Webhook
      if (gateway.apiToken) {
        headers['Authorization'] = `Bearer ${gateway.apiToken}`;
      }
      body = payload;
    }

    const response = await fetch(gateway.endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (response.ok) {
      return { success: true, dispatchId: `wpp-sent-${Date.now()}`, directUrl };
    } else {
      const errText = await response.text();
      return { success: false, dispatchId: `wpp-err-${Date.now()}`, directUrl, error: errText };
    }
  } catch (err: any) {
    return { success: false, dispatchId: `wpp-fail-${Date.now()}`, directUrl, error: err?.message || 'Network error' };
  }
}

/**
 * Drains and processes the alert_dispatch_queue from Supabase
 */
export async function processPendingAlertsQueue(
  supabase: SupabaseClient,
  gatewayConfig?: WhatsAppGatewayConfig
): Promise<{ processedCount: number; successCount: number; failedCount: number }> {
  let processedCount = 0;
  let successCount = 0;
  let failedCount = 0;

  try {
    const { data: pendingAlerts, error } = await supabase
      .from('alert_dispatch_queue')
      .select('*')
      .eq('status', 'PENDING')
      .limit(20);

    if (error || !pendingAlerts || pendingAlerts.length === 0) {
      return { processedCount: 0, successCount: 0, failedCount: 0 };
    }

    for (const alert of pendingAlerts) {
      processedCount++;
      const res = await dispatchWhatsAppAlert(
        {
          to: alert.phone_number,
          message: alert.message_body,
          priority: alert.priority || 'HIGH',
          metadata: {
            storeId: alert.store_id || '',
            storeUrl: '',
            score: 0
          }
        },
        gatewayConfig
      );

      if (res.success) {
        successCount++;
        await supabase
          .from('alert_dispatch_queue')
          .update({
            status: 'SENT',
            sent_at: new Date().toISOString()
          })
          .eq('id', alert.id);
      } else {
        failedCount++;
        await supabase
          .from('alert_dispatch_queue')
          .update({
            status: 'FAILED',
            error_detail: res.error || 'Dispatch error'
          })
          .eq('id', alert.id);
      }

      // Anti-spam pause of 300ms between messages
      await new Promise(r => setTimeout(r, 300));
    }
  } catch {
    // handled
  }

  return { processedCount, successCount, failedCount };
}
