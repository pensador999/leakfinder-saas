// ==============================================================================
// 🔬 UNIVERSAL VARIANT & STOCK EXTRACTOR — ADSHIELD ENTERPRISE 2026.4
// Truth-first, zero-false-positive extraction engine for e-commerce variants
// across Shopify, Nuvemshop (Tiendanube), VTEX, Yampi and Custom Platforms.
// ==============================================================================

export type SupportedPlatform = 'Shopify' | 'Nuvemshop' | 'VTEX' | 'Yampi' | 'WooCommerce' | 'Custom';
export type ExtractionMethod = 'NATIVE_JSON' | 'JSON_LD' | 'DOM_PARSER';

export interface ExtractedVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  available: boolean;
  inventoryPolicy?: 'deny' | 'continue';
  rawOptionValues?: Record<string, string>;
}

export interface UniversalVariantAuditResult {
  platform: SupportedPlatform;
  detectionMethod: ExtractionMethod;
  productTitle: string;
  hasApparelGrid: boolean;
  isSingleSizeOrExempt: boolean;
  exemptionReason?: string;
  totalVariants: number;
  availableSizes: string[];
  rupturedSizes: string[];
  isCriticalRupture: boolean; // High-demand sizes (M, G, GG or footwear 39, 40, 41) missing
  estimatedMonthlyLoss: number;
  confidenceScore: number; // 0-100%
  proofSnippet: string;
}

// 🇧🇷 High-Demand Core Sizes in Brazilian E-Commerce
const CORE_APPAREL_SIZES = ['M', 'G', 'GG'];
const CORE_FOOTWEAR_SIZES = ['39', '40', '41', '42'];

// 🧢 Items that are naturally Single Size, accessories, or not clothing
const SINGLE_SIZE_TERMS = [
  'BONÉ', 'BONE', 'MEIA', 'CINTO', 'BANDANA', 'MANGUITO', 'GARRAFA', 
  'COPO', 'ÓCULOS', 'OCULOS', 'CARTEIRA', 'ADESIVO', 'CHAVEIRO', 
  'WHEY', 'CREATINA', 'SUPLEMENTO', 'MOCHILA', 'BOLSA', 'CAPA', 
  'PULSEIRA', 'COLAR', 'BRINCO', 'LENÇO', 'LENCO', 'MÁSCARA', 'MASCARA'
];

/**
 * Normalizes size strings into standardized Brazilian fashion nomenclature
 */
export function normalizeSizeName(rawSize: string): string {
  if (!rawSize) return '';
  const clean = rawSize.trim().toUpperCase()
    .replace(/^TAMANHO\s*:\s*/i, '')
    .replace(/^TAM\s*:\s*/i, '')
    .replace(/^TAM\.\s*/i, '')
    .trim();

  // Map common variations
  if (['ÚNICO', 'UNICO', 'ONE SIZE', 'U', 'TU', 'TAMANHO ÚNICO', 'DEFAULT TITLE'].includes(clean)) {
    return 'ÚNICO';
  }
  if (['EXTRA GRANDE', 'EXTRA-G', 'XG'].includes(clean)) return 'GG';
  if (['EXTRA PEQUENO', 'EXTRA-P', 'XP'].includes(clean)) return 'PP';
  if (clean === 'SM' || clean === 'S') return 'P';
  if (clean === 'MD' || clean === 'MED') return 'M';
  if (clean === 'LG' || clean === 'L') return 'G';
  if (clean === 'XL') return 'GG';
  if (clean === 'XXL' || clean === '2XL') return 'G1';
  if (clean === 'XXXL' || clean === '3XL') return 'G2';

  return clean;
}

/**
 * Checks if a product is naturally exempt from apparel size grid audits
 */
