// ==============================================================================
// 🔬 DEEP SKU & VARIANT AUDIT ENGINE — ADSHIELD ENTERPRISE 2026.4
// Audits 100% of SKUs, sizes and individual variants with granular financial analysis
// Zero generalization: Each product SKU is treated as a unique inventory entity.
// ==============================================================================

import { assessGhostInventoryRisk, type GhostInventoryRiskAssessment } from './ghostInventoryShieldEngine.ts';

export interface AuditedProductSkuItem {
  skuId: string;
  skuCode: string;
  variantTitle: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  barcode?: string;
  isFullExempt: boolean;
  sizeDemandWeight: number; // Percent of Brazilian D2C fashion demand
  estimatedWastedAdSpendDay: number;
  manufacturingType: 'FABRICACAO_PROPRIA' | 'REVENDA';
  operationalAction: string;
}

export interface AuditedProductWithSkus {
  id: string;
  title: string;
  handle: string;
  url: string;
  productType: string;
  tags: string[];
  images: string[];
  totalSkusCount: number;
  activeSkusCount: number;
  rupturedSkusCount: number;
  skus: AuditedProductSkuItem[];
  criticalBleedBrlDay: number;
  criticalBleedBrlMonth: number;
  healthScore: number;
  manufacturingCategory: 'FABRICACAO_PROPRIA' | 'REVENDA';
  ghostInventoryRisk?: GhostInventoryRiskAssessment;
}

export interface DeepCatalogAuditSummary {
  totalProductsAudited: number;
  totalSkusAudited: number;
  totalInStockSkus: number;
  totalRupturedSkus: number;
  totalFullExemptSkus: number;
  globalCatalogHealthScore: number;
  totalMonthlyBleedBrl: number;
  criticalProducts: AuditedProductWithSkus[];
  allProducts: AuditedProductWithSkus[];
}

// 🇧🇷 Brazilian Fashion & Apparel Demand Weights (CoALA Market Calibrated)
const APPAREL_SIZE_WEIGHTS: Record<string, number> = {
  'PP': 5,
  'P': 15,
  'M': 25,
  'G': 30,
  'GG': 18,
  'XG': 18,
  'G1': 5,
  'G2': 2,
  'G3': 1,
  // Footwear & Pants Numbers
  '36': 8,
  '37': 12,
  '38': 22,
  '40': 28,
  '42': 22,
  '44': 8,
  'ÚNICO': 10,
  'UNICO': 10
};

/**
 * 🏭 Detects manufacturing classification for an individual SKU and product
 */
function classifyManufacturing(title: string, skuCode: string, tags: string[], productType: string): 'FABRICACAO_PROPRIA' | 'REVENDA' {
  const upper = `${title} ${skuCode} ${productType} ${tags.join(' ')}`.toUpperCase();

  const isResale = 
    upper.includes('BOTÃO') || 
    upper.includes('BOTAO') ||
    upper.includes('SOCIAL') ||
    upper.includes('BOTINA') ||
    upper.includes('BOTA') ||
    upper.includes('CALÇADO') ||
    upper.includes('CALCADO') ||
    upper.includes('BONÉ') ||
    upper.includes('BONE') ||
    upper.includes('BANDANA') ||
    upper.includes('MANGUITO') ||
    upper.includes('ÓCULOS') ||
    upper.includes('OCULOS') ||
    upper.includes('REVENDA') ||
    upper.includes('WORK') ||
    upper.includes('SAFARI') ||
    upper.includes('ALGODÃO') ||
    upper.includes('ALGODAO') ||
    upper.includes('CASUAL') ||
    upper.includes('ENVIO IMEDIATO') ||
    upper.includes('PRONTA ENTREGA') ||
    skuCode.startsWith('APC') ||
    skuCode.startsWith('CMB') ||
    skuCode.startsWith('CBT') ||
    skuCode.startsWith('BT') ||
    skuCode.startsWith('OC') ||
    /^\d{13}$/.test(skuCode);

  return isResale ? 'REVENDA' : 'FABRICACAO_PROPRIA';
}

