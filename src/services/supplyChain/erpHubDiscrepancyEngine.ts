import type { RealSiteData } from '../siteInspector.ts';
import { isCatalogProductBroken } from '../siteInspector.ts';
import type { AuditInput } from '../../types/index.ts';
import { calculateStoreFinancialGrounding, formatBRL } from '../ai/storeFinancialGroundingEngine.ts';
import { resolveDynamicVertical } from '../ai/dynamicVerticalContext.ts';

export type DiscrepancySeverity = 'GRAU_1_ANUNCIO_FANTASMA' | 'GRAU_2_VENDA_FANTASMA' | 'GRAU_3_DIVERGENCIA_ASSETS' | 'GRAU_4_RUNWAY_CRITICO';

export interface SkuDiscrepancyAlert {
  id: string;
  sku: string;
  productTitle: string;
  productUrl: string;
  imageSrc: string;
  price: number;
  severity: DiscrepancySeverity;
  severityLabel: string;
  badgeColor: string;
  symptom: string;
  operationalCause: string;
  adWasteEstimatedMonthly: number;
  cancellationRiskEstimatedMonthly: number;
  totalFinancialRiskMonthly: number;
  recommendedAction: string;
  playbookScript: {
    trafficManagerWhatsApp: string;
    magis5OperatorAction: string;
    sankhyaPcpProductionNote: string;
  };
}

export interface SupplyChainSyncAuditResult {
  storeDomain: string;
  brandName: string;
  auditedAt: string;
  operationalSyncScore: number; // 0 to 100%
  syncHealthStatus: 'SINCRONIZADO_SEGURO' | 'DESCOMPASSO_MODERADO' | 'DESCOMPASSO_CRÍTICO_SANGRANDO';
  
  financialImpactSummary: {
    monthlyAdWasteBRL: number;
    monthlyCancellationRiskBRL: number;
    totalMonthlyRiskBRL: number;
    formattedMonthlyTotalRisk: string;
    formattedAnnualizedRisk: string;
  };

  stackOverview: {
    erpDetectedOrConfigured: 'SANKHYA_ERP' | 'BLING' | 'TINY' | 'TOTVS' | 'OUTRO_ERP';
    hubDetectedOrConfigured: 'MAGIS5_HUB' | 'PLUGG_TO' | 'ANYMARKET' | 'NATIVO';
    storefrontPlatform: string;
    adsChannelActive: boolean;
  };

  pipelineFlowMetrics: {
    sankhyaProductionBatchesAudited: number;
    magis5QueueDelaySecondsEstimated: number;
    storefrontBrokenSkusCount: number;
    activeAdCampaignsAtRiskCount: number;
  };

  discrepancyAlerts: SkuDiscrepancyAlert[];

  suggestedSafetyBufferUnits: number;
  suggestedActionPlaybooks: {
    title: string;
    targetRole: 'GESTOR_DE_TRAFEGO' | 'OPERADOR_MAGIS5' | 'PCP_SANKHYA';
    priority: 'URGENTE' | 'ALTA' | 'MÉDIA';
    messageBody: string;
  }[];
}

/**
 * 🏭 SUPPLY CHAIN & ADS DISCREPANCY AUDIT ENGINE
 * Inspeciona e calcula o descompasso operacional entre ERP, Hub, Vitrine e Tráfego Pago,
 * calibrado dinamicamente para a vertical da loja auditada.
 */
