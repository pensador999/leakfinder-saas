// ==============================================================================
// 🛡️ GHOST INVENTORY & BACKORDER AD SHIELD ENGINE (2026.4 ENTERPRISE)
// Inspired by the "Yellowstone Dutton Ranch" case study on BRK Agro:
// Solves the critical blindspot where a product has available: true or an active
// "Adicionar à Sacola" button on the front-end, but physical warehouse stock is 0
// while paid traffic (Meta/Google Ads) continues actively wasting ad spend.
// ==============================================================================

export interface GhostInventoryRiskAssessment {
  productId: string;
  productTitle: string;
  handle: string;
  sku: string;
  url: string;
  isGhostInventorySuspect: boolean;
  riskScore: number; // 0 to 100
  riskLevel: 'CRITICO' | 'ALTO' | 'MODERADO' | 'SEGURO';
  detectedFlags: string[];
  backorderPolicyActive: boolean;
  untrackedInventory: boolean;
  fulfillmentPromiseConflict: boolean;
  hasActivePaidTraffic: boolean;
  activeCampaignId?: string;
  estimatedDailyWastedAdSpend: number;
  monthlyWastedAdSpend: number;
  recommendedMetaAdAction: 'PAUSE_AD_IMMEDIATELY' | 'SWITCH_DESTINATION_URL' | 'REDUCE_BUDGET' | 'KEEP_ACTIVE';
  actionSummary: string;
  technicalDiagnosis: string;
}

export interface GhostInventoryCheckInput {
  product: {
    id?: string | number;
    title: string;
    handle: string;
    variants?: any[];
    tags?: string[] | string;
    images?: string[];
    body_html?: string;
  };
  operationMode?: 'OWN_MANUFACTURING_ON_DEMAND' | 'PHYSICAL_WAREHOUSE' | 'RESALE_RETAIL' | 'AUTO_DETECT' | string;
  liveDomDetails?: {
    buyButtonText?: string;
    buyButtonDisabled?: boolean;
    hasImmediateShippingBadge?: boolean;
    hasSoldOutBadge?: boolean;
    bodyText?: string;
  };
  activeAdData?: {
    isAdRunning: boolean;
    adId?: string;
    dailySpend?: number;
    promotedModelName?: string;
    adCreativeUrl?: string;
  };
  erpOrAdminStock?: {
    warehouseQuantity?: number;
    isPreOrderOnly?: boolean;
  };
}

/**
 * 🕵️ Analyzes a product for Ghost Inventory (Overselling / Stockout Hidden Behind Backorders)
 */
