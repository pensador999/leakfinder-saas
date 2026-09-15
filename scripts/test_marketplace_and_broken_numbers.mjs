// ==============================================================================
// 🧪 SUITE DE TESTES: ELIMINAÇÃO DE NÚMEROS REDONDOS & LOJAS MARKETPLACE
// Valida que URLs da Shopee e outros marketplaces são detectadas como sellers,
// e que todas as saídas financeiras contêm centavos quebrados realistas.
// ==============================================================================

import assert from 'node:assert/strict';
import { extractCleanDomainAndBrand, detectEcommercePlatform } from '../src/services/siteInspector.ts';
import { calculateStoreFinancialGrounding, formatBRL } from '../src/services/ai/storeFinancialGroundingEngine.ts';

console.log('🏁 Iniciando Testes de Números Quebrados e Lojas de Marketplace...\n');

// ------------------------------------------------------------------------------
// Teste 1: URL Real da Shopee enviada pelo usuário
// ------------------------------------------------------------------------------
console.log('🧪 Teste 1: Validação da URL de Seller da Shopee informada pelo usuário...');

const userShopeeUrl = 'https://shopee.com.br/936o557f26?categoryId=100637&entryPoint=ShopByPDP&itemId=58268108232';

const extractionShopee = extractCleanDomainAndBrand(userShopeeUrl);
console.log('   - Brand extraída:', extractionShopee.brandName);
console.log('   - Domínio:', extractionShopee.domain);
console.log('   - Is Marketplace Seller:', extractionShopee.isMarketplaceSeller);
console.log('   - Seller ID:', extractionShopee.sellerIdentifier);

assert.ok(extractionShopee.isMarketplaceSeller, 'Deve identificar como seller de marketplace');
assert.equal(extractionShopee.sellerIdentifier, '936o557f26', 'Deve extrair o identificador do vendedor');
assert.ok(extractionShopee.brandName.includes('936O557F26'), 'Nome da marca deve conter o ID do vendedor');

const platformShopee = detectEcommercePlatform('', extractionShopee.domain, extractionShopee.cleanUrl);
console.log('   - Plataforma:', platformShopee.platform);
console.log('   - Is Enterprise:', platformShopee.isEnterprise);
console.log('   - Brand Tier:', platformShopee.brandTier);

assert.equal(platformShopee.platform, 'Shopee', 'Plataforma deve ser Shopee');
assert.equal(platformShopee.isEnterprise, false, 'Seller de marketplace NÃO deve ser classificado como Enterprise corporativa');
assert.equal(platformShopee.brandTier, 'DTC_LINE_STORE', 'Seller de marketplace deve ser DTC_LINE_STORE');

// ------------------------------------------------------------------------------
// Teste 2: Cálculos Financeiros da Shopee (Zero Números Redondos 5k, 7k, 8k)
// ------------------------------------------------------------------------------
console.log('\n🧪 Teste 2: Validação de Cálculos Financeiros com Centavos na Shopee...');

const mockShopeeSiteData = {
  url: userShopeeUrl,
  domain: extractionShopee.domain,
  brandName: extractionShopee.brandName,
  isHttps: true,
  ecommercePlatform: platformShopee.platform,
  isEnterpriseBrand: platformShopee.isEnterprise,
  brandTier: platformShopee.brandTier,
  isMarketplaceSeller: true,
  sellerIdentifier: extractionShopee.sellerIdentifier,
  title: 'Loja Oficial Shopee',
  metaDescription: '',
  h1List: ['Loja 936o557f26'],
  h2Count: 2,
  totalImages: 12,
  imagesWithoutAlt: 2,
  brokenProductImages: [],
  typoAlerts: [],
  catalogAudit: {
    totalProductsScanned: 15,
    totalSkusAudited: 60,
    totalInStockSkus: 52,
    totalRupturedSkus: 8,
    productsWithMissingImages: 0,
    productsWithBrokenGrid: 2,
    productsWithFullExemption: 0,
    productsWithoutDescription: 0,
    productsWithoutSizeGuide: 0,
    heavyImagesCount: 0,
    catalogHealthScore: 86,
    monthlyLossEstimateBRL: 2769.30,
    issues: [
      {
        id: 'p1',
        sku: 'SHP-1',
        productTitle: 'Produto Shopee 1',
        productUrl: userShopeeUrl,
        imageSrc: '',
        hasValidImage: true,
        imageResolutionStatus: 'ALTA',
        availableSizes: ['P'],
        missingSizes: ['M', 'G'],
        isFullPrintExempt: false,
        manufacturingType: 'REVENDA',
        hasDescription: true,
        descriptionLength: 100,
        hasSizeGuide: true,
        imageWeightKb: 150,
        criticalIssuesCount: 0,
        recommendedAction: 'Repor'
      }
    ]
  },
  hasSchemaJsonLd: true,
  hasViewportMeta: true,
  hasOgTags: true,
  detectedKeywords: ['ofertas'],
  detectedCheckoutTerms: {
    hasPix: true,
    hasFrete: true,
    hasGarantia: true,
    hasCheckoutTransparente: true,
    hasCart: true
  },
  formCount: 1,
  buttonCount: 5,
  estimatedLoadTime: 1.5,
  inspectionStatus: 'SUCCESS',
  hasMetaPixel: true
};

