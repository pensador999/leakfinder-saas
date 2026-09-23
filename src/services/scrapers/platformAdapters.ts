// ==============================================================================
// 🌐 ADSHIELD MULTI-CMS SCRAPER & PLATFORM ADAPTER ENGINE 2026.4
// Truth-first catalog discovery for Shopify, Tray Commerce, Nuvemshop,
// VTEX, WooCommerce, Loja Integrada, Yampi and Enterprise platforms.
// ==============================================================================

import type { EcommercePlatformType } from '../siteInspector';
import { parseBRLPrice } from '../pricing/currencyUtils.ts';

export interface DiscoveredProductItem {
  id: string;
  title: string;
  url: string;
  handle: string;
  price: number;
  imageSrc?: string;
  platform: EcommercePlatformType;
  schemaAvailability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Unknown';
  rawHtmlSnippet?: string;
  isOutOfStockInDom?: boolean;
}

/**
 * Identifica a plataforma de e-commerce com base em assinaturas nos headers e HTML
 */
export function detectEcommercePlatform(html: string, url: string = ''): EcommercePlatformType {
  const h = (html || '').toLowerCase();
  const u = (url || '').toLowerCase();

  if (h.includes('cdn.shopify.com') || h.includes('shopify.theme') || h.includes('window.shopify') || h.includes('/products.json')) {
    return 'Shopify';
  }
  if (h.includes('tray.com.br') || h.includes('traycdn.com.br') || h.includes('data-tray-tst') || h.includes('/loja/arquivos/') || h.includes('loadnextvariantdropdown')) {
    return 'Tray';
  }
  if (h.includes('nuvemshop.com.br') || h.includes('tiendanube') || h.includes('d3ugyf2ht6aenh.cloudfront.net') || h.includes('js-product-out-of-stock')) {
    return 'Nuvemshop';
  }
  if (h.includes('vtexassets.com') || h.includes('vtex.com') || h.includes('vteximg.com.br') || h.includes('vtex-commerce')) {
    return 'VTEX';
  }
  if (h.includes('wp-content') || h.includes('woocommerce') || h.includes('wc-api')) {
    return 'WooCommerce';
  }
  if (h.includes('lojadaintegrada') || h.includes('cdn.awsli.com.br')) {
    return 'Loja Integrada' as EcommercePlatformType;
  }
  if (h.includes('yampi.io') || h.includes('yampi.com.br')) {
    return 'Enterprise / Custom';
  }

  // Domain based heuristics
  if (u.includes('myshopify.com')) return 'Shopify';
  if (u.includes('lojavirtualnuvem.com.br')) return 'Nuvemshop';

  return 'Enterprise / Custom';
}

/**
 * Extrai URLs de produtos a partir de um sitemap XML (como sitemap.xml ou sitemap_1.xml)
 */
export function extractUrlsFromXmlSitemap(xmlContent: string): string[] {
  if (!xmlContent) return [];
  const matches = xmlContent.match(/<loc>(https?:\/\/[^<]+)<\/loc>/gi) || [];
  return matches
    .map(m => m.replace(/<\/?loc>/gi, '').trim())
    .filter(link => {
      const lower = link.toLowerCase();
      // Excluir URLs institucionais e páginas genéricas
      return !lower.includes('/pagina/') && 
             !lower.includes('/marca/') && 
             !lower.includes('/blog/') && 
             !lower.includes('/tag/') && 
             !lower.includes('/institucional/') &&
             !lower.includes('/atendimento/') &&
             !lower.includes('/politica') &&
             !lower.endsWith('.xml');
    });
}

/**
 * Parser Universal de Schema.org JSON-LD para produtos
 */
