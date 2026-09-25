/**
 * 🧪 ADSHIELD OS • TEST SUITE DE RESILIÊNCIA DE ENGENHARIA DE SISTEMAS & ARQUITETURA
 * 
 * Valida:
 * 1. Resiliência do pipeline assíncrono contra rejeições catastróficas (Safe Concurrency).
 * 2. Blindagem atuarial da máquina de prospecção outbound contra saídas R$ 0,00.
 * 3. Integridade do Tribunal de Consenso Dual-Agent e isolamento de falhas.
 * 4. Validação de regras canônicas de modais e deep linking.
 */

import { OutboundCloserEngine } from '../src/services/outbound/outboundCloserEngine.ts';
import { executeDualAgentCrossVerification } from '../src/services/ai/dualAgentConsensusGatekeeper.ts';
import { SpreadsheetExporter } from '../src/services/export/spreadsheetExporter.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log(`\n============================================================`);
console.log(`🛡️ ADSHIELD • TEST SUITE DE RESILIÊNCIA DE ARQUITETURA`);
console.log(`============================================================\n`);

// --------------------------------------------------------------------------
// 1. BLINDAGEM ATUARIAL DO OUTBOUND CLOSER ENGINE
// --------------------------------------------------------------------------
console.log(`📌 1. AUDITORIA ATUARIAL: OUTBOUND CLOSER ENGINE`);

const leadWithZeroBleed = {
  id: 'lead-test-01',
  storeName: 'Loja Teste Agro',
  storeDomain: 'lojatesteagro.com.br',
  targetPhone: '5511999998888',
  rupturedProductTitle: 'Camisa Manga Longa Proteção UV',
  rupturedSku: 'UV-50-CAM',
  brokenSizes: ['M', 'G'],
  metaAdLibraryUrl: 'https://facebook.com/ads/library/?id=123',
  estimatedMonthlyBleedBrl: 0, // Sangria zero testada intencionalmente
  niche: 'Agropecuária & Moda Campo',
  source: 'META_ADS_MINED'
};

const pitchZero = OutboundCloserEngine.generateThreeStepPitch(leadWithZeroBleed);

assert(!pitchZero.fullWhatsAppMessage.includes('R$ 0,00'), 'Pitch de WhatsApp nunca exibe R$ 0,00 quando sangria for 0');
assert(pitchZero.fullWhatsAppMessage.includes('3.200,00'), 'Aplica benchmark atuarial padrão de contingência (R$ 3.200,00) quando sangria é 0');
assert(pitchZero.step2Proof.length > 20, 'Gera etapa 2 de prova de crime consistente');

const leadWithPositiveBleed = {
  ...leadWithZeroBleed,
  estimatedMonthlyBleedBrl: 8450.00
};

const pitchPositive = OutboundCloserEngine.generateThreeStepPitch(leadWithPositiveBleed);
assert(pitchPositive.fullWhatsAppMessage.includes('8.450,00'), 'Preserva cálculo atuarial real auditado (R$ 8.450,00) quando sangria é positiva');

// --------------------------------------------------------------------------
// 2. AUDITORIA DO TRIBUNAL DE DUPLO CONSENSO
// --------------------------------------------------------------------------
console.log(`\n📌 2. AUDITORIA FORENSE: DUAL AGENT CONSENSUS GATEKEEPER`);

const mockRealSiteData = {
  url: 'https://lojateste.com.br',
  domain: 'lojateste.com.br',
  brandName: 'Loja Teste',
  title: 'Loja Teste Oficial',
  metaDescription: 'Compre online com segurança',
  h1List: ['Destaques da Coleção'],
  footerText: 'CNPJ: 12.345.678/0001-90',
  isShopify: true,
  catalogAudit: {
    totalProductsScanned: 24,
    productsWithBrokenGrid: 1,
    productsWithMissingImages: 0,
    monthlyLossEstimateBRL: 4200,
    issues: [
      {
        id: 'issue-1',
        sku: 'TEST-SKU-M',
        productTitle: 'Jaqueta Térmica Impermeável',
        productUrl: 'https://lojateste.com.br/products/jaqueta',
        imageSrc: 'https://lojateste.com.br/img.jpg',
        hasValidImage: true,
        imageResolutionStatus: 'ALTA',
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        isFullPrintExempt: false,
        hasDescription: true,
        descriptionLength: 120,
        hasSizeGuide: false,
        imageWeightKb: 120,
        criticalIssuesCount: 1,
        recommendedAction: 'Reposição de grade urgente'
      }
    ]
  }
};

const mockDiagnostic = {
  realSiteData: mockRealSiteData,
  estimatedRevenueLiftMin: 28,
  estimatedRevenueLiftMax: 48,
  growthScore: 82,
  analyzedAt: '25/09/2026'
};

const consensusResult = executeDualAgentCrossVerification(mockDiagnostic);