const financesShopee = calculateStoreFinancialGrounding(mockShopeeSiteData);

console.log('   - Ticket Médio Grounded:', financesShopee.formattedAverageTicket);
console.log('   - Faturamento Estimado:', financesShopee.estimatedMonthlyRevenue.formatted);
console.log('   - Gasto com Ads Estimado:', financesShopee.estimatedAdSpend.formattedMonthly);
console.log('   - Sangria Mensal em Ads:', financesShopee.financialRisk.formattedMonthlyLoss);
console.log('   - Sangria Anualizada:', financesShopee.financialRisk.formattedAnnualizedLoss);
console.log('   - Recuperação Mensal:', financesShopee.recoveryProjection.formattedMonthlyRecovery);

// Validação de centavos obrigatórios
assert.ok(financesShopee.formattedAverageTicket.includes(','), 'Ticket médio deve ter centavos');
assert.ok(financesShopee.financialRisk.formattedMonthlyLoss.includes(','), 'Perda mensal deve ter centavos');
assert.ok(financesShopee.financialRisk.formattedAnnualizedLoss.includes(','), 'Perda anual deve ter centavos');
assert.ok(financesShopee.recoveryProjection.formattedMonthlyRecovery.includes(','), 'Recuperação deve ter centavos');

// Nenhuma métrica deve ser número redondo estático (5000, 7000, 8000)
const prohibitedStaticRounds = [5000, 7000, 8000, 10000];
assert.ok(!prohibitedStaticRounds.includes(financesShopee.financialRisk.totalMonthlyLoss), 'Perda mensal não pode ser 5000, 7000 ou 8000 redondo');
assert.ok(!prohibitedStaticRounds.includes(financesShopee.estimatedAdSpend.monthly), 'Gasto em ads não pode ser redondo estático');
assert.ok(financesShopee.groundedAverageTicket < 150, 'Ticket médio da Shopee deve ser de marketplace (< R$ 150, não R$ 520 de enterprise)');

// ------------------------------------------------------------------------------
// Teste 3: Formatação com Centavos em formatBRL
// ------------------------------------------------------------------------------
console.log('\n🧪 Teste 3: Validação da função formatBRL com 2 casas decimais obrigatórias...');

assert.equal(formatBRL(5000), 'R$ 5.000,00', 'Deve formatar com ,00 quando número inteiro');
assert.equal(formatBRL(5384.27), 'R$ 5.384,27', 'Deve formatar centavos quebrados com precisão');
assert.equal(formatBRL(789.5), 'R$ 789,50', 'Deve preencher o zero final dos centavos');

// ------------------------------------------------------------------------------
// Teste 4: URL do Mercado Livre
// ------------------------------------------------------------------------------
console.log('\n🧪 Teste 4: Validação de Seller do Mercado Livre...');

const meliUrl = 'https://produto.mercadolivre.com.br/MLB-458921-camisa-termica-uv50';
const extractionMeli = extractCleanDomainAndBrand(meliUrl);
const platformMeli = detectEcommercePlatform('', extractionMeli.domain, extractionMeli.cleanUrl);

assert.ok(extractionMeli.isMarketplaceSeller, 'Deve identificar MLB como seller do Mercado Livre');
assert.equal(platformMeli.platform, 'Mercado Livre', 'Plataforma deve ser Mercado Livre');
assert.equal(platformMeli.isEnterprise, false, 'Seller Mercado Livre não é Enterprise matriz');

console.log('\n🎉 TODOS OS TESTES DE NÚMEROS QUEBRADOS E MARKETPLACE PASSARAM COM SUCESSO!');
