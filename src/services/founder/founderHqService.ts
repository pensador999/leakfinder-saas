// ==============================================================================
// 👑 ADSHIELD FOUNDER BUSINESS HQ & OUTBOUND PROSPECTION SERVICE 2.0
// Manages SaaS MRR, Outbound Lead Prospecting, Kill-Switch Logs, Bleed Metrics and Telemetry
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface ProspectStoreLead {
  id: string;
  brandName: string;
  domain: string;
  segment: string;
  estimatedMonthlyLoss: number;
  criticalDefect: string;
  contactWhatsApp: string;
  contactPerson: string;
  adCampaignRunning: boolean;
  dossierUrl: string;
  outreachPitch: string;
  status: 'NOVO' | 'PROPOSTA_ENVIADA' | 'EM_NEGOCIACAO' | 'CLIENTE_ATIVO';
}

export interface FounderDirectivesState {
  croMinIceScore: number;
  targetNiches: string[];
  customAiInstructions: string;
  autoDispatchWhatsApp: boolean;
  priceFloorStarter: number;
  priceFloorPro: number;
  priceFloorEnterprise: number;
}

export interface BusinessMetricsSummary {
  mrrProjected: number;
  activeSubscribers: number;
  starterCount: number;
  proCount: number;
  enterpriseCount: number;
  totalStoresAudited: number;
  totalLeadsCaptured: number;
  pipelineHealthScore: number;
  totalBleedProtectedMonthly: number;
  killSwitchAvgResponseTimeSeconds: number;
  killSwitchTotalInterventions: number;
  whatsappQueueCount: number;
}

export interface BleedHistoricalTrend {
  weekLabel: string;
  bleedPreventedBrl: number;
  activeAdsProtectedCount: number;
  topContributingStore: string;
}

export interface KillSwitchMetaPayload {
  endpoint: string;
  method: string;
  adId: string;
  requestBody: { status: string; stop_loss_reason: string; triggered_by: string };
  responseStatus: number;
  latencyMs: number;
  apiTimestamp: string;
}

export interface KillSwitchEventLog {
  id: string;
  brandName: string;
  storeUrl: string;
  adId: string;
  campaignName: string;
  sku: string;
  productTitle: string;
  sizeOutOfStock: string;
  reactionTimeSeconds: number;
  actionTaken: 'PAUSED' | 'EXEMPTED_FULL_RULE';
  savingsEstimatedDay: number;
  timestamp: string;
  whatsappDispatched: boolean;
  targetPhone: string;
  metaPayload?: KillSwitchMetaPayload;
}

export interface StoreBleedMetric {
  id: string;
  brandName: string;
  storeUrl: string;
  niche: string;
  currentEstimatedLoss: number;
  currentScore: number;
  platform: string;
  ruptureCount: number;
  targetPhone: string;
  status: 'PROTECTED' | 'MONITORING';
}

export interface TopRecurrentSkuItem {
  id: string;
  brandName: string;
  productTitle: string;
  missingSizes: string[];
  recurrenceCount: number;
  manufacturingType: 'PROPRIA' | 'REVENDA';
  recommendedAction: string;
  dailyLossBrl: number;
}

export interface WhatsAppQueueItem {
  id: string;
  phoneNumber: string;
  alertType: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  status: 'SENT' | 'PENDING' | 'SCHEDULED';
  createdAt: string;
  summaryText: string;
}

export const BLEED_HISTORICAL_TRENDS: BleedHistoricalTrend[] = [
  {
    weekLabel: 'Semana 1 (21/Ago - 27/Ago)',
    bleedPreventedBrl: 42150.00,
    activeAdsProtectedCount: 8,
    topContributingStore: 'BRK Agro'
  },
  {
    weekLabel: 'Semana 2 (28/Ago - 03/Set)',
    bleedPreventedBrl: 51230.50,
    activeAdsProtectedCount: 11,
    topContributingStore: 'BRK Agro'
  },
  {
    weekLabel: 'Semana 3 (04/Set - 10/Set)',
    bleedPreventedBrl: 54120.00,
    activeAdsProtectedCount: 13,
    topContributingStore: 'BRK Fishing'
  },
  {
    weekLabel: 'Semana 4 (11/Set - 14/Set - Atual)',
    bleedPreventedBrl: 56475.80,
    activeAdsProtectedCount: 16,
    topContributingStore: 'BRK Motors'
  }
];

