// ==============================================================================
// 🧪 SUÍTE DE TESTES AUTOMATIZADOS • FASE 3 (VIDEO-AVATAR & MULTIMEDIA OUTBOUND)
// Validação de roteiro calibrado de 15s, adapter Duix-Avatar e dispatcher WhatsApp.
// ==============================================================================

import { 
  generateVideoPitchScript, 
  extractFirstName 
} from '../src/services/outbound/videoPitchGenerator.ts';

import { 
  createAvatarVideoSpec 
} from '../src/services/outbound/avatarVideoAdapter.ts';

import { 
  generateVisualEvidencePayload 
} from '../src/services/vision/playwrightEvidenceCapture.ts';

import { 
  buildMultimediaOutboundPackage 
} from '../src/services/outbound/multimediaDispatchService.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🎬 BATERIA DE TESTES • FASE 3: VÍDEO-AVATAR (DUIX) & OUTBOUND MULTIMÍDIA    ║');
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

// 1. Testes de Geração de Roteiro Calibrado (15 a 20s)
console.log('🔍 [1/3] Testando Gerador de Roteiro de Vídeo-Avatar (15s)...');
assertTest(extractFirstName('Marcos Rezende') === 'Marcos', 'Primeiro nome extraído corretamente ("Marcos")');
assertTest(extractFirstName('') === 'Gestor', 'Fallback para "Gestor" em nome vazio');

const script = generateVideoPitchScript({
  storeDomain: 'brkagro.com.br',
  merchantName: 'Marcos Rezende',
  productTitle: 'Camisa Manga Longa UV50+',
  brokenSizes: ['M', 'G', 'GG'],
  estimatedMonthlyLoss: 5280
});

assertTest(script.merchantName === 'Marcos', 'Nome inserido no roteiro');
assertTest(script.wordCount >= 30 && script.wordCount <= 75, `Contagem de palavras calibrada (${script.wordCount} palavras)`);
assertTest(script.estimatedDurationSeconds >= 12 && script.estimatedDurationSeconds <= 22, `Duração estimada em janela de 15-20s (${script.estimatedDurationSeconds}s)`);
assertTest(script.scriptBlocks.hook.includes('Marcos'), 'Bloco 1 (Gancho) contém nome do lojista');
assertTest(script.scriptBlocks.proof.includes('Camisa Manga Longa UV50+'), 'Bloco 2 (Prova) cita o produto');
assertTest(script.scriptBlocks.financial.includes('5.280'), 'Bloco 3 (Financeiro) cita o valor de perda');
assertTest(script.scriptBlocks.cta.includes('Sentinela 24/7'), 'Bloco 4 (CTA) faz a chamada para ação');
assertTest(script.subtitlesSrt.includes('00:00:00,000 --> 00:00:04,200'), 'Legendas SRT geradas com timestamps');

// 2. Testes do Adapter Duix-Avatar / HeyGem Spec
console.log('\n🔍 [2/3] Testando Adapter de Composição de Vídeo (9:16 PiP)...');
const evidence = generateVisualEvidencePayload({
  storeDomain: 'brkagro.com.br',
  productTitle: 'Camisa Manga Longa UV50+',
  productUrl: 'https://brkagro.com.br/products/camisa-manga-longa-uv50',
  brokenSizes: ['M', 'G', 'GG']
});

const videoSpec = createAvatarVideoSpec({ script, evidence });

assertTest(videoSpec.resolution.width === 1080 && videoSpec.resolution.height === 1920, 'Resolução vertical 9:16 (1080x1920)');
assertTest(videoSpec.layers.backgroundEvidence.type === 'IMAGE_PLAYWRIGHT_SCREENSHOT', 'Camada de fundo configurada com Playwright screenshot');
assertTest(videoSpec.layers.avatarForeground.position === 'BOTTOM_RIGHT', 'Avatar posicionado em PiP no canto inferior direito');
assertTest(videoSpec.layers.subtitles.textColor === '#facc15', 'Legendas com amarelo de alto contraste (#facc15)');
assertTest(videoSpec.mockVideoUrl.includes('domain=brkagro.com.br'), 'URL de mock de vídeo vinculada ao domínio da loja');

// 3. Testes do Dispatcher Multimídia Completo (A Trinca de Fechamento)
console.log('\n🔍 [3/3] Testando Dispatcher Multimídia (A Trinca de Ouro)...');
const pkg = buildMultimediaOutboundPackage({
  storeDomain: 'brkagro.com.br',
  merchantName: 'Marcos Rezende',
  productTitle: 'Camisa Manga Longa UV50+',
  productUrl: 'https://brkagro.com.br/products/camisa-manga-longa-uv50',
  brokenSizes: ['M', 'G', 'GG'],
  dailyAdBudget: 220,
  planId: 'PRO_MONTHLY'
});

assertTest(pkg.packageId.startsWith('pkg_'), 'ID único do pacote gerado');
assertTest(pkg.video.resolution.aspectRatio === '9:16', 'Vídeo do pacote em formato 9:16');
assertTest(pkg.evidence.brokenSizes.includes('M'), 'Prova visual anexada no pacote');
assertTest(pkg.directStripeCheckoutUrl.includes('buy.stripe.com'), 'Link Stripe 1-clique incluído');
assertTest(pkg.directStripeCheckoutUrl.includes('utm_source=adshield_whatsapp'), 'UTM de rastreio presente no link');
assertTest(pkg.estimatedRoi.includes('x'), 'ROI estimado calculado e formatado');

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES DA FASE 3 APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
if (passedTests === totalTests) {
  console.log('║ 🏆 RESULTADO: FASE 3 (VÍDEO-AVATAR & MULTIMÍDIA) HOMOLOGADA COM SUCESSO!   ║');
} else {
  console.log('║ ⚠️ RESULTADO: HOUVE FALHA EM TESTES!                                        ║');
}
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
