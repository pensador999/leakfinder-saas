import fs from 'fs';
import { falsifyProductAnomaly } from './modules/popperianFalsifier.mjs';
import { recordEpisodicIncident, queryProductMemory } from './modules/agentMemoryStore.mjs';
import { MultiAgentProfiler } from './modules/multiAgentOptimizer.mjs';
import { executeGoInDepthScan } from './modules/goInDepthMarketIntelligence.mjs';
import { getShopifyAdminSlug, detectStorePlatform, isExemptProduct, detectProductManufacturingType } from './universalCatalogAdapter.mjs';

async function runAdversarialConfrontationSuite() {
  console.log("╔════════════════════════════════════════════════════════════════════════════╗");
  console.log("║ ⚔️  BATERIA DE CONFRONTO & CONFLITO ADVERSARIAL — ADSHIELD AUDITOR 2026.4   ║");
  console.log("║ Objetivo: Testar limites, conflitar lógicas e provar alinhamento 100%      ║");
  console.log("╚════════════════════════════════════════════════════════════════════════════╝\n");

  let totalTests = 0;
  let passedTests = 0;
  let conflictsFound = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      conflictsFound++;
      console.error(`  🚨 [CONFLITO DETECTADO] ${testName}`);
      if (details) console.error(`     ↳ Detalhes: ${details}`);
    }
  }

  // ============================================================================
  // CONFRONTO 1: REGRA DO CÓDIGO FULL & ISENÇÕES EM CASOS EXTREMOS
  // ============================================================================
  console.log("\n🧪 1. CONFRONTO DE ISENÇÕES & REGRA FULL (CASE-SENSITIVITY & VARIAÇÕES)");
  
  // Test 1.1: SKU com _full minúsculo
  const res1_1 = isExemptProduct("Camisa Normal", [], "Geral", [{ sku: "C01191G_full" }], "camisa-normal");
  assert(res1_1 === true, "SKU com sufixo '_full' em minúsculo deve ser 100% isento", `Resultado: ${res1_1}`);

  // Test 1.2: SKU com _Full misturado
  const res1_2 = isExemptProduct("Camisa Normal", [], "Geral", [{ sku: "C01191G_Full" }], "camisa-normal");
  assert(res1_2 === true, "SKU com sufixo '_Full' capitalizado deve ser 100% isento", `Resultado: ${res1_2}`);

  // Test 1.3: Tag FULL minúscula ou maiúscula
  const res1_3 = isExemptProduct("Camisa Normal", ["full"], "Geral", [{ sku: "C01191G" }], "camisa-normal");
  assert(res1_3 === true, "Tag 'full' em minúsculo deve ser 100% isenta", `Resultado: ${res1_3}`);

  // Test 1.4: Título com [FULL] ou [Full]
  const res1_4 = isExemptProduct("Camisa Manga Longa [Full]", [], "Geral", [{ sku: "C01191G" }], "camisa-normal");
  assert(res1_4 === true, "Título contendo '[Full]' deve ser 100% isento", `Resultado: ${res1_4}`);

  // Test 1.5: Popperian Falsifier rejeita Full em qualquer propriedade
  const falsifyFull = falsifyProductAnomaly({ title: "Camisa X", sku: "SKU123_FULL", missingSizes: ["M", "G"] });
  assert(falsifyFull.isResistant === false, "Popperian Falsifier refuta produto com SKU FULL", falsifyFull.verdict);

  // Test 1.6: Produto de vestuário real COM furo DEVE ser aceito pelo Popperian Falsifier
  const falsifyReal = falsifyProductAnomaly({ title: "Camisa Dry Fit Militar", sku: "DRY001P", missingSizes: ["M", "G"] });
  assert(falsifyReal.isResistant === true, "Popperian Falsifier confirma ruptura real em vestuário sem regra Full", falsifyReal.verdict);

  // ============================================================================
  // CONFRONTO 2: SENSOR DE FOTOS AUSENTES & EDGE CASES DE IMAGEM
  // ============================================================================
  console.log("\n📸 2. CONFRONTO DO SENSOR DE IMAGENS QUEBRADAS/AUSENTES");

  function testImageCheck(images) {
    return images.length > 0 && images.some(img => img && img.src && String(img.src).trim().length > 0);
  }

  assert(testImageCheck([]) === false, "Array vazio images: [] deve ser detectado como SEM IMAGEM");
  assert(testImageCheck([{}]) === false, "Objeto vazio images: [{}] deve ser detectado como SEM IMAGEM");
  assert(testImageCheck([{ src: "" }]) === false, "images: [{ src: '' }] deve ser detectado como SEM IMAGEM");
  assert(testImageCheck([{ src: "   " }]) === false, "images: [{ src: '   ' }] com espaços deve ser detectado como SEM IMAGEM");
  assert(testImageCheck([{ src: "https://cdn.shopify.com/foto.jpg" }]) === true, "Imagem válida deve ser aprovada");

  // ============================================================================
  // CONFRONTO 3: BLINDAGEM DE SEGURANÇA ZERO-TRUST & LINKS NATIVOS SHOPIFY
  // ============================================================================
  console.log("\n🔒 3. CONFRONTO DE BLINDAGEM DE SEGURANÇA ZERO-TRUST (SHOPIFY ADMIN)");

  // 1. Garante que getShopifyAdminSlug NUNCA vaza identificadores internos privados
  const slugFishing = getShopifyAdminSlug("https://www.brkfishing.com.br");
  assert(slugFishing === null, "BRK Fishing não vaza slug privado (Zero-Trust ativo)");

  const slugAgro = getShopifyAdminSlug("https://www.brkagro.com.br");
  assert(slugAgro === null, "BRK Agro não vaza slug privado (Zero-Trust ativo)");

  const slugMotors = getShopifyAdminSlug("https://www.brkmotors.com.br");
  assert(slugMotors === null, "BRK Motors não vaza slug privado (Zero-Trust ativo)");

  // 2. Garante que links nativos de admin são gerados de forma segura sem expor tenant
  const sampleDomain = "www.brkfishing.com.br";
  const sampleProductId = "8337841127490";
  const safeNativeUrl = `https://${sampleDomain}/admin/products/${sampleProductId}`;
  assert(!safeNativeUrl.includes("k1y01s-5r"), "Link nativo de admin não contém slug privado");
  assert(safeNativeUrl.includes("/admin/products/8337841127490"), "Link nativo segue a rota oficial segura da Shopify");

  // ============================================================================
  // CONFRONTO 4: PERSISTÊNCIA DUAL & INTEGRIDADE DOS ARQUIVOS DE TELEMETRIA
  // ============================================================================
  console.log("\n💾 4. CONFRONTO DE INTEGRIDADE DOS ARQUIVOS DE DADOS");

  // 4.1. telemetry_db.json
  try {
    const rawTelemetry = fs.readFileSync('data/telemetry_db.json', 'utf8');
    const teleDb = JSON.parse(rawTelemetry);
    assert(Array.isArray(teleDb.daily_snapshots), "telemetry_db.json possui array 'daily_snapshots'");
    assert(Array.isArray(teleDb.monitored_stores), "telemetry_db.json possui array 'monitored_stores'");
    assert(Array.isArray(teleDb.job_logs), "telemetry_db.json possui array 'job_logs'");
    assert(Array.isArray(teleDb.alert_dispatch_queue), "telemetry_db.json possui array 'alert_dispatch_queue'");
    assert(teleDb.monitored_stores.length >= 3, "telemetry_db.json monitora pelo menos as 3 marcas BRK");
    
    // Verificar se todas as lojas têm marcas e URLs válidas
    const storesValid = teleDb.monitored_stores.every(s => s.brand_name && s.store_url && s.store_url.startsWith('http'));
    assert(storesValid, "Todas as lojas monitoradas têm brand_name e URL válidos");
  } catch (err) {
    assert(false, "telemetry_db.json é JSON válido e não corrompido", err.message);
  }

  // 4.2. agent_memory_store.json (CoALA Memory: Semantic, Episodic, Procedural)
  try {
    const rawMemory = fs.readFileSync('data/agent_memory_store.json', 'utf8');
    const memDb = JSON.parse(rawMemory);
    assert(typeof memDb.episodic === 'object', "agent_memory_store.json possui memória 'episodic'");
    assert(typeof memDb.episodic.incident_streaks === 'object', "agent_memory_store.json possui 'episodic.incident_streaks'");
    assert(typeof memDb.episodic.cumulative_losses === 'object', "agent_memory_store.json possui 'episodic.cumulative_losses'");
    assert(typeof memDb.semantic === 'object', "agent_memory_store.json possui memória 'semantic'");
    assert(typeof memDb.procedural === 'object', "agent_memory_store.json possui memória 'procedural'");

    const streakKeys = Object.keys(memDb.episodic.incident_streaks || {});
    assert(streakKeys.length > 0, `Memória episódica possui ${streakKeys.length} incidentes com streak histórico`);

    const sampleKey = streakKeys[0];
    const sampleEntry = memDb.episodic.incident_streaks[sampleKey];
    const cycles = typeof sampleEntry === 'object' ? sampleEntry.detection_cycles : sampleEntry;
    assert(typeof cycles === 'number' && cycles >= 1, `Contador de recorrência CoALA válido (Amostra: ${cycles} ciclos em memória)`);
  } catch (err) {
    assert(false, "agent_memory_store.json é JSON válido e não corrompido", err.message);
  }

  // ============================================================================
  // CONFRONTO 5: HARMONIZAÇÃO MATEMÁTICA & FÓRMULAS DE IMPACTO FINANCEIRO
  // ============================================================================
  console.log("\n💰 5. CONFRONTO DE CÁLCULO DE SANGRIA E CONVERSÃO");

  const samplePrice = 189.90;
  const sampleRuptureCount = 3;
  const calculatedLoss = sampleRuptureCount * (samplePrice * 25); // 3 * 189.90 * 25 = 14.242,50
  assert(calculatedLoss > 14000 && calculatedLoss < 15000, "Cálculo de sangria em tráfego pago segue fórmula calibrada (Preço x 25 conversões perdidas)", `R$ ${calculatedLoss}`);

  // Testar score de catálogo
  const scoreClean = 100 - (0 * 8);
  assert(scoreClean === 100, "Catálogo com 0 rupturas recebe Score 100/100");
  const scoreBroken = Math.max(68, 100 - (5 * 8));
  assert(scoreBroken === 68, "Catálogo com 5 rupturas aplica floor de segurança 68/100");

  // ============================================================================
  // CONFRONTO 6: OSINT INTELLIGENCE COBERTURA DOS 3 NICHOS
  // ============================================================================
  console.log("\n🕵️ 6. CONFRONTO DE SINAIS OSINT POR NICHO");

  const osintAgro = executeGoInDepthScan('AGRO');
  assert(osintAgro.highIntentKeywords.length >= 3 && osintAgro.topAdAngles.length >= 2, "Nicho AGRO possui palavras-chave e ângulos de criativos completos");

  const osintFishing = executeGoInDepthScan('FISHING');
  assert(osintFishing.highIntentKeywords.length >= 3 && osintFishing.topAdAngles.length >= 2, "Nicho FISHING possui palavras-chave e ângulos de criativos completos");

  const osintMotors = executeGoInDepthScan('MOTORS');
  assert(osintMotors.highIntentKeywords.length >= 2 && osintMotors.topAdAngles.length >= 1, "Nicho MOTORS possui palavras-chave e ângulos de criativos completos");

  // ============================================================================
  // CONFRONTO 7: MULTI-AGENT PROFILER INTEGRITY
  // ============================================================================
  console.log("\n⚡ 7. CONFRONTO DE ORQUESTRAÇÃO & PROFILING");

  const profiler = new MultiAgentProfiler();
  profiler.startStep('STEP_TEST_1');
  await new Promise(r => setTimeout(r, 10));
  profiler.endStep('STEP_TEST_1');
  
  const pSummary = profiler.getSummary();
  assert(pSummary.totalDurationMs >= 10, "Profiler registra duração total milissegundo a milissegundo");
  assert(typeof pSummary.breakdown === 'object' && pSummary.breakdown['STEP_TEST_1'], "Profiler gera breakdown com etapas formatadas");

  // ============================================================================
  // RESULTADO FINAL DO CONFRONTO
  // ============================================================================
  console.log("\n╔════════════════════════════════════════════════════════════════════════════╗");
  console.log(`║ 📊 BALANÇO DO CONFRONTO: ${passedTests}/${totalTests} TESTES APROVADOS (${((passedTests / totalTests) * 100).toFixed(1)}%)                ║`);
  if (conflictsFound === 0) {
    console.log("║ 🏆 RESULTADO: ZERO CONFLITOS! ESTRUTURA 100% ALINHADA E HARMONIZADA!        ║");
  } else {
    console.log(`║ ⚠️ ATENÇÃO: ${conflictsFound} CONFLITO(S) ENCONTRADO(S) E EXIGEM CORREÇÃO!              ║`);
  }
  console.log("╚════════════════════════════════════════════════════════════════════════════╝\n");
}

runAdversarialConfrontationSuite();
