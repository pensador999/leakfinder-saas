// ==============================================================================
// 🧪 SUITE DE TESTES FASE 4 — ADSHIELD ENTERPRISE & HUB DE AGÊNCIAS
// Valida Notion MCP Sync, Composio Slack/Discord Dispatcher e E2B Megastore Runner
// ==============================================================================

import assert from 'node:assert';
import { 
  generateNotionDatabaseSchema, 
  formatNotionPagePayload, 
  syncAgencyWorkspaceToNotion 
} from '../src/services/integrations/notionWorkspaceSync.ts';
import { 
  formatSlackStockoutAlert, 
  formatDiscordStockoutAlert, 
  dispatchAgencyAlert 
} from '../src/services/integrations/composioDispatcher.ts';
import { 
  generateE2BSandboxScript, 
  executeMassiveCatalogAnalysis 
} from '../src/services/analytics/e2bSandboxRunner.ts';

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
console.log('🛡️ ADSHIELD ENTERPRISE — BATERIA DE TESTES FASE 4');
console.log('============================================================\n');

// -------------------------------------------------------------
// 1. TESTES: NOTION MCP WORKSPACE SYNC
// -------------------------------------------------------------
console.log('📌 1. NOTION MCP WORKSPACE SYNC');

runTest('Schema do Notion Database contém propriedades fundamentais', () => {
  const schema = generateNotionDatabaseSchema();
  assert.ok(schema.title.includes('AdShield'), 'Título deve conter AdShield');
  assert.ok(schema.properties['Cliente / Loja'], 'Propriedade Cliente / Loja obrigatória');
  assert.strictEqual(schema.properties['Cliente / Loja'].type, 'title');
  assert.ok(schema.properties['Produto Afetado'], 'Propriedade Produto Afetado obrigatória');
  assert.ok(schema.properties['Tamanhos Rompidos'], 'Propriedade Tamanhos Rompidos obrigatória');
  assert.strictEqual(schema.properties['Tamanhos Rompidos'].type, 'multi_select');
  assert.ok(schema.properties['Desperdício Estimado'], 'Propriedade Desperdício Estimado obrigatória');
  assert.strictEqual(schema.properties['Desperdício Estimado'].type, 'number');
  assert.ok(schema.properties['Status da Campanha'], 'Propriedade Status da Campanha obrigatória');
  assert.ok(schema.properties['Link da Prova Visual'], 'Propriedade Link da Prova Visual obrigatória');
});

runTest('Formatação de página Notion segue payload oficial da Notion API', () => {
  const record = {
    clientName: 'Alpha Store',
    storeDomain: 'alphastore.com.br',
    affectedProductTitle: 'Camiseta Premium',
    brokenSizes: ['M', 'G'],
    estimatedMonthlyLoss: 4500,
    severity: 'CRÍTICA',
    campaignStatus: '🚨 ATIVO (PAUSAR)',
    evidenceScreenshotUrl: 'https://leakfinder-green.vercel.app/api/evidence-preview?domain=alphastore.com.br',
    lastInspectedAt: '2026-09-16T17:00:00Z'
  };

  const payload = formatNotionPagePayload(record);
  assert.strictEqual(payload.parent.database_id, 'notion_db_adshield_agency_hub');
  assert.strictEqual(payload.properties['Cliente / Loja'].title[0].text.content, 'Alpha Store (alphastore.com.br)');
  assert.strictEqual(payload.properties['Produto Afetado'].rich_text[0].text.content, 'Camiseta Premium');
  assert.strictEqual(payload.properties['Desperdício Estimado'].number, 4500);
  assert.deepStrictEqual(
    payload.properties['Tamanhos Rompidos'].multi_select, 
    [{ name: 'M' }, { name: 'G' }]
  );
  assert.strictEqual(payload.properties['Link da Prova Visual'].url, record.evidenceScreenshotUrl);
});

