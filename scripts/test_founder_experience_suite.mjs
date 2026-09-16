// ==============================================================================
// 🧪 TEST SUITE: FOUNDER WHATSAPP REAL EXPERIENCE (GOLDEN TRIO)
// Valida montagem do pacote Golden Trio para o WhatsApp pessoal do fundador
// ==============================================================================

import assert from 'node:assert';
import { 
  buildFounderExperienceTest, 
  simulateFounderTestDispatch, 
  DEFAULT_FOUNDER_CONFIG 
} from '../src/services/outbound/founderExperienceTester.ts';

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
  }
}

console.log('\n============================================================');
console.log('📱 ADSHIELD • TEST SUITE: EXPERIÊNCIA DO FUNDADOR (WHATSAPP)');
console.log('============================================================\n');

// 1. Telefone e Canonicalização
console.log('📌 1. CANONICALIZAÇÃO DE NÚMERO & PARÂMETROS');

runTest('Formata telefone padrão do fundador corretamente', () => {
  const payload = buildFounderExperienceTest();
  assert.strictEqual(payload.recipientPhone, '5534991351122');
  assert.ok(payload.directWhatsAppUrl.includes('5534991351122'));
  assert.ok(payload.waMeShortUrl.includes('5534991351122'));
});

runTest('Normaliza telefones com caracteres especiais', () => {
  const payload = buildFounderExperienceTest({
    founderPhone: '(34) 9 9135-1122'
  });
  assert.strictEqual(payload.recipientPhone, '5534991351122');
});

runTest('Adiciona prefixo 55 caso o usuário insira apenas DDD + Número', () => {
  const payload = buildFounderExperienceTest({
    founderPhone: '34991351122'
  });
  assert.strictEqual(payload.recipientPhone, '5534991351122');
});

// 2. Montagem do Pacote Golden Trio
console.log('\n📌 2. MONTAGEM DO PACOTE GOLDEN TRIO');

runTest('Gera o pacote multimídia com Vídeo 15s, Prova Playwright e Stripe Checkout', () => {
  const payload = buildFounderExperienceTest({
    storeDomain: 'brkagro.com.br',
    productTitle: 'Camisa Manga Longa UV50+',
    brokenSizes: ['M', 'G', 'GG'],
    dailyAdBudget: 200
  });

  const trio = payload.goldenTrioPackage;
  assert.ok(trio.video, 'Vídeo avatar deve existir');
  assert.ok(trio.video.durationSeconds >= 14 && trio.video.durationSeconds <= 20, 'Duração do vídeo deve estar entre 14s e 20s');
  assert.strictEqual(trio.video.resolution.aspectRatio, '9:16');
  
  assert.ok(trio.evidence, 'Prova visual deve existir');
  assert.strictEqual(trio.evidence.storeDomain, 'brkagro.com.br');
  assert.deepStrictEqual(trio.evidence.brokenSizes, ['M', 'G', 'GG']);
  
  assert.ok(trio.directStripeCheckoutUrl.includes('stripe.com'));
});

// 3. Formatação da Mensagem & URLs
console.log('\n📌 3. VALIDAÇÃO DE COPY & LINKS WHATSAPP');

runTest('A copy gerada contém informações auditadas sem alucinação', () => {
  const payload = buildFounderExperienceTest({
    storeDomain: 'texascenter.com.br',
    productTitle: 'Bota Texana Country',
    brokenSizes: ['39', '40'],
    dailyAdBudget: 300
  });

  const msg = payload.evolutionApiPayload.textMessage;
  assert.ok(msg.includes('texascenter.com.br'), 'Mensagem deve conter o domínio da loja');
  assert.ok(msg.includes('Bota Texana Country'), 'Mensagem deve conter o produto auditado');
  assert.ok(msg.includes('[39, 40]'), 'Mensagem deve listar os tamanhos esgotados');
  assert.ok(msg.includes('buy.stripe.com'), 'Mensagem deve conter link de checkout Stripe');
});

runTest('URLs de WhatsApp wa.me e api.whatsapp.com são válidas e codificadas', () => {
  const payload = buildFounderExperienceTest();
  assert.ok(payload.directWhatsAppUrl.startsWith('https://api.whatsapp.com/send?phone='));
  assert.ok(payload.waMeShortUrl.startsWith('https://wa.me/'));
  // Verifica se não há espaços crus na query string
  const queryString = payload.directWhatsAppUrl.split('?')[1];
  assert.ok(!queryString.includes(' '), 'Query string não deve conter espaços crus sem URL encode');
});

// 4. Estrutura Evolution API / Z-API
console.log('\n📌 4. ESTRUTURA DE GATEWAY EVOLUTION API / Z-API');

runTest('Payload para gateway possui campos obrigatórios e delay anti-ban', () => {
  const payload = buildFounderExperienceTest();
  const evo = payload.evolutionApiPayload;
  
  assert.strictEqual(evo.number, '5534991351122');
  assert.ok(evo.textMessage.length > 50);
  assert.ok(evo.mediaMessage);
  assert.strictEqual(evo.mediaMessage.mediatype, 'video');
  assert.ok(evo.options.delay >= 1000, 'Delay mínimo de 1s para anti-spam');
  assert.strictEqual(evo.options.presence, 'composing');
});

runTest('Simulação de despacho no gateway retorna sucesso e status 200', () => {
  const payload = buildFounderExperienceTest();
  const res = simulateFounderTestDispatch(payload);
  
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.deliveredToSimulator, true);
  assert.strictEqual(res.httpStatus, 200);
  assert.ok(res.deliveryTimestamp);
});

// -------------------------------------------------------------
// RELATÓRIO FINAL
// -------------------------------------------------------------
console.log('\n============================================================');
console.log(`📊 RESULTADO TESTE FUNDADOR: ${passed}/${total} TESTES PASSARAM COM SUCESSO`);
console.log('============================================================\n');

if (passed !== total) {
  process.exit(1);
}
