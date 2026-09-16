// ==============================================================================
// 🧪 TEST SUITE: OUTBOUND PILOT CAMPAIGN & ANTI-BAN CADENCE
// Valida o lote de 40 lojas reais, delays humanizados e funil de conversão
// ==============================================================================

import assert from 'node:assert';
import { 
  getVerifiedOutboundPilotLeads, 
  applySpintax, 
  generateAntiBanSchedule, 
  simulateOutboundPilotCampaign, 
  DEFAULT_CADENCE_CONFIG 
} from '../src/services/outbound/outboundCampaignEngine.ts';

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
console.log('🚀 ADSHIELD • TEST SUITE: CAMPANHA OUTBOUND EM MASSA & ANTI-BAN');
console.log('============================================================\n');

// 1. Base de 40 Lojas
console.log('📌 1. VALIDAÇÃO DO LOTE DE LEADS (40 LOJAS REAIS)');

runTest('Retorna exatamente 40 lojas com dados consistentes', () => {
  const leads = getVerifiedOutboundPilotLeads();
  assert.strictEqual(leads.length, 40, 'Deve conter exatamente 40 lojas mapeadas');
  
  for (const lead of leads) {
    assert.ok(lead.id, 'Lead deve ter ID único');
    assert.ok(lead.brandName, 'Nome da marca é obrigatório');
    assert.ok(lead.storeUrl.startsWith('https://'), 'URL da loja deve ser HTTPS válida');
    assert.ok(lead.whatsapp.startsWith('55'), 'Telefone deve ter código do país 55');
    assert.ok(lead.monthlyWasteBRL > 0, 'Desperdício mensal deve ser positivo');
    assert.ok(lead.brokenSizes.length > 0, 'Deve ter tamanhos rompidos detectados');
    assert.ok(['TIER_1_HOT', 'TIER_2_WARM', 'TIER_3_COLD'].includes(lead.tier));
  }
});

runTest('Distribuição de Tiers cobre nichos Hot e Warm', () => {
  const leads = getVerifiedOutboundPilotLeads();
  const hotCount = leads.filter(l => l.tier === 'TIER_1_HOT').length;
  const warmCount = leads.filter(l => l.tier === 'TIER_2_WARM').length;
  
  assert.ok(hotCount >= 10, 'Deve haver pelo menos 10 leads Hot');
  assert.ok(warmCount >= 10, 'Deve haver pelo menos 10 leads Warm');
});

// 2. Spintax Anti-Fingerprinting
console.log('\n📌 2. SPINTAX & ANTI-FINGERPRINTING');

runTest('Spintax resolve variações dinâmicas de saudação', () => {
  const template = '{Olá|Fala|Opa} {time|pessoal} da {empresa}!';
  const resolved = applySpintax(template);
  
  assert.ok(!resolved.includes('{'), 'Não deve conter chaves abertas');
  assert.ok(!resolved.includes('}'), 'Não deve conter chaves fechadas');
  assert.ok(!resolved.includes('|'), 'Não deve conter pipes');
  assert.ok(resolved.endsWith('!'));
});

// 3. Cadência Anti-Ban & Jitter Delays
console.log('\n📌 3. CADÊNCIA ANTI-BAN & JITTER DELAYS');

runTest('Fila de agendamento respeita limites de jitter (45s a 120s)', () => {
  const leads = getVerifiedOutboundPilotLeads().slice(0, 10);
  const queue = generateAntiBanSchedule(leads, DEFAULT_CADENCE_CONFIG);
  
  assert.strictEqual(queue.length, 10);
  for (const item of queue) {
    assert.ok(item.jitterSeconds >= 45 && item.jitterSeconds <= 120, 'Jitter deve estar no intervalo');
    assert.ok(item.scheduledSlot, 'Deve possuir horário agendado');
  }
});

runTest('Fallback triplo de canais seleciona canal correto por perfil', () => {
  const leads = getVerifiedOutboundPilotLeads();
  const queue = generateAntiBanSchedule(leads, DEFAULT_CADENCE_CONFIG);
  
  const waCount = queue.filter(q => q.channel === 'WHATSAPP_GOLDEN_TRIO').length;
  const fallbackCount = queue.filter(q => q.channel === 'SMS_FALLBACK' || q.channel === 'EMAIL_DOSSIER').length;
  
  assert.ok(waCount > 0, 'Deve conter canais WhatsApp Golden Trio');
  assert.ok(fallbackCount > 0, 'Deve conter canais de fallback SMS/Email');
});

// 4. Simulação de Campanha & Funil
console.log('\n📌 4. SIMULAÇÃO DE CAMPANHA & FUNIL DE CONVERSÃO');

runTest('Simulação de campanha projeta métricas de funil realistas', () => {
  const report = simulateOutboundPilotCampaign();
  
  assert.strictEqual(report.totalLeads, 40);
  assert.ok(report.totalMonthlyWasteAuditedBRL > 1000000, 'Total auditado deve ultrapassar R$ 1.000.000');
  
  const funnel = report.funnelMetrics;
  assert.strictEqual(funnel.dispatched, 40);
  assert.ok(funnel.delivered >= 38, 'Taxa de entrega alta');
  assert.ok(funnel.responded >= 10, 'Taxa de resposta de pelo menos 25%');
  assert.ok(funnel.meetingBooked >= 4, 'Pelo menos 4 reuniões agendadas');
  assert.ok(funnel.convertedStripeSubscribers >= 2, 'Pelo menos 2 clientes convertidos');
  assert.ok(funnel.projectedNewArrBRL > 10000, 'Novo ARR positivo');
  assert.ok(report.durationEstimateHours > 0.5, 'Duração da campanha realista com delays');
});

// -------------------------------------------------------------
// RELATÓRIO FINAL
// -------------------------------------------------------------
console.log('\n============================================================');
console.log(`📊 RESULTADO TESTE OUTBOUND: ${passed}/${total} TESTES PASSARAM COM SUCESSO`);
console.log('============================================================\n');

if (passed !== total) {
  process.exit(1);
}