runTest('Sincronização multi-tenant de agência gera Database ID e URL válidos', () => {
  const records = [
    {
      clientName: 'Cliente 1',
      storeDomain: 'c1.com.br',
      affectedProductTitle: 'Prod 1',
      brokenSizes: ['G'],
      estimatedMonthlyLoss: 1200,
      severity: 'ALTA',
      campaignStatus: '🚨 ATIVO (PAUSAR)',
      evidenceScreenshotUrl: 'https://ex.com/p1.png',
      lastInspectedAt: '2026-09-16T17:00:00Z'
    },
    {
      clientName: 'Cliente 2',
      storeDomain: 'c2.com.br',
      affectedProductTitle: 'Prod 2',
      brokenSizes: ['39', '40'],
      estimatedMonthlyLoss: 2200,
      severity: 'CRÍTICA',
      campaignStatus: '🚨 ATIVO (PAUSAR)',
      evidenceScreenshotUrl: 'https://ex.com/p2.png',
      lastInspectedAt: '2026-09-16T17:00:00Z'
    }
  ];

  const result = syncAgencyWorkspaceToNotion('Agência Escala Mídia', records);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.recordCount, 2);
  assert.ok(result.databaseId.includes('notion'));
  assert.ok(result.mockNotionUrl.includes('notion.so/adshield-agency'));
});

// -------------------------------------------------------------
// 2. TESTES: COMPOSIO MCP DISPATCHER (SLACK & DISCORD)
// -------------------------------------------------------------
console.log('\n📌 2. COMPOSIO MCP DISPATCHER (SLACK & DISCORD)');

const alertData = {
  clientName: 'Insider Store',
  storeDomain: 'insiderstore.com.br',
  productTitle: 'Daily T-Shirt Tech',
  brokenSizes: ['M', 'G'],
  estimatedMonthlyLoss: 6825,
  evidenceUrl: 'https://leakfinder-green.vercel.app/api/evidence-preview?domain=insiderstore.com.br',
  severity: 'CRÍTICA'
};

runTest('Slack Block Kit gera estrutura visual correta com botões interativos', () => {
  const slackPayload = formatSlackStockoutAlert(alertData, '#alerta-estoque');
  assert.strictEqual(slackPayload.channel, '#alerta-estoque');
  assert.ok(slackPayload.text.includes('Insider Store') || slackPayload.text.includes('insiderstore.com.br'));
  
  // Blocos: Header, Section, Context, Actions
  assert.strictEqual(slackPayload.blocks.length, 4);
  assert.strictEqual(slackPayload.blocks[0].type, 'header');
  assert.strictEqual(slackPayload.blocks[1].type, 'section');
  assert.strictEqual(slackPayload.blocks[2].type, 'context');
  assert.strictEqual(slackPayload.blocks[3].type, 'actions');

  const actionElements = slackPayload.blocks[3].elements;
  assert.strictEqual(actionElements.length, 3);
  assert.strictEqual(actionElements[0].text.text, '🛑 Pausar Anúncio no Meta');
  assert.strictEqual(actionElements[0].style, 'danger');
  assert.ok(actionElements[0].url.includes('adsmanager.facebook.com'));
  assert.strictEqual(actionElements[1].text.text, '📸 Ver Prova do Crime');
  assert.strictEqual(actionElements[1].url, alertData.evidenceUrl);
});

runTest('Discord Embed gera objeto com cor vermelha de perigo e campos chave', () => {
  const discordPayload = formatDiscordStockoutAlert(alertData);
  assert.strictEqual(discordPayload.username, 'AdShield Agency Sentinel');
  assert.strictEqual(discordPayload.embeds.length, 1);

  const embed = discordPayload.embeds[0];
  assert.strictEqual(embed.color, 15548997); // Red
  assert.ok(embed.title.includes('Insider Store'));
  
  const fieldNames = embed.fields.map(f => f.name);
  assert.ok(fieldNames.includes('Tamanhos Rompidos'));
  assert.ok(fieldNames.includes('Risco Financeiro'));
  assert.ok(fieldNames.includes('Severidade'));
  assert.ok(fieldNames.includes('Ação Recomendada'));
  assert.ok(fieldNames.includes('Prova Visual'));
});

runTest('Despacho de alerta simula entrega com canal e mock URL', () => {
  const slackDispatch = dispatchAgencyAlert('SLACK', alertData, '#alertas-meta');
  assert.strictEqual(slackDispatch.success, true);
  assert.strictEqual(slackDispatch.platform, 'SLACK');
  assert.strictEqual(slackDispatch.targetChannel, '#alertas-meta');
  assert.ok(slackDispatch.mockDeliveryUrl.includes('composio-preview'));

  const discordDispatch = dispatchAgencyAlert('DISCORD', alertData);
  assert.strictEqual(discordDispatch.platform, 'DISCORD');
});

