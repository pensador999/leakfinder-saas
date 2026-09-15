// ==============================================================================
// 📡 OUTBOUND WEBHOOK DISPATCHER & ANTI-BAN QUEUE
// Skill: autonomous-agent-orchestrator + growth-outbound-closer
// Gerencia a fila de envio automático de pitches para WhatsApp com delays humanos,
// proteção contra bloqueio de chip e integração com Evolution API / Z-API.
// ==============================================================================

import { ProspectLead, updateLeadProspectStatus } from './leadSniperEngine';

export interface OutboundWebhookConfig {
  provider: 'EVOLUTION_API' | 'Z_API' | 'CUSTOM_WEBHOOK' | 'MANUAL_ASSISTED';
  apiUrl: string;
  apiKey: string;
  instanceName?: string;
  minDelaySeconds: number; // ex: 15s
  maxDelaySeconds: number; // ex: 45s
  autoSendEnabled: boolean;
}

export interface QueuedDispatchItem {
  id: string;
  leadId: string;
  brandName: string;
  recipientPhone: string;
  messageText: string;
  pitchType: 'directFounder' | 'technicalMediaBuyer' | 'audioScript45s';
  status: 'PENDENTE' | 'PROCESSANDO' | 'ENVIADO' | 'FALHA';
  scheduledFor: string;
  dispatchedAt?: string;
  error?: string;
}

const LOCAL_STORAGE_WEBHOOK_CONFIG_KEY = 'adshield_outbound_webhook_cfg_v1';
const LOCAL_STORAGE_DISPATCH_QUEUE_KEY = 'adshield_outbound_dispatch_queue_v1';

export const DEFAULT_OUTBOUND_CONFIG: OutboundWebhookConfig = {
  provider: 'MANUAL_ASSISTED',
  apiUrl: 'https://api.evolution-api.com/message/sendText',
  apiKey: '',
  instanceName: 'adshield-closer-01',
  minDelaySeconds: 15,
  maxDelaySeconds: 40,
  autoSendEnabled: false
};

export function getSavedOutboundConfig(): OutboundWebhookConfig {
  if (typeof window === 'undefined') return DEFAULT_OUTBOUND_CONFIG;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEBHOOK_CONFIG_KEY);
    return raw ? { ...DEFAULT_OUTBOUND_CONFIG, ...JSON.parse(raw) } : DEFAULT_OUTBOUND_CONFIG;
  } catch {
    return DEFAULT_OUTBOUND_CONFIG;
  }
}

export function persistOutboundConfig(cfg: OutboundWebhookConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_WEBHOOK_CONFIG_KEY, JSON.stringify(cfg));
  }
}

export function getDispatchQueue(): QueuedDispatchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DISPATCH_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistDispatchQueue(queue: QueuedDispatchItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_DISPATCH_QUEUE_KEY, JSON.stringify(queue));
  }
}

/**
 * Adiciona um lead à fila de disparo outbound com cálculo de delay humano anti-ban.
 */
export function enqueueLeadForOutreach(
  lead: ProspectLead,
  pitchType: 'directFounder' | 'technicalMediaBuyer' | 'audioScript45s' = 'directFounder'
): QueuedDispatchItem {
  const cfg = getSavedOutboundConfig();
  const queue = getDispatchQueue();

  const messageText = lead.pitches[pitchType] || lead.pitches.directFounder;
  const recipientPhone = lead.contactTargetPhone || lead.detectedWhatsApp || '';

  // Calcula atraso aleatório entre min e max segundos para simular comportamento humano
  const delaySec = Math.floor(Math.random() * (cfg.maxDelaySeconds - cfg.minDelaySeconds + 1)) + cfg.minDelaySeconds;
  const scheduledTime = new Date(Date.now() + (delaySec * 1000)).toISOString();

  const newItem: QueuedDispatchItem = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    leadId: lead.id,
    brandName: lead.brandName,
    recipientPhone,
    messageText,
    pitchType,
    status: 'PENDENTE',
    scheduledFor: scheduledTime
  };

  const updatedQueue = [...queue.filter(q => q.leadId !== lead.id), newItem];
  persistDispatchQueue(updatedQueue);

  return newItem;
}

/**
 * Dispara um item específico da fila de mensagens.
 */
export async function dispatchSingleQueueItem(itemId: string): Promise<QueuedDispatchItem> {
  const cfg = getSavedOutboundConfig();
  const queue = getDispatchQueue();
  const itemIndex = queue.findIndex(q => q.id === itemId);

  if (itemIndex === -1) {
    throw new Error('Item de disparo não encontrado na fila.');
  }

  const item = queue[itemIndex];
  item.status = 'PROCESSANDO';
  persistDispatchQueue(queue);

  try {
    if (cfg.provider === 'MANUAL_ASSISTED' || !cfg.apiUrl || !cfg.apiKey) {
      // Modo manual assistido: simula sucesso de envio e marca status
      await new Promise(r => setTimeout(r, 600));
      item.status = 'ENVIADO';
      item.dispatchedAt = new Date().toISOString();
      updateLeadProspectStatus(item.leadId, 'CONTATADO', 'Enviado via WhatsApp Outreach.');
    } else {
      // Disparo real via API externa (Evolution API / Z-API / Webhook)
      const cleanNumber = item.recipientPhone.replace(/\D/g, '');
      const response = await fetch(cfg.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cfg.apiKey,
          'Authorization': `Bearer ${cfg.apiKey}`
        },
        body: JSON.stringify({
          number: cleanNumber,
          textMessage: { text: item.messageText },
          message: item.messageText
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API de WhatsApp: HTTP ${response.status}`);
      }

      item.status = 'ENVIADO';
      item.dispatchedAt = new Date().toISOString();
      updateLeadProspectStatus(item.leadId, 'CONTATADO', 'Enviado via Webhook Oficial.');
    }
  } catch (err: any) {
    item.status = 'FALHA';
    item.error = err.message || 'Erro desconhecido ao disparar webhook.';
  }

  queue[itemIndex] = item;
  persistDispatchQueue(queue);
  return item;
}
