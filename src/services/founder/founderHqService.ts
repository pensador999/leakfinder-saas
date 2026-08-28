// ==============================================================================
// 👑 ADSHIELD FOUNDER BUSINESS HQ & OUTBOUND PROSPECTION SERVICE
// Manages SaaS MRR, Outbound Lead Prospecting, Concierge CRM and Agent Directives
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
}

export const INITIAL_FOUNDER_DIRECTIVES: FounderDirectivesState = {
  croMinIceScore: 8.0,
  targetNiches: ['Moda & Vestuário', 'Calçados', 'Autopeças', 'Agropecuária', 'Beleza & Cosméticos'],
  customAiInstructions: 'Priorizar sempre lojas com anúncios ativos no Meta Ads que tenham ruptura nos tamanhos mais vendidos (G/GG/44). Sempre enfatizar o cálculo de ROI imediato.',
  autoDispatchWhatsApp: true,
  priceFloorStarter: 197,
  priceFloorPro: 497,
  priceFloorEnterprise: 1290
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
    dossierUrl: 'https://leakfinder-green.vercel.app/?loja=countrylifestore.com.br',
    outreachPitch: 'Olá Rodrigo! Nosso robô detectou que o anúncio da Country Life Store para a Camisa Work está ativo no Instagram, mas os tamanhos G e GG estão esgotados. Vocês estão perdendo cerca de R$ 14.500/mês em cliques perdidos. Geramos um dossiê gratuito da sua loja: https://leakfinder-green.vercel.app/?loja=countrylifestore.com.br',
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
    dossierUrl: 'https://leakfinder-green.vercel.app/?loja=belladonnacalcados.com.br',
    outreachPitch: 'Olá Juliana! Notamos que o anúncio do Sneaker Plataforma da Bella Donna está rodando sem estoque das numerações 36 e 37 (responsáveis por 44% das vendas de calçados). O prejuízo estimado é de R$ 22.800/mês. Acesse o diagnóstico da sua loja aqui: https://leakfinder-green.vercel.app/?loja=belladonnacalcados.com.br',
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
    dossierUrl: 'https://leakfinder-green.vercel.app/?loja=motopecasbrasil.com.br',
    outreachPitch: 'Fala Marcos! Vimos o anúncio do Farol LED no Google Shopping sem indicação clara de voltagem e ano da moto, gerando abandonos de 60% no checkout. Veja o dossiê executivo completo da loja: https://leakfinder-green.vercel.app/?loja=motopecasbrasil.com.br',
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
    dossierUrl: 'https://leakfinder-green.vercel.app/?loja=glowskinbeauty.com.br',
    outreachPitch: 'Olá Camila! O Sérum da Glow Skin está com taxa de conversão mobile abaixo do benchmark porque o botão de compra fica fora da zona de alcance do polegar. Criamos um relatório visual em alta definição: https://leakfinder-green.vercel.app/?loja=glowskinbeauty.com.br',
    status: 'EM_NEGOCIACAO'
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

  // Active Subscribers Model (Sample SaaS Metrics)
  const starterCount = 12;      // 12 * 197 = 2.364
  const proCount = 28;          // 28 * 497 = 13.916
  const enterpriseCount = 6;    // 6 * 1290 = 7.740
  const mrrProjected = (starterCount * 197) + (proCount * 497) + (enterpriseCount * 1290);

  return {
    mrrProjected,
    activeSubscribers: starterCount + proCount + enterpriseCount,
    starterCount,
    proCount,
    enterpriseCount,
    totalStoresAudited: snapshotsCount,
    totalLeadsCaptured: leadsCount,
    pipelineHealthScore: 98
  };
}
