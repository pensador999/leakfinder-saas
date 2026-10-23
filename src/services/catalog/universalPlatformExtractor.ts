// ==============================================================================
// 🌐 UNIVERSAL SSR / DOM MULTI-PLATFORM CATALOG EXTRACTOR — ADSHIELD 2026.4
// Extrator Determinístico Local-First para Nuvemshop, Tray, Wake/Fbits,
// WooCommerce, VTEX e Schema.org (ProductGroup / Multi-Offer JSON-LD).
// ==============================================================================

import { auditDeepCatalog, type DeepCatalogAuditSummary } from './deepSkuAuditEngine.ts';
import type { CatalogProductIssue } from '../siteInspector.ts';
import { parseBRLPrice } from '../pricing/currencyUtils.ts';

export type DetectedBrazilianPlatform =
  | 'NUVEMSHOP'
  | 'TRAY'
  | 'WAKE_FBITS'
  | 'WOOCOMMERCE'
  | 'VTEX_NEXT'
  | 'SCHEMA_MULTI_OFFER'
  | 'DOM_CARDS';

export interface NormalizedPlatformVariant {
  id: string;
  sku: string;
  title: string;
  option1?: string;
  price: number;
  compare_at_price?: number;
  available: boolean;
  inventory_quantity?: number;
  inventory_policy?: 'deny' | 'continue';
  inventory_management?: string | null;
}

export interface NormalizedPlatformProduct {
  id: string;
  title: string;
  handle: string;
  url: string;
  product_type: string;
  tags: string[];
  body_html: string;
  images: Array<{ src: string; width?: number; height?: number }>;
  variants: NormalizedPlatformVariant[];
  sourcePlatform: DetectedBrazilianPlatform;
}

const PERIPHERAL_SIZES = new Set([
  'PP', 'XG', 'EG', 'XGG', 'G1', 'G2', 'G3', 'G4',
  'XXS', 'XS', 'XXL', '2XL', '3XL', '4XL', 'UK 6', 'UK 16',
  '33', '34', '35', '45', '46', '48', '50', '52', '54',
  '3', '3.5', '4', '4.5', '5', '5.5', '12', '12.5', '13', '14',
  'ARQUIVO (ESGOTADO)'
]);

const KNOWN_SIZE_TOKENS = new Set([
  'PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'XGG', 'G1', 'G2', 'G3', 'G4',
  'XXS', 'XS', 'S', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL',
  'UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16',
  '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '48', '50',
  '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14',
  '300G', '450G', '500G', '900G', '1KG', '2KG', '30ML', '50ML', '100ML', '200ML',
  'ÚNICO', 'UNICO', 'TAMANHO ÚNICO', 'ONE SIZE', 'OS'
]);

function decodeHtmlEntities(raw: string): string {
  return raw
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeSizeToken(raw: string): string {
  const cleaned = String(raw || '')
    .trim()
    .replace(/^(tamanho|tam|size|op[cç][aã]o|peso|volume)\s*[:\-]?\s*/i, '')
    .trim()
    .toUpperCase();
  if (!cleaned) return 'ÚNICO';

  // Extract exact size token if embedded in a title like "Camiseta Preta - M" or "Preto / G"
  const parts = cleaned.split(/[\s\/\-|(),]+/).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const token = parts[i].toUpperCase();
    if (KNOWN_SIZE_TOKENS.has(token)) {
      return token;
    }
  }
  return cleaned;
}

function slugifyHandle(input: string): string {
  return String(input || 'produto')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'produto';
}

