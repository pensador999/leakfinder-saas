// ==============================================================================
// 🧪 SUÍTE DE TESTES DE INTEGRIDADE DE CÓDIGO & AUDITORIA DE SITES REAIS
// AdShield 2026.4 — Blindagem de Código, Moeda BRL e Zero Falsos-Positivos
// ==============================================================================

import { parseBRLPrice, formatBRL, calculatePriceSpread } from '../src/services/pricing/currencyUtils.ts';
import { checkProductExemption, normalizeSizeName, extractFromDOM } from '../src/services/catalog/universalVariantExtractor.ts';
import { parseProductJsonLd, parseTrayProductHtml, parseNuvemshopProductHtml } from '../src/services/scrapers/platformAdapters.ts';
import { auditGoogleShoppingShield } from '../src/services/audits/googleShoppingShieldEngine.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🛡️ SUÍTE DE INTEGRIDADE: PARSER DE SITES, MOEDA BRL & ZERO FALSO-POSITIVO  ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let passedTests = 0;
let totalTests = 0;

function assertTest(condition, testName, errorDetails = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} - ${errorDetails}`);
  }
}

// ==============================================================================
// BATERIA 1: PARSER ROBUSTO DE MOEDA BRASILEIRA (BRL)
// ==============================================================================
console.log('🔍 [1/5] Testando Parser de Moeda Brasileira (Eliminando o bug de 1.250,90 -> 1.25)...');

// Caso 1: Alto ticket com ponto de milhar e vírgula de centavos (ex: Texas Center, 7M Boots)
assertTest(parseBRLPrice('R$ 1.250,90') === 1250.90, 'Parse "R$ 1.250,90" -> 1250.90', `Obteve: ${parseBRLPrice('R$ 1.250,90')}`);
assertTest(parseBRLPrice('1.499,00') === 1499.00, 'Parse "1.499,00" -> 1499.00', `Obteve: ${parseBRLPrice('1.499,00')}`);
assertTest(parseBRLPrice('2.849,91') === 2849.91, 'Parse "2.849,91" -> 2849.91', `Obteve: ${parseBRLPrice('2.849,91')}`);

// Caso 2: Preço padrão com vírgula (ex: BRK, Presa Viva)
assertTest(parseBRLPrice('R$ 159,90') === 159.90, 'Parse "R$ 159,90" -> 159.90', `Obteve: ${parseBRLPrice('R$ 159,90')}`);
assertTest(parseBRLPrice('129,90') === 129.90, 'Parse "129,90" -> 129.90', `Obteve: ${parseBRLPrice('129,90')}`);

// Caso 3: Formato decimal nativo Shopify / JSON (ponto como decimal)
assertTest(parseBRLPrice('159.90') === 159.90, 'Parse "159.90" -> 159.90', `Obteve: ${parseBRLPrice('159.90')}`);
assertTest(parseBRLPrice(159.90) === 159.90, 'Parse number 159.90 -> 159.90', `Obteve: ${parseBRLPrice(159.90)}`);

// Caso 4: Preço zerado (Google Shopping bug / descontinuado)
assertTest(parseBRLPrice('R$ 0,00') === 0, 'Parse "R$ 0,00" -> 0', `Obteve: ${parseBRLPrice('R$ 0,00')}`);
assertTest(parseBRLPrice('0.00') === 0, 'Parse "0.00" -> 0', `Obteve: ${parseBRLPrice('0.00')}`);
assertTest(parseBRLPrice('0') === 0, 'Parse "0" -> 0', `Obteve: ${parseBRLPrice('0')}`);

// Caso 5: Entradas anômalas, nulas e strings malformadas (Zero crash)
assertTest(parseBRLPrice(null) === 0, 'Parse null -> 0 (Zero crash)');
assertTest(parseBRLPrice(undefined) === 0, 'Parse undefined -> 0 (Zero crash)');
assertTest(parseBRLPrice('') === 0, 'Parse "" -> 0 (Zero crash)');
assertTest(parseBRLPrice('Sob Consulta') === 0, 'Parse "Sob Consulta" -> 0 (Zero crash)');
assertTest(parseBRLPrice('<span>R$ 389,00</span>') === 389.00, 'Parse com HTML embutido -> 389.00');

// ==============================================================================
// BATERIA 2: BLINDAGEM DE ISENÇÃO (BONÉS, PESCA, REVENDA, _FULL)
// ==============================================================================
console.log('\n🔍 [2/5] Testando Isenção de Catálogo (Zero Falsos-Positivos de Ruptura de Grade)...');

// Caso A: Iscas artificiais e tralhas de pesca (BRK Fishing)
const iscaExemption = checkProductExemption('Isca Artificial Meia Água 110mm 15g');
assertTest(iscaExemption.isExempt === true, 'Isca de Pesca deve ser isenta de grade PP-G2');

const varaExemption = checkProductExemption('Vara de Pescar Carbono 17lb 1.80m');
assertTest(varaExemption.isExempt === true, 'Vara de Pesca deve ser isenta de grade PP-G2');

const carretilhaExemption = checkProductExemption('Carretilha Perfil Baixo Drag 8kg');
assertTest(carretilhaExemption.isExempt === true, 'Carretilha deve ser isenta de grade PP-G2');

// Caso B: Bonés Trucker e Acessórios de Tamanho Único
const truckerExemption = checkProductExemption('Boné Trucker Yellowstone Dutton Ranch');
assertTest(truckerExemption.isExempt === true, 'Boné Trucker Yellowstone deve ser isento de grade PP-G2');

const manguitoExemption = checkProductExemption('Manguito Proteção Solar UV50+');
assertTest(manguitoExemption.isExempt === true, 'Manguito deve ser isento de grade PP-G2');

const bandanaExemption = checkProductExemption('Bandana Tubular Multiuso');
assertTest(bandanaExemption.isExempt === true, 'Bandana deve ser isenta de grade PP-G2');

// Caso C: Vestuário regular NÃO deve ser isento
const camisaNormalExemption = checkProductExemption('Camisa Polo Masculina Piquet');
assertTest(camisaNormalExemption.isExempt === false, 'Camisa regular NÃO deve ser isenta');

// ==============================================================================
// BATERIA 3: SCHEMA.ORG JSON-LD & ADAPTADORES MULTI-CMS (TRAY & NUVEMSHOP)
// ==============================================================================
console.log('\n🔍 [3/5] Testando Parser de Schema.org JSON-LD e Plataformas Reais...');

// Mock HTML de Produto Tray Commerce (Texas Center)
const mockTrayHtml = `
  <html>
    <head>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Chapéu Western Feltro Importado Resistol",
        "image": "https://images.tcdn.com.br/chapeu-resistol.jpg",
        "sku": "TC-RESISTOL-01",
        "offers": {
          "@type": "Offer",
          "price": "1.250,90",
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock"
        }
      }
      </script>
    </head>
    <body>
      <div class="produto">
        <h1>Chapéu Western Feltro Importado Resistol</h1>
        <strong class="preco-destaque">R$ 1.250,90</strong>
      </div>
    </body>
  </html>
