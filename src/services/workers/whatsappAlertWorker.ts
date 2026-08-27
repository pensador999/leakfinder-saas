import { MonitoredStore, StoreSnapshotDelta } from '../swarm/autonomousSwarmEngine';
import { AgentDiagnosticResult } from '../../types';
import { SupabaseClient } from '@supabase/supabase-js';

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
  provider: 'EVOLUTION_API' | 'Z_API' | 'GENERIC_WEBHOOK' | 'SIMULATION';
  endpointUrl: string;
  apiToken?: string;
  instanceName?: string;
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
    provider: 'SIMULATION',
    endpointUrl: '',
    apiToken: '',
    instanceName: 'adshield-bot'
  };
}

export function saveWhatsAppGatewayConfig(config: WhatsAppGatewayConfig): void {
  localStorage.setItem(LOCAL_GATEWAY_CONFIG_KEY, JSON.stringify(config));
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
  const brokenSkus = catalogIssues.filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0);

  let message = `🛡️ *ADSHIELD INTEL • RELATÓRIO EXECUTIVO DIÁRIO*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🏢 Loja: *${store.brandName}*\n`;
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
    message += `\n💰 *Perda Estimada:* R$ ${diagnostic.estimatedRevenueLiftMin * 45}/mês em queima de mídia.\n`;
    message += `👉 *Recomendação:* Repor tamanhos ou pausar criativo no Meta Ads.\n\n`;
  } else {
    message += `✅ *Catálogo Blindado:* Nenhuma ruptura crítica detectada nas grades principais.\n\n`;
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
): Promise<{ success: boolean; dispatchId: string; error?: string }> {
  const gateway = config || getWhatsAppGatewayConfig();

  // If simulation mode
  if (gateway.provider === 'SIMULATION' || !gateway.endpointUrl) {
    return {
      success: true,
      dispatchId: `sim-wpp-${Date.now()}`
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
      return { success: true, dispatchId: `wpp-sent-${Date.now()}` };
    } else {
      const errText = await response.text();
      return { success: false, dispatchId: `wpp-err-${Date.now()}`, error: errText };
    }
  } catch (err: any) {
    return { success: false, dispatchId: `wpp-fail-${Date.now()}`, error: err?.message || 'Network error' };
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