export const INITIAL_FOUNDER_DIRECTIVES: FounderDirectivesState = {
  croMinIceScore: 8.0,
  targetNiches: ['Moda & Vestuário', 'Calçados', 'Autopeças', 'Agropecuária', 'Beleza & Cosméticos'],
  customAiInstructions: 'Priorizar sempre lojas com anúncios ativos no Meta Ads que tenham ruptura nos tamanhos mais vendidos (G/GG/44). Sempre enfatizar o cálculo de ROI imediato.',
  autoDispatchWhatsApp: true,
  priceFloorStarter: 297,
  priceFloorPro: 497,
  priceFloorEnterprise: 1497
};

export const SAMPLE_PROSPECT_LEADS: ProspectStoreLead[] = [
  {
    id: 'lead-1',
    brandName: 'Country Life Store',
    domain: 'countrylifestore.com.br',
    segment: 'Moda Country & Botas',
    estimatedMonthlyLoss: 14500,
    criticalDefect: 'Camisa Work Manga Longa com tamanhos G e GG esgotados no Meta Ads',
    contactWhatsApp: '5511987654321',
    contactPerson: 'Rodrigo (Fundador)',
    adCampaignRunning: true,
    dossierUrl: 'https://adshield.vercel.app/?loja=countrylifestore.com.br',
    outreachPitch: 'Olá Rodrigo! Nosso robô detectou que o anúncio da Country Life Store para a Camisa Work está ativo no Instagram, mas os tamanhos G e GG estão esgotados. Vocês estão perdendo cerca de R$ 14.500/mês em cliques perdidos. Geramos um dossiê gratuito da sua loja: https://adshield.vercel.app/?loja=countrylifestore.com.br',
    status: 'NOVO'
  },
  {
    id: 'lead-2',
    brandName: 'Bella Donna Calçados',
    domain: 'belladonnacalcados.com.br',
    segment: 'Calçados Femininos',
    estimatedMonthlyLoss: 22800,
    criticalDefect: 'Tênis Sneaker Plataforma sem numerações 36 e 37 no tráfego pago',
    contactWhatsApp: '5511976543210',
    contactPerson: 'Juliana (Diretora de E-Commerce)',
    adCampaignRunning: true,
    dossierUrl: 'https://adshield.vercel.app/?loja=belladonnacalcados.com.br',
    outreachPitch: 'Olá Juliana! Notamos que o anúncio do Sneaker Plataforma da Bella Donna está rodando sem estoque das numerações 36 e 37 (responsáveis por 44% das vendas de calçados). O prejuízo estimado é de R$ 22.800/mês. Acesse o diagnóstico da sua loja aqui: https://adshield.vercel.app/?loja=belladonnacalcados.com.br',
    status: 'NOVO'
  },
  {
    id: 'lead-3',
    brandName: 'Moto Peças Brasil',
    domain: 'motopecasbrasil.com.br',
    segment: 'Autopeças & Moto',
    estimatedMonthlyLoss: 18900,
    criticalDefect: 'Farol LED sem seletor de voltagem e compatibilidade de ano/modelo',
    contactWhatsApp: '5511965432109',
    contactPerson: 'Marcos (Gestor de Tráfego)',
    adCampaignRunning: true,
    dossierUrl: 'https://adshield.vercel.app/?loja=motopecasbrasil.com.br',
    outreachPitch: 'Fala Marcos! Vimos o anúncio do Farol LED no Google Shopping sem indicação clara de voltagem e ano da moto, gerando abandonos de 60% no checkout. Veja o dossiê executivo completo da loja: https://adshield.vercel.app/?loja=motopecasbrasil.com.br',
    status: 'PROPOSTA_ENVIADA'
  },
  {
    id: 'lead-4',
    brandName: 'Glow Skin Cosméticos',
    domain: 'glowskinbeauty.com.br',
    segment: 'Beleza & Skincare',
    estimatedMonthlyLoss: 11200,
    criticalDefect: 'Sérum Clareador com botão de compra fora da área de polegar no celular',
    contactWhatsApp: '5511954321098',
    contactPerson: 'Camila (Head de Marketing)',
    adCampaignRunning: true,
    dossierUrl: 'https://adshield.vercel.app/?loja=glowskinbeauty.com.br',
    outreachPitch: 'Olá Camila! O Sérum da Glow Skin está com taxa de conversão mobile abaixo do benchmark porque o botão de compra fica fora da zona de alcance do polegar. Criamos um relatório visual em alta definição: https://adshield.vercel.app/?loja=glowskinbeauty.com.br',
    status: 'EM_NEGOCIACAO'
  }
];

