import { 
  getStoreMemory,
  recordStoreInspection,
  detectRestockEvents,
  formatRestockCelebrationMessage,
  normalizeDomain,
  extractCanonicalSize,
  extractProductHandle
} from '../src/services/memory/storeContextMemory.ts';

import { 
  isCloudflareChallenge,
  parseProtectedProductCatalog,
  fetchWithFirecrawlFallback
} from '../src/services/network/firecrawlFallbackService.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🧠 BATERIA DE TESTES • FASE 2: MEMÓRIA MEM0 & FIRECRAWL MCP FALLBACK       ║');
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

// 1. Testes de Normalização, Canonização e Handles Estáveis
console.log('🔍 [1/5] Testando Normalização, Canonização & Handles Estáveis...');
const domain = 'https://lojadeteste.com.br/produtos';
const clean = normalizeDomain(domain);
assertTest(clean === 'lojadeteste.com.br', 'Domínio normalizado corretamente');

assertTest(extractCanonicalSize('Azul / M') === 'M', 'Tamanho composto "Azul / M" canonizado para "M"');
assertTest(extractCanonicalSize('Preto - GG') === 'GG', 'Tamanho composto "Preto - GG" canonizado para "GG"');
assertTest(extractCanonicalSize('Tam: 41') === '41', 'Calçado numérico "Tam: 41" canonizado para "41"');

const handleFromUrl = extractProductHandle('https://lojadeteste.com.br/products/camisa-polo-linho?variant=123', 'SKU-001');
assertTest(handleFromUrl === 'camisa-polo-linho', 'Handle estável extraído diretamente da URL do produto');

const initialProfile = getStoreMemory(clean);
assertTest(initialProfile.domain === 'lojadeteste.com.br', 'Perfil recuperado com domínio correto');
assertTest(initialProfile.auditCount === 0, 'Contagem inicial de auditorias zerada');
assertTest(initialProfile.dailyAdBudget === 150, 'Orçamento padrão inicial definido (R$ 150/dia)');

// 2. Teste de Registro da Inspeção T0 (Ruptura em M e G)
console.log('\n🔍 [2/5] Testando Registro de Inspeção Inicial (T0: Ruptura)...');
const t0Result = recordStoreInspection('lojadeteste.com.br', {
  brandName: 'Loja de Teste',
  merchantName: 'Gustavo',
  dailyAdBudget: 250,
  products: [
    {
      handle: 'camisa-polo-linho',
      title: 'Camisa Polo Puro Linho',
      brokenSizes: ['M', 'G'],
      availableSizes: ['P', 'GG']
    }
  ]
});

assertTest(t0Result.profile.auditCount === 1, 'Auditoria 1 registrada na memória');
assertTest(t0Result.profile.dailyAdBudget === 250, 'Orçamento diário atualizado para R$ 250');
assertTest(t0Result.profile.knownSkus['camisa-polo-linho'].brokenSizes.includes('M'), 'Tamanho M registrado como quebrado no T0');
assertTest(t0Result.restockEvents.length === 0, 'Nenhum restock disparado na primeira inspeção');

// 3. Teste de Inspeção T1 com Detecção de Reposição (Restock Detection)
console.log('\n🔍 [3/5] Testando Inspeção Subsequente (T1: Reposição de Estoque)...');
const t1Result = recordStoreInspection('lojadeteste.com.br', {
  products: [
    {
      handle: 'camisa-polo-linho',
      title: 'Camisa Polo Puro Linho',
      brokenSizes: ['G'], // M foi reposto! Agora está disponível
      availableSizes: ['P', 'M', 'GG']
    }
  ]
});

assertTest(t1Result.profile.auditCount === 2, 'Auditoria 2 computada');
assertTest(t1Result.restockEvents.length === 1, '1 Evento de reposição identificado com sucesso');
assertTest(t1Result.restockEvents[0].restockedSizes.includes('M'), 'Tamanho M reconhecido como reposto');

const celebrationMsg = formatRestockCelebrationMessage({
  storeDomain: 'lojadeteste.com.br',
  merchantName: 'Gustavo',
  restockEvents: t1Result.restockEvents
});

assertTest(celebrationMsg.includes('Gustavo'), 'Mensagem de celebração traz o nome do gestor');
assertTest(celebrationMsg.includes('Camisa Polo Puro Linho'), 'Nome do produto na notificação');
assertTest(celebrationMsg.includes('*[M]* voltaram ao estoque'), 'Identificação dos tamanhos repostos');
assertTest(celebrationMsg.includes('reativá-las com segurança máxima'), 'Instrução positiva para o gestor');

// 4. Teste de Imunidade a Falsos-Positivos de Reposição
console.log('\n🔍 [4/5] Testando Imunidade a Falsos-Positivos de Reposição...');
const falsePositiveCheck = detectRestockEvents('lojadeteste.com.br', [
  {
    handle: 'camisa-polo-linho',
    title: 'Camisa Polo Puro Linho',
    brokenSizes: ['G'], // G continua quebrado!
    availableSizes: ['P', 'G'] // Suposta anomalia de catálogo onde G aparece em ambos
  }
]);
assertTest(falsePositiveCheck.length === 0, 'G não é falso-positivo de restock pois continua na lista de quebrados');

// 5. Testes do Roteador de Scraping Firecrawl Fallback
console.log('\n🔍 [5/5] Testando Detector de Cloudflare & Contingência Firecrawl...');
const isBlock403 = isCloudflareChallenge('Access Denied', 403);
assertTest(isBlock403 === true, 'Status 403 reconhecido como bloqueio de segurança');

const isTurnstile = isCloudflareChallenge('<html><div class="turnstile-wrapper">Just a moment...</div></html>', 200);
assertTest(isTurnstile === true, 'Turnstile challenge no HTML identificado');

// Teste de fallback automático em chamada simulada bloqueada
async function runNetworkTests() {
  const blockedFetcher = async () => ({
    ok: false,
    status: 403,
    text: async () => '<html><body>Attention Required! | Cloudflare</body></html>'
  });

  const scrapeResult = await fetchWithFirecrawlFallback('https://loja-protegida.com.br/products.json', blockedFetcher);
  assertTest(scrapeResult.success === true, 'Fallback Firecrawl recuperou dados com sucesso');
  assertTest(scrapeResult.source === 'FIRECRAWL_MCP_FALLBACK', 'Fonte marcada como FIRECRAWL_MCP_FALLBACK');
  assertTest(scrapeResult.cloudflareDetected === true, 'Detecção de Cloudflare sinalizada');

  const parsedCatalog = parseProtectedProductCatalog(scrapeResult.content, 'https://loja-protegida.com.br');
  assertTest(parsedCatalog.length > 0, 'Produtos extraídos do payload protegido');
  assertTest(parsedCatalog[0].sizes.length > 0, 'Variantes e tamanhos extraídos com precisão');

  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log(`║ 📊 BALANÇO: ${passedTests}/${totalTests} TESTES DA FASE 2 APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  if (passedTests === totalTests) {
    console.log('║ 🏆 RESULTADO: FASE 2 (MEMÓRIA MEM0 & FIRECRAWL MCP) HOMOLOGADA COM SUCESSO! ║');
  } else {
    console.log('║ ⚠️ RESULTADO: HOUVE FALHA EM ALGUNS TESTES!                                ║');
  }
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runNetworkTests().catch(err => {
  console.error('Erro na execução da suíte:', err);
  process.exit(1);
});