export function parseProductJsonLd(html: string): {
  title?: string;
  price?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  sku?: string;
  image?: string;
} {
  const results: any = {};
  if (!html) return results;

  const scriptMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];

  for (const scriptTag of scriptMatches) {
    const rawJson = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '').trim();
    try {
      const parsed = JSON.parse(rawJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const obj of items) {
        if (obj['@type'] === 'Product' || (Array.isArray(obj['@type']) && obj['@type'].includes('Product'))) {
          if (obj.name && !results.title) results.title = obj.name;
          if (obj.image && !results.image) {
            results.image = Array.isArray(obj.image) ? obj.image[0] : (typeof obj.image === 'object' ? obj.image.url : obj.image);
          }
          if (obj.sku && !results.sku) results.sku = obj.sku;

          // Offers
          const offers = obj.offers;
          if (offers) {
            const offerObj = Array.isArray(offers) ? offers[0] : offers;
            if (offerObj.price && !results.price) {
              results.price = parseBRLPrice(offerObj.price);
            }
            if (offerObj.availability) {
              const av = String(offerObj.availability).toLowerCase();
              if (av.includes('outofstock')) results.availability = 'OutOfStock';
              else if (av.includes('instock')) results.availability = 'InStock';
              else if (av.includes('preorder')) results.availability = 'PreOrder';
            }
          }
          return results;
        }
      }
    } catch {
      // JSON-LD malformado é ignorado com segurança
    }
  }

  return results;
}

/**
 * Extrai dados essenciais de uma página de produto da Tray Commerce a partir do HTML
 */
export function parseTrayProductHtml(html: string, url: string): DiscoveredProductItem {
  const schema = parseProductJsonLd(html);
  
  // Title fallback
  let title = schema.title || '';
  if (!title) {
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
    title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Produto Tray';
  }

  // Price fallback
  let price = schema.price || 0;
  if (!price) {
    const priceMatch = html.match(/class="preco-destaque"[^>]*>([\s\S]*?)<\/strong>/i) || 
                       html.match(/R\$\s*([\d\.,]+)/);
    if (priceMatch) {
      price = parseBRLPrice(priceMatch[1]);
    }
  }

  // Out of Stock detection
  const isOutOfStockInDom = html.includes('Produto Indisponível') || 
                           html.includes('produto-esgotado') || 
                           html.includes('avise-me') || 
                           schema.availability === 'OutOfStock';

  const handle = url.split('/').filter(Boolean).pop() || '';

  return {
    id: `tray-${handle}`,
    title,
    url,
    handle,
    price,
    platform: 'Tray',
    schemaAvailability: schema.availability || (isOutOfStockInDom ? 'OutOfStock' : 'InStock'),
    isOutOfStockInDom,
    rawHtmlSnippet: html.slice(0, 500)
  };
}

/**
 * Extrai dados essenciais de uma página de produto da Nuvemshop a partir do HTML
 */