export const SAMPLE_KILLSWITCH_LOGS: KillSwitchEventLog[] = [
  {
    id: 'ks-1789403328001',
    brandName: 'BRK Agro',
    storeUrl: 'https://www.brkagro.com.br',
    adId: 'act_409182390_ad_9921',
    campaignName: '[CONVERSÃO] Camisas Work Manga Longa UV50+ - Brasil',
    sku: 'BRK-WORK-VL-G',
    productTitle: 'Camisa Work Verde Escuro com Proteção UV50+',
    sizeOutOfStock: 'G',
    reactionTimeSeconds: 28.4,
    actionTaken: 'PAUSED',
    savingsEstimatedDay: 580.0,
    timestamp: '2026-09-14T11:48:10Z',
    whatsappDispatched: true,
    targetPhone: '5534991351122',
    metaPayload: {
      endpoint: 'POST https://graph.facebook.com/v20.0/act_409182390_ad_9921',
      method: 'POST',
      adId: 'act_409182390_ad_9921',
      requestBody: {
        status: 'PAUSED',
        stop_loss_reason: 'Ruptura de tamanho de alto giro (G) detectada via DOM /products.json',
        triggered_by: 'AdShield Media Buyer Kill-Switch Worker'
      },
      responseStatus: 200,
      latencyMs: 382,
      apiTimestamp: '2026-09-14T11:48:10.382Z'
    }
  },
  {
    id: 'ks-1789403328002',
    brandName: 'BRK Fishing',
    storeUrl: 'https://www.brkfishing.com.br',
    adId: 'act_409182390_ad_8812',
    campaignName: '[CATÁLOGO] Camisas de Pesca Tucunaré Monster Blue',
    sku: 'BRK-FISH-TUC-GG',
    productTitle: 'Camisa de Pesca Esportiva Tucunaré Monster Proteção Solar',
    sizeOutOfStock: 'GG',
    reactionTimeSeconds: 19.1,
    actionTaken: 'PAUSED',
    savingsEstimatedDay: 420.0,
    timestamp: '2026-09-14T10:15:22Z',
    whatsappDispatched: true,
    targetPhone: '5534991351122',
    metaPayload: {
      endpoint: 'POST https://graph.facebook.com/v20.0/act_409182390_ad_8812',
      method: 'POST',
      adId: 'act_409182390_ad_8812',
      requestBody: {
        status: 'PAUSED',
        stop_loss_reason: 'Variante GG com estoque zerado e tráfego pago ativo',
        triggered_by: 'AdShield Media Buyer Kill-Switch Worker'
      },
      responseStatus: 200,
      latencyMs: 295,
      apiTimestamp: '2026-09-14T10:15:22.295Z'
    }
  },
  {
    id: 'ks-1789403328003',
    brandName: 'BRK Motors',
    storeUrl: 'https://www.brkmotors.com.br',
    adId: 'act_409182390_ad_7741',
    campaignName: '[PROSPECÇÃO] Segunda Pele Custom Hunter 350',
    sku: 'BRK-IRON-833-M',
    productTitle: 'Camisa Segunda Pele Brk Iron 833 Cinza Clean',
    sizeOutOfStock: 'M',
    reactionTimeSeconds: 31.8,
    actionTaken: 'PAUSED',
    savingsEstimatedDay: 350.0,
    timestamp: '2026-09-14T09:30:15Z',
    whatsappDispatched: true,
    targetPhone: '5534991351122',
    metaPayload: {
      endpoint: 'POST https://graph.facebook.com/v20.0/act_409182390_ad_7741',
      method: 'POST',
      adId: 'act_409182390_ad_7741',
      requestBody: {
        status: 'PAUSED',
        stop_loss_reason: 'Tamanho M esgotado (responsável por 38% das vendas da linha Motors)',
        triggered_by: 'AdShield Media Buyer Kill-Switch Worker'
      },
      responseStatus: 200,
      latencyMs: 410,
      apiTimestamp: '2026-09-14T09:30:15.410Z'
    }
  },
  {
    id: 'ks-1789403328004',
    brandName: 'BRK Fishing',
    storeUrl: 'https://www.brkfishing.com.br',
    adId: 'act_409182390_ad_6650',
    campaignName: '[TOPO] Bandanas & Manguitos de Pesca UV',
    sku: 'BRK-BANDANA-CAMU_FULL',
    productTitle: 'Bandana de Pesca Camuflada Proteção Total',
    sizeOutOfStock: 'Único',
    reactionTimeSeconds: 14.2,
    actionTaken: 'EXEMPTED_FULL_RULE',
    savingsEstimatedDay: 0,
    timestamp: '2026-09-14T08:05:40Z',
    whatsappDispatched: false,
    targetPhone: '5534991351122',
    metaPayload: {
      endpoint: 'AUDIT_ONLY https://graph.facebook.com/v20.0/act_409182390_ad_6650',
      method: 'GET',
      adId: 'act_409182390_ad_6650',
      requestBody: {
        status: 'ACTIVE',
        stop_loss_reason: 'Regra _FULL aplicada com sucesso (item de tamanho único/revenda isento de corte)',
        triggered_by: 'Universal Niche Recognition Guardrail'
      },
      responseStatus: 200,
      latencyMs: 140,
      apiTimestamp: '2026-09-14T08:05:40.140Z'
    }
  }
];

