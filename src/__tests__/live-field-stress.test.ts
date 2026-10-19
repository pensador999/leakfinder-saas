import { describe, it, expect } from 'vitest';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { auditSupplyChainDiscrepancy } from '../services/supplyChain/erpHubDiscrepancyEngine';
import { runCeoOrchestratorEvaluation } from '../services/agents/chiefExecutiveOrchestratorAgent';
import { classifyUniversalNiche } from '../services/agents/universalNicheRecognitionAgent';
import { resolveDynamicVertical } from '../services/ai/dynamicVerticalContext';
import { getVerticalizedAgentPrompt } from '../agents';
import { calculateActuarialBleed } from '../services/ai/bleedActuaryEngine';
import { useAuditStore } from '../store/auditStore';
import { runOmnichannelCrossAudit } from '../services/supplyChain/omnichannelTruthMatrixService';

describe('🔥 TESTE DE CAMPO MÁXIMO E2E (LIVE MULTI-STORE STRESS TEST)', () => {
  it('Audita lojas reais ao vivo em diferentes verticais de ponta a ponta', async () => {
    const targetStores = [
      {
        name: 'Sallve (Cosméticos & Skincare)',
        url: 'https://www.sallve.com.br',
        expectedVertical: 'COSMETICOS_BEAUTY',
        nicheHint: 'Cosméticos e Skincare'
      },
      {
        name: 'BRK Agro (Agropecuária & Outdoor)',
        url: 'https://www.brkagro.com.br',
        expectedVertical: 'AGRO_CAMPO_OUTDOOR',
        nicheHint: 'Moda Agro e Pesca UV50+'
      }
    ];

    for (const store of targetStores) {
      console.log(`\n==================================================================`);
      console.log(`🚀 INICIANDO TESTE DE CAMPO MÁXIMO: ${store.name} (${store.url})`);
      console.log(`==================================================================`);

      const startMs = Date.now();

      // 1 & 2. Execução completa do Pipeline Principal de Diagnóstico varrendo 100% das páginas, produtos e SKUs
      const diagnostic = await runAgentDiagnosticAsync({
        businessName: store.name,
        siteUrl: store.url,
        niche: store.nicheHint,
        targetRegion: 'Brasil',
        averageOrderValue: 220,
        grossMargin: 60,
        operationMode: 'AUTO_DETECT'
      });

      const elapsedMs = Date.now() - startMs;
      const catAudit = diagnostic.realSiteData.catalogAudit;
      const deepSummary = catAudit?.deepSkuAudit;

      console.log(`📦 [1/7] Paginação 100% Concluída (/products.json):`);
      console.log(`   ├─ Páginas Varridas: ${catAudit?.paginationInfo?.pagesCrawled} (Modo: ${catAudit?.paginationInfo?.crawlDepth})`);
      console.log(`   ├─ Total de Produtos Auditados (100%): ${catAudit?.totalProductsScanned}`);
      console.log(`   └─ Total de SKUs Mapeados (100%): ${catAudit?.totalSkusAudited} (Em Estoque: ${catAudit?.totalSkusInStock} | Rompidos: ${catAudit?.totalSkusInStockout})`);

      console.log(`⚡ [2/7] Diagnóstico E2E concluído em ${elapsedMs}ms | Growth Score: ${diagnostic.growthScore}/100`);
      console.log(`   ├─ Plataforma detectada: ${diagnostic.realSiteData.ecommercePlatform}`);
      console.log(`   ├─ Nicho detectado: ${diagnostic.input.niche}`);
      console.log(`   ├─ Produtos escaneados no Catalog Doctor: ${catAudit?.totalProductsScanned}`);
      console.log(`   ├─ Produtos Isentos (_FULL / Pesca / Casual / Único): ${catAudit?.productsWithFullExemption}`);
      console.log(`   ├─ Produtos com grade quebrada real: ${catAudit?.productsWithBrokenGrid}`);
      console.log(`   └─ Saúde do Catálogo: ${catAudit?.catalogHealthScore}%`);

      expect(diagnostic.growthScore).toBeGreaterThanOrEqual(0);
      expect(diagnostic.growthScore).toBeLessThanOrEqual(100);
      expect(diagnostic.realSiteData.domain).toBeTruthy();
      expect(catAudit?.totalProductsScanned).toBeGreaterThan(100);
      expect(catAudit?.totalSkusAudited).toBeGreaterThan(100);

      // 3. Verificação da Detecção de Vertical & Prompt Injector
      const verticalContextText = `${diagnostic.input.niche} ${diagnostic.realSiteData.title} ${diagnostic.realSiteData.domain}`;
      const vertical = resolveDynamicVertical(verticalContextText);
      const universalNiche = classifyUniversalNiche(diagnostic.realSiteData);
      const injectedAdsPrompt = getVerticalizedAgentPrompt('agent-05', verticalContextText);

      console.log(`🌐 [3/7] Verticalização Dinâmica:`);
      console.log(`   ├─ Vertical ID Resolvida: ${vertical.verticalId} (${vertical.label})`);
      console.log(`   ├─ Universal Niche ID: ${universalNiche.detectedNiche} (Confiança: ${universalNiche.confidenceScore}%)`);
      console.log(`   ├─ ERP Dominante: ${vertical.dominantTechStack.primaryErp}`);
      console.log(`   ├─ Curva Central de Giro: [${vertical.coreDemandSizes.join(', ')}]`);
      console.log(`   └─ Prompt Injetado contém bloco vertical? ${injectedAdsPrompt.includes(vertical.verticalId)}`);

      expect(vertical.verticalId).toBe(store.expectedVertical);
      expect(injectedAdsPrompt).toContain(vertical.verticalId);

      // 4. Auditoria Profunda de 100% dos SKUs + Deduplicação + Ghost Inventory
      expect(deepSummary).toBeDefined();
      if (deepSummary) {
        console.log(`🔬 [4/7] Deep SKU Audit & Deduplicação em 100% da Loja:`);
        console.log(`   ├─ Produtos únicos auditados: ${deepSummary.totalProductsAudited}`);
        console.log(`   ├─ SKUs únicos auditados: ${deepSummary.totalSkusAudited}`);
        console.log(`   ├─ SKUs em estoque: ${deepSummary.totalInStockSkus} | SKUs em ruptura: ${deepSummary.totalRupturedSkus}`);
        console.log(`   ├─ Sangria Mensal Calculada: R$ ${deepSummary.totalMonthlyBleedBrl.toFixed(2)}`);
        if (deepSummary.criticalProducts.length > 0) {
          const topCrit = deepSummary.criticalProducts[0];
          console.log(`   └─ Top Produto Crítico: "${topCrit.title}" (${topCrit.rupturedSkusCount}/${topCrit.totalSkusCount} SKUs rompidos) -> Ação: ${topCrit.skus.find(s => !s.available)?.operationalAction}`);
        }

        // Verifica que não há códigos SKU duplicados dentro do mesmo produto em 100% dos produtos da loja
        for (const prod of deepSummary.allProducts) {
          const skus = prod.skus.map(s => s.skuCode.toUpperCase());
          const uniqueSkus = new Set(skus);
          expect(skus.length).toBe(uniqueSkus.size);
        }
      }

      // 5. Motor de Discrepância Supply Chain (ERP / Hub / Meta Ads) sobre 100% do catálogo
      const supplyChainAudit = auditSupplyChainDiscrepancy(diagnostic.realSiteData, diagnostic.input);
      console.log(`🏭 [5/7] Auditoria Supply Chain (ERP/Hub) em 100% do Catálogo:`);
      console.log(`   ├─ ERP Configurado/Detectado: ${supplyChainAudit.stackOverview.erpDetectedOrConfigured}`);
      console.log(`   ├─ Hub Configurado/Detectado: ${supplyChainAudit.stackOverview.hubDetectedOrConfigured}`);
      console.log(`   ├─ Sync Score Operacional: ${supplyChainAudit.operationalSyncScore}% (${supplyChainAudit.syncHealthStatus})`);
      console.log(`   ├─ Alertas de Discrepância Gerados: ${supplyChainAudit.discrepancyAlerts.length}`);
      console.log(`   └─ Risco Financeiro Mensal Total: ${supplyChainAudit.financialImpactSummary.formattedMonthlyTotalRisk}`);

      // Garante que SKU-PRODUCAO-01 fictício nunca exista
      expect(supplyChainAudit.discrepancyAlerts.some(a => a.sku === 'SKU-PRODUCAO-01')).toBe(false);

      // 6. Avaliação Executiva do Agente CEO (Boardroom Dossier)
      const ceoDossier = await runCeoOrchestratorEvaluation(diagnostic);
      console.log(`👑 [6/7] Veredito do Agente CEO:`);
      console.log(`   ├─ Status: ${ceoDossier.ceoStatus}`);
      console.log(`   ├─ Propostas Aprovadas: ${ceoDossier.approvedCount}/${ceoDossier.totalProposalsEvaluated}`);
      console.log(`   ├─ Discurso Executivo: "${ceoDossier.boardroomSpeech}"`);
      console.log(`   └─ Top Decisão Sprint 48h: "${ceoDossier.decisions[0]?.proposalTitle}" (ICE: ${ceoDossier.decisions[0]?.iceScore})`);

      expect(ceoDossier.ceoStatus).toContain(vertical.label);
      expect(ceoDossier.decisions.some(d => d.proposalTitle.includes('Supabase') || d.proposalTitle.includes('Vite'))).toBe(false);

      // 7. Persistência no Zustand Store + Cruzamento Quádruplo Omnichannel + Cálculo Atuarial
      useAuditStore.getState().setDiagnostic(diagnostic);
      const omniResult = await runOmnichannelCrossAudit();
      const firstIssue = diagnostic.realSiteData.catalogAudit?.issues?.find(i => !i.isFullPrintExempt && i.missingSizes.length > 0) || diagnostic.realSiteData.catalogAudit?.issues?.[0];
      if (firstIssue) {
        const bleedActuary = calculateActuarialBleed({
          productTitle: firstIssue.productTitle,
          productPriceBRL: firstIssue.price || 199.90,
          availableSizes: firstIssue.availableSizes,
          outOfStockSizes: firstIssue.missingSizes,
          niche: vertical.verticalId
        });
        console.log(`📐 [7/7] Engenharia Atuarial & Matriz Omnichannel (100% do Catálogo):`);
        console.log(`   ├─ Produto Auditado no Atuário: "${bleedActuary.productTitle}"`);
        console.log(`   ├─ Demanda Rompida na Curva Gaussiana: ${bleedActuary.rupturedDemandPct}% | Severidade: ${bleedActuary.severity}`);
        console.log(`   ├─ Sangria Mensal Total (Ads + Lucro Cessante): R$ ${bleedActuary.totalMonthlyBleedBRL.toFixed(2)}`);
        console.log(`   └─ Itens Críticos na Matriz Omnichannel: ${omniResult.items.length} (Primeiro SKU: ${omniResult.items[0]?.sku})`);
      }
    }
  }, 90000);

  it('Mapeia 100% dos produtos, SKUs e coleções reais nos 3 sites da BRK (Agro > 16k, Fishing > 11.8k, Motors > 9k)', async () => {
    const { sweepStoreFullCatalog } = await import('../services/siteInspector');
    const { auditSpecificCollection } = await import('../services/collectionDeepInspector');

    const brkStores = [
      { name: 'BRK Agro', url: 'https://www.brkagro.com.br', minProducts: 2500, minSkus: 16000, minCollections: 150 },
      { name: 'BRK Fishing', url: 'https://www.brkfishing.com.br', minProducts: 2100, minSkus: 11800, minCollections: 150 },
      { name: 'BRK Motors', url: 'https://www.brkmotors.com.br', minProducts: 1400, minSkus: 9000, minCollections: 80 }
    ];

    for (const store of brkStores) {
      const start = Date.now();
      const summary = await sweepStoreFullCatalog(store.url, 25);
      const colAudit = await auditSpecificCollection(store.url, undefined, summary.issues);
      const elapsed = Date.now() - start;

      const topCurveABroken = summary.issues.find(i => i.isBestSellerCurveA && ((i.brokenCoreSizes?.length ?? 0) > 0 || (i.missingSizes?.length ?? 0) > 0));
      console.log(
        `📊 [${store.name}] Páginas: ${summary.paginationInfo?.pagesCrawled} | Produtos: ${summary.totalProductsScanned} | SKUs: ${summary.totalSkusAudited} (Estoque: ${summary.totalSkusInStock} / Rompidos: ${summary.totalSkusInStockout}) | Curva A Pública: ${summary.curveATotalProducts ?? 0} prods (${summary.curveABrokenProducts ?? 0} rompidos — Top #1: "${topCurveABroken?.productTitle ?? 'N/A'}" [Falta: ${topCurveABroken?.missingSizes?.join(', ') ?? ''}] [${topCurveABroken?.curveACollections?.join(', ') ?? ''}]) | Coleções Reais: ${colAudit.totalCollectionsInStore} (${elapsed}ms)`
      );

      expect(summary.totalProductsScanned).toBeGreaterThanOrEqual(store.minProducts);
      expect(summary.totalSkusAudited).toBeGreaterThanOrEqual(store.minSkus);
      expect(summary.paginationInfo?.hasMorePages).toBe(false);
      expect(summary.curveATotalProducts).toBeGreaterThan(0);
      expect(colAudit.totalCollectionsInStore).toBeGreaterThanOrEqual(store.minCollections);
      expect(colAudit.selectedCollection.totalProductsInCollection).toBeGreaterThan(0);
    }
  }, 90000);

  it('Audita lojas externas de moda autoral (Duas Design - duasdesign.com) sem falsos positivos de arquivo histórico, metafields Shopify 2.0, CNPJ >700KB ou QuotaExceededError', async () => {
    const start = Date.now();
    const diagnostic = await runAgentDiagnosticAsync({
      businessName: 'Duas Design',
      siteUrl: 'https://duasdesign.com',
      niche: 'Moda Feminina Autoral',
      targetRegion: 'Brasil',
      averageOrderValue: 320,
      grossMargin: 65,
      operationMode: 'AUTO_DETECT'
    });
    const elapsed = Date.now() - start;

    const catAudit = diagnostic.realSiteData.catalogAudit!;
    const activeCatalogItems = catAudit.issues.filter(
      i => !(i.availableSizes.length === 1 && i.availableSizes[0] === 'ARQUIVO (ESGOTADO)')
    );
    const archivedItems = catAudit.issues.filter(
      i => i.availableSizes.length === 1 && i.availableSizes[0] === 'ARQUIVO (ESGOTADO)'
    );

    console.log(
      `👗 [Duas Design — duasdesign.com] (${elapsed}ms)\n` +
      `   ├─ Total Produtos Varridos: ${catAudit.totalProductsScanned} | Total SKUs: ${catAudit.totalSkusAudited}\n` +
      `   ├─ Catálogo Ativo em Linha: ${activeCatalogItems.length} produtos (${catAudit.productsWithBrokenGrid} c/ grade central furada)\n` +
      `   ├─ Arquivo Histórico Descontinuado (100% Esgotado): ${archivedItems.length} produtos isolados sem falso positivo\n` +
      `   ├─ Falsos Positivos de Descrição (Metafields Shopify 2.0): ${catAudit.productsWithoutDescription}\n` +
      `   ├─ Saúde Real do Catálogo Ativo: ${catAudit.catalogHealthScore}% | Growth Score: ${diagnostic.growthScore}/100\n` +
      `   ├─ CNPJ Detectado (>700KB HTML): ${diagnostic.realSiteData.legalCompliance?.hasCnpjInFooter} (${diagnostic.realSiteData.legalCompliance?.cnpjFound})\n` +
      `   └─ Top #1 Produto Crítico Ativo: "${catAudit.issues[0]?.productTitle}" [Disponível: ${catAudit.issues[0]?.availableSizes.join(', ')} | Falta: ${catAudit.issues[0]?.missingSizes.join(', ')}]`
    );

    // 1. Varredura 100% real do catálogo (>2.000 produtos e >9.000 SKUs)
    expect(catAudit.totalProductsScanned).toBeGreaterThan(2000);
    expect(catAudit.totalSkusAudited).toBeGreaterThan(9000);

    // 2. Separação entre Catálogo Ativo (~273 prods) e Arquivo Histórico (~1.841 prods 100% esgotados)
    expect(activeCatalogItems.length).toBeGreaterThan(200);
    expect(archivedItems.length).toBeGreaterThan(1500);
    expect(catAudit.productsWithBrokenGrid).toBeLessThan(activeCatalogItems.length);
    // O primeiro item da lista deve ser um produto ativo com grade furada, nunca um item de arquivo morto
    expect(catAudit.issues[0]?.availableSizes[0]).not.toBe('ARQUIVO (ESGOTADO)');

    // 3. Zero falso positivo de descrição ausente em temas Shopify 2.0 que usam Metafields
    expect(catAudit.productsWithoutDescription).toBe(0);

    // 4. Saúde do catálogo calculada sobre a coleção ativa (não esmagada para 30% pelo arquivo morto)
    expect(catAudit.catalogHealthScore).toBeGreaterThanOrEqual(55);

    // 5. Detecção de CNPJ no rodapé mesmo em HTML > 735KB
    expect(diagnostic.realSiteData.legalCompliance?.hasCnpjInFooter).toBe(true);
    expect(diagnostic.realSiteData.legalCompliance?.cnpjFound).toContain('16.097.130/0001-24');

    // 6. Blindagem contra QuotaExceededError no Zustand Persist (localStorage < 5MB)
    expect(() => {
      useAuditStore.getState().setDiagnostic(diagnostic);
    }).not.toThrow();
    expect(useAuditStore.getState().diagnostic?.realSiteData.domain).toBe('duasdesign.com');
  }, 90000);

  it('Valida verticalização de Vestuário em 100% dos produtos (Minimal Club, Insider Store e Mash VTEX) sem falsos positivos de grade dupla, numérica, BOGO ou revenda', async () => {
    const apparelStores = [
      {
        name: 'Minimal Club',
        url: 'https://minimalclub.com.br',
        niche: 'Moda Masculina e Camisetas Básicas',
        minProducts: 100,
        minSkus: 3000,
        expectedPlatform: 'Shopify'
      },
      {
        name: 'Insider Store',
        url: 'https://www.insiderstore.com.br',
        niche: 'Moda Funcional e Techwear',
        minProducts: 550,
        minSkus: 9000,
        expectedPlatform: 'Shopify'
      },
      {
        name: 'Mash',
        url: 'https://www.mash.com.br',
        niche: 'Moda Íntima e Vestuário',
        minProducts: 8,
        minSkus: 30,
        expectedPlatform: 'VTEX'
      }
    ];

    for (const s of apparelStores) {
      const diag = await runAgentDiagnosticAsync({
        businessName: s.name,
        siteUrl: s.url,
        niche: s.niche,
        targetRegion: 'Brasil',
        averageOrderValue: 280,
        grossMargin: 62,
        operationMode: 'AUTO_DETECT'
      });

      const cat = diag.realSiteData.catalogAudit!;
      const supply = auditSupplyChainDiscrepancy(diag.realSiteData, diag.input);
      const ceo = await runCeoOrchestratorEvaluation(diag);
      useAuditStore.getState().setDiagnostic(diag);
      const omni = await runOmnichannelCrossAudit();

      expect(diag.realSiteData.ecommercePlatform).toBe(s.expectedPlatform);
      expect(cat.totalProductsScanned).toBeGreaterThanOrEqual(s.minProducts);
      expect(cat.totalSkusAudited).toBeGreaterThanOrEqual(s.minSkus);
      expect(cat.monthlyLossEstimateBRL).toBeGreaterThan(0);

      // CEO não deve sofrer deriva para Fitness/Suplementos e Omnichannel deve alinhar 100% com productsWithBrokenGrid
      expect(ceo.ceoStatus).toContain('Streetwear & Tech Apparel');
      if (cat.productsWithBrokenGrid >= 10) {
        expect(omni.items.length).toBe(cat.productsWithBrokenGrid);
      }

      // Lojas D2C de marca própria devem gerar alertas de FABRICACAO_PROPRIA (Ordem de Produção - OP), não Revenda
      const prodAlerts = supply.discrepancyAlerts.filter(a => a.manufacturingCategory === 'FABRICACAO_PROPRIA');
      expect(prodAlerts.length).toBeGreaterThan(0);

      if (s.name === 'Minimal Club') {
        // Calça Alfaiataria com 38..46 disponíveis e apenas 48 (ponta periférica) esgotado não deve ser grade quebrada
        const calcaAlfaiataria = cat.issues.find(i => i.productTitle.includes('Calça Alfaiataria Minimal 2.0'));
        if (calcaAlfaiataria) {
          expect(calcaAlfaiataria.missingSizes).toContain('48');
          expect(calcaAlfaiataria.recommendedAction).toBe('Catálogo em conformidade.');
        }
      }

      if (s.name === 'Insider Store') {
        // Saia Envelope Breeze com grade dupla P/M e G/GG em estoque não deve ter falso positivo
        const saiaEnvelope = cat.issues.find(i => i.productTitle.includes('Saia Envelope Breeze'));
        if (saiaEnvelope) {
          expect(saiaEnvelope.missingSizes.length).toBe(0);
        }
      }
    }
  }, 120000);
});