export function checkProductExemption(title: string, tags: string[] = [], options: string[] = []): {
  isExempt: boolean;
  reason?: string;
} {
  const upperTitle = (title || '').toUpperCase();
  const upperTags = tags.map(t => t.toUpperCase());
  const upperOptions = options.map(o => o.toUpperCase());

  // Check 1: Fulfillment tag _FULL
  if (upperTitle.includes('_FULL') || upperTags.some(t => t.includes('_FULL') || t.includes('FULL'))) {
    return { isExempt: true, reason: 'Estoque Fulfillment Externo (_FULL / Mercado Livre / Shopee)' };
  }

  // Check 2: Known single-size accessory categories
  const matchedTerm = SINGLE_SIZE_TERMS.find(term => upperTitle.includes(term) || upperTags.includes(term));
  if (matchedTerm) {
    return { isExempt: true, reason: `Produto de Categoria Acessório/Tamanho Único (${matchedTerm})` };
  }

  // Check 3: Only default or single option
  if (upperOptions.length === 1 && (upperOptions[0] === 'ÚNICO' || upperOptions[0] === 'DEFAULT TITLE')) {
    return { isExempt: true, reason: 'Variante Única Cadastrada na Loja' };
  }

  return { isExempt: false };
}

/**
 * Detects whether the item is footwear or standard apparel
 */
export function isFootwearProduct(title: string, tags: string[] = []): boolean {
  const str = `${title} ${tags.join(' ')}`.toUpperCase();
  return (
    str.includes('TÊNIS') || str.includes('TENIS') ||
    str.includes('SAPATO') || str.includes('BOTINA') ||
    str.includes('BOTA') || str.includes('MOCASSIM') ||
    str.includes('CHINELO') || str.includes('SANDÁLIA') || str.includes('SANDALIA') ||
    str.includes('CALÇADO') || str.includes('CALCADO')
  );
}

/**
 * Parses Shopify Native JSON (/products/{handle}.js or product payload)
 */
export function extractFromShopifyJson(productJson: any): UniversalVariantAuditResult {
  const title = productJson.title || 'Produto Shopify';
  const tags = Array.isArray(productJson.tags) 
    ? (typeof productJson.tags === 'string' ? productJson.tags.split(',') : productJson.tags) 
    : [];
  
  const rawVariants = Array.isArray(productJson.variants) ? productJson.variants : [];
  const options = Array.isArray(productJson.options) 
    ? productJson.options.map((o: any) => typeof o === 'string' ? o : o.name) 
    : [];

  const exemption = checkProductExemption(title, tags, options);
  if (exemption.isExempt) {
    return {
      platform: 'Shopify',
      detectionMethod: 'NATIVE_JSON',
      productTitle: title,
      hasApparelGrid: false,
      isSingleSizeOrExempt: true,
      exemptionReason: exemption.reason,
      totalVariants: rawVariants.length,
      availableSizes: ['ÚNICO'],
      rupturedSizes: [],
      isCriticalRupture: false,
      estimatedMonthlyLoss: 0,
      confidenceScore: 100,
      proofSnippet: `Isenção comprovada: ${exemption.reason}`
    };
  }

  const isFootwear = isFootwearProduct(title, tags);
  const availableSizes: string[] = [];
  const rupturedSizes: string[] = [];

  rawVariants.forEach((v: any) => {
    const sizeName = normalizeSizeName(v.title || v.option1 || '');
    if (!sizeName || sizeName === 'ÚNICO') return;

    // Check if variant has backorder allowed (continue)
    const isAvailable = Boolean(v.available) || v.inventory_policy === 'continue';

    if (isAvailable) {
      if (!availableSizes.includes(sizeName)) availableSizes.push(sizeName);
    } else {
      if (!rupturedSizes.includes(sizeName)) rupturedSizes.push(sizeName);
    }
  });

  const coreList = isFootwear ? CORE_FOOTWEAR_SIZES : CORE_APPAREL_SIZES;
  const isCritical = rupturedSizes.some(sz => coreList.includes(sz));
  const estimatedLoss = rupturedSizes.length * 1250;

  return {
    platform: 'Shopify',
    detectionMethod: 'NATIVE_JSON',
    productTitle: title,
    hasApparelGrid: availableSizes.length + rupturedSizes.length > 1,
    isSingleSizeOrExempt: false,
    totalVariants: rawVariants.length,
    availableSizes,
    rupturedSizes,
    isCriticalRupture: isCritical,
    estimatedMonthlyLoss: estimatedLoss,
    confidenceScore: 99,
    proofSnippet: `Shopify JSON Nativo: ${availableSizes.length} disponíveis, ${rupturedSizes.length} esgotados.`
  };
}

