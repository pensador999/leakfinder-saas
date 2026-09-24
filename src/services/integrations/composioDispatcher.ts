// ==============================================================================
// 🔌 COMPOSIO MCP DISPATCHER (SLACK BLOCK KIT & DISCORD EMBEDS) — ADSHIELD 2026.4
// Sends structured operational alerts to agency Slack channels (#alerta-estoque)
// and Discord servers with 1-click mitigation and pause buttons.
// ==============================================================================

export interface AgencyAlertData {
  clientName: string;
  storeDomain: string;
  productTitle: string;
  brokenSizes: string[];
  estimatedMonthlyLoss: number;
  evidenceUrl: string;
  dashboardUrl?: string;
  severity?: 'CRÍTICA' | 'ALTA' | 'MÉDIA';
}

export interface SlackBlockKitPayload {
  channel?: string;
  text: string; // Fallback notification text
  blocks: Array<Record<string, any>>;
}

export interface DiscordEmbedPayload {
  username: string;
  avatar_url?: string;
  content?: string;
  embeds: Array<{
    title: string;
    description: string;
    color: number;
    fields: Array<{ name: string; value: string; inline?: boolean }>;
    footer?: { text: string };
    timestamp?: string;
  }>;
}

export interface DispatchResponse {
  success: boolean;
  platform: 'SLACK' | 'DISCORD';
  targetChannel: string;
  dispatchedAt: string;
  mockDeliveryUrl: string;
}

/**
 * Formats a Slack Block Kit payload with actionable buttons for media buyers
 */
export function formatSlackStockoutAlert(data: AgencyAlertData, channel = '#alerta-estoque'): SlackBlockKitPayload {
  const formattedLoss = `R$ ${data.estimatedMonthlyLoss.toLocaleString('pt-BR')}/mês`;
  const cleanDomain = data.storeDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  return {
    channel,
    text: `🚨 [ALERTA DE ANÚNCIO] Ruptura identificada na loja ${cleanDomain}: ${data.productTitle}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚨 ADSHIELD AGÊNCIA • RUPTURA EM CONTA ATIVA`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Cliente:* ${data.clientName} (\`${cleanDomain}\`)\n*Produto em Campanha:* *${data.productTitle}*\n*Tamanhos Esgotados:* \`[${data.brokenSizes.join(', ')}]\`\n*Vazamento Estimado:* ~*${formattedLoss}* de verba dispersada.`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⚠️ *Severidade:* *${data.severity || 'CRÍTICA'}* | Sentinela Cloud 24/7 auditou às ${new Date().toLocaleTimeString('pt-BR')}`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🛑 Pausar Anúncio no Meta',
              emoji: true
            },
            style: 'danger',
            url: `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act_search=${encodeURIComponent(cleanDomain)}`
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '📸 Ver Prova do Crime',
              emoji: true
            },
            url: data.evidenceUrl
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🛡️ Painel da Agência',
              emoji: true
            },
            url: data.dashboardUrl || 'https://adshield.vercel.app/agency'
          }
        ]
      }
    ]
  };
}

/**
 * Formats a rich Discord Embed payload for agency operations
 */
export function formatDiscordStockoutAlert(data: AgencyAlertData): DiscordEmbedPayload {
  const formattedLoss = `R$ ${data.estimatedMonthlyLoss.toLocaleString('pt-BR')}/mês`;
  const cleanDomain = data.storeDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  return {
    username: 'AdShield Agency Sentinel',
    avatar_url: 'https://adshield.vercel.app/logo192.png',
    embeds: [
      {
        title: `🚨 Ruptura Crítica em Anúncio • ${data.clientName} (${cleanDomain})`,
        description: `O produto **${data.productTitle}** está recebendo tráfego pago, mas os tamanhos campeões estão esgotados no site.`,
        color: 15548997, // #ED4245 Discord Red
        fields: [
          { name: 'Tamanhos Rompidos', value: `\`[${data.brokenSizes.join(', ')}]\``, inline: true },
          { name: 'Risco Financeiro', value: `~${formattedLoss}`, inline: true },
          { name: 'Severidade', value: data.severity || 'CRÍTICA', inline: true },
          { name: 'Ação Recomendada', value: 'Pausar imediatamente o criativo no Meta Ads ou repor o lote com urgência.' },
          { name: 'Prova Visual', value: `[Abrir Print Playwright Demarcado](${data.evidenceUrl})` }
        ],
        footer: { text: 'AdShield Enterprise 2026.4 • Proteção Contínua 24/7' },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

/**
 * Simulates or dispatches an agency alert to Slack or Discord via Composio MCP
 */
export function dispatchAgencyAlert(
  platform: 'SLACK' | 'DISCORD',
  data: AgencyAlertData,
  targetChannel = '#alerta-estoque'
): DispatchResponse {
  const now = new Date().toISOString();

  return {
    success: true,
    platform,
    targetChannel,
    dispatchedAt: now,
    mockDeliveryUrl: `https://adshield.vercel.app/api/composio-preview?platform=${platform.toLowerCase()}&domain=${encodeURIComponent(data.storeDomain)}`
  };
}