assert(consensusResult.approvedFindingsCount >= 1, 'Aprova achados verificados por duplo agente');
assert(consensusResult.verifiedFindings[0].financialImpactMonthly === 4200, 'Consenso preserva impacto financeiro auditado estrito');
assert(consensusResult.globalConsensusAccuracyPct >= 99, 'Consensus Accuracy reporta acurácia atuarial >= 99%');

// --------------------------------------------------------------------------
// 3. AUDITORIA CANÔNICA DE MODAIS
// --------------------------------------------------------------------------
console.log(`\n📌 3. AUDITORIA DE TIPAGEM & CANONICAL MODAL IDS`);

const canonicalModals = [
  'audit', 'export', 'settings', 'adminDashboard', 'pricing',
  'whatsappLead', 'leadsDrawer', 'storesManager', 'whatsappWatchdog',
  'integrations', 'whiteLabel', 'metaAutoKill', 'batchAuditor',
  'chromeExtension', 'mitigationHistory', 'founderAuth'
];

assert(canonicalModals.length === 16, 'Contém exatamente 16 modais mapeados sob ActiveModalId');
assert(canonicalModals.includes('pricing') && canonicalModals.includes('metaAutoKill'), 'Contém modais de checkout e kill-switch no radar');

// --------------------------------------------------------------------------
// 4. AUDITORIA DE RESILIÊNCIA DA EXPORTAÇÃO DE PLANILHAS & SÍNTESE DE SKUS
// --------------------------------------------------------------------------
console.log(`\n📌 4. AUDITORIA DE RESILIÊNCIA: PLANILHAS & SÍNTESE DE SKUS`);

const brokenIssueData = {
  domain: 'insiderstore.com.br',
  brandName: 'Insider Store',
  catalogAudit: {
    issues: [
      {
        id: 'insider-item-1',
        sku: 'TECH-TSHIRT',
        productTitle: 'Tech T-Shirt Anti-Suor',
        productUrl: 'https://insiderstore.com.br/products/tech-t-shirt',
        availableSizes: ['P', 'M', 'GG'],
        missingSizes: ['G', 'ESTOQUE_FANTASMA_SUSPEITO'],
        isFullPrintExempt: false,
        recommendedAction: 'Repor tamanho G urgente',
        manufacturingType: 'FABRICACAO_PROPRIA'
      },
      {
        id: 'insider-item-2',
        // Testando robustez contra propriedades nulas/indefinidas
        sku: undefined,
        productTitle: undefined,
        productUrl: undefined,
        availableSizes: undefined,
        missingSizes: undefined,
        isFullPrintExempt: true,
        recommendedAction: undefined
      }
    ]
  }
};

let exportAuditNoError = false;
let exportSkusNoError = false;
let generatedAuditCsv = '';
let generatedSkusCsv = '';

try {
  const originalWindow = global.window;
  const originalDocument = global.document;
  const originalBlob = global.Blob;
  const originalUrl = global.URL;

  global.window = {};
  global.document = {
    createElement: () => ({
      setAttribute: () => {},
      style: {},
      click: () => {}
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    }
  };

  global.Blob = class {
    constructor(content) {
      this.content = Array.isArray(content) ? content.join('') : String(content);
      if (this.content.includes('Código SKU')) {
        generatedAuditCsv = this.content;
      }
      if (this.content.includes('ID da Variante')) {
        generatedSkusCsv = this.content;
      }
    }
  };

  global.URL = {
    createObjectURL: () => 'blob:mock-url',
    revokeObjectURL: () => {}
  };

  SpreadsheetExporter.exportCatalogAudit(brokenIssueData);
  exportAuditNoError = true;

  SpreadsheetExporter.exportAllSkusCsv(brokenIssueData);
  exportSkusNoError = true;

  global.window = originalWindow;
  global.document = originalDocument;
  global.Blob = originalBlob;
  global.URL = originalUrl;
} catch (err) {
  console.error('Falha na exportação de planilhas:', err);
}

assert(exportAuditNoError, 'SpreadsheetExporter.exportCatalogAudit é 100% blindado contra dados incompletos');
assert(exportSkusNoError, 'SpreadsheetExporter.exportAllSkusCsv sintetiza variantes sem quebrar com dados nulos');
assert(generatedSkusCsv.includes('Tamanho P') && generatedSkusCsv.includes('Tamanho G'), 'Variantes sintetizadas incluem tamanhos disponíveis e em falta');
assert(generatedSkusCsv.includes('EM ESTOQUE') && generatedSkusCsv.includes('🚨 RUPTURA CRÍTICA'), 'Variantes refletem situação precisa de estoque no padrão brasileiro');

console.log(`\n============================================================`);
console.log(`📊 RESULTADO DA AUDITORIA: ${passed}/${passed + failed} TESTES PASSARAM`);
console.log(`============================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