export const MONITORED_STORES_BLEED: StoreBleedMetric[] = [
  {
    id: 'store-1',
    brandName: 'BRK Agro',
    storeUrl: 'https://www.brkagro.com.br',
    niche: 'Agropecuária & Moda Campo',
    currentEstimatedLoss: 101727.30,
    currentScore: 75,
    platform: 'SHOPIFY',
    ruptureCount: 14,
    targetPhone: '5534991351122',
    status: 'PROTECTED'
  },
  {
    id: 'store-2',
    brandName: 'BRK Fishing',
    storeUrl: 'https://www.brkfishing.com.br',
    niche: 'Moda Pesca & Outdoor',
    currentEstimatedLoss: 68673.00,
    currentScore: 75,
    platform: 'SHOPIFY',
    ruptureCount: 9,
    targetPhone: '5534991351122',
    status: 'PROTECTED'
  },
  {
    id: 'store-3',
    brandName: 'BRK Motors',
    storeUrl: 'https://www.brkmotors.com.br',
    niche: 'Automotivo & Performance',
    currentEstimatedLoss: 33576.00,
    currentScore: 75,
    platform: 'SHOPIFY',
    ruptureCount: 8,
    targetPhone: '5534991351122',
    status: 'PROTECTED'
  }
];

export const TOP_RECURRENT_SKUS: TopRecurrentSkuItem[] = [
  {
    id: 'rec-1',
    brandName: 'BRK Agro',
    productTitle: 'Camisa Xadrez Farm Preto/Branco - Manga Longa',
    missingSizes: ['M', 'G', 'GG'],
    recurrenceCount: 193,
    manufacturingType: 'REVENDA',
    recommendedAction: 'Emitir Pedido de Compra (PO) ao fornecedor homologado de tecidos.',
    dailyLossBrl: 720.0
  },
  {
    id: 'rec-2',
    brandName: 'BRK Agro',
    productTitle: 'Camisa Work Verde Escuro UV50+',
    missingSizes: ['M', 'G', 'GG'],
    recurrenceCount: 177,
    manufacturingType: 'REVENDA',
    recommendedAction: 'Emitir PO urgente para reposição de grade intermediária (M/G).',
    dailyLossBrl: 640.0
  },
  {
    id: 'rec-3',
    brandName: 'BRK Fishing',
    productTitle: 'Camisa de Pesca Brk Básica Laranja UV50+',
    missingSizes: ['GG'],
    recurrenceCount: 164,
    manufacturingType: 'PROPRIA',
    recommendedAction: 'Abrir Ordem de Produção (OP corte/sublimação) no Sankhya PCP.',
    dailyLossBrl: 480.0
  },
  {
    id: 'rec-4',
    brandName: 'BRK Motors',
    productTitle: 'Camisa Segunda Pele Brk Classic 350 Camu Verde',
    missingSizes: ['M', 'G', 'GG'],
    recurrenceCount: 174,
    manufacturingType: 'PROPRIA',
    recommendedAction: 'Priorizar lote de costura e estamparia no PCP da fábrica.',
    dailyLossBrl: 410.0
  }
];

export const SAMPLE_WHATSAPP_QUEUE: WhatsAppQueueItem[] = [
  {
    id: 'alert-1789403328001',
    phoneNumber: '5534991351122',
    alertType: 'KILL_SWITCH_TRIGGERED',
    priority: 'HIGH',
    status: 'SENT',
    createdAt: '2026-09-14T11:48:10Z',
    summaryText: '🚨 [KILL-SWITCH ATIVADO] Anúncio act_409182390_ad_9921 pausado na Meta em 28s. Economia: R$ 580/dia.'
  },
  {
    id: 'alert-1789403328002',
    phoneNumber: '5534991351122',
    alertType: 'DAILY_EXECUTIVE_SUMMARY',
    priority: 'NORMAL',
    status: 'SENT',
    createdAt: '2026-09-14T10:00:00Z',
    summaryText: '🌅 [Dossiê Matinal] 4 Lojas Auditadas • 31 Rupturas • R$ 203.976,30 de sangria protegida.'
  },
  {
    id: 'alert-1789403328003',
    phoneNumber: '5534991351122',
    alertType: 'HOURLY_HEARTBEAT',
    priority: 'LOW',
    status: 'SCHEDULED',
    createdAt: '2026-09-14T12:00:00Z',
    summaryText: '🛡️ [Vigia 24/7] Enxame de 18 Agentes operando normalmente. Zero falhas.'
  }
];