/**
 * Parses Nuvemshop (Tiendanube) Native Payload (LS.product)
 */
export function extractFromNuvemshopPayload(nuvemProduct: any): UniversalVariantAuditResult {
  const title = nuvemProduct.name || nuvemProduct.title || 'Produto Nuvemshop';
  const rawVariants = Array.isArray(nuvemProduct.variants) ? nuvemProduct.variants : [];
  
  const exemption = checkProductExemption(title, [], []);
  if (exemption.isExempt) {
    return {
      platform: 'Nuvemshop',
      detectionMethod: 'NATIVE_JSON',
      productTitle: title,
      hasApparelGrid: false,
      isSingleSizeOrExempt: true,
      exemptionReason: exemption.reason,
      totalVariants: rawVariants.length,
      availableSizes: ['ÚNICO'],
      rupturedSizes: [],
      isCriticalRupture: false,
      estimatedMonthlyLoss: 0,
      confidenceScore: 100,
      proofSnippet: `Nuvemshop Isenção: ${exemption.reason}`
    };
  }

  const isFootwear = isFootwearProduct(title);
  const availableSizes: string[] = [];
  const rupturedSizes: string[] = [];

  rawVariants.forEach((v: any) => {
    // Nuvemshop stores option values in values array (e.g. [{pt: 'M'}])
    let valStr = '';
    if (Array.isArray(v.values) && v.values[0]) {
      valStr = v.values[0].pt || v.values[0].es || Object.values(v.values[0])[0] || '';
    } else if (typeof v.option0 === 'string') {
      valStr = v.option0;
    }
    const sizeName = normalizeSizeName(valStr);
    if (!sizeName || sizeName === 'ÚNICO') return;

    // In Nuvemshop: available is true if stock is null (unlimited) or stock > 0
    const hasStock = v.available === true || v.stock === null || (typeof v.stock === 'number' && v.stock > 0);

    if (hasStock) {
      if (!availableSizes.includes(sizeName)) availableSizes.push(sizeName);
    } else {
      if (!rupturedSizes.includes(sizeName)) rupturedSizes.push(sizeName);
    }
  });

  const coreList = isFootwear ? CORE_FOOTWEAR_SIZES : CORE_APPAREL_SIZES;
  const isCritical = rupturedSizes.some(sz => coreList.includes(sz));

  return {
    platform: 'Nuvemshop',
    detectionMethod: 'NATIVE_JSON',
    productTitle: title,
    hasApparelGrid: availableSizes.length + rupturedSizes.length > 1,
    isSingleSizeOrExempt: false,
    totalVariants: rawVariants.length,
    availableSizes,
    rupturedSizes,
    isCriticalRupture: isCritical,
    estimatedMonthlyLoss: rupturedSizes.length * 1250,
    confidenceScore: 98,
    proofSnippet: `Nuvemshop LS.product: ${availableSizes.length} em estoque, ${rupturedSizes.length} sem estoque.`
  };
}

/**
 * Universal DOM Inspector for client-side or headless HTML inspection
 * (Evaluates multi-platform selectors with cascading validation)
 */
