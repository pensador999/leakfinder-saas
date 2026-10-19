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
});