/**
 * 🔬 Audits a single product by dissecting each of its individual SKUs / variants
 */
export function auditProductDeepSkus(
  product: any, 
  storeDomainOrOptions: string | { storeDomain?: string; dailyAdSpend?: number; isAdRunning?: boolean; operationMode?: string } = '', 
  dailyAdSpend: number = 250
): AuditedProductWithSkus {
  const storeDomain = typeof storeDomainOrOptions === 'string' 
    ? storeDomainOrOptions 
    : (storeDomainOrOptions?.storeDomain || '');
  const effectiveAdSpend = typeof storeDomainOrOptions === 'object' && storeDomainOrOptions?.dailyAdSpend !== undefined
    ? storeDomainOrOptions.dailyAdSpend
    : dailyAdSpend;
  const isAdConfirmedRunning = typeof storeDomainOrOptions === 'object' && storeDomainOrOptions?.isAdRunning !== undefined
    ? storeDomainOrOptions.isAdRunning
    : false; // NUNCA presumir true sem comprovação fática
  const operationMode = typeof storeDomainOrOptions === 'object' ? storeDomainOrOptions.operationMode : undefined;

  const title = product.title || 'Produto sem Título';
  const handle = product.handle || '';
  const cleanDomain = String(storeDomain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const url = product.url || (cleanDomain ? `https://${cleanDomain}/products/${handle}` : `/products/${handle}`);
  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  const tags: string[] = Array.isArray(product.tags) ? product.tags : [];
  const productType = product.product_type || product.productType || '';

  const isProductLevelFull = 
    title.toUpperCase().includes('FULL') || 
    handle.toUpperCase().includes('FULL') ||
    tags.some(t => t.toUpperCase().includes('FULL'));

  const manufacturingType = classifyManufacturing(title, rawVariants[0]?.sku || '', tags, productType);

  let totalSkus = 0;
  let activeSkus = 0;
  let rupturedSkus = 0;
  let productDailyBleed = 0;

  const auditedSkus: AuditedProductSkuItem[] = rawVariants.map((v: any) => {
    totalSkus++;
    const variantTitle = String(v.title || '').trim() || 'Padrão';
    const skuCode = String(v.sku || '').trim() || `SKU-${v.id || totalSkus}`;
    const price = typeof v.price === 'string' ? parseFloat(v.price) || 169.90 : v.price || 169.90;
    const compareAtPrice = v.compare_at_price ? parseFloat(String(v.compare_at_price)) : undefined;
    const available = Boolean(v.available);

    const isSkuLevelFull = isProductLevelFull || skuCode.toUpperCase().includes('FULL') || variantTitle.toUpperCase().includes('FULL');

    // Demand weight based on size
    const upperSize = variantTitle.toUpperCase();
    const demandWeight = APPAREL_SIZE_WEIGHTS[upperSize] !== undefined ? APPAREL_SIZE_WEIGHTS[upperSize] : 10;

    let wastedAdSpendDay = 0;
    let operationalAction = 'Estoque Saudável';

    if (available) {
      activeSkus++;
    } else {
      rupturedSkus++;
      if (isSkuLevelFull) {
        operationalAction = 'Estoque Fulfillment: Saldo gerenciado no CD Mercado Livre/Shopee Full.';
      } else {
        // Daily wasted ad spend proportioned by size importance with 2-decimal precision (se anúncio confirmado)
        wastedAdSpendDay = isAdConfirmedRunning 
          ? Number(((effectiveAdSpend * (demandWeight / 100)) * 0.85).toFixed(2))
          : 0;
        productDailyBleed = Number((productDailyBleed + wastedAdSpendDay).toFixed(2));

        if (manufacturingType === 'FABRICACAO_PROPRIA') {
          operationalAction = `Abrir Ordem de Produção (OP corte/sublimação) no Sankhya PCP para grade [${variantTitle}].`;
        } else {
          operationalAction = `Emitir Pedido de Compra (PO) urgente ao fornecedor homologado para reposição [${variantTitle}].`;
        }
      }
    }

    return {
      skuId: String(v.id || `var-${totalSkus}`),
      skuCode,
      variantTitle,
      price,
      compareAtPrice,
      available,
      barcode: v.barcode || '',
      isFullExempt: isSkuLevelFull,
      sizeDemandWeight: demandWeight,
      estimatedWastedAdSpendDay: wastedAdSpendDay,
      manufacturingType,
      operationalAction
    };
  });

  // Calculate Product Health Score (0-100)
  let healthScore = 100;
  if (totalSkus > 0) {
    const activePercent = (activeSkus / totalSkus) * 100;
    healthScore = Math.round(activePercent);
    // Extra penalty if middle high-demand sizes (M, G, GG) are missing
    const criticalMissing = auditedSkus.some(s => !s.available && !s.isFullExempt && (s.variantTitle === 'M' || s.variantTitle === 'G' || s.variantTitle === 'GG'));
    if (criticalMissing) {
      healthScore = Math.min(healthScore, 65);
    }
  }

  const ghostInventoryRisk = assessGhostInventoryRisk({
    product,
    operationMode,
    activeAdData: {
      isAdRunning: isAdConfirmedRunning,
      dailySpend: effectiveAdSpend
    }
  });

  return {
    id: String(product.id),
    title,
    handle,
    url,
    productType,
    tags,
    images: Array.isArray(product.images) ? product.images.map((img: any) => typeof img === 'string' ? img : img.src) : [],
    totalSkusCount: totalSkus,
    activeSkusCount: activeSkus,
    rupturedSkusCount: rupturedSkus,
    skus: auditedSkus,
    criticalBleedBrlDay: productDailyBleed,
    criticalBleedBrlMonth: Number((productDailyBleed * 30).toFixed(2)),
    healthScore,
    manufacturingCategory: manufacturingType,
    ghostInventoryRisk
  };
}

/**
 * 📦 Deep audit of the full catalog: Iterates exhaustively through every single product and SKU
 */
export function auditDeepCatalog(
  products: any[], 
  options: { storeDomain?: string; dailyAdSpend?: number; isAdRunning?: boolean; operationMode?: string } = {}
): DeepCatalogAuditSummary {
  const { storeDomain = 'loja.com.br', dailyAdSpend = 250, isAdRunning = false, operationMode } = options;

  let totalSkus = 0;
  let totalInStock = 0;
  let totalRuptured = 0;
  let totalFullExempt = 0;
  let totalMonthlyBleed = 0;

  const auditedProducts: AuditedProductWithSkus[] = products.map(p => {
    const audited = auditProductDeepSkus(p, options, dailyAdSpend);
    totalSkus += audited.totalSkusCount;
    totalInStock += audited.activeSkusCount;
    totalRuptured += audited.rupturedSkusCount;
    totalFullExempt += audited.skus.filter(s => s.isFullExempt).length;
    totalMonthlyBleed += audited.criticalBleedBrlMonth;
    return audited;
  });

  const criticalProducts = auditedProducts.filter(p => p.criticalBleedBrlDay > 0);

  const globalHealthScore = totalSkus > 0 ? Math.round((totalInStock / totalSkus) * 100) : 100;

  return {
    totalProductsAudited: products.length,
    totalSkusAudited: totalSkus,
    totalInStockSkus: totalInStock,
    totalRupturedSkus: totalRuptured,
    totalFullExemptSkus: totalFullExempt,
    globalCatalogHealthScore: Math.min(100, Math.max(30, globalHealthScore)),
    totalMonthlyBleedBrl: Number(totalMonthlyBleed.toFixed(2)),
    criticalProducts,
    allProducts: auditedProducts
  };
}