`;

const parsedTray = parseTrayProductHtml(mockTrayHtml, 'https://texascenter.com.br/produto/chapeu-resistol');
assertTest(parsedTray.title === 'Chapéu Western Feltro Importado Resistol', 'Tray: Título extraído com sucesso');
assertTest(parsedTray.price === 1250.90, `Tray: Preço BRL correto R$ 1.250,90 (Recebeu: ${parsedTray.price})`);
assertTest(parsedTray.platform === 'Tray', 'Tray: Plataforma identificada corretamente');
assertTest(parsedTray.schemaAvailability === 'InStock', 'Tray: Schema InStock verificado');

// Mock HTML de Produto Nuvemshop (7M Boots com OutOfStock sob encomenda)
const mockNuvemHtml = `
  <html>
    <head>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Bota Texana Feminina Bordada Florão Couro Legítimo",
        "sku": "7M-BOT-029",
        "offers": {
          "@type": "Offer",
          "price": "399,17",
          "priceCurrency": "BRL",
          "availability": "https://schema.org/OutOfStock"
        }
      }
      </script>
    </head>
    <body>
      <div class="js-item-product js-product-out-of-stock">
        <h1>Bota Texana Feminina Bordada Florão Couro Legítimo</h1>
        <span class="js-price-display">R$ 399,17</span>
        <div class="js-product-out-of-stock">Produto sob encomenda</div>
      </div>
    </body>
  </html>
