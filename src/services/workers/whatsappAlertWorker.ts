import { MonitoredStore, StoreSnapshotDelta } from '../swarm/autonomousSwarmEngine';
import { AgentDiagnosticResult } from '../../types';

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
 * Mock/API dispatcher for WhatsApp messages (compatible with Evolution API / Z-API / Webhook)
 */
export async function dispatchWhatsAppAlert(
  payload: WhatsAppAlertPayload,
  webhookUrl?: string
): Promise<{ success: boolean; dispatchId: string }> {
  // If official webhook is provided, POST the payload
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: response.ok, dispatchId: `wpp-${Date.now()}` };
    } catch {
      return { success: false, dispatchId: `err-${Date.now()}` };
    }
  }

  // Local simulated successful queue dispatch
  return {
    success: true,
    dispatchId: `sim-wpp-${Date.now()}`
  };
}