// -------------------------------------------------------------
// 3. TESTES: E2B CODE INTERPRETER SANDBOX RUNNER
// -------------------------------------------------------------
console.log('\n📌 3. E2B SANDBOX RUNNER & CURVA ABC');

runTest('Gerador de script E2B produz Python Pandas/NumPy compatível', () => {
  const script = generateE2BSandboxScript(10000);
  assert.ok(script.includes('import pandas as pd'));
  assert.ok(script.includes('import numpy as np'));
  assert.ok(script.includes("np.where(df['cum_share'] <= 0.80, 'CURVA_A'"));
  assert.ok(script.includes('CURVA_B'));
  assert.ok(script.includes('CURVA_C'));
});

runTest('Análise de catálogo segmenta Curva A, B e C corretamente', () => {
  const sampleSkus = [
    // Top performers (Curva A)
    { sku: 'A1', title: 'Carro Chefe 1', category: 'Camisas', price: 200, monthlySalesVolume: 1000, totalVariants: 5, brokenVariantsCount: 2, brokenSizes: ['M', 'G'] }, // 200k
    { sku: 'A2', title: 'Carro Chefe 2', category: 'Camisas', price: 150, monthlySalesVolume: 800, totalVariants: 5, brokenVariantsCount: 0, brokenSizes: [] }, // 120k
    // Mid performers (Curva B)
    { sku: 'B1', title: 'Secundário 1', category: 'Bermudas', price: 100, monthlySalesVolume: 300, totalVariants: 4, brokenVariantsCount: 1, brokenSizes: ['42'] }, // 30k
    { sku: 'B2', title: 'Secundário 2', category: 'Bermudas', price: 100, monthlySalesVolume: 200, totalVariants: 4, brokenVariantsCount: 0, brokenSizes: [] }, // 20k
    // Long tail (Curva C)
    { sku: 'C1', title: 'Acessório 1', category: 'Meias', price: 30, monthlySalesVolume: 50, totalVariants: 2, brokenVariantsCount: 0, brokenSizes: [] }, // 1.5k
    { sku: 'C2', title: 'Acessório 2', category: 'Bonés', price: 50, monthlySalesVolume: 20, totalVariants: 1, brokenVariantsCount: 0, brokenSizes: [] } // 1.0k
  ];

  const result = executeMassiveCatalogAnalysis({
    storeDomain: 'mega-store.com.br',
    skus: sampleSkus
  });

  assert.strictEqual(result.totalSkusAudited, 6);
  assert.ok(result.abcCurve.curvaA.skuCount > 0, 'Curva A deve conter SKUs');
  assert.ok(result.abcCurve.curvaA.stockoutSkusCount >= 1, 'Curva A deve registrar o SKU com ruptura');
  assert.ok(result.abcCurve.curvaA.estimatedMonthlyLossBRL > 0, 'Curva A deve estimar prejuízo financeiro');
  assert.ok(result.criticalVulnerabilities.length > 0, 'Deve elencar vulnerabilidades críticas');
  assert.strictEqual(result.criticalVulnerabilities[0].sku, 'A1');
  assert.deepStrictEqual(result.criticalVulnerabilities[0].brokenSizes, ['M', 'G']);
  assert.ok(result.totalPreventableWasteBRL > 0, 'Desperdício total prevenível deve ser positivo');
});

runTest('Sandbox processa sem erros e retorna tempo de execução realista', () => {
  const hundredSkus = Array.from({ length: 100 }, (_, i) => ({
    sku: `SKU-${i}`,
    title: `Produto ${i}`,
    category: 'Geral',
    price: 100,
    monthlySalesVolume: 50,
    totalVariants: 4,
    brokenVariantsCount: i % 10 === 0 ? 1 : 0,
    brokenSizes: i % 10 === 0 ? ['M'] : []
  }));

  const result = executeMassiveCatalogAnalysis({
    storeDomain: 'speed-test.com.br',
    skus: hundredSkus
  });

  assert.strictEqual(result.totalSkusAudited, 100);
  assert.ok(result.executionTimeMs >= 0);
  assert.strictEqual(result.containerRuntime, 'LOCAL_SANDBOX_FALLBACK');
});

// -------------------------------------------------------------
// RELATÓRIO FINAL
// -------------------------------------------------------------
console.log('\n============================================================');
console.log(`📊 RESULTADO FASE 4: ${passed}/${total} TESTES PASSARAM COM SUCESSO`);
console.log('============================================================\n');

if (passed !== total) {
  process.exit(1);
}