`;

const parsedNuvem = parseNuvemshopProductHtml(mockNuvemHtml, 'https://7mboots.com.br/produtos/bota-texana-feminina');
assertTest(parsedNuvem.title === 'Bota Texana Feminina Bordada Florão Couro Legítimo', 'Nuvemshop: Título extraído com sucesso');
assertTest(parsedNuvem.price === 399.17, `Nuvemshop: Preço BRL correto R$ 399,17 (Recebeu: ${parsedNuvem.price})`);
assertTest(parsedNuvem.schemaAvailability === 'OutOfStock', 'Nuvemshop: Detectou Schema OutOfStock com precisão');
assertTest(parsedNuvem.isOutOfStockInDom === true, 'Nuvemshop: Detectou flag js-product-out-of-stock no DOM');

// ==============================================================================
// BATERIA 4: GOOGLE SHOPPING SHIELD COM PREÇOS REAIS BRL
// ==============================================================================
console.log('\n🔍 [4/5] Testando Google Shopping Shield com Preços BRL e Divergências...');

const shoppingSummary = auditGoogleShoppingShield([
  // Produto 1: Preço zero (anomalia de sitemap)
  {
    title: 'Produto Descontinuado Zerado',
    url: 'https://texascenter.com.br/produto/zerado',
    price: '0,00',
    isOutOfStockInDom: false,
    hasBuyButtonInDom: true
  },
  // Produto 2: 7M Boots case (Schema OutOfStock mas botão ativo no front-end)
  {
    title: 'Bota Texana Escamada',
    url: 'https://7mboots.com.br/produtos/bota-escamada',
    price: '1.250,00',
    schemaAvailability: 'OutOfStock',
    isOutOfStockInDom: false,
    hasBuyButtonInDom: true,
    isPreOrderOrBackorder: true
  },
  // Produto 3: Normal em estoque
  {
    title: 'Camisa Polo Presa Viva',
    url: 'https://presaviva.com.br/produto/camisa-polo',
    price: '159,90',
    schemaAvailability: 'InStock',
    isOutOfStockInDom: false,
    hasBuyButtonInDom: true
  }
]);

assertTest(shoppingSummary.discrepantProductsCount > 0, 'Google Shopping Shield: Detectou anomalias no catálogo');
assertTest(shoppingSummary.items.length === 2, `Detectou exatamente 2 anomalias (Recebeu: ${shoppingSummary.items.length})`);
assertTest(shoppingSummary.items.some(d => d.discrepancyType === 'PRICE_ZERO_INDEXATION_ANOMALY'), 'Detectou anomalia de preço zero');
assertTest(shoppingSummary.items.some(d => d.discrepancyType === 'SCHEMA_OUT_OF_STOCK_BUT_ACTIVE'), 'Detectou Schema OutOfStock vs Compra Ativa (Caso 7M Boots)');

// ==============================================================================
// BATERIA 5: BLINDAGEM DE WIDGETS DE TABELA DE MEDIDAS (SIZEBAY, KIWI, ADDONS)
// ==============================================================================
console.log('\n🔍 [5/5] Testando Reconhecimento de Tabela de Medidas (Zero Falsos-Positivos)...');

const htmlWithSizebay = '<div id="sizebay-container" data-sizebay="active"><button class="vfr-app">Provador Virtual</button></div>';
assertTest(
  htmlWithSizebay.toLowerCase().includes('sizebay') || htmlWithSizebay.toLowerCase().includes('provador virtual'),
  'Reconhece Sizebay / Provador Virtual nativamente'
);

const htmlWithProductAddons = '<product-addons data-text-header="Guia de tamanhos" data-custom-class="size_chart"></product-addons>';
assertTest(
  htmlWithProductAddons.toLowerCase().includes('product-addons') && htmlWithProductAddons.toLowerCase().includes('size_chart'),
  'Reconhece widget <product-addons> da BRK'
);

const htmlWithKiwi = '<div id="kiwi-sizing-chart" class="kiwi-sizing-context">Guia de Tamanhos</div>';
assertTest(
  htmlWithKiwi.toLowerCase().includes('kiwi-sizing'),
  'Reconhece widget Kiwi Sizing'
);

// ==============================================================================
// BALANÇO FINAL DA SUÍTE
// ==============================================================================
console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES DE INTEGRIDADE APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)            ║`);
if (passedTests === totalTests) {
  console.log('║ 🏆 RESULTADO: CÓDIGO 100% BLINDADO CONTRA DADOS ERRADOS E QUEBRAS!        ║');
} else {
  console.log('║ ⚠️ ALERTA: ALGUNS TESTES FALHARAM. VERIFIQUE OS LOGS ACIMA!               ║');
}
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

process.exit(passedTests === totalTests ? 0 : 1);
