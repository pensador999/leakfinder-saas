// ==============================================================================
// 🧪 SUÍTE DE TESTES AUTOMATIZADOS • FASE 1 (PLAYWRIGHT CAPTURE & STRIPE BILLING)
// Validação de captura de prova visual, planos de assinatura e checkout 1-clique.
// ==============================================================================

import { 
  ADSHIELD_STRIPE_PLANS, 
  createStripeCheckoutSession, 
  formatWhatsAppOfferWithStripe 
} from '../src/services/billing/stripeCheckoutService.ts';

import { 
  generateVisualEvidencePayload 
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
console.log('🔍 [1/3] Testando Configuração de Planos Stripe...');
assertTest(ADSHIELD_STRIPE_PLANS.STARTER_MONTHLY.priceBrl === 290, 'Plano Starter custa R$ 290');
assertTest(ADSHIELD_STRIPE_PLANS.PRO_MONTHLY.priceBrl === 490, 'Plano Pro custa R$ 490');
assertTest(ADSHIELD_STRIPE_PLANS.AGENCY_MONTHLY.priceBrl === 990, 'Plano Agency custa R$ 990');
assertTest(ADSHIELD_STRIPE_PLANS.PRO_MONTHLY.recommended === true, 'Plano Pro marcado como recomendado');

// 2. Testes de Geração de Checkout Session
console.log('\n🔍 [2/3] Testando Geração de Checkout 1-Clique...');
const sessionPro = createStripeCheckoutSession({
  planId: 'PRO_MONTHLY',
  storeDomain: 'insiderstore.com.br',
  customerEmail: 'financeiro@insiderstore.com.br'
});

assertTest(sessionPro.success === true, 'Checkout Pro gerado com sucesso');
assertTest(sessionPro.priceBrl === 490, 'Preço de checkout correto (R$ 490)');
assertTest(sessionPro.checkoutUrl.includes('stripe.com'), 'URL aponta para gateway Stripe');
assertTest(sessionPro.checkoutUrl.includes('insiderstore.com.br'), 'Referência da loja injetada no link');

// 3. Testes de Captura Visual Playwright
console.log('\n🔍 [3/3] Testando Payload de Prova do Crime Visual...');
const evidence = generateVisualEvidencePayload({
  storeDomain: 'brkagro.com.br',
  productTitle: 'Camisa Paixão por Cavalos UV50',
  productUrl: 'https://brkagro.com.br/products/camisa-paixao',
  brokenSizes: ['M', 'G', 'GG']
});

assertTest(evidence.evidenceId.startsWith('evid_'), 'ID de evidência único gerado');
assertTest(evidence.brokenSizes.includes('M') && evidence.brokenSizes.includes('G'), 'Tamanhos M e G registrados na evidência');
assertTest(evidence.annotatedHtmlSnippet.includes('PROVA DO CRIME'), 'Snippet demarcado contém cabeçalho de prova');
assertTest(evidence.caption.includes('brkagro.com.br'), 'Legenda de WhatsApp contém o domínio auditado');

// 4. Teste da Oferta Integrada de WhatsApp
const whatsappMsg = formatWhatsAppOfferWithStripe({
  storeDomain: 'brkagro.com.br',
  merchantName: 'Marcos',
  productTitle: 'Camisa Paixão por Cavalos UV50',
  brokenSizes: ['M', 'G'],
  estimatedMonthlyLoss: 2500,
  planId: 'PRO_MONTHLY'
});

assertTest(whatsappMsg.includes('Marcos'), 'Mensagem personalizada com o nome do lojista');
assertTest(whatsappMsg.includes('R$ 490/mês'), 'Mensagem traz o preço da assinatura Pro');
assertTest(whatsappMsg.includes('buy.stripe.com'), 'Mensagem contém o link de pagamento 1-clique do Stripe');

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
