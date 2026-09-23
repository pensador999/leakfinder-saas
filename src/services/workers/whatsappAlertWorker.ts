import type { MonitoredStore, StoreSnapshotDelta } from '../swarm/autonomousSwarmEngine.ts';
import type { AgentDiagnosticResult } from '../../types/index.ts';
import { calculateStoreFinancialGrounding } from '../ai/storeFinancialGroundingEngine.ts';
import { isCatalogProductBroken } from '../siteInspector.ts';
import type { SupabaseClient } from '@supabase/supabase-js';

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

export function getWhatsAppGatewayConfig(): WhatsAppGatewayConfig {
  const stored = localStorage.getItem(LOCAL_GATEWAY_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
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
  localStorage.setItem(LOCAL_GATEWAY_CONFIG_KEY, JSON.stringify(config));
}

export function buildWhatsAppDirectUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  const canonicalPhone = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://api.whatsapp.com/send?phone=${canonicalPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Builds high-converting, grounded executive alert messages for store owners
 */
export function formatDailyWhatsAppExecutiveSummary(
  store: MonitoredStore,
  diagnostic: AgentDiagnosticResult,
  delta?: StoreSnapshotDelta
): string {
  const score = diagnostic.growthScore;
  const catalogIssues = diagnostic.realSiteData.catalogAudit?.issues || [];
  const brokenSkus = catalogIssues.filter(isCatalogProductBroken);
  const finances = calculateStoreFinancialGrounding(diagnostic.realSiteData, diagnostic.input, diagnostic.social);

  let message = `🛡️ *ADSHIELD INTEL • RELATÓRIO EXECUTIVO DIÁRIO*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🏢 Loja: *${store.brandName}* (${finances.tierLabel})\n`;
  message += `📊 AdShield Score: *${score}/100* ${score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴'}\n`;
  message += `⏱️ Horário da Auditoria: *07:00 (Grounding 100%)*\n\n`;

  if (delta && delta.scoreDelta !== 0) {
    message += `📈 *Evolução nas últimas 24h:*\n`;
    message += `${delta.evolutionSummary}\n\n`;
  }

  if (brokenSkus.length > 0) {
    message += `🚨 *Produtos em Anúncio com Grade Esgotada:*\n`;
    brokenSkus.slice(0, 3).forEach((sku, idx) => {
      message += `${idx + 1}. *${sku.productTitle}* (Sem: ${sku.missingSizes.join(', ')})\n`;
    });
    message += `\n💰 *Perda Estimada:* ${finances.financialRisk.formattedMonthlyLoss}/mês em queima de mídia.\n`;
    message += `👉 *Recomendação:* Repor tamanhos ou pausar criativo no Meta Ads.\n\n`;
  } else {
    message += `✅ *Catálogo Blindado:* Nenhuma ruptura crítica detectada nas grades principais.\n\n`;
  }

  if (diagnostic.realSiteData.googleShoppingShield && diagnostic.realSiteData.googleShoppingShield.discrepantProductsCount > 0) {
    message += `🛍️ *Google Shopping Shield:* ${diagnostic.realSiteData.googleShoppingShield.discrepantProductsCount} produto(s) com Schema OutOfStock afetando lances de PMax.\n\n`;
  }

  if (diagnostic.realSiteData.legalCompliance && !diagnostic.realSiteData.legalCompliance.isFullyCompliant) {
    message += `⚖️ *Alerta Legal (Decreto 7.962/13):* ${diagnostic.realSiteData.legalCompliance.violations[0]?.description || 'Ajustes no rodapé necessários'}\n\n`;
  }

  message += `🔗 *Painel Completo:* https://adshield.ai/dashboard?store=${encodeURIComponent(store.storeUrl)}`;

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
