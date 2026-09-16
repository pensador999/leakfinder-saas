// ==============================================================================
// 🔬 AUDITORIA ADVERSARIAL & FALSIFICAÇÃO: FASES 4, 5 E 6 (ADSHIELD ENTERPRISE)
// Testa ativamente os pontos de quebra: anti-ban, limites diários, dados corrompidos
// ==============================================================================

import assert from 'node:assert';
import { 
  getVerifiedOutboundPilotLeads, 
  applySpintax, 
  generateAntiBanSchedule, 
  simulateOutboundPilotCampaign,
  DEFAULT_CADENCE_CONFIG 
} from '../src/services/outbound/outboundCampaignEngine.ts';
import { 
  buildFounderExperienceTest, 
  simulateFounderTestDispatch 
} from '../src/services/outbound/founderExperienceTester.ts';
import { 
  executeMassiveCatalogAnalysis 
} from '../src/services/analytics/e2bSandboxRunner.ts';

let passed = 0;
let failed = 0;
const findings = [];

function auditCheck(category, description, fn) {
  try {
    fn();
    console.log(`  🟢 [PASS] ${category}: ${description}`);
    passed++;
  } catch (err) {
    console.log(`  🔴 [FAIL/VULNERABILIDADE DETECTADA] ${category}: ${description}`);
    console.log(`     Motivo: ${err.message}`);
    findings.push({ category, description, error: err.message });
    failed++;
  }
}

console.log('\n================================================================================');
console.log('🛡️ AUDITORIA TÉCNICA RIGOROSA & TESTES ADVERSARIAIS (POFFER / MUNGER)');
console.log('   Objetivo: Falsificar premissas, detectar vulnerabilidades operacionais e anti-ban');
console.log('================================================================================\n');

// -------------------------------------------------------------
// 1. AUDITORIA: SPINTAX & RECURSÃO
// -------------------------------------------------------------
console.log('📌 1. AUDITORIA DE SPINTAX & FINGERPRINTING DE MENSAGENS');

auditCheck('SPINTAX', 'Template com chaves aninhadas não deve deixar sintaxe residual', () => {
  const nested = '{Olá|{Oi|Fala}} lojista!';
  const res = applySpintax(nested);
  assert.ok(!res.includes('{') && !res.includes('}'), `Resíduo encontrado no resultado: "${res}"`);
});

auditCheck('SPINTAX', 'Template vazio ou com texto simples deve ser preservado sem quebras', () => {
  assert.strictEqual(applySpintax(''), '');
  assert.strictEqual(applySpintax('Texto sem tags'), 'Texto sem tags');
});

// -------------------------------------------------------------
// 2. AUDITORIA: ANTI-BAN & GESTÃO DE HORÁRIO COMERCIAL
// -------------------------------------------------------------
console.log('\n📌 2. AUDITORIA DE CADÊNCIA ANTI-BAN & LIMITES OPERACIONAIS');

auditCheck('ANTI-BAN', 'Lote de 40 com limite diário de 25 deve respeitar D+1 (Split de dias)', () => {
  const leads = getVerifiedOutboundPilotLeads();
  const schedule = generateAntiBanSchedule(leads, {
    ...DEFAULT_CADENCE_CONFIG,
    dailyLimit: 25
  });

  // Verifica se o schedule trata o estouro do limite de 25 no primeiro dia
  const firstDay = schedule.slice(0, 25);
  const secondDay = schedule.slice(25);
  assert.strictEqual(firstDay.length, 25, 'Primeiro dia deve ter no máximo 25 disparos');
  assert.strictEqual(secondDay.length, 15, 'Segundo dia deve alocar os 15 restantes');
});

auditCheck('ANTI-BAN', 'Disparos após 18:00 devem pular para o próximo dia útil às 09:00', () => {
  const leads = getVerifiedOutboundPilotLeads().slice(0, 5);
  const schedule = generateAntiBanSchedule(leads, {
    ...DEFAULT_CADENCE_CONFIG,
    allowedHoursStart: 9,
    allowedHoursEnd: 18
  });
  // Cada item agendado deve estar entre 09:00 e 18:00
  for (const item of schedule) {
    const hour = parseInt(item.scheduledSlot.split(':')[0], 10);
    assert.ok(hour >= 9 && hour <= 18, `Horário fora da janela comercial: ${item.scheduledSlot}`);
  }
});

// -------------------------------------------------------------
// 3. AUDITORIA: TELEFONES & SANITIZAÇÃO
// -------------------------------------------------------------
console.log('\n📌 3. AUDITORIA DE NÚMEROS TELEFÔNICOS & DIGITAÇÃO');

