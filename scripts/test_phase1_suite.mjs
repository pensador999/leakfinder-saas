// ==============================================================================
// 🧪 SUÍTE DE TESTES AUTOMATIZADOS • FASE 1 (PLAYWRIGHT CAPTURE & STRIPE BILLING)
// Validação de captura de prova visual, planos de assinatura e checkout 1-clique.
// ==============================================================================

import { 
  ADSHIELD_STRIPE_PLANS, 
  createStripeCheckoutSession, 
  calculateDynamicLossEstimate,
  formatWhatsAppOfferWithStripe 
} from '../src/services/billing/stripeCheckoutService.ts';

import { 
  generateVisualEvidencePayload,
  calculateStockoutSeverity
} from '../src/services/vision/playwrightEvidenceCapture.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 💳 BATERIA DE TESTES • FASE 1: PROVA VISUAL & STRIPE BILLING 1-CLIQUE       ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let passedTests = 0;
let totalTests = 0;

function assertTest(condition, testName, errorMsg) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} - ${errorMsg}`);
  }
}

// 1. Testes de Planos Stripe
console.log('🔍 [1/4] Testando Configuração de Planos Stripe...');
assertTest(ADSHIELD_STRIPE_PLANS.STARTER_MONTHLY.priceBrl === 297, 'Plano Starter custa R$ 297');
assertTest(ADSHIELD_STRIPE_PLANS.PRO_MONTHLY.priceBrl === 497, 'Plano Pro custa R$ 497');
assertTest(ADSHIELD_STRIPE_PLANS.AGENCY_MONTHLY.priceBrl === 1497, 'Plano Agency custa R$ 1497');
assertTest(ADSHIELD_STRIPE_PLANS.PRO_MONTHLY.recommended === true, 'Plano Pro marcado como recomendado');

// 2. Testes de Geração de Checkout Session
console.log('\n🔍 [2/4] Testando Geração de Checkout 1-Clique com UTMs...');
const sessionPro = createStripeCheckoutSession({
  planId: 'PRO_MONTHLY',
  storeDomain: 'insiderstore.com.br',
  customerEmail: 'financeiro@insiderstore.com.br'
});

assertTest(sessionPro.success === true, 'Checkout Pro gerado com sucesso');
assertTest(sessionPro.priceBrl === 497, 'Preço de checkout correto (R$ 497)');
assertTest(sessionPro.checkoutUrl.includes('stripe.com'), 'URL aponta para gateway Stripe');
assertTest(sessionPro.checkoutUrl.includes('insiderstore.com.br'), 'Referência da loja injetada no link');
assertTest(sessionPro.checkoutUrl.includes('utm_source=adshield_whatsapp'), 'Parâmetros de UTM incluídos no checkout');

// 3. Testes de Captura Visual Playwright & Severidade
console.log('\n🔍 [3/4] Testando Payload de Prova do Crime Visual & Severidade...');
const severityCheck = calculateStockoutSeverity(['M', 'G'], 5);
assertTest(severityCheck.severity === 'CRITICAL', 'Ruptura de M e G classificada como CRITICAL');

const evidence = generateVisualEvidencePayload({
  storeDomain: 'brkagro.com.br',
  productTitle: 'Camisa Paixão por Cavalos UV50',
  productUrl: 'https://brkagro.com.br/products/camisa-paixao',
  brokenSizes: ['M', 'G', 'GG'],
  totalSizesCount: 5
});

assertTest(evidence.evidenceId.startsWith('evid_'), 'ID de evidência único gerado');
assertTest(evidence.brokenSizes.includes('M') && evidence.brokenSizes.includes('G'), 'Tamanhos M e G registrados na evidência');
assertTest(evidence.severity === 'CRITICAL', 'Severidade calculada como CRITICAL');
assertTest(evidence.stockoutRatioPercent === 60, 'Taxa de ruptura calculada em 60%');
assertTest(evidence.annotatedHtmlSnippet.includes('PROVA DO CRIME'), 'Snippet demarcado contém cabeçalho de prova');
assertTest(evidence.caption.includes('brkagro.com.br'), 'Legenda de WhatsApp contém o domínio auditado');

// 4. Teste de Cálculo Dinâmico de Perda & Oferta de WhatsApp
console.log('\n🔍 [4/4] Testando Cálculo Dinâmico de Perda & Oferta com ROI...');
const dynamicCalc = calculateDynamicLossEstimate({
  dailyAdBudget: 150,
  brokenSizes: ['M', 'G']
});
assertTest(dynamicCalc.demandImpactPercent === 65, 'Demanda de M/G calculada em 65%');
assertTest(dynamicCalc.estimatedMonthlyLoss === 2925, 'Perda mensal calculada em R$ 2.925 (150 * 0.65 * 30)');

const whatsappMsg = formatWhatsAppOfferWithStripe({
  storeDomain: 'brkagro.com.br',
  merchantName: 'Marcos',
  productTitle: 'Camisa Paixão por Cavalos UV50',
  brokenSizes: ['M', 'G'],
  dailyAdBudget: 150,
  planId: 'PRO_MONTHLY'
});

assertTest(whatsappMsg.includes('Marcos'), 'Mensagem personalizada com o nome do lojista');
assertTest(whatsappMsg.includes('R$ 497/mês'), 'Mensagem traz o preço da assinatura Pro');
assertTest(whatsappMsg.includes('buy.stripe.com'), 'Mensagem contém o link de pagamento 1-clique do Stripe');
assertTest(whatsappMsg.includes('Retorno do Investimento Estimado'), 'Mensagem exibe o cálculo de ROI');
assertTest(whatsappMsg.includes('6.0x') || whatsappMsg.includes('5.9x') || whatsappMsg.includes('6x'), 'Múltiplo de ROI correto (~6.0x)');

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES DA FASE 1 APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
if (passedTests === totalTests) {
  console.log('║ 🏆 RESULTADO: FASE 1 (PLAYWRIGHT CAPTURE & STRIPE CHECKOUT) HOMOLOGADA!    ║');
} else {
  console.log('║ ⚠️ RESULTADO: HOUVE FALHA EM TESTES!                                        ║');
}
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