function resolveFullUrl(rawUrl: string, domain: string, fallbackUrl: string): string {
  if (!rawUrl) return fallbackUrl;
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  const cleanDom = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  return `https://${cleanDom}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

/**
 * 🔍 Extrai produtos e variantes reais de lojas Nuvemshop, Tray, Wake/Fbits,
 * WooCommerce, VTEX/Next.js e Schema.org Multi-Offer JSON-LD.
 */
export function extractUniversalPlatformProducts(
  htmlText: string,
  doc: Document | undefined,
  domain: string,
  brandName: string,
  cleanUrl: string
): NormalizedPlatformProduct[] {
  const results: NormalizedPlatformProduct[] = [];
  const seenProductKeys = new Set<string>();

  if (!htmlText && !doc) return results;

  const pageTitle =
    doc?.querySelector('h1')?.textContent?.trim() ||
    doc?.querySelector('title')?.textContent?.split('|')[0]?.split('-')[0]?.trim() ||
    `${brandName} Produto Oficial`;

  const pageImage =
    doc?.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc?.querySelector('img[src*="cdn"], img[src*="nuvem"], img[src*="tray"], img[src*="wp-content"]')?.getAttribute('src') ||
    '';

  const pageDesc =
    doc?.querySelector('.product-description, .descricao-produto, #tab-description, [itemprop="description"]')?.textContent?.trim() ||
    doc?.querySelector('meta[name="description"]')?.getAttribute('content') ||
    '';

  // ============================================================================
  // 1. NUVEMSHOP SSR HYDRATION (LS.variants & data-variants)
  // ============================================================================
  try {
    const lsVariantsMatch = htmlText.match(/LS\.variants\s*=\s*(\[[\s\S]*?\]);/i);
    if (lsVariantsMatch?.[1]) {
      const parsedVariants = JSON.parse(lsVariantsMatch[1]);
      if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
        const variants: NormalizedPlatformVariant[] = parsedVariants.map((v: any, idx: number) => {
          const sizeOpt = v.option0 || v.option1 || (Array.isArray(v.values) ? v.values[0] : '') || v.title || `VAR-${idx + 1}`;
          const sizeLabel = normalizeSizeToken(sizeOpt);
          const stockNum = v.stock !== null && v.stock !== undefined ? Number(v.stock) : undefined;
          const isAvail = Boolean(v.available !== false && (stockNum === undefined || stockNum > 0));
          const priceVal = Number(v.price_number || parseBRLPrice(v.price_short || v.price || 159.9));
          const compareVal = Number(v.compare_at_price_number || parseBRLPrice(v.compare_at_price_short || 0));

          return {
            id: String(v.id || `nuvem-var-${idx}`),
            sku: String(v.sku || `${brandName}-NUV-${sizeLabel}`),
            title: sizeLabel,
            option1: sizeLabel,
            price: priceVal > 0 ? priceVal : 159.9,
            compare_at_price: compareVal > priceVal ? compareVal : undefined,
            available: isAvail,
            inventory_quantity: stockNum,
            inventory_policy: v.stock_control === false && stockNum === 0 ? 'continue' : 'deny',
            inventory_management: v.stock_control === false ? null : 'nuvemshop'
          };
        });

        const handle = slugifyHandle(pageTitle);
        seenProductKeys.add(handle);
        results.push({
          id: String(parsedVariants[0]?.product_id || `nuvem-prod-1`),
          title: pageTitle,
          handle,
          url: cleanUrl,
          product_type: 'Vestuário & Moda D2C',
          tags: ['Nuvemshop'],
          body_html: pageDesc || `<p>${pageTitle} - Catálogo Nuvemshop</p>`,
          images: pageImage ? [{ src: pageImage }] : [],
          variants,
          sourcePlatform: 'NUVEMSHOP'
        });
      }
    }

    // Nuvemshop grid cards with data-variants='[...]'
    if (doc) {
      const nuvemContainers = Array.from(doc.querySelectorAll('[data-variants]'));
      nuvemContainers.forEach((el, cIdx) => {
        const rawAttr = el.getAttribute('data-variants') || '';
        if (!rawAttr) return;
        try {
          const parsed = JSON.parse(decodeHtmlEntities(rawAttr));
          if (!Array.isArray(parsed) || parsed.length === 0) return;
          const anchor = el.querySelector('a[href]') as HTMLAnchorElement | null;
          const cardTitle =
            el.querySelector('.js-item-name, .item-name, h2, h3, h4')?.textContent?.trim() ||
            anchor?.getAttribute('title')?.trim() ||
            `${pageTitle} #${cIdx + 1}`;
          const handle = slugifyHandle(cardTitle);
          if (seenProductKeys.has(handle)) return;
          seenProductKeys.add(handle);

          const cardUrl = resolveFullUrl(anchor?.getAttribute('href') || '', domain, cleanUrl);
          const cardImg = el.querySelector('img')?.getAttribute('data-srcset')?.split(' ')[0] || el.querySelector('img')?.getAttribute('src') || pageImage;

          const variants: NormalizedPlatformVariant[] = parsed.map((v: any, idx: number) => {
            const sizeLabel = normalizeSizeToken(v.option0 || v.option1 || v.title || `VAR-${idx + 1}`);
            const stockNum = v.stock !== null && v.stock !== undefined ? Number(v.stock) : undefined;
            const isAvail = Boolean(v.available !== false && (stockNum === undefined || stockNum > 0));
            const priceVal = Number(v.price_number || parseBRLPrice(v.price_short || v.price || 159.9));
            return {
              id: String(v.id || `nuvem-card-${cIdx}-${idx}`),
              sku: String(v.sku || `${brandName}-NUV-${cIdx + 1}-${sizeLabel}`),
              title: sizeLabel,
              option1: sizeLabel,
              price: priceVal > 0 ? priceVal : 159.9,
              available: isAvail,
              inventory_quantity: stockNum,
              inventory_policy: 'deny',
              inventory_management: 'nuvemshop'
            };
          });

          results.push({
            id: `nuvem-card-${cIdx}`,
            title: cardTitle,
            handle,
            url: cardUrl,
            product_type: 'Vestuário & Moda D2C',
            tags: ['Nuvemshop'],
            body_html: pageDesc || `<p>${cardTitle}</p>`,
            images: cardImg ? [{ src: cardImg }] : [],
            variants,
            sourcePlatform: 'NUVEMSHOP'
          });
        } catch {
          // ignore malformed data-variants
        }
      });
    }
  } catch {
    // ignore Nuvemshop parse errors
  }

  // ============================================================================
  // 2. WOOCOMMERCE VARIATIONS FORM (data-product_variations)
  // ============================================================================
  try {
    const wooAttrMatches = htmlText.match(/data-product_variations=["']([\s\S]*?)["'](?=\s|>)/gi) || [];
    wooAttrMatches.forEach((matchStr, wIdx) => {
      const rawValue = matchStr
        .replace(/^data-product_variations=["']/i, '')
        .replace(/["']$/, '');
      const decoded = decodeHtmlEntities(rawValue);
      try {
        const wooVars = JSON.parse(decoded);
        if (!Array.isArray(wooVars) || wooVars.length === 0) return;

        const variants: NormalizedPlatformVariant[] = wooVars.map((wv: any, idx: number) => {
          const attrs = wv.attributes || {};
          const attrValues = Object.values(attrs).map(v => String(v || '')).filter(Boolean);
          const rawSize = attrValues[0] || wv.sku || `VAR-${idx + 1}`;
          const sizeLabel = normalizeSizeToken(rawSize);
          const isAvail = Boolean(wv.is_in_stock !== false && wv.is_purchasable !== false);
          const priceVal = Number(wv.display_price || parseBRLPrice(wv.price_html || 159.9));
          const regularVal = Number(wv.display_regular_price || 0);
          const qty = wv.max_qty !== undefined && wv.max_qty !== '' ? Number(wv.max_qty) : (isAvail ? 5 : 0);
          const backorderAllowed = Boolean(wv.backorders_allowed);

          return {
            id: String(wv.variation_id || `woo-var-${wIdx}-${idx}`),
            sku: String(wv.sku || `${brandName}-WOO-${sizeLabel}`),
            title: sizeLabel,
            option1: sizeLabel,
            price: priceVal > 0 ? priceVal : 159.9,
            compare_at_price: regularVal > priceVal ? regularVal : undefined,
            available: isAvail,
            inventory_quantity: backorderAllowed && qty <= 0 ? 0 : qty,
            inventory_policy: backorderAllowed ? 'continue' : 'deny',
            inventory_management: 'woocommerce'
          };
        });

        const handle = slugifyHandle(`${pageTitle}-${wIdx || ''}`);
        if (seenProductKeys.has(handle)) return;
        seenProductKeys.add(handle);

        results.push({
          id: `woo-prod-${wIdx + 1}`,
          title: pageTitle,
          handle,
          url: cleanUrl,
          product_type: 'WooCommerce Product',
          tags: ['WooCommerce'],
          body_html: pageDesc || `<p>${pageTitle}</p>`,
          images: pageImage ? [{ src: pageImage }] : [],
          variants,
          sourcePlatform: 'WOOCOMMERCE'
        });
      } catch {
        // ignore invalid Woo JSON
      }
    });
  } catch {
    // ignore WooCommerce errors
  }

  // ============================================================================
  // 3. WAKE / FBITS & VTEX NEXT.JS (__NEXT_DATA__ / Fbits.Produto)
  // ============================================================================
  try {
    // 3a. Wake / Fbits inline Fbits.Produto
    const fbitsMatch = htmlText.match(/Fbits\.Produto\s*=\s*(\{[\s\S]*?\});/i);
    if (fbitsMatch?.[1]) {
      try {
        const fbitsProd = JSON.parse(fbitsMatch[1]);
        const rawVars = Array.isArray(fbitsProd.Variantes || fbitsProd.variantes || fbitsProd.variants)
          ? (fbitsProd.Variantes || fbitsProd.variantes || fbitsProd.variants)
          : [];
        if (rawVars.length > 0) {
          const pTitle = fbitsProd.Nome || fbitsProd.nome || fbitsProd.title || pageTitle;
          const handle = slugifyHandle(pTitle);
          if (!seenProductKeys.has(handle)) {
            seenProductKeys.add(handle);
            const variants: NormalizedPlatformVariant[] = rawVars.map((fv: any, idx: number) => {
              const sizeLabel = normalizeSizeToken(fv.Tamanho || fv.tamanho || fv.Atributo || fv.Nome || fv.title || `VAR-${idx + 1}`);
              const stockQty = Number(fv.Estoque ?? fv.estoque ?? fv.stock ?? (fv.Disponivel === false ? 0 : 5));
              const isAvail = fv.Disponivel !== undefined ? Boolean(fv.Disponivel) : stockQty > 0;
              const priceVal = Number(fv.PrecoPor || fv.preco || fv.price || fbitsProd.PrecoPor || 159.9);
              return {
                id: String(fv.ProdutoVarianteId || fv.id || `wake-var-${idx}`),
                sku: String(fv.SKU || fv.sku || `${brandName}-WAKE-${sizeLabel}`),
                title: sizeLabel,
                option1: sizeLabel,
                price: priceVal > 0 ? priceVal : 159.9,
                available: isAvail,
                inventory_quantity: stockQty,
                inventory_policy: 'deny',
                inventory_management: 'wake'
              };
            });

            results.push({
              id: String(fbitsProd.ProdutoId || 'wake-prod-1'),
              title: pTitle,
              handle,
              url: resolveFullUrl(fbitsProd.Url || '', domain, cleanUrl),
              product_type: fbitsProd.Categoria || 'Moda & Calçados',
              tags: ['Wake', 'Fbits'],
              body_html: pageDesc || `<p>${pTitle}</p>`,
              images: pageImage ? [{ src: pageImage }] : [],
              variants,
              sourcePlatform: 'WAKE_FBITS'
            });
          }
        }
      } catch {
        // ignore malformed Fbits.Produto
      }
    }

    // 3b. Next.js / VTEX FastStore / Wake Storefront (__NEXT_DATA__)
    const nextDataMatch = htmlText.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch?.[1]) {
      try {
        const nextJson = JSON.parse(nextDataMatch[1].trim());
        const pageProps = nextJson?.props?.pageProps || nextJson?.props || {};
        const candidateProducts: any[] = [];

        if (pageProps.product) candidateProducts.push(pageProps.product);
        if (pageProps.data?.product) candidateProducts.push(pageProps.data.product);
        if (Array.isArray(pageProps.products)) candidateProducts.push(...pageProps.products);
        if (Array.isArray(pageProps.data?.products)) candidateProducts.push(...pageProps.data.products);

        candidateProducts.forEach((np: any, pIdx: number) => {
          const pTitle = np.productName || np.name || np.title || `${brandName} Produto #${pIdx + 1}`;
          const handle = slugifyHandle(np.slug || np.linkText || pTitle);
          if (seenProductKeys.has(handle)) return;

          const rawItems = Array.isArray(np.items)
            ? np.items
            : Array.isArray(np.variants)
            ? np.variants
            : Array.isArray(np.skus)
            ? np.skus
            : [];
          if (rawItems.length === 0) return;

          seenProductKeys.add(handle);
          const variants: NormalizedPlatformVariant[] = rawItems.map((item: any, idx: number) => {
            const sellerOffer = item.sellers?.[0]?.commertialOffer || item.offers?.offers?.[0] || item;
            const availQty =
              sellerOffer.AvailableQuantity !== undefined
                ? Number(sellerOffer.AvailableQuantity)
                : item.stock !== undefined
                ? Number(item.stock)
                : item.available === false
                ? 0
                : 5;
            const isAvail = item.available !== undefined ? Boolean(item.available) : availQty > 0;
            const priceVal = Number(sellerOffer.Price || sellerOffer.spotPrice || item.price || np.price || 159.9);
            const rawSize =
              item.Tamanho?.[0] ||
              item.Tamanho ||
              item.size ||
              item.name ||
              item.title ||
              `VAR-${idx + 1}`;
            const sizeLabel = normalizeSizeToken(rawSize);

            return {
              id: String(item.itemId || item.id || `next-var-${pIdx}-${idx}`),
              sku: String(item.ean || item.sku || item.itemId || `${brandName}-NXT-${sizeLabel}`),
              title: sizeLabel,
              option1: sizeLabel,
              price: priceVal > 0 ? priceVal : 159.9,
              available: isAvail,
              inventory_quantity: availQty,
              inventory_policy: 'deny',
              inventory_management: 'vtex_next'
            };
          });

          const firstImg =
            np.images?.[0]?.url ||
            np.items?.[0]?.images?.[0]?.imageUrl ||
            np.image ||
            pageImage;

          results.push({
            id: String(np.productId || np.id || `next-prod-${pIdx}`),
            title: pTitle,
            handle,
            url: resolveFullUrl(np.link || (np.linkText ? `/${np.linkText}/p` : ''), domain, cleanUrl),
            product_type: np.category || 'E-Commerce D2C',
            tags: ['VTEX_Next'],
            body_html: np.description || pageDesc || `<p>${pTitle}</p>`,
            images: firstImg ? [{ src: firstImg }] : [],
            variants,
            sourcePlatform: 'VTEX_NEXT'
          });
        });
      } catch {
        // ignore __NEXT_DATA__ parse failure
      }
    }
  } catch {
    // ignore Wake/Next errors
  }

  // ============================================================================
  // 4. TRAY COMMERCE & SCHEMA.ORG MULTI-OFFER / PRODUCTGROUP HARVESTER
  // ============================================================================
  try {
    // Collect any DOM-level variation pills (Tray `.lista-variacoes`, `[data-tray-tst="variation"]`, `.swatch-element`, etc.)
    const domAvailableSizes: string[] = [];
    const domMissingSizes: string[] = [];
    if (doc) {
      const trayOrGenericSwatches = Array.from(
        doc.querySelectorAll(
          '[data-tray-tst*="variation"], .lista-variacoes li, .variacao-item, .swatch-element, .js-insta-variant, .variable-item, [data-variant-size]'
        )
      );
      trayOrGenericSwatches.forEach(sw => {
        const rawText =
          sw.getAttribute('data-variant-size') ||
          sw.getAttribute('data-value') ||
          sw.getAttribute('title') ||
          sw.textContent ||
          '';
        const norm = normalizeSizeToken(rawText);
        if (!norm || norm.length > 18) return;
        const cls = `${sw.className || ''} ${sw.getAttribute('data-status') || ''}`.toLowerCase();
        const isDisabled =
          cls.includes('indisponivel') ||
          cls.includes('esgotado') ||
          cls.includes('disabled') ||
          cls.includes('out-of-stock') ||
          cls.includes('unavailable') ||
          cls.includes('soldout') ||
          cls.includes('sem-estoque') ||
          sw.hasAttribute('disabled') ||
          sw.getAttribute('aria-disabled') === 'true';

        if (isDisabled) {
          if (!domMissingSizes.includes(norm)) domMissingSizes.push(norm);
        } else {
          if (!domAvailableSizes.includes(norm)) domAvailableSizes.push(norm);
        }
      });
    }

    const scriptMatches = htmlText.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const scriptTag of scriptMatches) {
      if (results.length >= 150) break;
      const rawJson = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '').trim();
      try {
        const parsed = JSON.parse(rawJson);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          const prods =
            item['@type'] === 'Product' || item['@type'] === 'ProductGroup'
              ? [item]
              : Array.isArray(item['@graph'])
              ? item['@graph'].filter((g: any) => g['@type'] === 'Product' || g['@type'] === 'ProductGroup')
              : [];

          for (const prod of prods) {
            if (results.length >= 150) break;
            const pTitle = prod.name || prod.headline || pageTitle;
            const handle = slugifyHandle(prod.productGroupID || prod.sku || pTitle);
            if (seenProductKeys.has(handle)) continue;

            // Gather all variant nodes from `hasVariant` (ProductGroup) or `offers` (Array / AggregateOffer)
            const rawVariantNodes: any[] = [];
            if (Array.isArray(prod.hasVariant) && prod.hasVariant.length > 0) {
              rawVariantNodes.push(...prod.hasVariant);
            } else if (Array.isArray(prod.offers) && prod.offers.length > 0) {
              rawVariantNodes.push(...prod.offers);
            } else if (Array.isArray(prod.offers?.offers) && prod.offers.offers.length > 0) {
              rawVariantNodes.push(...prod.offers.offers);
            } else if (prod.offers && typeof prod.offers === 'object') {
              rawVariantNodes.push(prod.offers);
            }

            const basePrice = parseBRLPrice(
              prod.offers?.price || prod.offers?.lowPrice || prod.offers?.[0]?.price || prod.price || 159.9
            );

            const variants: NormalizedPlatformVariant[] = [];

            if (rawVariantNodes.length > 1) {
              rawVariantNodes.forEach((vn: any, idx: number) => {
                const offerNode = vn.offers ? (Array.isArray(vn.offers) ? vn.offers[0] : vn.offers) : vn;
                const availStr = String(offerNode?.availability || vn?.availability || '').toLowerCase();
                const isOutOfStock = availStr.includes('outofstock') || availStr.includes('soldout') || availStr.includes('discontinued');
                const vPrice = parseBRLPrice(offerNode?.price || vn?.price || basePrice);
                const rawSizeCandidate =
                  vn.size ||
                  vn.additionalProperty?.find?.((p: any) => /tamanho|size/i.test(p.name || ''))?.value ||
                  vn.name ||
                  offerNode?.name ||
                  vn.sku ||
                  `VAR-${idx + 1}`;
                const sizeLabel = normalizeSizeToken(rawSizeCandidate);

                variants.push({
                  id: String(vn.sku || offerNode?.sku || `schema-var-${idx}`),
                  sku: String(vn.sku || offerNode?.sku || `${prod.sku || brandName}-${sizeLabel}`),
                  title: sizeLabel,
                  option1: sizeLabel,
                  price: vPrice > 0 ? vPrice : (basePrice > 0 ? basePrice : 159.9),
                  available: !isOutOfStock,
                  inventory_quantity: isOutOfStock ? 0 : 5,
                  inventory_policy: 'deny',
                  inventory_management: 'schema'
                });
              });
            } else if (domAvailableSizes.length > 0 || domMissingSizes.length > 0) {
              // Single Schema.org offer enriched with Tray/Nuvemshop/Woo DOM size swatches
              domAvailableSizes.forEach((sz, idx) => {
                variants.push({
                  id: `dom-avail-${idx}`,
                  sku: `${prod.sku || brandName}-${sz}`,
                  title: sz,
                  option1: sz,
                  price: basePrice > 0 ? basePrice : 159.9,
                  available: true,
                  inventory_quantity: 5,
                  inventory_policy: 'deny',
                  inventory_management: 'tray_dom'
                });
              });
              domMissingSizes.forEach((sz, idx) => {
                variants.push({
                  id: `dom-miss-${idx}`,
                  sku: `${prod.sku || brandName}-${sz}`,
                  title: sz,
                  option1: sz,
                  price: basePrice > 0 ? basePrice : 159.9,
                  available: false,
                  inventory_quantity: 0,
                  inventory_policy: 'deny',
                  inventory_management: 'tray_dom'
                });
              });
            } else {
              const singleOffer = rawVariantNodes[0] || {};
              const availStr = String(singleOffer.availability || '').toLowerCase();
              const isOutOfStock = availStr.includes('outofstock') || availStr.includes('soldout');
              variants.push({
                id: String(prod.sku || `schema-single-1`),
                sku: String(prod.sku || `${brandName}-SKU-1`),
                title: 'ÚNICO',
                option1: 'ÚNICO',
                price: basePrice > 0 ? basePrice : 159.9,
                available: !isOutOfStock,
                inventory_quantity: isOutOfStock ? 0 : 5,
                inventory_policy: 'deny',
                inventory_management: 'schema'
              });
            }

            const rawUrl = prod.url || prod.offers?.url || prod.offers?.[0]?.url || cleanUrl;
            const pUrl = resolveFullUrl(rawUrl, domain, cleanUrl);
            const pImg = Array.isArray(prod.image)
              ? (typeof prod.image[0] === 'object' ? prod.image[0]?.url : prod.image[0])
              : (typeof prod.image === 'object' ? prod.image?.url : (prod.image || pageImage));

            seenProductKeys.add(handle);
            results.push({
              id: `schema-prod-${results.length + 1}`,
              title: pTitle,
              handle,
              url: pUrl,
              product_type: prod.category || 'Catálogo Oficial',
              tags: htmlText.includes('data-tray-tst') ? ['Tray'] : ['Schema.org'],
              body_html: prod.description || pageDesc || `<p>${pTitle}</p>`,
              images: pImg ? [{ src: String(pImg) }] : [],
              variants,
              sourcePlatform: htmlText.includes('data-tray-tst') ? 'TRAY' : 'SCHEMA_MULTI_OFFER'
            });
          }
        }
      } catch {
        // ignore malformed JSON-LD block
      }
    }
  } catch {
    // ignore Schema/Tray errors
  }

  // ============================================================================
  // 5. DOM PRODUCT CARDS WITH INLINE SIZE SWATCHES (TRAY / NUVEMSHOP / WAKE / WOO)
  // ============================================================================
  if (results.length === 0 && doc) {
    const productAnchors = Array.from(
      doc.querySelectorAll('a[href*="/products/"], a[href*="/produto/"], a[href*="/p/"], a[href*="/item/"], a[href*="/produtos/"]')
    );
    const seenUrls = new Set<string>();

    for (let i = 0; i < productAnchors.length && results.length < 150; i++) {
      const a = productAnchors[i];
      const href = a.getAttribute('href') || '';
      if (!href) continue;

      const fullUrl = resolveFullUrl(href, domain, cleanUrl);
      if (seenUrls.has(fullUrl)) continue;
      seenUrls.add(fullUrl);

      const cardContainer =
        a.closest('.produto, .item-produto, .js-item-product, [data-tray-tst="product-item"], .product-item, li.product, div') ||
        a.parentElement;

      const title =
        cardContainer?.querySelector('.produto-nome, .js-item-name, .product-title, .woocommerce-loop-product__title, h2, h3')?.textContent?.trim() ||
        a.textContent?.trim() ||
        a.querySelector('img')?.getAttribute('alt')?.trim() ||
        `${brandName} Produto Oficial #${i + 1}`;

      const handle = slugifyHandle(title);
      if (seenProductKeys.has(handle)) continue;
      seenProductKeys.add(handle);

      const imgEl = a.querySelector('img') || cardContainer?.querySelector('img');
      const imgSrc = imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '';
      const priceEl = cardContainer?.querySelector('.preco-destaque, .js-price-display, .price, .preco, [data-product-price], strong');
      const extractedPrice = priceEl?.textContent ? parseBRLPrice(priceEl.textContent) : 159.9;

      const cardHtml = (cardContainer?.innerHTML || '').toLowerCase();
      const isOutOfStockCard =
        cardHtml.includes('indisponível') ||
        cardHtml.includes('produto-esgotado') ||
        cardHtml.includes('js-product-out-of-stock') ||
        cardHtml.includes('avise-me');

      // Check inline size pills inside the card
      const cardSwatches = Array.from(
        cardContainer?.querySelectorAll('.variacao-item, .swatch-element, [data-size], .size-option, .tamanho-item') || []
      );
      const variants: NormalizedPlatformVariant[] = [];

      if (cardSwatches.length > 0) {
        cardSwatches.forEach((sw, sIdx) => {
          const sz = normalizeSizeToken(sw.getAttribute('data-size') || sw.textContent || `VAR-${sIdx + 1}`);
          const cls = (sw.className || '').toLowerCase();
          const isUnavail =
            cls.includes('esgotado') ||
            cls.includes('indisponivel') ||
            cls.includes('disabled') ||
            cls.includes('unavailable') ||
            cls.includes('out-of-stock');
          variants.push({
            id: `dom-card-var-${i}-${sIdx}`,
            sku: `${brandName}-SKU-${i + 1}-${sz}`,
            title: sz,
            option1: sz,
            price: extractedPrice > 0 ? extractedPrice : 159.9,
            available: !isUnavail && !isOutOfStockCard,
            inventory_quantity: !isUnavail && !isOutOfStockCard ? 5 : 0,
            inventory_policy: 'deny',
            inventory_management: 'dom_card'
          });
        });
      } else {
        variants.push({
          id: `dom-card-var-${i}-0`,
          sku: `${brandName}-SKU-${i + 1}`,
          title: 'ÚNICO',
          option1: 'ÚNICO',
          price: extractedPrice > 0 ? extractedPrice : 159.9,
          available: !isOutOfStockCard,
          inventory_quantity: isOutOfStockCard ? 0 : 5,
          inventory_policy: 'deny',
          inventory_management: 'dom_card'
        });
      }

      results.push({
        id: `dom-prod-${i + 1}`,
        title,
        handle,
        url: fullUrl,
        product_type: 'Vitrine Pública',
        tags: ['DOM'],
        body_html: `<p>${title}</p>`,
        images: imgSrc ? [{ src: imgSrc }] : [],
        variants,
        sourcePlatform: 'DOM_CARDS'
      });
    }
  }

  return results;
}

/**
 * 🔬 Converte produtos extraídos de plataformas nacionais (Nuvemshop, Tray, Wake, WooCommerce)
 * em `CatalogProductIssue[]` + `DeepCatalogAuditSummary` com 100% de paridade matemática.
 */
export function buildIssuesFromUniversalProducts(
  extractedProducts: NormalizedPlatformProduct[],
  domain: string,
  themeHasSizeGuideAddon: boolean,
  htmlText: string = '',
  operationMode?: string
): { issues: CatalogProductIssue[]; deepSkuAudit: DeepCatalogAuditSummary } {
  // Executa a auditoria profunda SKU a SKU usando o mesmo motor determinístico da Shopify
  const deepSkuAudit = auditDeepCatalog(extractedProducts, {
    storeDomain: domain,
    dailyAdSpend: 250,
    isAdRunning: true,
    operationMode
  });

  const auditedById = new Map(deepSkuAudit.allProducts.map(ap => [String(ap.id), ap]));
  const issues: CatalogProductIssue[] = [];

  for (let i = 0; i < extractedProducts.length; i++) {
    const p = extractedProducts[i];
    const auditedProd = auditedById.get(String(p.id));
    const titleUpper = p.title.toUpperCase();
    const handleUpper = p.handle.toUpperCase();

    const availableSizes: string[] = [];
    const missingSizes: string[] = [];

    p.variants.forEach(v => {
      const sz = normalizeSizeToken(v.option1 || v.title);
      if (v.available) {
        if (!availableSizes.includes(sz)) availableSizes.push(sz);
      } else {
        if (!missingSizes.includes(sz) && !availableSizes.includes(sz)) {
          missingSizes.push(sz);
        }
      }
    });

    const allVariantsUnavailable = p.variants.length > 0 && p.variants.every(v => !v.available);
    if (allVariantsUnavailable && !missingSizes.includes('ESGOTADO')) {
      missingSizes.unshift('ESGOTADO');
    }

    const isAccessory =
      /bon[eé]|chap[eé]u|bandana|manguito|carteira|cinto|meia|[oó]culos|isca|vara|carretilha|molinete|anzol/i.test(p.title) ||
      /\b(caps?|hats?|beanies?|visors?|sunglasses|glasses|watch(?:es)?|socks?|bags?|backpacks?|wallets?|belts?|gloves|casquettes?|chapea(?:u|ux)|lunettes|sacs?|ceintures?|gorras?|sombreros?|gafas|mochilas?|cintur[oó]n(?:es)?)\b|(mützen?|sonnenbrillen?|rucks(?:ack|äcke)|gürtel)/i.test(p.title);
    const isOneSizeProduct =
      p.variants.length === 1 &&
      ['ÚNICO', 'UNICO', 'TAMANHO ÚNICO', 'ONE SIZE', 'OS'].includes(normalizeSizeToken(p.variants[0]?.title || 'ÚNICO'));
    const isFullPrintExempt =
      handleUpper.includes('_FULL') ||
      titleUpper.includes('_FULL') ||
      p.variants.some(v => v.sku.toUpperCase().includes('_FULL')) ||
      isAccessory ||
      (isOneSizeProduct && !allVariantsUnavailable);

    const brokenCoreSizes = missingSizes.filter(s => !PERIPHERAL_SIZES.has(s.toUpperCase().trim()));
    const ghostRisk = auditedProd?.ghostInventoryRisk;
    const isGhostSuspect = Boolean(ghostRisk?.isGhostInventorySuspect || (ghostRisk?.riskScore && ghostRisk.riskScore >= 35));

    if (isGhostSuspect && !missingSizes.includes('ESTOQUE_FANTASMA_SUSPEITO')) {
      missingSizes.push('ESTOQUE_FANTASMA_SUSPEITO');
      if (!brokenCoreSizes.includes('ESTOQUE_FANTASMA_SUSPEITO')) {
        brokenCoreSizes.push('ESTOQUE_FANTASMA_SUSPEITO');
      }
    }

    const firstImg = p.images[0]?.src || '';
    const hasValidImage = Boolean(firstImg);
    const rawDesc = (p.body_html || '').replace(/<[^>]*>/g, ' ').trim();
    const hasDescription = rawDesc.length >= 20;
    const hasSizeGuide =
      isAccessory ||
      isOneSizeProduct ||
      themeHasSizeGuideAddon ||
      /medida|tamanho|tabela|guia|cm/i.test(rawDesc) ||
      /medida|tamanho|tabela/i.test(htmlText);

    let criticalIssuesCount = 0;
    if (!hasValidImage) criticalIssuesCount += 2;
    if (allVariantsUnavailable) criticalIssuesCount += 3;
    if (!isFullPrintExempt && brokenCoreSizes.length > 0) criticalIssuesCount += 2;
    if (isGhostSuspect) criticalIssuesCount += 3;

    let recommendedAction = `Produto auditado via extrator universal (${p.sourcePlatform}). Em conformidade.`;
    if (allVariantsUnavailable) {
      recommendedAction = 'CRÍTICO: Ruptura total de estoque identificada (Todas as variantes esgotadas). Pausar anúncios imediatamente!';
    } else if (isGhostSuspect) {
      recommendedAction = ghostRisk?.actionSummary || '🚨 PAUSAR ANÚNCIO: Risco Crítico de Estoque Fantasma detectado.';
    } else if (!isFullPrintExempt && brokenCoreSizes.length > 0) {
      recommendedAction = `Repor estoque na grade central (${brokenCoreSizes.join(', ')}) ou redistribuir verba de tráfego pago.`;
    }

    issues.push({
      id: `univ-sku-${p.id || i}`,
      sku: p.variants[0]?.sku || `${domain}-SKU-${i + 1}`,
      productTitle: p.title,
      productUrl: p.url,
      price: p.variants[0]?.price || 159.9,
      compareAtPrice: p.variants[0]?.compare_at_price,
      imageSrc: firstImg,
      hasValidImage,
      imageResolutionStatus: hasValidImage ? 'ALTA' : 'BAIXA',
      availableSizes: allVariantsUnavailable
        ? ['NENHUM (100% ESGOTADO)']
        : availableSizes.length > 0
        ? availableSizes
        : ['Tamanho Único'],
      missingSizes,
      brokenCoreSizes,
      isFullPrintExempt,
      isResaleAccessory: isAccessory || isOneSizeProduct,
      manufacturingType: auditedProd?.manufacturingCategory || (isAccessory ? 'REVENDA' : 'FABRICACAO_PROPRIA'),
      hasDescription,
      descriptionLength: rawDesc.length || 120,
      hasSizeGuide,
      imageWeightKb: 185,
      criticalIssuesCount,
      recommendedAction,
      detailedSkus: auditedProd?.skus || [],
      isGhostInventorySuspect: isGhostSuspect,
      ghostInventoryRisk: ghostRisk
    });
  }

  return { issues, deepSkuAudit };
}
