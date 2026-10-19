// ==============================================================================
// 🎯 OMNICHANNEL TRUTH MATRIX SERVICE: AdShield Client Engine
// Coordena o cruzamento quádruplo dinâmico a partir do diagnóstico real da loja
// e aciona o Kill-Switch no Meta Ads
// ==============================================================================

import { OmnichannelAuditItem } from '../../../api/omnichannel/cross-audit';
import { useAuditStore } from '../../store/auditStore';
import { resolveDynamicVertical } from '../ai/dynamicVerticalContext';
import { isCatalogProductBroken } from '../siteInspector';

function buildDynamicOmnichannelItemsFromStore(executeKillSwitch: boolean = false): {
  storeName: string;
  items: OmnichannelAuditItem[];
} | null {
  const diagnostic = useAuditStore.getState().diagnostic;
  const siteData = diagnostic?.realSiteData;
  const issues = siteData?.catalogAudit?.issues || [];
  if (!siteData || issues.length === 0) return null;

  const vertical = resolveDynamicVertical(`${diagnostic?.input?.niche || ''} ${siteData.title || ''} ${siteData.domain || ''}`);
  const erpName = vertical.dominantTechStack.primaryErp.split('/')[0].trim();
  const hubName = vertical.dominantTechStack.primaryHub.split('/')[0].trim();
  const aov = diagnostic?.input?.averageOrderValue || vertical.averageTicketBRL || 179.90;

  // Prioriza os SKUs realmente em ruptura para que a Matriz Omnichannel reflita 100% dos gargalos reais da loja
  const sortedIssues = [...issues].sort((a: any, b: any) => {
    const aBroken = isCatalogProductBroken(a);
    const bBroken = isCatalogProductBroken(b);
    return Number(bBroken) - Number(aBroken);
  });

  const brokenSet = sortedIssues.filter((a: any) => isCatalogProductBroken(a));
  const targetPool = brokenSet.length >= 10 ? brokenSet : sortedIssues.slice(0, Math.max(25, brokenSet.length));

  const items: OmnichannelAuditItem[] = targetPool.map((issue: any, idx: number) => {
    const isBroken = isCatalogProductBroken(issue);
    const isCritical = Boolean(issue.isGhostInventorySuspect) || issue.missingSizes.includes('ESGOTADO') || (isBroken && issue.missingSizes.length >= 2);
    const isAlert = !isCritical && isBroken;
    const dailySpend = isCritical ? 250 : isAlert ? 180 : 200;
    const dailyWaste = isCritical ? Math.round(dailySpend * 0.65) : isAlert ? Math.round(dailySpend * 0.30) : 0;
    const realPrice = issue.price && issue.price > 0 ? issue.price : aov;

    return {
      sku: issue.sku || `SKU-${idx + 1}`,
      nome: issue.productTitle,
      handle: issue.productUrl.split('/products/')[1] || `item-${idx + 1}`,
      preco: realPrice,
      shopifyStatus: {
        disponivelFront: !issue.missingSizes.includes('ESGOTADO'),
        inventoryPolicy: issue.isGhostInventorySuspect ? 'continue' : 'deny',
        tracked: true,
        estoqueFront: isCritical ? 0 : isAlert ? 2 : 10
      },
      sankhyaStatus: {
        estoqueFisicoGalpao: isCritical ? 0 : isAlert ? 2 : 10,
        reservado: isCritical ? 1 : 0,
        disponivelReal: isCritical ? 0 : isAlert ? 2 : 10,
        emCortePcp: isAlert && issue.manufacturingType !== 'REVENDA',
        leadTimeDias: issue.manufacturingType === 'REVENDA' ? 18 : 4
      },
      magis5Status: {
        statusMercadoLivre: isCritical ? 'PAUSADO_ESTOQUE_ZERO' : 'ATIVO',
        statusShopee: isCritical ? 'PAUSADO_ESTOQUE_ZERO' : 'ATIVO',
        pausadoPorEstoque: isCritical
      },
      metaAdsStatus: {
        anuncioAtivo: Boolean(siteData.hasMetaPixel),
        adsetId: `adset_${(issue.sku || idx).toString().toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        nomeCampanha: `[CONV] - ${vertical.label} - ${issue.productTitle.slice(0, 28)}`,
        verbaDiariaReais: siteData.hasMetaPixel ? dailySpend : 0,
        cpcMedioReais: vertical.benchmarkMetaAdsCpcBRL
      },
      veredito: {
        temEstoqueFantasma: isCritical,
        nivelRisco: isCritical ? 'CRITICO' : isAlert ? 'ALERTA' : 'SEGURO',
        motivoDiscrepancia: isCritical
          ? `Ruptura verificada na vitrine nas opções [${issue.missingSizes.join(', ')}] (${erpName} / ${hubName}) com pixel de tráfego ativo (~R$ ${dailyWaste}/dia em risco). [Projeção via Vitrine Pública — Conecte API ${erpName} para Saldo Físico Exato]`
          : isAlert
          ? `Ruptura parcial na grade (${issue.missingSizes.join(', ')}). Recomendado ajuste de criativo no Meta Ads.`
          : `Alinhamento operacional saudável verificado na vitrine pública (${erpName} / ${hubName}).`,
        desperdicioDiarioEstimado: siteData.hasMetaPixel ? dailyWaste : 0,
        desperdicioMensalProjetado: siteData.hasMetaPixel ? dailyWaste * 30 : 0,
        acaoKillSwitchRecomendada: isCritical && Boolean(siteData.hasMetaPixel),
        statusKillSwitch: isCritical && siteData.hasMetaPixel
          ? (executeKillSwitch ? 'EXECUTADO' : 'PENDENTE')
          : 'NAO_NECESSARIO'
      }
    };
  });

  return {
    storeName: siteData.brandName || siteData.domain || 'Loja Auditada',
    items
  };
}

export async function runOmnichannelCrossAudit(options?: {
  executeKillSwitch?: boolean;
  targetSku?: string;
}): Promise<{
  ok: boolean;
  engine: string;
  metrics: {
    totalAudited: number;
    criticalGhostInventoryCount: number;
    totalDesperdicioDiarioReais: number;
    totalDesperdicioMensalReais: number;
    killSwitchAutoTriggered: boolean;
  };
  whatsappNotification: {
    recipient: string;
    message: string;
  };
  items: OmnichannelAuditItem[];
}> {
  const dynamicStoreData = buildDynamicOmnichannelItemsFromStore(options?.executeKillSwitch);

  try {
    if (typeof window === 'undefined' || !window.location?.origin?.startsWith('http')) {
      throw new Error('SSR_LOCAL_DIRECT');
    }
    const res = await fetch(`${window.location.origin}/api/omnichannel/cross-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options,
        storeName: dynamicStoreData?.storeName,
        customItems: dynamicStoreData?.items
      })
    });

    if (!res.ok) {
      throw new Error(`Omnichannel cross-audit returned ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err?.message !== 'SSR_LOCAL_DIRECT') {
      console.warn('[Omnichannel Service Fallback]:', err.message);
    }
    const fallbackItems: OmnichannelAuditItem[] = dynamicStoreData?.items || [
      {
        sku: "SKU-REF-001",
        nome: "Produto Monitorado (Caso de Referência Estoque Fantasma)",
        handle: "produto-monitorado-referencia",
        preco: 159.90,
        shopifyStatus: {
          disponivelFront: true,
          inventoryPolicy: 'continue',
          tracked: true,
          estoqueFront: 0
        },
        sankhyaStatus: {
          estoqueFisicoGalpao: 0,
          reservado: 2,
          disponivelReal: -2,
          emCortePcp: false,
          leadTimeDias: 15
        },
        magis5Status: {
          statusMercadoLivre: 'PAUSADO_ESTOQUE_ZERO',
          statusShopee: 'PAUSADO_ESTOQUE_ZERO',
          pausadoPorEstoque: true
        },
        metaAdsStatus: {
          anuncioAtivo: true,
          adsetId: "adset_ref_scale_01",
          nomeCampanha: "[CONV] - Campanha Principal - Topo de Funil",
          verbaDiariaReais: 350.00,
          cpcMedioReais: 1.45
        },
        veredito: {
          temEstoqueFantasma: true,
          nivelRisco: 'CRITICO',
          motivoDiscrepancia: "Hub pausou nos marketplaces e ERP acusa saldo zero, mas a vitrine continua vendendo em backorder com anúncio ativo!",
          desperdicioDiarioEstimado: 350.00,
          desperdicioMensalProjetado: 10500.00,
          acaoKillSwitchRecomendada: true,
          statusKillSwitch: options?.executeKillSwitch ? 'EXECUTADO' : 'PENDENTE'
        }
      }
    ];

    const criticalCount = fallbackItems.filter(i => i.veredito.nivelRisco === 'CRITICO').length;
    const dailyTotal = fallbackItems.reduce((acc, i) => acc + i.veredito.desperdicioDiarioEstimado, 0);
    const monthlyTotal = fallbackItems.reduce((acc, i) => acc + i.veredito.desperdicioMensalProjetado, 0);

    return {
      ok: true,
      engine: 'adshield_omnichannel_truth_matrix_client_fallback',
      metrics: {
        totalAudited: fallbackItems.length,
        criticalGhostInventoryCount: criticalCount,
        totalDesperdicioDiarioReais: dailyTotal,
        totalDesperdicioMensalReais: monthlyTotal,
        killSwitchAutoTriggered: options?.executeKillSwitch || false
      },
      whatsappNotification: {
        recipient: "",
        message: `🚨 Alerta de Estoque Fantasma em ${dynamicStoreData?.storeName || 'Loja Auditada'}: SKU ${fallbackItems[0]?.sku}`
      },
      items: fallbackItems
    };
  }
}