export function parseNuvemshopProductHtml(html: string, url: string): DiscoveredProductItem {
  const schema = parseProductJsonLd(html);

  let title = schema.title || '';
  if (!title) {
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
    title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Produto Nuvemshop';
  }

  let price = schema.price || 0;
  if (!price) {
    const priceMatch = html.match(/class="[^"]*js-price-display[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                       html.match(/R\$\s*([\d\.,]+)/);
    if (priceMatch) {
      price = parseBRLPrice(priceMatch[1]);
    }
  }

  const isOutOfStockInDom = html.includes('js-product-out-of-stock') || 
                           html.includes('Sem estoque') || 
                           html.includes('Não temos estoque deste produto') ||
                           schema.availability === 'OutOfStock';

  const handle = url.split('/produtos/')[1]?.replace(/\/$/, '') || url.split('/').filter(Boolean).pop() || '';

  return {
    id: `nuvem-${handle}`,
    title,
    url,
    handle,
    price,
    platform: 'Nuvemshop',
    schemaAvailability: schema.availability || (isOutOfStockInDom ? 'OutOfStock' : 'InStock'),
    isOutOfStockInDom,
    rawHtmlSnippet: html.slice(0, 500)
  };
}

/**
 * Extrai coleções / categorias a partir de links de navegação do HTML
 */
export function extractNavigationCollectionsFromHtml(html: string, baseUrl: string): { title: string; url: string; handle: string }[] {
  if (!html) return [];
  const cleanBase = baseUrl.replace(/\/$/, '');
  const linkMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
  const results: { title: string; url: string; handle: string }[] = [];
  const seenUrls = new Set<string>();

  for (const aTag of linkMatches) {
    const hrefMatch = aTag.match(/href=["']([^"']+)["']/i);
    const textMatch = aTag.match(/>([^<]+)</);
    if (!hrefMatch || !textMatch) continue;

    const rawHref = hrefMatch[1].trim();
    const title = textMatch[1].trim();

    if (!title || title.length < 3 || title.length > 40) continue;

    const isCategory = 
      rawHref.includes('/collections/') || 
      rawHref.includes('/categoria/') || 
      rawHref.includes('/departamento/') || 
      rawHref.includes('/produtos/') ||
      rawHref.includes('/c/');

    if (isCategory && !rawHref.includes('#') && !rawHref.includes('javascript:')) {
      let fullUrl = rawHref;
      if (rawHref.startsWith('/')) {
        fullUrl = `${cleanBase}${rawHref}`;
      } else if (!rawHref.startsWith('http')) {
        fullUrl = `${cleanBase}/${rawHref}`;
      }

      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        const handle = fullUrl.split('/').filter(Boolean).pop()?.split('?')[0] || '';
        results.push({ title, url: fullUrl, handle });
      }
    }
  }

  return results.slice(0, 20); // Top 20 coleções principais
}

/**
 * Parser para produtos VTEX retornados pela VTEX Search API
 */
export function parseVtexSearchProductItem(vtexItem: any, baseUrl: string): DiscoveredProductItem {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const item = vtexItem.items && vtexItem.items[0];
  const seller = item?.sellers && item.sellers[0];
  const commOffer = seller?.commertialOffer;

  const price = commOffer?.Price || 0;
  const isAvailable = (commOffer?.AvailableQuantity || 0) > 0;
  const linkText = vtexItem.linkText || vtexItem.productReference || String(vtexItem.productId);
  const fullUrl = vtexItem.link ? vtexItem.link : `${cleanBase}/${linkText}/p`;

  return {
    id: `vtex-${vtexItem.productId || linkText}`,
    title: vtexItem.productName || 'Produto VTEX',
    url: fullUrl,
    handle: linkText,
    price,
    platform: 'VTEX',
    imageSrc: item?.images && item.images[0]?.imageUrl,
    schemaAvailability: isAvailable ? 'InStock' : 'OutOfStock',
    isOutOfStockInDom: !isAvailable
  };
}

/**
 * Parser para produtos WooCommerce
 */
export function parseWooCommerceProductHtml(html: string, url: string): DiscoveredProductItem {
  const schema = parseProductJsonLd(html);
  let title = schema.title || '';
  if (!title) {
    const titleMatch = html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                       html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Produto WooCommerce';
  }

  let price = schema.price || 0;
  if (!price) {
    const priceMatch = html.match(/<bdi>.*?([\d\.,]+)<\/bdi>/i) || html.match(/class="woocommerce-Price-amount[^>]*>([\s\S]*?)<\/span>/i);
    if (priceMatch) {
      price = parseBRLPrice(priceMatch[1]);
    }
  }

  const isOutOfStock = html.includes('out-of-stock') || html.includes('fora-de-estoque') || schema.availability === 'OutOfStock';
  const handle = url.split('/produto/')[1]?.replace(/\/$/, '') || url.split('/').filter(Boolean).pop() || '';

  return {
    id: `woo-${handle}`,
    title,
    url,
    handle,
    price,
    platform: 'WooCommerce',
    schemaAvailability: isOutOfStock ? 'OutOfStock' : 'InStock',
    isOutOfStockInDom: isOutOfStock,
    rawHtmlSnippet: html.slice(0, 500)
  };
}

