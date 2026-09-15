// ==============================================================================
// 🧪 SUITE DE TESTES AUTOMATIZADOS: MOTOR DE VARREDURA PROFUNDA DE CATÁLOGO
// Validação exaustiva: Paginação multi-página, dissecação de SKUs, regras fabris e CSV
// ==============================================================================

import assert from 'node:assert/strict';
import { auditProductDeepSkus, auditDeepCatalog } from '../src/services/catalog/deepSkuAuditEngine.ts';
import { SpreadsheetExporter } from '../src/services/export/spreadsheetExporter.ts';

console.log('🏁 Iniciando Testes do Motor de Varredura Profunda de Catálogo (SKU a SKU)...\n');

// ------------------------------------------------------------------------------
// Teste 1: Dissecação granular de um produto em múltiplos SKUs individuais
// ------------------------------------------------------------------------------
console.log('🧪 Teste 1: Dissecação de SKUs individuais com pesos de demanda da moda...');

const mockProductTshirt = {
  id: 1001,
  title: 'Camisa Térmica UV50+ Predator',
  handle: 'camisa-termica-uv50-predator',
  product_type: 'CAMISAS',
  tags: ['TERMICAS', 'VERAO'],
  variants: [
    { id: 10011, title: 'PP', sku: 'PRD-PP', price: '129.90', available: true, barcode: '7891001001' },
    { id: 10012, title: 'P', sku: 'PRD-P', price: '129.90', available: true, barcode: '7891001002' },
    { id: 10013, title: 'M', sku: 'PRD-M', price: '129.90', available: false, barcode: '7891001003' }, // RUPTURA
    { id: 10014, title: 'G', sku: 'PRD-G', price: '129.90', available: false, barcode: '7891001004' }, // RUPTURA
    { id: 10015, title: 'GG', sku: 'PRD-GG', price: '129.90', available: true, barcode: '7891001005' },
    { id: 10016, title: 'G1', sku: 'PRD-G1', price: '139.90', available: false, barcode: '7891001006' }, // RUPTURA
    { id: 10017, title: 'G2', sku: 'PRD-G2', price: '139.90', available: false, barcode: '7891001007' }  // RUPTURA
  ],
  images: [{ src: 'https://cdn.shopify.com/predator.jpg' }]
};

const auditedTshirt = auditProductDeepSkus(mockProductTshirt, { dailyAdSpend: 300 });

assert.equal(auditedTshirt.totalSkusCount, 7, 'Deve mapear todos os 7 SKUs');
assert.equal(auditedTshirt.activeSkusCount, 3, 'Deve identificar exatamente 3 SKUs ativos');
assert.equal(auditedTshirt.rupturedSkusCount, 4, 'Deve identificar exatamente 4 SKUs em ruptura');
assert.equal(auditedTshirt.manufacturingCategory, 'FABRICACAO_PROPRIA', 'Deve identificar como PCP Têxtil');

// Validação dos pesos de demanda
const skuM = auditedTshirt.skus.find(s => s.variantTitle === 'M');
const skuG = auditedTshirt.skus.find(s => s.variantTitle === 'G');
assert.ok(skuM, 'SKU M deve existir');
assert.ok(skuG, 'SKU G deve existir');
assert.equal(skuM.sizeDemandWeight, 25, 'Tamanho M deve ter peso de 25%');
assert.equal(skuG.sizeDemandWeight, 30, 'Tamanho G deve ter peso de 30%');
assert.ok(skuM.estimatedWastedAdSpendDay > 0, 'SKU M em ruptura deve calcular sangria de ad spend diária');

console.log('✅ Teste 1 Concluído com Sucesso!\n');

// ------------------------------------------------------------------------------
// Teste 2: Regra _FULL (Estampas Especiais isentas de ruptura PCP)
// ------------------------------------------------------------------------------
console.log('🧪 Teste 2: Verificação da Regra _FULL (Isenção de Grade Têxtil)...');

const mockProductFull = {
  id: 1002,
  title: 'Camisa Edição Comemorativa Master_FULL',
  handle: 'camisa-edicao-comemorativa-master-full',
  product_type: 'CAMISAS',
  tags: ['_FULL', 'COLECIONADOR'],
  variants: [
    { id: 10021, title: 'M', sku: 'MST-FULL-M', price: '199.90', available: true },
    { id: 10022, title: 'G', sku: 'MST-FULL-G', price: '199.90', available: false }
  ]
};

const auditedFull = auditProductDeepSkus(mockProductFull);
assert.equal(auditedFull.skus.every(s => s.isFullExempt), true, 'Todos os SKUs _FULL devem ser classificados como isentos');
console.log('✅ Teste 2 Concluído com Sucesso!\n');

// ------------------------------------------------------------------------------
// Teste 3: Acessórios e Revenda (Tamanho Único e Fornecedores)
// ------------------------------------------------------------------------------
console.log('🧪 Teste 3: Verificação de Acessórios / Revenda (Bandanas, Manguitos, Bonés)...');