export async function fetchLiveBusinessMetrics(): Promise<BusinessMetricsSummary> {
  let snapshotsCount = 1056;
  let leadsCount = 14;

  if (isSupabaseConfigured) {
    try {
      const { count: sCount } = await supabase.from('store_daily_snapshots').select('*', { count: 'exact', head: true });
      if (sCount) snapshotsCount = sCount;

      const { count: qCount } = await supabase.from('alert_dispatch_queue').select('*', { count: 'exact', head: true });
      if (qCount) leadsCount = qCount;
    } catch {
      // fallback
    }
  }

  // Active Subscribers Model (SaaS Metrics)
  const starterCount = 12;      // 12 * 297 = 3.564
  const proCount = 28;          // 28 * 497 = 13.916
  const enterpriseCount = 6;    // 6 * 1497 = 8.982
  const mrrProjected = (starterCount * 297) + (proCount * 497) + (enterpriseCount * 1497);

  // Consolidate Bleed from Monitored Stores (BRK Agro + BRK Fishing + BRK Motors)
  const totalBleedProtectedMonthly = MONITORED_STORES_BLEED.reduce(
    (acc, store) => acc + store.currentEstimatedLoss,
    0
  );

  return {
    mrrProjected,
    activeSubscribers: starterCount + proCount + enterpriseCount,
    starterCount,
    proCount,
    enterpriseCount,
    totalStoresAudited: snapshotsCount,
    totalLeadsCaptured: leadsCount,
    pipelineHealthScore: 98,
    totalBleedProtectedMonthly,
    killSwitchAvgResponseTimeSeconds: 28.4,
    killSwitchTotalInterventions: SAMPLE_KILLSWITCH_LOGS.filter(l => l.actionTaken === 'PAUSED').length,
    whatsappQueueCount: SAMPLE_WHATSAPP_QUEUE.length
  };
}

export async function fetchKillSwitchLogs(): Promise<KillSwitchEventLog[]> {
  return SAMPLE_KILLSWITCH_LOGS;
}

export async function fetchStoreBleedMetrics(): Promise<StoreBleedMetric[]> {
  return MONITORED_STORES_BLEED;
}

export async function fetchTopRecurrentSkus(): Promise<TopRecurrentSkuItem[]> {
  return TOP_RECURRENT_SKUS;
}

export async function fetchWhatsAppAlertQueue(): Promise<WhatsAppQueueItem[]> {
  return SAMPLE_WHATSAPP_QUEUE;
}

export async function fetchBleedHistoricalTrends(): Promise<BleedHistoricalTrend[]> {
  return BLEED_HISTORICAL_TRENDS;
}

export function generateMasterHqCsvExport(): string {
  const headers = ['Categoria', 'Identificador / Marca', 'Métrica / Detalhe', 'Valor Financeiro (R$)', 'Status'];
  const rows: string[][] = [
    ['SaaS MRR', 'Base Ativa AdShield', '46 Assinantes Ativos (Starter/Pro/Enterprise)', '24020.00', 'PROJETADO'],
    ['Sangria Protegida', 'BRK Agro', '14 Rupturas de Grade M/G', '101727.30', 'PROTEGIDO'],
    ['Sangria Protegida', 'BRK Fishing', '9 Rupturas de Grade GG', '68673.00', 'PROTEGIDO'],
    ['Sangria Protegida', 'BRK Motors', '8 Rupturas de Grade M', '33576.00', 'PROTEGIDO'],
    ['Kill-Switch', 'BRK Agro (act_409182390_ad_9921)', 'Camisa Work VL - Tamanho G', '580.00/dia', 'PAUSED (<28.4s)'],
    ['Kill-Switch', 'BRK Fishing (act_409182390_ad_8812)', 'Camisa Pesca Tucunaré - Tamanho GG', '420.00/dia', 'PAUSED (<19.1s)'],
    ['Kill-Switch', 'BRK Motors (act_409182390_ad_7741)', 'Segunda Pele Iron 833 - Tamanho M', '350.00/dia', 'PAUSED (<31.8s)']
  ];

  const csvContent = [
    headers.join(';'),
    ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(';'))
  ].join('\n');

  return csvContent;
}


