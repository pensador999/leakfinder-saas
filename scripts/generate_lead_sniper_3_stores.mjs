import fs from 'node:fs';
import { 
  OutboundCloserEngine
} from '../src/services/outbound/outboundCloserEngine.ts';

const targetStores = [
  {
    id: 'lead-altogiro-01',
    storeName: 'Alto Giro',
    storeDomain: 'altogiro.com.br',
    targetDecisionMakerName: 'Diretor de E-commerce / Gestor de Tráfego',
    targetPhone: '5517982233912',
    rupturedProductTitle: 'Legging Elástico Personalizado Alto Giro (R$ 359,90)',
    rupturedSku: 'AG-LEG-359',
    brokenSizes: ['P', 'M', 'G (Disponível apenas PP e GG)'],
    metaAdLibraryUrl: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=altogiro.com.br&search_type=keyword_unordered&media_type=all',
    estimatedMonthlyBleedBrl: 12450.00,
    niche: 'Moda Fitness Feminina Premium',
    source: 'META_ADS_MINED'
  },
  {
    id: 'lead-honeybe-02',
    storeName: 'Honey Be',
    storeDomain: 'honeybe.com.br',
    targetDecisionMakerName: 'Head de Performance & Growth',
    targetPhone: '5522999149388',
    rupturedProductTitle: 'Short Fitness Preto Faixa Lateral SH552 (R$ 29,90)',
    rupturedSku: 'HB-SH552-P',
    brokenSizes: ['M', 'G', 'GG (Disponível apenas P)'],
    metaAdLibraryUrl: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=honeybe.com.br&search_type=keyword_unordered&media_type=all',
    estimatedMonthlyBleedBrl: 8900.00,
    niche: 'Moda Fitness Feminina',
    source: 'META_ADS_MINED'
  },
  {
    id: 'lead-brkagro-03',
    storeName: 'BRK Agro',
    storeDomain: 'brkagro.com.br',
    targetDecisionMakerName: 'Head de Mídia Paga / Gestor de Tráfego',
    targetPhone: '5534998782000',
    rupturedProductTitle: 'Camisa Agro BRK Clean Preta UV50 Envio Imediato (R$ 169,90)',
    rupturedSku: 'BRK-CLN-PRT',
    brokenSizes: ['P', 'M', 'G, G2 (Disponível apenas GG e G1)'],
    metaAdLibraryUrl: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=brkagro.com.br&search_type=keyword_unordered&media_type=all',
    estimatedMonthlyBleedBrl: 15200.00,
    niche: 'Moda Country / Agro',
    source: 'META_ADS_MINED'
  }
];

function run() {
  const generatedCampaigns = [];

  for (const lead of targetStores) {
    const isMobile = OutboundCloserEngine.isBrazilianMobilePhone(lead.targetPhone);
    const pitch = OutboundCloserEngine.generateThreeStepPitch(lead);
    const agencyPitch = OutboundCloserEngine.generateAgencyWhiteLabelOffer(
      `Agência Parceira de ${lead.storeName}`,
      lead.targetPhone
    );

    generatedCampaigns.push({
      lead,
      isMobile,
      pitch,
      agencyPitch
    });
  }

  // Also generate the CSV
  const csvContent = OutboundCloserEngine.exportLeadsToCrmCsv(targetStores);
  fs.writeFileSync('data/outbound/leads_outbound_3_stores.csv', csvContent, 'utf-8');

  fs.writeFileSync(
    'data/outbound/lead_sniper_3_stores_campaign.json',
    JSON.stringify(generatedCampaigns, null, 2),
    'utf-8'
  );
  console.log('✅ Campanhas do Lead Sniper e CSV gerados com sucesso em data/outbound/!');
}

run();
