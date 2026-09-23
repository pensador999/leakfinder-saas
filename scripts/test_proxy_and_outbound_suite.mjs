import assert from 'node:assert';
import { 
  ResidentialProxyManager 
} from '../src/services/network/residentialProxyManager.ts';
import { 
  OutboundCloserEngine 
} from '../src/services/outbound/outboundCloserEngine.ts';

console.log('⚔️ INICIANDO SUÍTE DE TESTES: ETAPA 3 (PROXIES RESIDENCIAIS) & ETAPA 4 (OUTBOUND CLOSER B2B)');

// --------------------------------------------------------------------------
// TESTE 1: ResidentialProxyManager — Headers Consistentes & Sessões Sticky
// --------------------------------------------------------------------------
console.log('\n▶ Teste 1: Validação do ResidentialProxyManager');

const headers = ResidentialProxyManager.getConsistentClientHeaders();
assert(headers['User-Agent'].includes('Chrome/128'), 'User-Agent deve simular Chrome moderno');
assert.strictEqual(headers['sec-ch-ua-platform'], '"Windows"', 'Client hints devem declarar Windows');
assert.strictEqual(headers['Accept-Language'], 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7', 'Accept-Language deve priorizar pt-BR');

const session1 = ResidentialProxyManager.getStickyProxyForDomain('brkagro.com.br');
assert(session1.proxyUrl.includes('country-br'), 'Proxy deve apontar para o Brasil');
assert(session1.carrierName.length > 5, 'Deve rotular a operadora brasileira');

// Chamada subsequente para o mesmo domínio deve retornar a mesma sessão Sticky
const session2 = ResidentialProxyManager.getStickyProxyForDomain('brkagro.com.br');
assert.strictEqual(session2.isStickySession, true, 'Deve manter a sessão Sticky ativa');
assert.strictEqual(session2.proxyUrl, session1.proxyUrl, 'URLs de proxy devem ser idênticas na mesma sessão');

// Forçar rotação de IP
ResidentialProxyManager.rotateIpImmediately('brkagro.com.br');
const session3 = ResidentialProxyManager.getStickyProxyForDomain('brkagro.com.br');
assert.strictEqual(session3.isStickySession, false, 'Após rotateIpImmediately, deve iniciar nova sessão');

console.log('✅ Teste 1 passou: Headers consistentes e sessões Sticky de 10 minutos operacionais!');

// --------------------------------------------------------------------------
// TESTE 2: Detecção de Desafios WAF (Cloudflare 1020, Turnstile, 429)
// --------------------------------------------------------------------------
console.log('\n▶ Teste 2: Detecção Automática de Desafios WAF');

const cloudflareChallengeHtml = `
<html>
<head><title>Just a moment...</title></head>
<body>
  <span>Please wait while we check your browser</span>
  <div>Cloudflare Ray ID: 89420ab1289c</div>
</body>
</html>`;

const cleanStoreHtml = `<html><head><title>BRK Agro | Moda Campo</title></head><body><h1>Vitrine</h1></body></html>`;

assert.strictEqual(ResidentialProxyManager.isWafChallengeDetected(cloudflareChallengeHtml, 200), true, 'Deve detectar desafio Cloudflare');
assert.strictEqual(ResidentialProxyManager.isWafChallengeDetected(cleanStoreHtml, 403), true, 'Status 403 deve ser tratado como desafio');
assert.strictEqual(ResidentialProxyManager.isWafChallengeDetected(cleanStoreHtml, 429), true, 'Status 429 deve ser tratado como desafio');
assert.strictEqual(ResidentialProxyManager.isWafChallengeDetected(cleanStoreHtml, 200), false, 'HTML limpo 200 não deve disparar falso-positivo');

console.log('✅ Teste 2 passou: WAF Challenges detectados com precisão sem falsos-positivos!');

// --------------------------------------------------------------------------
// TESTE 3: OutboundCloserEngine — Pitch de 3 Passos & Proposta White-Label R$ 997/mês
// --------------------------------------------------------------------------
console.log('\n▶ Teste 3: Geração do Dossiê da Prova do Crime & Pitch de 3 Passos');

const mockLead = {
  id: 'lead-7m-boots',
  storeName: '7M Boots',
  storeDomain: '7mboots.com.br',
  targetPhone: '5516999998888',
  rupturedProductTitle: 'Bota Texana Feminina Flor de Couro',
  rupturedSku: 'BOT-TEX-007',
  brokenSizes: ['36', '37', '38'],
  metaAdLibraryUrl: 'https://facebook.com/ads/library/?id=12345',
  estimatedMonthlyBleedBrl: 4250.00,
  niche: 'Calçados & Moda Country',
  source: 'META_ADS_MINED'
};

const pitch = OutboundCloserEngine.generateThreeStepPitch(mockLead);
assert(pitch.step1Hook.includes('Bota Texana Feminina Flor de Couro'), 'Passo 1 deve conter o produto real');
assert(pitch.step1Hook.includes('36, 37, 38'), 'Passo 1 deve conter os tamanhos furados');
assert(pitch.step2Proof.includes('R$'), 'Passo 2 deve conter o valor financeiro da sangria');
assert(pitch.step3Cta.includes('QUERO'), 'Passo 3 deve conter a chamada de resposta sem atrito');
assert(pitch.directWhatsAppUrl.includes('api.whatsapp.com'), 'Deve gerar o link wa.me pronto');

// Proposta de Agência White-Label
const agencyOffer = OutboundCloserEngine.generateAgencyWhiteLabelOffer('Agência V4 Company Agro', '5511988887777');
assert.strictEqual(agencyOffer.proposedMonthlyPriceBrl, 997.00, 'Preço deve ser exatamente R$ 997,00/mês');
assert(agencyOffer.pitchBody.includes('Agência V4 Company Agro'), 'Deve personalizar com o nome da agência');
assert(agencyOffer.pitchBody.includes('White-Label'), 'Deve destacar o modelo White-Label');

// Validação LGPD Opt-Out
assert(pitch.fullWhatsAppMessage.includes('PARAR'), 'Pitch de e-commerce deve conter opt-out LGPD PARAR');
assert(agencyOffer.pitchBody.includes('PARAR'), 'Pitch de agência deve conter opt-out LGPD PARAR');

// Validação de Telefones Brasileiros (Celular vs Fixo)
assert.strictEqual(OutboundCloserEngine.isBrazilianMobilePhone('5511988887777'), true, 'Celular SP com 9 dígitos deve ser aceito');
assert.strictEqual(OutboundCloserEngine.isBrazilianMobilePhone('(16) 99765-4321'), true, 'Celular com formatação deve ser aceito');
assert.strictEqual(OutboundCloserEngine.isBrazilianMobilePhone('1132221234'), false, 'Telefone fixo (começa com 3) deve ser rejeitado');
assert.strictEqual(OutboundCloserEngine.isBrazilianMobilePhone('1124445555'), false, 'Telefone fixo (começa com 2) deve ser rejeitado');
assert.strictEqual(OutboundCloserEngine.isBrazilianMobilePhone('12345'), false, 'Número curto deve ser rejeitado');

// Validação de Launch Args do Puppeteer
const launchArgs = ResidentialProxyManager.getBrowserLaunchArgs('brkagro.com.br');
assert(launchArgs.includes('--no-sandbox'), 'Deve conter flag --no-sandbox para Linux');
assert(launchArgs.includes('--disable-dev-shm-usage'), 'Deve conter flag anti-crash de memória');

console.log('✅ Teste 3 passou: Pitches de 3 passos, White-Label, Opt-Out LGPD e Validação de Celulares validados!');

// --------------------------------------------------------------------------
// TESTE 4: Fila Anti-Ban WhatsApp & Exportação CSV para CRM
// --------------------------------------------------------------------------
console.log('\n▶ Teste 4: Fila com Cadência Anti-Ban & Exportador CSV');

const schedule = OutboundCloserEngine.calculateAntiBanSchedule(15);
assert.strictEqual(schedule.delaysPerLeadMs.length, 15, 'Deve gerar 15 delays individuais');
assert(schedule.delaysPerLeadMs.every(d => d >= 45000 && d <= 110000), 'Todos os delays devem estar entre 45s e 110s');
assert(schedule.totalEstimatedMinutes >= 11, 'Tempo estimado total deve ser condizente com envio humano');

const csvCrm = OutboundCloserEngine.exportLeadsToCrmCsv([mockLead], ',');
assert(csvCrm.includes('Loja,Dominio,Telefone'), 'CSV CRM deve ter cabeçalhos válidos');
assert(csvCrm.includes('7mboots.com.br'), 'CSV CRM deve conter o domínio do lead');
assert(csvCrm.includes('4250.00'), 'CSV CRM deve conter a sangria calculada');

const csvExcel = OutboundCloserEngine.exportLeadsToCrmCsv([mockLead], ';');
assert(csvExcel.startsWith('\uFEFF'), 'CSV Excel deve conter UTF-8 BOM');
assert(csvExcel.includes('"Domínio"'), 'CSV Excel deve conter caracteres acentuados preservados');
assert(csvExcel.includes('R$'), 'CSV Excel deve conter formatação em moeda BRL');

console.log('✅ Teste 4 passou: Cadência humana anti-ban e exportador CSV (CRM + Excel BR) validados!');

console.log('\n🏆 TODOS OS 4 TESTES DAS ETAPAS 3 E 4 PASSARAM COM SUCESSO ABSOLUTO APÓS A AUDITORIA CRÍTICA!\n');

