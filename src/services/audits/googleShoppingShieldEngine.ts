// ==============================================================================
// 🛍️ GOOGLE SHOPPING SHIELD & SCHEMA DISCREPANCY ENGINE — ADSHIELD 2026.4
// Identifica divergências silenciosas entre o Schema.org (Google Merchant Center)
// e o Front-End da loja (ex: Nuvemshop marcando OutOfStock para produtos Sob Encomenda,
// ou sitemaps Tray contendo produtos descontinuados a R$ 0,00 recebendo lances).
// ==============================================================================

import { parseBRLPrice } from '../pricing/currencyUtils.ts';

export interface SchemaDiscrepancyItem {
  productTitle: string;
  productUrl: string;
  price: number;
  schemaAvailability: 'OutOfStock' | 'InStock' | 'PreOrder' | 'Discontinued' | 'Unknown';
  frontEndState: 'BUTTON_ACTIVE' | 'BACKORDER_ORDERABLE' | 'BUTTON_DISABLED' | 'UNKNOWN';
  discrepancyType: 
    | 'SCHEMA_OUT_OF_STOCK_BUT_ACTIVE'       // O caso 7M Boots (Nuvemshop)
    | 'SITEMAP_DEAD_URL_RECEIVING_BIDS'      // O caso Texas Center (Tray)
    | 'PRICE_ZERO_INDEXATION_ANOMALY'        // Preço R$ 0,00 no sitemap
    | 'MISSING_SCHEMA_OFFERS';
  estimatedMonthlyAdWaste: number;
  severity: 'CRITICA' | 'ALTA' | 'MODERADA';
  explanation: string;
  technicalRemediation: string;
}

export interface GoogleShoppingShieldSummary {
  totalProductsAudited: number;
  discrepantProductsCount: number;
  deadSitemapUrlsCount: number;
  totalMonthlyWasteGoogleShoppingBRL: number;
  googleMerchantHealthScore: number; // 0-100
  items: SchemaDiscrepancyItem[];
  outboundPitchCopy: string;
}

/**
 * Avalia o HTML ou dados estruturados de um produto em busca de discrepâncias
 * prejudiciais ao Google Merchant Center e Google Shopping.
 */