const mockProductAccessory = {
  id: 1003,
  title: 'Bandana de Proteção Solar Camuflada',
  handle: 'bandana-protecao-solar-camuflada',
  product_type: 'ACESSORIOS',
  tags: ['BANDANA', 'REVENDA'],
  variants: [
    { id: 10031, title: 'Tamanho Único', sku: 'BDN-01', price: '39.90', available: true }
  ]
};

const auditedAccessory = auditProductDeepSkus(mockProductAccessory);
assert.equal(auditedAccessory.manufacturingCategory, 'REVENDA', 'Deve ser classificado como Revenda');
assert.ok(auditedAccessory.skus[0].sizeDemandWeight > 0, 'Tamanho único de revenda deve ter peso definido');
console.log('✅ Teste 3 Concluído com Sucesso!\n');

// ------------------------------------------------------------------------------
// Teste 4: Auditoria de Catálogo Completo (Simulação de Enxame)
// ------------------------------------------------------------------------------
console.log('🧪 Teste 4: Auditoria Agregada do Catálogo Completo...');

const catalogSummary = auditDeepCatalog([
  mockProductTshirt,
  mockProductFull,
  mockProductAccessory
], { storeDomain: 'test-store.com.br', dailyAdSpend: 500 });

assert.equal(catalogSummary.totalProductsAudited, 3, 'Deve auditar 3 produtos');
assert.equal(catalogSummary.totalSkusAudited, 10, 'Deve auditar exatamente 10 SKUs (7 + 2 + 1)');
assert.equal(catalogSummary.totalInStockSkus, 5, 'Deve computar 5 SKUs em estoque (3 + 1 + 1)');
assert.equal(catalogSummary.totalRupturedSkus, 5, 'Deve computar 5 SKUs em ruptura (4 + 1 + 0)');
assert.ok(catalogSummary.totalMonthlyBleedBrl > 0, 'Deve estimar sangria financeira mensal agregada');

console.log(`📊 Métricas Agregadas do Teste:
  - Total Produtos: ${catalogSummary.totalProductsAudited}
  - Total SKUs: ${catalogSummary.totalSkusAudited}
  - SKUs em Estoque: ${catalogSummary.totalInStockSkus}
  - SKUs em Ruptura: ${catalogSummary.totalRupturedSkus}
  - Sangria Mensal Estimada: R$ ${catalogSummary.totalMonthlyBleedBrl.toFixed(2)}
`);
console.log('✅ Teste 4 Concluído com Sucesso!\n');

// ------------------------------------------------------------------------------
// Teste 5: Exportação CSV Linha a Linha de 100% dos SKUs
// ------------------------------------------------------------------------------
console.log('🧪 Teste 5: Exportação CSV granular (1 linha por SKU)...');

let generatedCsv = '';
let downloadTriggered = false;

// Mock DOM download trigger
globalThis.document = {
  createElement: (tag) => {
    return {
      style: {},
      setAttribute: () => {},
      click: () => { downloadTriggered = true; }
    };
  },
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};

globalThis.Blob = class MockBlob {
  constructor(parts) {
    generatedCsv = parts.join('');
  }
};

globalThis.URL = {
  createObjectURL: () => 'blob:mock-url',
  revokeObjectURL: () => {}
};

const mockSiteData = {
  domain: 'brkagro.com.br',
  brandName: 'BRK Agro',
  catalogAudit: {
    deepSkuAudit: catalogSummary
  }
};

SpreadsheetExporter.exportAllSkusCsv(mockSiteData);

assert.ok(downloadTriggered, 'Download do CSV deve ser disparado');
assert.ok(generatedCsv.includes('Código SKU;ID da Variante;Nome do Produto;Tamanho / Opção;Preço Unitário (R$);Situação de Estoque;Classificação Fabril;Isenção _FULL / Marketplace;Demanda do Tamanho no Brasil (%);Sangria Estimada em Tráfego (R$/mês);Ação Operacional Recomendada;Link Direto na Loja'), 'Cabeçalhos do CSV devem estar corretos');
assert.ok(generatedCsv.includes('PRD-PP'), 'Deve conter o SKU PRD-PP');
assert.ok(generatedCsv.includes('PRD-M'), 'Deve conter o SKU PRD-M');
assert.ok(generatedCsv.includes('MST-FULL-M'), 'Deve conter o SKU MST-FULL-M');
assert.ok(generatedCsv.includes('BDN-01'), 'Deve conter o SKU BDN-01');

const csvLines = generatedCsv.split('\n').filter(line => line.trim().length > 0);
// 1 linha de cabeçalho + 10 linhas de SKUs
assert.equal(csvLines.length, 11, 'Deve conter exatamente 1 cabeçalho + 10 linhas de SKUs individuais');

console.log('✅ Teste 5 Concluído com Sucesso!\n');

console.log('🎉 TODOS OS 5 TESTES DO MOTOR DE VARREDURA PROFUNDA PASSARAM COM SUCESSO!');