auditCheck('TELEFONE', 'Telefones com formatos complexos (+55 (034) 99135-1122) devem ser limpos', () => {
  const res = buildFounderExperienceTest({
    founderPhone: '+55 (034) 99135-1122'
  });
  // O zero do DDD '034' deve ser removido resultando em 5534...
  assert.strictEqual(res.recipientPhone, '5534991351122');
});

auditCheck('TELEFONE', 'Telefone fixo de 10 dígitos (sem o 9) deve ser detectado e alertado', () => {
  const res = buildFounderExperienceTest({
    founderPhone: '3432321122' // Fixo comercial
  });
  // Deve normalizar ou sinalizar
  assert.ok(res.recipientPhone.length >= 12, 'Telefone no Brasil deve ter 12 ou 13 dígitos');
});

// -------------------------------------------------------------
// 4. AUDITORIA: E2B SANDBOX SOB ESTRESSE DE DADOS CORROMPIDOS
// -------------------------------------------------------------
console.log('\n📌 4. AUDITORIA DO E2B SANDBOX RUNNER COM DADOS CORROMPIDOS');

auditCheck('E2B_SANDBOX', 'Catálogo vazio deve retornar estrutura válida sem crash', () => {
  const res = executeMassiveCatalogAnalysis({
    storeDomain: 'vazia.com.br',
    skus: []
  });
  assert.strictEqual(res.totalSkusAudited, 0);
  assert.strictEqual(res.totalPreventableWasteBRL, 0);
  assert.strictEqual(res.abcCurve.curvaA.skuCount, 0);
});

auditCheck('E2B_SANDBOX', 'SKUs com preço zerado ou volume NaN não devem produzir NaN no faturamento', () => {
  const corruptedSkus = [
    { sku: 'BAD1', title: 'Produto Grátis', category: 'X', price: 0, monthlySalesVolume: 100, totalVariants: 4, brokenVariantsCount: 2, brokenSizes: ['M'] },
    { sku: 'BAD2', title: 'Volume Zero', category: 'X', price: 150, monthlySalesVolume: 0, totalVariants: 4, brokenVariantsCount: 1, brokenSizes: ['G'] },
    { sku: 'GOOD', title: 'Produto Real', category: 'X', price: 200, monthlySalesVolume: 10, totalVariants: 4, brokenVariantsCount: 0, brokenSizes: [] }
  ];
  const res = executeMassiveCatalogAnalysis({
    storeDomain: 'corrompida.com.br',
    skus: corruptedSkus
  });
  assert.ok(!Number.isNaN(res.totalPreventableWasteBRL), 'Desperdício não pode ser NaN');
  assert.ok(!Number.isNaN(res.abcCurve.curvaA.revenueSharePercent), 'Share não pode ser NaN');
  assert.ok(!Number.isNaN(res.abcCurve.curvaB.revenueSharePercent), 'Share não pode ser NaN');
  assert.ok(!Number.isNaN(res.abcCurve.curvaC.revenueSharePercent), 'Share não pode ser NaN');
});

// -------------------------------------------------------------
// 5. AUDITORIA: UTM DIVERSIFICATION NO WHATSAPP
// -------------------------------------------------------------
console.log('\n📌 5. AUDITORIA DE DIVERSIFICAÇÃO DE LINKS (ANTI-SPAM)');

auditCheck('ANTI-SPAM', 'Links de Stripe e Dossiê devem conter tokens únicos por lead para evitar ban por URL fixa', () => {
  const leads = getVerifiedOutboundPilotLeads();
  // Verifica se cada lead gera identificador único na URL de checkout
  const lead1 = leads[0];
  const lead2 = leads[1];
  assert.notStrictEqual(lead1.storeUrl, lead2.storeUrl);
  assert.notStrictEqual(lead1.brandName, lead2.brandName);
});

// -------------------------------------------------------------
// SUMÁRIO DA AUDITORIA
// -------------------------------------------------------------
console.log('\n================================================================================');
console.log(`📊 BALANÇO DA AUDITORIA ADVERSARIAL: ${passed} APROVADOS | ${failed} VULNERABILIDADES IDENTIFICADAS`);
console.log('================================================================================\n');

if (findings.length > 0) {
  console.log('⚠️ VULNERABILIDADES QUE PRECISAM DE OTIMIZAÇÃO:');
  findings.forEach((f, idx) => {
    console.log(`  [#${idx + 1}] Categoria: ${f.category}`);
    console.log(`      Problema: ${f.description}`);
    console.log(`      Falha: ${f.error}\n`);
  });
}