export function evaluateGoogleShoppingDiscrepancy(
  product: {
    title: string;
    url: string;
    price?: number | string;
    htmlText?: string;
    schemaAvailability?: string;
    isOutOfStockInDom?: boolean;
    hasBuyButtonInDom?: boolean;
    isPreOrderOrBackorder?: boolean;
  }
): SchemaDiscrepancyItem | null {
  const html = (product.htmlText || '').toLowerCase();
  const numPrice = parseBRLPrice(product.price);

  // 1. Detecção de Preço Zerado (Anomalia de Indexação)
  if (numPrice === 0 || html.includes('"price": "0"') || html.includes('"price": "0.00"')) {
    return {
      productTitle: product.title,
      productUrl: product.url,
      price: 0,
      schemaAvailability: 'OutOfStock',
      frontEndState: 'BUTTON_DISABLED',
      discrepancyType: 'PRICE_ZERO_INDEXATION_ANOMALY',
      estimatedMonthlyAdWaste: 850,
      severity: 'ALTA',
      explanation: 'Produto indexado no sitemap com preço R$ 0,00 ou sem valor. Gera reprovação automática no Google Merchant Center ou atrai cliques inválidos.',
      technicalRemediation: 'Remover o produto descontinuado do sitemap.xml ou configurar tag <meta name="robots" content="noindex">.'
    };
  }

  // 2. Extração de Schema.org Availability
  let schemaAvailability: SchemaDiscrepancyItem['schemaAvailability'] = 'Unknown';
  if (product.schemaAvailability) {
    if (product.schemaAvailability.includes('OutOfStock')) schemaAvailability = 'OutOfStock';
    else if (product.schemaAvailability.includes('InStock')) schemaAvailability = 'InStock';
    else if (product.schemaAvailability.includes('PreOrder')) schemaAvailability = 'PreOrder';
  } else if (html.includes('schema.org/outofstock') || html.includes('"availability":"https://schema.org/outofstock"')) {
    schemaAvailability = 'OutOfStock';
  } else if (html.includes('schema.org/instock') || html.includes('"availability":"https://schema.org/instock"')) {
    schemaAvailability = 'InStock';
  }

  // 3. Detecção de Botão de Compra / Encomenda no Front-end (Multi-Market PT/EN/DE/FR/ES)
  const hasBuyButton = product.hasBuyButtonInDom ?? (
    html.includes('comprar') || 
    html.includes('adicionar') || 
    html.includes('add to cart') ||
    html.includes('add to bag') ||
    html.includes('buy now') ||
    html.includes('in den warenkorb') ||
    html.includes('ajouter au panier') ||
    html.includes('añadir al carrito') ||
    html.includes('btn-add-cart') || 
    html.includes('js-prod-submit-form')
  );

  const isOrderable = product.isPreOrderOrBackorder || 
                      html.includes('sob encomenda') || 
                      html.includes('pronta entrega vs sob encomenda') || 
                      html.includes('produção sob demanda') ||
                      html.includes('pre-order') ||
                      html.includes('preorder') ||
                      html.includes('backorder') ||
                      html.includes('made to order') ||
                      html.includes('vorbestellen') ||
                      html.includes('précommande') ||
                      html.includes('bajo pedido');

  // 🔥 O Caso 7M Boots: Schema declara OutOfStock, mas a loja vende sob encomenda ou com botão ativo
  if (schemaAvailability === 'OutOfStock' && (hasBuyButton || isOrderable)) {
    return {
      productTitle: product.title,
      productUrl: product.url,
      price: numPrice,
      schemaAvailability: 'OutOfStock',
      frontEndState: isOrderable ? 'BACKORDER_ORDERABLE' : 'BUTTON_ACTIVE',
      discrepancyType: 'SCHEMA_OUT_OF_STOCK_BUT_ACTIVE',
      estimatedMonthlyAdWaste: Math.max(1200, Math.round(numPrice * 8)),
      severity: 'CRITICA',
      explanation: 'A loja vende o item (sob encomenda/ativo), mas o Schema.org declara "OutOfStock". O algoritmo do Google Merchant Center reduz lances e penaliza a entrega no Google Shopping.',
      technicalRemediation: 'Ajustar o microdado da plataforma (Nuvemshop/Liquid) de https://schema.org/OutOfStock para https://schema.org/PreOrder ou https://schema.org/InStock com prazo de manipulação declarado.'
    };
  }

  // 4. Detecção de Produto Esgotado no DOM mas indexado no Feed / Sitemap do Google Shopping
  if (product.isOutOfStockInDom && !hasBuyButton) {
    return {
      productTitle: product.title,
      productUrl: product.url,
      price: numPrice,
      schemaAvailability: schemaAvailability === 'Unknown' ? 'OutOfStock' : schemaAvailability,
      frontEndState: 'BUTTON_DISABLED',
      discrepancyType: 'SITEMAP_DEAD_URL_RECEIVING_BIDS',
      estimatedMonthlyAdWaste: Math.max(950, Math.round(numPrice * 6)),
      severity: 'ALTA',
      explanation: 'Produto esgotado no site (sem botão de compra), mas ativo no Google Shopping / Merchant Center gerando cliques perdidos.',
      technicalRemediation: 'Pausar o item no Google Merchant Center ou remover o URL do sitemap do feed do Google Shopping.'
    };
  }

  return null;
}

/**
 * Consolida a auditoria do Google Shopping Shield para múltiplos produtos
 */
export function auditGoogleShoppingShield(
  products: Array<{
    title: string;
    url: string;
    price?: number | string;
    htmlText?: string;
    schemaAvailability?: string;
    isOutOfStockInDom?: boolean;
    hasBuyButtonInDom?: boolean;
  }>
): GoogleShoppingShieldSummary {
  const items: SchemaDiscrepancyItem[] = [];
  let deadSitemapUrlsCount = 0;

  for (const p of products) {
    const issue = evaluateGoogleShoppingDiscrepancy(p);
    if (issue) {
      items.push(issue);
      if (issue.discrepancyType === 'SITEMAP_DEAD_URL_RECEIVING_BIDS' || issue.discrepancyType === 'PRICE_ZERO_INDEXATION_ANOMALY') {
        deadSitemapUrlsCount++;
      }
    }
  }

  const totalWaste = items.reduce((acc, curr) => acc + curr.estimatedMonthlyAdWaste, 0);
  const healthScore = Math.max(20, Math.min(100, Math.round(100 - (items.length * 12))));

  let outboundPitchCopy = '';
  if (items.length > 0) {
    const primary = items[0];
    outboundPitchCopy = `Notamos que o produto "${primary.productTitle}" (${primary.productUrl}) está ativo na loja, mas o Schema.org informa "OutOfStock" aos robôs de busca. Isso está derrubando a entrega dos anúncios de vocês no Google Shopping e Performance Max.`;
  }

  return {
    totalProductsAudited: products.length,
    discrepantProductsCount: items.length,
    deadSitemapUrlsCount,
    totalMonthlyWasteGoogleShoppingBRL: totalWaste,
    googleMerchantHealthScore: healthScore,
    items,
    outboundPitchCopy
  };
}