export function assessGhostInventoryRisk(input: GhostInventoryCheckInput): GhostInventoryRiskAssessment {
  const { liveDomDetails, activeAdData, erpOrAdminStock, operationMode } = input;
  const product = input?.product || (input as any);
  const flags: string[] = [];
  let riskScore = 0;

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const primaryVariant = variants[0] || {};
  const tags = Array.isArray(product.tags) 
    ? product.tags.map(t => String(t).toLowerCase()) 
    : String(product.tags || '').toLowerCase().split(',');

  const rawTagsStr = tags.join(' ');
  const titleLower = (product.title || '').toLowerCase();
  const sku = primaryVariant.sku || 'N/A';

  // 1. CHECAGEM DE INVENTORY POLICY (BACKORDER / CONTINUAR VENDENDO)
  const isContinuePolicy = primaryVariant.inventory_policy === 'continue';
  const isUntracked = primaryVariant.inventory_management === null || primaryVariant.inventory_management === undefined;
  const isReportedZeroStock = primaryVariant.inventory_quantity !== undefined && primaryVariant.inventory_quantity <= 0;

  // Reconhecimento de modelo de negócio: Confecção Sob Demanda vs Estoque Físico
  const isMadeToOrder = operationMode === 'OWN_MANUFACTURING_ON_DEMAND' ||
    rawTagsStr.includes('sob_demanda') ||
    rawTagsStr.includes('sublimacao') ||
    rawTagsStr.includes('personalizado') ||
    titleLower.includes('personalizada') ||
    titleLower.includes('sob medida');

  if (isContinuePolicy) {
    if (isMadeToOrder) {
      flags.push("Operação Sob Demanda: Política 'Continuar vendendo' é padrão da fábrica (fabricação sob pedido).");
    } else {
      flags.push("Política 'Continuar vendendo quando esgotado' (inventory_policy: continue) ativa.");
      riskScore += 35;
    }
  }

  if (isUntracked) {
    if (!isMadeToOrder) {
      flags.push("Estoque sem rastreamento oficial no front-end (inventory_management: null).");
      riskScore += 20;
    }
  }

  if (isReportedZeroStock && (isContinuePolicy || primaryVariant.available)) {
    if (isMadeToOrder) {
      flags.push("Saldo físico zerado no galpão com produção sob demanda ativa (fluxo PCP normal).");
      riskScore += 5;
    } else {
      flags.push("Variante com estoque zerado no backend mas 'available: true' exposto ao público.");
      riskScore += 45;
    }
  }

  // 2. CHECAGEM DIRETA VIA ERP OU ADMIN INTEGRATION (GROUNDING REAL)
  if (erpOrAdminStock) {
    if (erpOrAdminStock.warehouseQuantity !== undefined && erpOrAdminStock.warehouseQuantity <= 0) {
      flags.push(`Estoque Físico Real no Galpão = ${erpOrAdminStock.warehouseQuantity} un (RUPTURA CONFIRMADA).`);
      riskScore += 50;
    }
  }

  // 3. CONFLITO DE PROMESSA DE EXPEDIÇÃO ('ENVIO IMEDIATO' VS RUPTURA REAL - CDC ART. 35)
  const claimsImmediateDelivery = 
    rawTagsStr.includes('envio imediato') || 
    rawTagsStr.includes('prazo_imediato') || 
    titleLower.includes('envio imediato') ||
    Boolean(liveDomDetails?.hasImmediateShippingBadge) ||
    Boolean(liveDomDetails?.bodyText?.toLowerCase().includes('envio imediato'));

  let fulfillmentPromiseConflict = false;
  if (claimsImmediateDelivery && (isContinuePolicy || (erpOrAdminStock?.warehouseQuantity ?? 1) <= 0)) {
    fulfillmentPromiseConflict = true;
    flags.push("Infração CDC Art. 35: Produto ostenta 'Envio Imediato' sem estoque expedível em 24h.");
    riskScore += 30;
  }

  // 4. CHECAGEM DE PRODUTO HERO EM ACESSÓRIOS/BONÉS (HISTÓRICO YELLOWSTONE)
  const isHighTrafficAccessory = 
    titleLower.includes('bone') || 
    titleLower.includes('boné') || 
    titleLower.includes('trucker') ||
    titleLower.includes('yellowstone') ||
    titleLower.includes('chapeu') ||
    titleLower.includes('chapéu') ||
    titleLower.includes('bandana');

  if (isHighTrafficAccessory) {
    flags.push("Item de alta atratividade e compra por impulso no tráfego pago (Acessório/Colecionável).");
    riskScore += 15;
  }

  // 5. CHECAGEM DE DIVERGÊNCIA VISUAL / MODELOS MISTURADOS
  const hasMultipleThemeImages = Array.isArray(product.images) && product.images.length >= 3 && (
    titleLower.includes('yellowstone') || titleLower.includes('long horn') || titleLower.includes('taurus')
  );
  if (hasMultipleThemeImages) {
    flags.push("Variações visuais misturadas no mesmo SKU: risco de substituição de modelo esgotado.");
    riskScore += 10;
  }

  // 6. CÁLCULO DE DESPERDÍCIO FINANCEIRO EM TRÁFEGO PAGO
  const hasActiveAds = Boolean(activeAdData?.isAdRunning);
  const dailySpend = activeAdData?.dailySpend || 180; // Benchmark de campanha padrão
  let dailyWasted = 0;

  if (riskScore >= 50 && hasActiveAds) {
    dailyWasted = dailySpend;
  } else if (riskScore >= 30 && hasActiveAds) {
    dailyWasted = Math.round(dailySpend * 0.4);
  }

  const monthlyWasted = dailyWasted * 30;

  // 6. CLASSIFICAÇÃO FINAL DE RISCO
  let riskLevel: 'CRITICO' | 'ALTO' | 'MODERADO' | 'SEGURO' = 'SEGURO';
  let recommendedAction: 'PAUSE_AD_IMMEDIATELY' | 'SWITCH_DESTINATION_URL' | 'REDUCE_BUDGET' | 'KEEP_ACTIVE' = 'KEEP_ACTIVE';
  let actionSummary = 'Estoque e tráfego em conformidade.';

  if (riskScore >= 60) {
    riskLevel = 'CRITICO';
    recommendedAction = 'PAUSE_AD_IMMEDIATELY';
    actionSummary = `🚨 PAUSAR ANÚNCIO IMEDIATAMENTE: SKU ${sku} está em ruptura física ou backorder silencioso enquanto queima ~R$ ${dailyWasted}/dia em tráfego.`;
  } else if (riskScore >= 35) {
    riskLevel = 'ALTO';
    recommendedAction = 'SWITCH_DESTINATION_URL';
    actionSummary = `⚠️ REDIRECIONAR TRÁFEGO: Substituir URL do criativo por produto alternativo com estoque físico confirmado.`;
  } else if (riskScore >= 20) {
    riskLevel = 'MODERADO';
    recommendedAction = 'REDUCE_BUDGET';
    actionSummary = 'Auditar estoque físico no ERP e reduzir verba até confirmação do lote.';
  }

  const technicalDiagnosis = `O produto "${product.title}" (${sku}) apresentou pontuação de risco de Estoque Fantasma de ${riskScore}/100. ` +
    (flags.length > 0 ? `Evidências: ${flags.join(' | ')}.` : 'Nenhuma anomalia de backorder detectada.');

  return {
    productId: String(product.id || 'N/A'),
    productTitle: product.title,
    handle: product.handle,
    sku,
    url: `/products/${product.handle}`,
    isGhostInventorySuspect: riskScore >= 35,
    riskScore: Math.min(100, riskScore),
    riskLevel,
    detectedFlags: flags,
    backorderPolicyActive: isContinuePolicy,
    untrackedInventory: isUntracked,
    fulfillmentPromiseConflict,
    hasActivePaidTraffic: hasActiveAds,
    activeCampaignId: activeAdData?.adId,
    estimatedDailyWastedAdSpend: dailyWasted,
    monthlyWastedAdSpend: monthlyWasted,
    recommendedMetaAdAction: recommendedAction,
    actionSummary,
    technicalDiagnosis
  };
}
