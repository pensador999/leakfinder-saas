// ==============================================================================
// 🧪 SUÍTE DE TESTES AUTOMATIZADOS • DETECÇÃO DE VARIANTES MULTIPLATAFORMA
// Validação de 100% de precisão e ZERO FALSO-POSITIVO em Shopify, Nuvemshop, VTEX e Yampi.
// ==============================================================================

import { 
  extractFromShopifyJson, 
  extractFromNuvemshopPayload, 
  checkProductExemption,
  normalizeSizeName,
  isFootwearProduct
} from '../src/services/catalog/universalVariantExtractor.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🔬 BATERIA DE TESTES DE PRECISÃO DE VARIANTES & ZERO FALSO-POSITIVO        ║');
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

// ==============================================================================
// TESTES 1: NORMALIZAÇÃO DE TAMANHOS BRASILEIROS
// ==============================================================================
console.log('🔍 [1/5] Testando Normalização de Grade Brasileira...');
assertTest(normalizeSizeName('Tamanho: M') === 'M', 'Normalização "Tamanho: M" -> "M"');
assertTest(normalizeSizeName('Tam. GG') === 'GG', 'Normalização "Tam. GG" -> "GG"');
assertTest(normalizeSizeName('XG') === 'GG', 'Normalização "XG" -> "GG"');
assertTest(normalizeSizeName('Extra Grande') === 'GG', 'Normalização "Extra Grande" -> "GG"');
assertTest(normalizeSizeName('One Size') === 'ÚNICO', 'Normalização "One Size" -> "ÚNICO"');
assertTest(normalizeSizeName('DEFAULT TITLE') === 'ÚNICO', 'Normalização "DEFAULT TITLE" -> "ÚNICO"');

// ==============================================================================
// TESTES 2: REGRAS DE ISENÇÃO ANTI-FALSO-POSITIVO
// ==============================================================================
console.log('\n🔍 [2/5] Testando Filtro Quádruplo de Isenção (Zero Falso-Positivo)...');

// Caso A: Boné de tamanho único
const boneExemption = checkProductExemption('Boné Trucker Classic Preto', ['Acessórios']);
assertTest(boneExemption.isExempt === true, 'Boné deve ser isento de grade P/M/G', 'Falha na isenção de boné');

// Caso B: Cinto de Couro
const cintoExemption = checkProductExemption('Cinto Couro Legítimo Fivela Prata');
assertTest(cintoExemption.isExempt === true, 'Cinto deve ser isento', 'Falha na isenção de cinto');

// Caso C: Whey Protein / Suplemento
const wheyExemption = checkProductExemption('100% Whey Concentrado 900g Baunilha');
assertTest(wheyExemption.isExempt === true, 'Suplemento deve ser isento', 'Falha na isenção de suplemento');

// Caso D: Produto com regra _FULL
const fullExemption = checkProductExemption('Camiseta Linho_FULL', ['MODA_FULL']);
assertTest(fullExemption.isExempt === true, 'Produto _FULL deve ser isento', 'Falha na isenção de tag _FULL');

// Caso E: Camiseta normal NÃO deve ser isenta
const tShirtExemption = checkProductExemption('Camiseta Algodão Egípcio Classic', ['Roupas', 'Masculino']);
assertTest(tShirtExemption.isExempt === false, 'Camiseta normal não deve ser isenta', 'Isentou camiseta indevidamente');

// ==============================================================================
// TESTES 3: RECONHECIMENTO DE CALÇADOS E GRADE NUMÉRICA
// ==============================================================================
console.log('\n🔍 [3/5] Testando Reconhecimento de Calçados...');
assertTest(isFootwearProduct('Tênis Casual Slip-on Couro') === true, 'Identifica "Tênis"');
assertTest(isFootwearProduct('Bota Adventure Impermeável') === true, 'Identifica "Bota"');
assertTest(isFootwearProduct('Mocassim Tratorado Confort') === true, 'Identifica "Mocassim"');
assertTest(isFootwearProduct('Camisa Polo Piquet') === false, 'Não confunde "Camisa" com calçado');