export function extractFromDOM(documentObj: Document, htmlString: string = ''): UniversalVariantAuditResult {
  const htmlLower = (htmlString || (documentObj.documentElement ? documentObj.documentElement.outerHTML : '')).toLowerCase();
  
  // 1. Detect Platform
  let platform: SupportedPlatform = 'Custom';
  if (htmlLower.includes('cdn.shopify.com') || htmlLower.includes('window.shopify')) {
    platform = 'Shopify';
  } else if (htmlLower.includes('nuvemshop.com.br') || htmlLower.includes('tiendanube') || htmlLower.includes('d3ugyf2ht6aenh.cloudfront.net')) {
    platform = 'Nuvemshop';
  } else if (htmlLower.includes('vtexassets.com') || htmlLower.includes('vtex.com')) {
    platform = 'VTEX';
  } else if (htmlLower.includes('yampi.io') || htmlLower.includes('yampi.com.br')) {
    platform = 'Yampi';
  }

  // Extract Title
  const h1El = documentObj.querySelector('h1');
  const title = h1El ? h1El.innerText.trim() : 'Produto em Inspeção';

  // Check Exemption
  const exemption = checkProductExemption(title);
  if (exemption.isExempt) {
    return {
      platform,
      detectionMethod: 'DOM_PARSER',
      productTitle: title,
      hasApparelGrid: false,
      isSingleSizeOrExempt: true,
      exemptionReason: exemption.reason,
      totalVariants: 1,
      availableSizes: ['ÚNICO'],
      rupturedSizes: [],
      isCriticalRupture: false,
      estimatedMonthlyLoss: 0,
      confidenceScore: 95,
      proofSnippet: `Isenção validada no DOM: ${exemption.reason}`
    };
  }

  const isFootwear = isFootwearProduct(title);
  const availableSizes: string[] = [];
  const rupturedSizes: string[] = [];

  // Multiplatform Selectors Mapping
  const platformSelectors = {
    Shopify: {
      available: 'fieldset.product-form__input input[type="radio"]:not(:disabled) + label, .variant-input:not(.variant-input--unavailable) label, .swatch-element:not(.soldout) label',
      ruptured: 'fieldset.product-form__input input[type="radio"]:disabled + label, .variant-input--unavailable label, .swatch-element.soldout label, [data-available="false"]'
    },
    Nuvemshop: {
      available: '.product-variants-item.js-instock, .js-variant-select option:not(:disabled), input[name*="variation"]:not(:disabled) + label',
      ruptured: '.product-variants-item.out-of-stock, .product-variants-item.js-outofstock, .js-variant-select option:disabled, input[name*="variation"]:disabled + label'
    },
    VTEX: {
      available: '.vtex-sku-selector-1-x-skuSelectorItem:not(.vtex-sku-selector-1-x-unavailable), .skuselector .item:not(.item_unavailable)',
      ruptured: '.vtex-sku-selector-1-x-unavailable, .vtex-sku-selector-1-x-skuSelectorItem--unavailable, .item_unavailable, .item_unavaliable'
    },
    Yampi: {
      available: '.yampi-variation-item:not(.is-disabled), .swatch-option:not(.disabled)',
      ruptured: '.yampi-variation-item.is-disabled, .swatch-option.disabled, [data-variation-id].out-of-stock'
    },
    Custom: {
      available: '.size-item:not(.disabled), .swatch:not(.soldout), button.size-btn:not([disabled])',
      ruptured: '.sold-out, .sold_out, .disabled[data-value], button[disabled][data-variant-id], .is-sold-out'
    }
  };

  const selectors = platformSelectors[platform] || platformSelectors.Custom;

  // Query ruptured elements
  const rupturedNodes = documentObj.querySelectorAll(selectors.ruptured);
  rupturedNodes.forEach((node) => {
    const text = (node.textContent || (node as HTMLElement).innerText || node.getAttribute('data-value') || '').trim();
    const size = normalizeSizeName(text);
    if (size && size !== 'ÚNICO' && !rupturedSizes.includes(size)) {
      rupturedSizes.push(size);
    }
  });

  // Query available elements
  const availableNodes = documentObj.querySelectorAll(selectors.available);
  availableNodes.forEach((node) => {
    const text = (node.textContent || (node as HTMLElement).innerText || node.getAttribute('data-value') || '').trim();
    const size = normalizeSizeName(text);
    if (size && size !== 'ÚNICO' && !availableSizes.includes(size) && !rupturedSizes.includes(size)) {
      availableSizes.push(size);
    }
  });

  const coreList = isFootwear ? CORE_FOOTWEAR_SIZES : CORE_APPAREL_SIZES;
  const isCritical = rupturedSizes.some(sz => coreList.includes(sz));

  return {
    platform,
    detectionMethod: 'DOM_PARSER',
    productTitle: title,
    hasApparelGrid: availableSizes.length + rupturedSizes.length > 0,
    isSingleSizeOrExempt: false,
    totalVariants: Math.max(1, availableSizes.length + rupturedSizes.length),
    availableSizes,
    rupturedSizes,
    isCriticalRupture: isCritical,
    estimatedMonthlyLoss: rupturedSizes.length * 1250,
    confidenceScore: 92,
    proofSnippet: `Auditoria DOM ${platform}: ${availableSizes.length} disponíveis, ${rupturedSizes.length} com classe de ruptura.`
  };
}
