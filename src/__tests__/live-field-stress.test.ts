import { describe, it, expect } from 'vitest';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { auditDeepCatalog } from '../services/catalog/deepSkuAuditEngine';
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

      // 1. Fetch ao vivo de /products.json para testar auditDeepCatalog diretamente com payload real da Shopify
      let rawShopifyProducts: any[] = [];
      try {
        const res = await fetch(`${store.url}/products.json?limit=50`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AdShield-FieldAuditor/2026' }
        });
        if (res.ok) {
          const json = await res.json();
          rawShopifyProducts = json.products || [];
        }
      } catch (err: any) {
        console.warn(`[Live Fetch Warning] ${store.url}/products.json:`, err.message);
      }

      console.log(`📦 [1/7] Produtos extraídos ao vivo de /products.json: ${rawShopifyProducts.length}`);

      // 2. Execução completa do Pipeline Principal de Diagnóstico (runAgentDiagnosticAsync)
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
      console.log(`⚡ [2/7] Diagnóstico E2E concluído em ${elapsedMs}ms | Growth Score: ${diagnostic.growthScore}/100`);
      console.log(`   ├─ Plataforma detectada: ${diagnostic.realSiteData.ecommercePlatform}`);
      console.log(`   ├─ Nicho detectado: ${diagnostic.input.niche}`);
      console.log(`   ├─ Produtos escaneados no Catalog Doctor: ${diagnostic.realSiteData.catalogAudit?.totalProductsScanned}`);
      console.log(`   ├─ Produtos com grade quebrada: ${diagnostic.realSiteData.catalogAudit?.productsWithBrokenGrid}`);
      console.log(`   └─ Saúde do Catálogo: ${diagnostic.realSiteData.catalogAudit?.catalogHealthScore}%`);

      expect(diagnostic.growthScore).toBeGreaterThanOrEqual(0);
      expect(diagnostic.growthScore).toBeLessThanOrEqual(100);
      expect(diagnostic.realSiteData.domain).toBeTruthy();

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

      // 4. Auditoria Profunda de SKUs + Deduplicação + Ghost Inventory
      if (rawShopifyProducts.length > 0) {
        const deepSummary = auditDeepCatalog(rawShopifyProducts, {
          storeDomain: diagnostic.realSiteData.domain,
          dailyAdSpend: 300,
          isAdRunning: diagnostic.realSiteData.hasMetaPixel,
          operationMode: 'AUTO_DETECT'
        });

        console.log(`🔬 [4/7] Deep SKU Audit & Deduplicação:`);
        console.log(`   ├─ Produtos únicos auditados: ${deepSummary.totalProductsAudited}`);
        console.log(`   ├─ SKUs únicos auditados: ${deepSummary.totalSkusAudited}`);
        console.log(`   ├─ SKUs em estoque: ${deepSummary.totalInStockSkus} | SKUs em ruptura: ${deepSummary.totalRupturedSkus}`);
        console.log(`   ├─ Sangria Mensal Calculada: R$ ${deepSummary.totalMonthlyBleedBrl.toFixed(2)}`);
        if (deepSummary.criticalProducts.length > 0) {
          const topCrit = deepSummary.criticalProducts[0];
          console.log(`   └─ Top Produto Crítico: "${topCrit.title}" (${topCrit.rupturedSkusCount}/${topCrit.totalSkusCount} SKUs rompidos) -> Ação: ${topCrit.skus.find(s => !s.available)?.operationalAction}`);
        }

        // Verifica que não há códigos SKU duplicados dentro do mesmo produto auditado
        for (const prod of deepSummary.allProducts) {
          const skus = prod.skus.map(s => s.skuCode.toUpperCase());
          const uniqueSkus = new Set(skus);
          expect(skus.length).toBe(uniqueSkus.size);
        }
      }

      // 5. Motor de Discrepância Supply Chain (ERP / Hub / Meta Ads)
      const supplyChainAudit = auditSupplyChainDiscrepancy(diagnostic.realSiteData, diagnostic.input);
      console.log(`🏭 [5/7] Auditoria Supply Chain (ERP/Hub):`);
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
      const firstIssue = diagnostic.realSiteData.catalogAudit?.issues?.find(i => i.missingSizes.length > 0) || diagnostic.realSiteData.catalogAudit?.issues?.[0];
      if (firstIssue) {
        const bleedActuary = calculateActuarialBleed({
          productTitle: firstIssue.productTitle,
          productPriceBRL: 199.90,
          availableSizes: firstIssue.availableSizes,
          outOfStockSizes: firstIssue.missingSizes,
          niche: vertical.verticalId
        });
        console.log(`📐 [7/7] Engenharia Atuarial & Matriz Omnichannel:`);
        console.log(`   ├─ Produto Auditado no Atuário: "${bleedActuary.productTitle}"`);
        console.log(`   ├─ Demanda Rompida na Curva Gaussiana: ${bleedActuary.rupturedDemandPct}% | Severidade: ${bleedActuary.severity}`);
        console.log(`   ├─ Sangria Mensal Total (Ads + Lucro Cessante): R$ ${bleedActuary.totalMonthlyBleedBRL.toFixed(2)}`);
        console.log(`   └─ Itens na Matriz Omnichannel: ${omniResult.items.length} (Primeiro SKU: ${omniResult.items[0]?.sku})`);
      }
    }
  }, 60000);

  it('Mapeia 100% dos produtos e SKUs nos 3 sites da BRK (Agro > 16k, Fishing > 11.8k, Motors > 9k)', async () => {
    const { sweepStoreFullCatalog } = await import('../services/siteInspector');

    const brkStores = [
      { name: 'BRK Agro', url: 'https://www.brkagro.com.br', minProducts: 2500, minSkus: 16000 },
      { name: 'BRK Fishing', url: 'https://www.brkfishing.com.br', minProducts: 2100, minSkus: 11800 },
      { name: 'BRK Motors', url: 'https://www.brkmotors.com.br', minProducts: 1400, minSkus: 9000 }
    ];

    for (const store of brkStores) {
      const start = Date.now();
      const summary = await sweepStoreFullCatalog(store.url, 25);
      const elapsed = Date.now() - start;

      console.log(
        `📊 [${store.name}] Páginas: ${summary.paginationInfo?.pagesCrawled} | Produtos Auditados: ${summary.totalProductsScanned} | Total SKUs Mapeados: ${summary.totalSkusAudited} | Em Estoque: ${summary.totalSkusInStock} | Rompidos: ${summary.totalSkusInStockout} (${elapsed}ms)`
      );

      expect(summary.totalProductsScanned).toBeGreaterThanOrEqual(store.minProducts);
      expect(summary.totalSkusAudited).toBeGreaterThanOrEqual(store.minSkus);
      expect(summary.paginationInfo?.hasMorePages).toBe(false);
    }
  }, 90000);
});

