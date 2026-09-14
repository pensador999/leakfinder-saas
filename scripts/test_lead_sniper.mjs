// ==============================================================================
// 🧪 TEST SUITE: LEAD SNIPER & B2B OUTBOUND PROSPECTING ENGINE
// Verifies Meta Ads Library generation, WhatsApp pitch logic, and persistence.
// ==============================================================================

import { 
  readLocalDb, 
  saveProspectLead, 
  getProspectLeads, 
  updateProspectLeadStatus 
} from './localTelemetryDb.mjs';

console.log('🧪 Iniciando Testes Automatizados do Lead Sniper Engine...\n');

// 1. Teste de geração de Meta Ads Library URL
function generateMetaAdsLibraryUrl(brandName) {
  const query = encodeURIComponent(brandName.trim());
  return `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=${query}&search_type=keyword_unordered&media_type=all`;
}

const testBrand = 'BRK Agro';
const adsUrl = generateMetaAdsLibraryUrl(testBrand);
console.log(`✓ [Meta Ads Library URL]: ${adsUrl}`);
if (!adsUrl.includes('facebook.com/ads/library') || !adsUrl.includes('BRK%20Agro')) {
  throw new Error('Falha na geração da URL da Meta Ads Library!');
}

// 2. Teste do Framework de Copywriting de 3 Passos (growth-outbound-closer)
function generateWhatsAppPitches(brandName, productTitle, price, missingSizes, totalWasteMonthly) {
  const missingText = missingSizes.join(' e ');
  const formattedWaste = totalWasteMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const formattedPrice = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner de auditoria na vitrine da *${brandName}* e cruzamos com a biblioteca de anúncios de vocês no Meta Ads:

Vocês estão rodando tráfego pago ativo para o produto *"${productTitle}"* (R$ ${formattedPrice}), mas os tamanhos *${missingText}* estão esgotados no checkout do site.

Como ${missingText} respondem por cerca de 65% das compras de vestuário no Brasil, a cada R$ 1.000 investidos nessa campanha, cerca de R$ 650 viram cliques perdidos de clientes que chegam e desistem (estimamos uma sangria de ~*R$ ${formattedWaste}/mês*).

Montamos um dossiê confidencial de 1 página mostrando o flagrante e os links diretos para pausar o criativo ou repor o estoque antes de queimar mais verba.

Quer que eu te envie o link aqui pelo WhatsApp? É só responder *"QUERO"*.`;

  return { directFounder };
}

const samplePitch = generateWhatsAppPitches(
  'BRK Fishing', 
  'Camisa Monster Bass Pro', 
  159.90, 
  ['M', 'G'], 
  38400.00
);

console.log('✓ [Pitch de 3 Passos Validado]:');
console.log('--- Início da Mensagem ---');
console.log(samplePitch.directFounder.substring(0, 280) + '...');
console.log('--- Fim da Amostra ---\n');

if (!samplePitch.directFounder.includes('65%') || !samplePitch.directFounder.includes('M e G')) {
  throw new Error('Pitch não cumpre a metodologia de 3 passos do growth-outbound-closer!');
}

// 3. Teste de Codificação de WhatsApp Click-to-Chat
function buildWhatsAppClickToChatUrl(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

const targetPhone = '5534991351122';
const clickToChatUrl = buildWhatsAppClickToChatUrl(targetPhone, samplePitch.directFounder);
console.log(`✓ [Click-to-Chat URL Gerada]: ${clickToChatUrl.substring(0, 100)}...`);
if (!clickToChatUrl.startsWith('https://api.whatsapp.com/send?phone=5534991351122')) {
  throw new Error('Erro na formatação da URL do WhatsApp Click-to-Chat!');
}

// 4. Teste de Persistência no telemetry_db.json
const mockLead = {
  id: 'lead-test-agro-prospect',
  brandName: 'AgroStore Teste',
  domain: 'agrostoreteste.com.br',
  storeUrl: 'https://www.agrostoreteste.com.br',
  niche: 'Agropecuária',
  hasMetaPixel: true,
  metaAdsLibraryUrl: generateMetaAdsLibraryUrl('AgroStore Teste'),
  activeAdsCountEstimated: 14,
  contactTargetPhone: '5534991351122',
  totalMonthlyWasteEstimated: 29500.00,
  iceScore: 9.1,
  status: 'NOVO_LEAD',
  notes: 'Lead gravado via suíte de testes automatizados.'
};

saveProspectLead(mockLead);
console.log('✓ [Persistência]: Lead salvo com sucesso no banco de dados local.');

const loadedLeads = getProspectLeads();
const found = loadedLeads.find(l => l.id === mockLead.id);
if (!found) {
  throw new Error('Falha ao recuperar o lead persistido no telemetry_db.json!');
}

updateProspectLeadStatus(mockLead.id, 'CONTATADO', 'Primeira mensagem enviada no WhatsApp às 11:42');
const reloaded = getProspectLeads().find(l => l.id === mockLead.id);
if (reloaded.status !== 'CONTATADO') {
  throw new Error('Falha ao atualizar o status do lead no CRM!');
}
console.log(`✓ [CRM Pipeline]: Status atualizado com sucesso para: ${reloaded.status} ("${reloaded.notes}")\n`);

console.log('🎉 TODOS OS TESTES DO LEAD SNIPER FORAM APROVADOS COM 100% DE SUCESSO!');