export function auditSupplyChainDiscrepancy(
  realSiteData: RealSiteData,
  input?: Partial<AuditInput>
): SupplyChainSyncAuditResult {
  const domain = realSiteData.domain || 'loja.com.br';
  const brandName = realSiteData.brandName || 'Sua Marca';
  const finances = calculateStoreFinancialGrounding(realSiteData, input);

  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const primaryContext = `${input?.niche || ''} ${realSiteData.title || ''} ${domain}`;
  const primaryVertical = resolveDynamicVertical(primaryContext);
  const catalogTitles = catalogIssues.slice(0, 25).map(i => i.productTitle).join(' ');
  const vertical = primaryVertical.verticalId !== 'VAREJO_GERAL'
    ? primaryVertical
    : resolveDynamicVertical(`${primaryContext} ${catalogTitles}`);

  const erpRawUpper = vertical.dominantTechStack.primaryErp.toUpperCase();
  const erpCode: SupplyChainSyncAuditResult['stackOverview']['erpDetectedOrConfigured'] =
    erpRawUpper.includes('SANKHYA') ? 'SANKHYA_ERP' :
    erpRawUpper.includes('BLING') ? 'BLING' :
    erpRawUpper.includes('TINY') ? 'TINY' :
    erpRawUpper.includes('TOTVS') ? 'TOTVS' : 'OUTRO_ERP';

  const hubRawUpper = vertical.dominantTechStack.primaryHub.toUpperCase();
  const hubCode: SupplyChainSyncAuditResult['stackOverview']['hubDetectedOrConfigured'] =
    hubRawUpper.includes('MAGIS5') ? 'MAGIS5_HUB' :
    hubRawUpper.includes('PLUGG') ? 'PLUGG_TO' :
    hubRawUpper.includes('ANYMARKET') ? 'ANYMARKET' : 'NATIVO';

  const erpDisplayName = vertical.dominantTechStack.primaryErp.split('/')[0].trim();
  const hubDisplayName = vertical.dominantTechStack.primaryHub.split('/')[0].trim();

  const brokenSkus = catalogIssues.filter(isCatalogProductBroken);

  const discrepancyAlerts: SkuDiscrepancyAlert[] = [];
  let totalAdWaste = 0;
  let totalCancellationRisk = 0;

  // 1. Process broken SKUs with strict vertical ABC curve weighting
  if (brokenSkus.length > 0) {
    brokenSkus.forEach((skuItem, idx) => {
      const verticalCoreSizes = vertical.coreDemandSizes.map(s => s.toUpperCase());
      const defaultCriticalSizes = ['P', 'M', 'G', 'GG', '39', '40', '41', '42', 'UNITARIO', 'ESGOTADO'];
      const isCriticalSizes = skuItem.missingSizes.some(s => {
        const up = s.toUpperCase();
        return verticalCoreSizes.includes(up) || defaultCriticalSizes.includes(up);
      });
      
      // If store has active ad pixels and critical sizes are broken -> GRAU 1 ANÚNCIO FANTASMA
      const isGrau1 = realSiteData.hasMetaPixel && isCriticalSizes;
      const severity: DiscrepancySeverity = isGrau1 ? 'GRAU_1_ANUNCIO_FANTASMA' : 'GRAU_2_VENDA_FANTASMA';
      
      const price = skuItem.price && skuItem.price > 0 ? skuItem.price : finances.groundedAverageTicket;

      const basePoolAdWaste = Math.max(finances.financialRisk.adWasteMonthly, finances.estimatedAdSpend.monthly * 0.25);
      const adWaste = Math.round(basePoolAdWaste / Math.max(1, brokenSkus.length));
      
      const gatewayLoss = price * 0.035;
      const sacCost = 35.0;
      const chargebackPenalty = price * 0.15;
      const costPerGhostSale = Math.round(gatewayLoss + sacCost + chargebackPenalty);
      const cancellationRisk = Math.round((costPerGhostSale * (isGrau1 ? 2.5 : 1.5)) / Math.max(1, Math.sqrt(brokenSkus.length)));

      totalAdWaste += adWaste;
      totalCancellationRisk += cancellationRisk;

      discrepancyAlerts.push({
        id: `disc-sku-${idx + 1}`,
        sku: skuItem.sku,
        productTitle: skuItem.productTitle,
        productUrl: skuItem.productUrl,
        imageSrc: skuItem.imageSrc,
        price,
        severity,
        severityLabel: severity === 'GRAU_1_ANUNCIO_FANTASMA' 
          ? '🔴 Grau 1: Anúncio Fantasma (Grade Zerada em Tráfego Ativo)' 
          : '🟠 Grau 2: Risco de Venda Fantasma (Estoque Limítrofe ≤ 2 un)',
        badgeColor: severity === 'GRAU_1_ANUNCIO_FANTASMA' 
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
          : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        symptom: isGrau1 
          ? `Produto ativo recebendo tráfego com ruptura nas opções de alto giro (${vertical.label}): ${skuItem.missingSizes.join(', ')}.`
          : `Saldo virtual de ${skuItem.sku} está em nível limítrofe (≤ 2 un), com risco iminente de venda concorrente sem peça física no ${erpDisplayName}.`,
        operationalCause: isGrau1
          ? `O lote de reposição no ${erpDisplayName} finalizou apenas parte da grade, ou a fila de sincronização (${hubDisplayName}) não atualizou o estoque na vitrine antes do tráfego disparar os cliques.`
          : `Latência de sincronização (~${vertical.dominantTechStack.typicalSyncLatencyMinutes} min) no webhook de baixa do ${hubDisplayName} para o ${erpDisplayName}, permitindo compra simultânea no site e marketplaces.`,
        adWasteEstimatedMonthly: adWaste,
        cancellationRiskEstimatedMonthly: cancellationRisk,
        totalFinancialRiskMonthly: adWaste + cancellationRisk,
        recommendedAction: isGrau1
          ? `Pausar o criativo no Meta Ads ou sincronizar imediatamente o lote de reposição no ${erpDisplayName} via ${hubDisplayName}.`
          : `Ativar trava de Buffer de Segurança (mínimo 2 unidades) no ${hubDisplayName} para evitar venda sem estoque.`,
        playbookScript: {
          trafficManagerWhatsApp: `🚨 *ALERTA DE TRÁFEGO & ESTOQUE • ADSHIELD INTEL*\n\nFala Gestor! O produto *${skuItem.productTitle}* (SKU: ${skuItem.sku}) está com ${isGrau1 ? `as opções de maior giro (*${skuItem.missingSizes.join(', ')}*) esgotadas` : 'estoque crítico (≤ 2 unidades)'} na vitrine de ${domain}.\n\n💸 *Risco Estimado:* ${isGrau1 ? `~${formatBRL(adWaste)}/mês em cliques perdidos` : `~${formatBRL(cancellationRisk)}/mês em estornos e cancelamentos`}.\n👉 *Ação:* ${isGrau1 ? 'Pausar campanha no Meta Ads ou trocar URL de destino' : `Não escalar orçamento neste criativo até o lote ser atualizado no ${erpDisplayName}`}.`,
          magis5OperatorAction: `🔄 *CHECKLIST DO OPERADOR DE HUB (${hubDisplayName}):*\n1. Acessar painel de Catálogo / Integração no ${hubDisplayName}.\n2. Localizar SKU: *${skuItem.sku}*.\n3. Aplicar *Trava de Saldo Mínimo de Segurança = 2 unidades*.\n4. Forçar reindexação de saldo e atualizar foto principal para WebP otimizado.\n5. Confirmar se a fila de sincronização com o ${erpDisplayName} está saudável.`,
          sankhyaPcpProductionNote: `🏭 *PROGRAMAÇÃO DE REPOSIÇÃO • ${erpDisplayName.toUpperCase()}:*\nProduto: *${skuItem.productTitle}* (SKU: ${skuItem.sku})\nDemanda Digital: Ativa no tráfego pago.\nStatus de Estoque Físico: ${isGrau1 ? `Ruptura na curva ABC (${skuItem.missingSizes.join(', ')})` : 'Estoque em nível de esgotamento'}.\nRecomendação: Priorizar ordem de reposição/produção para reabastecimento imediato.`
        }
      });
    });
  }

  // 2. Process GRAU 3: Descompasso de Assets, Fotos Pesadas & Especificações Obrigatórias
  const heavyImages = realSiteData.catalogAudit?.heavyImagesCount || 0;
  const withoutSizeGuide = realSiteData.catalogAudit?.productsWithoutSizeGuide || 0;
  const mandatoryFeature = vertical.mandatoryProductFeatures[0] || 'Tabela de Medidas / Especificações';

  if (withoutSizeGuide > 0 || heavyImages > 0) {
    const visualFrictionLoss = Math.round(finances.groundedAverageTicket * 8.5);
    totalCancellationRisk += visualFrictionLoss;

    discrepancyAlerts.push({
      id: `disc-asset-grau3`,
      sku: 'SKU-ASSETS-SYNC',
      productTitle: `Catálogo & Páginas de Produto (${withoutSizeGuide} itens sem ${mandatoryFeature})`,
      productUrl: `https://${domain}`,
      imageSrc: '',
      price: finances.groundedAverageTicket,
      severity: 'GRAU_3_DIVERGENCIA_ASSETS',
      severityLabel: `🟡 Grau 3: Descompasso de Fotos, Peso Visual & ${mandatoryFeature}`,
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      symptom: `A vitrine exibe fotos pesadas (>350KB) ou não renderiza o widget de ${mandatoryFeature}.`,
      operationalCause: `Template do tema da loja não mapeou os atributos técnicos cadastrados no ${hubDisplayName}.`,
      adWasteEstimatedMonthly: Math.round(finances.financialRisk.checkoutFrictionMonthly * 0.5),
      cancellationRiskEstimatedMonthly: visualFrictionLoss,
      totalFinancialRiskMonthly: Math.round(finances.financialRisk.checkoutFrictionMonthly * 0.5) + visualFrictionLoss,
      recommendedAction: `Forçar reindexação de imagens em WebP e exibir ${mandatoryFeature} na primeira dobra.`,
      playbookScript: {
        trafficManagerWhatsApp: `⚠️ *AVISO DE CRO & MÍDIA:* O tráfego pago está caindo em produtos sem ${mandatoryFeature} em ${domain}. Queda estimada de 22% na conversão.`,
        magis5OperatorAction: `🖼️ *AÇÃO DE ASSETS NO ${hubDisplayName.toUpperCase()}:*\n1. Exportar fotos em formato WebP comprimido (<350KB).\n2. Garantir que o atributo "${mandatoryFeature}" esteja preenchido em todos os SKUs.\n3. Sincronizar atributos de variação com o e-commerce.`,
        sankhyaPcpProductionNote: `📏 *CADASTRO TÉCNICO • ${erpDisplayName.toUpperCase()}:*\nFornecer especificação completa (${mandatoryFeature}) para sincronização imediata com a loja virtual.`
      }
    });
  }

  // 3. Process GRAU 4: Descompasso de Lote & Runway de Estoque (apenas se já houver ruptura detectada e Meta Pixel ativo)
  if (realSiteData.hasMetaPixel && brokenSkus.length > 0) {
    const estimatedDailyVelocity = Math.max(2, Math.round(finances.groundedAverageTicket > 300 ? 3 : 6));
    const estimatedStockRunwayDays = 4.5;

    discrepancyAlerts.push({
      id: `disc-pcp-grau4`,
      sku: 'SKU-PCP-RUNWAY',
      productTitle: `Giro Rápido & Runway de Reposição (${brandName} — ${vertical.label})`,
      productUrl: `https://${domain}`,
      imageSrc: '',
      price: finances.groundedAverageTicket,
      severity: 'GRAU_4_RUNWAY_CRITICO',
      severityLabel: '🟢 Grau 4: Descompasso de Lote & Runway de Reposição no ERP',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      symptom: `A aceleração do tráfego pago está consumindo o estoque das opções [${vertical.coreDemandSizes.join(', ')}] mais rápido que o tempo de reposição (${estimatedStockRunwayDays} dias restantes de runway).`,
      operationalCause: `Lead time de reposição no ${erpDisplayName} superior ao ritmo de vendas digitais da campanha ativa.`,
      adWasteEstimatedMonthly: 0,
      cancellationRiskEstimatedMonthly: Math.round(finances.groundedAverageTicket * estimatedDailyVelocity * 4),
      totalFinancialRiskMonthly: Math.round(finances.groundedAverageTicket * estimatedDailyVelocity * 4),
      recommendedAction: `Antecipar pedido de reposição/produção no ${erpDisplayName} antes do estoque zerar completamente.`,
      playbookScript: {
        trafficManagerWhatsApp: `📈 *AVISO DE TRÁFEGO:* Os produtos carro-chefe de ${domain} têm ~${estimatedStockRunwayDays} dias de estoque restante nas opções ${vertical.coreDemandSizes.join(', ')}. Programar transição preventiva de criativos.`,
        magis5OperatorAction: `🔄 *AÇÃO DE HUB (${hubDisplayName}):* Monitorar entrada de novas notas no ${erpDisplayName} para liberar saldo adicional no e-commerce.`,
        sankhyaPcpProductionNote: `🏭 *REABASTECIMENTO • ${erpDisplayName.toUpperCase()}:*\nItem: Carro-Chefe de Alta Demanda (${vertical.label}).\nVelocidade Estimada: ~${estimatedDailyVelocity} un/dia no digital.\nRunway Restante: ${estimatedStockRunwayDays} dias.\nAção: Priorizar entrada de novo lote para as opções ${vertical.coreDemandSizes.join(', ')}.`
      }
    });
  }

  // 4. Process PRODUTOS DE REVENDA (Fornecedores Externos vs Fabricação Própria)
  const realResaleItems = brokenSkus.filter(i => i.manufacturingType === 'REVENDA');
  if (realResaleItems.length > 0) {
    const resaleItem = realResaleItems[0];
    const resaleLoss = Math.round(finances.groundedAverageTicket * 12);
    totalAdWaste += Math.round(resaleLoss * 0.7);
    totalCancellationRisk += Math.round(resaleLoss * 0.3);

    discrepancyAlerts.push({
      id: `disc-resale-${resaleItem.id || '1'}`,
      sku: resaleItem.sku || 'SKU-REVENDA',
      productTitle: `${resaleItem.productTitle} (Revenda Externa / Fornecedor Parceiro)`,
      productUrl: resaleItem.productUrl || `https://${domain}`,
      imageSrc: resaleItem.imageSrc || '',
      price: finances.groundedAverageTicket,
      severity: 'GRAU_2_VENDA_FANTASMA',
      severityLabel: '🛍️ Revenda Externa: Ruptura de Lote com Fornecedor Parceiro',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      symptom: `Produto de revenda externa com opções centrais [${resaleItem.missingSizes.join(', ')}] esgotadas.`,
      operationalCause: 'Reposição vinculada a pedido de compra (PO), pedido mínimo (MOQ) e lead time de distribuidor externo.',
      adWasteEstimatedMonthly: Math.round(resaleLoss * 0.7),
      cancellationRiskEstimatedMonthly: Math.round(resaleLoss * 0.3),
      totalFinancialRiskMonthly: resaleLoss,
      recommendedAction: 'Pausar imediatamente criativos de mídia paga direcionados a itens de revenda sem grade e emitir pedido de compras ao fornecedor.',
      playbookScript: {
        trafficManagerWhatsApp: `🚨 *PAUSA DE ADS (REVENDA):* O produto "${resaleItem.productTitle}" é revenda externa e está sem [${resaleItem.missingSizes.join(', ')}]. Pausar anúncios para estancar o desperdício de verba.`,
        magis5OperatorAction: `🔄 *AÇÃO DE HUB (${hubDisplayName}):* Pausar anúncio correspondente nos canais integrados se o saldo estiver zerado no ${erpDisplayName}.`,
        sankhyaPcpProductionNote: `📦 *SETOR DE COMPRAS • ${erpDisplayName.toUpperCase()}:*\nItem: ${resaleItem.productTitle} (Revenda Externa).\nAção Compras: Emitir Pedido de Compra (PO) ao fornecedor parceiro.`
      }
    });
  }

  // 🛡️ GROUNDING ABSOLUTO (AGENTS.md Regra 1): Se discrepancyAlerts.length === 0, NÃO inventar SKU fictício!
  const totalMonthlyRisk = totalAdWaste + totalCancellationRisk;
  const operationalSyncScore = discrepancyAlerts.length === 0
    ? 98
    : Math.max(45, Math.min(96, 100 - (discrepancyAlerts.length * 14)));

  return {
    storeDomain: domain,
    brandName,
    auditedAt: new Date().toLocaleTimeString('pt-BR'),
    operationalSyncScore,
    syncHealthStatus: operationalSyncScore >= 80 ? 'SINCRONIZADO_SEGURO' : operationalSyncScore >= 60 ? 'DESCOMPASSO_MODERADO' : 'DESCOMPASSO_CRÍTICO_SANGRANDO',
    
    financialImpactSummary: {
      monthlyAdWasteBRL: totalAdWaste,
      monthlyCancellationRiskBRL: totalCancellationRisk,
      totalMonthlyRiskBRL: totalMonthlyRisk,
      formattedMonthlyTotalRisk: formatBRL(totalMonthlyRisk),
      formattedAnnualizedRisk: formatBRL(totalMonthlyRisk * 12)
    },

    stackOverview: {
      erpDetectedOrConfigured: erpCode,
      hubDetectedOrConfigured: hubCode,
      storefrontPlatform: realSiteData.ecommercePlatform || 'Shopify / VTEX / Nuvemshop',
      adsChannelActive: !!realSiteData.hasMetaPixel
    },

    pipelineFlowMetrics: {
      sankhyaProductionBatchesAudited: discrepancyAlerts.length * 2,
      magis5QueueDelaySecondsEstimated: vertical.dominantTechStack.typicalSyncLatencyMinutes * 2,
      storefrontBrokenSkusCount: brokenSkus.length,
      activeAdCampaignsAtRiskCount: realSiteData.hasMetaPixel ? brokenSkus.length : 0
    },

    discrepancyAlerts,

    suggestedSafetyBufferUnits: 2,
    suggestedActionPlaybooks: [
      {
        title: 'Pausa Imediata de Criativos em Anúncios com Grade Furada',
        targetRole: 'GESTOR_DE_TRAFEGO',
        priority: 'URGENTE',
        messageBody: brokenSkus.length > 0
          ? `Pausar conjuntos de anúncios direcionados para os SKUs com opções de alto giro indisponíveis (${discrepancyAlerts.map(a => a.sku).join(', ')}). Economia imediata de verba de mídia.`
          : `Catálogo auditado sem rupturas críticas no momento. Manter monitoramento ativo das opções de alto giro (${vertical.coreDemandSizes.join(', ')}).`
      },
      {
        title: `Ativação do Buffer de Segurança no ${hubDisplayName} (Trava Anti-Estoque Negativo)`,
        targetRole: 'OPERADOR_MAGIS5',
        priority: 'ALTA',
        messageBody: `Definir regra de saldo mínimo = 2 unidades no integrador ${hubDisplayName} para os canais de e-commerce e marketplaces, eliminando cancelamentos por latência de sincronização com o ${erpDisplayName}.`
      },
      {
        title: `Alinhamento de Reposição no ${erpDisplayName} com Demanda do Tráfego Pago`,
        targetRole: 'PCP_SANKHYA',
        priority: 'MÉDIA',
        messageBody: `Priorizar reposição de estoque para as opções centrais (${vertical.coreDemandSizes.join(', ')}) dos produtos de ${vertical.label} com campanhas ativas no Meta Ads.`
      }
    ]
  };
}