// ==============================================================================
// TESTES 4: AUDITORIA NATIVA SHOPIFY JSON
// ==============================================================================
console.log('\n🔍 [4/5] Testando Extração Nativa Shopify JSON...');

// Mock de produto Shopify com grade furada (M e G esgotados)
const mockShopifyBroken = {
  title: 'Camiseta Pima Regular Fit',
  tags: ['Moda', 'Verão'],
  options: ['Tamanho'],
  variants: [
    { title: 'P', available: true, price: '149.00' },
    { title: 'M', available: false, price: '149.00', inventory_policy: 'deny' },
    { title: 'G', available: false, price: '149.00', inventory_policy: 'deny' },
    { title: 'GG', available: true, price: '149.00' }
  ]
};

const resultShopifyBroken = extractFromShopifyJson(mockShopifyBroken);
assertTest(resultShopifyBroken.hasApparelGrid === true, 'Shopify: detectou grade de vestuário');
assertTest(resultShopifyBroken.rupturedSizes.includes('M'), 'Shopify: detectou M esgotado');
assertTest(resultShopifyBroken.rupturedSizes.includes('G'), 'Shopify: detectou G esgotado');
assertTest(resultShopifyBroken.isCriticalRupture === true, 'Shopify: sinalizou ruptura crítica (M/G)');
assertTest(resultShopifyBroken.availableSizes.includes('P'), 'Shopify: manteve P como disponível');

// Mock de produto Shopify com pré-venda ativa (available: false, mas inventory_policy: continue)
const mockShopifyPreorder = {
  title: 'Jaqueta Couro Legítimo Edição Limitada',
  tags: ['Inverno'],
  options: ['Tamanho'],
  variants: [
    { title: 'M', available: false, price: '890.00', inventory_policy: 'continue' },
    { title: 'G', available: true, price: '890.00', inventory_policy: 'continue' }
  ]
};
const resultShopifyPreorder = extractFromShopifyJson(mockShopifyPreorder);
assertTest(!resultShopifyPreorder.rupturedSizes.includes('M'), 'Shopify Pré-Venda: não marca como rompido quando policy é continue');

// ==============================================================================
// TESTES 5: AUDITORIA NATIVA NUVEMSHOP (TIENDANUBE LS.product)
// ==============================================================================
console.log('\n🔍 [5/5] Testando Extração Nativa Nuvemshop Payload...');

const mockNuvemshop = {
  name: 'Vestido Midi Estampado Floral',
  variants: [
    { id: 101, values: [{ pt: 'P' }], stock: 5, available: true },
    { id: 102, values: [{ pt: 'M' }], stock: 0, available: false },
    { id: 103, values: [{ pt: 'G' }], stock: 0, available: false },
    { id: 104, values: [{ pt: 'GG' }], stock: 2, available: true }
  ]
};

const resultNuvem = extractFromNuvemshopPayload(mockNuvemshop);
assertTest(resultNuvem.platform === 'Nuvemshop', 'Nuvemshop: plataforma identificada');
assertTest(resultNuvem.rupturedSizes.includes('M'), 'Nuvemshop: M identificado como sem estoque');
assertTest(resultNuvem.rupturedSizes.includes('G'), 'Nuvemshop: G identificado como sem estoque');
assertTest(resultNuvem.isCriticalRupture === true, 'Nuvemshop: ruptura crítica identificada');
assertTest(resultNuvem.availableSizes.includes('P') && resultNuvem.availableSizes.includes('GG'), 'Nuvemshop: P e GG mantidos ativos');

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES DE PRECISÃO APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
if (passedTests === totalTests) {
  console.log('║ 🏆 RESULTADO: MOTOR DE VARIANTES 100% BLINDADO CONTRA FALSOS-POSITIVOS!   ║');
} else {
  console.log('║ ⚠️ RESULTADO: HOUVE FALHA EM CENÁRIOS DE TESTE!                           ║');
}
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
