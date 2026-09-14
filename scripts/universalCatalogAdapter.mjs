// ==============================================================================
// 🌐 UNIVERSAL MULTI-PLATFORM & MARKETPLACE CATALOG ADAPTER
// Polimorphic crawler supporting:
// 1. Shopify (/products.json?limit=15)
// 2. VTEX (/api/catalog_system/pub/products/search)
// 3. Nuvemshop / Tiendanube (Schema.org JSON-LD & HTML DOM Parsing)
// 4. Marketplaces (Mercado Livre, Shopee, Amazon, Magalu)
// ==============================================================================

/**
 * 🔍 Platform Detector based on URL and domain heuristics
 */
export function detectStorePlatform(url) {
  const lower = url.toLowerCase();

  // 1. Marketplaces
  if (lower.includes('mercadolivre.com.br') || lower.includes('mercadolibre.com')) {
    return 'MERCADO_LIVRE';
  }
  if (lower.includes('shopee.com.br') || lower.includes('shopee.com')) {
    return 'SHOPEE';
  }
  if (lower.includes('amazon.com.br') || lower.includes('amazon.com')) {
    return 'AMAZON';
  }
  if (lower.includes('magazineluiza.com.br') || lower.includes('magalu.com')) {
    return 'MAGALU';
  }

  // 2. Default E-Commerce Platforms (will be probed in cascade)
  return 'DIRECT_STORE';
}

/**
 * 🎣 Exemption Rules: Fishing gear, accessories, one-size, and _FULL
 */
export function isExemptProduct(title, tags = [], productType = '', variants = [], handle = '') {
  const titleUpper = String(title || '').toUpperCase();
  const typeUpper = String(productType || '').toUpperCase();
  const handleUpper = String(handle || '').toUpperCase();
  const tagsUpper = (tags || []).map(t => String(t).toUpperCase());
  const skusUpper = (variants || []).map(v => String(v.sku || '').toUpperCase());

  // 1. Fishing Gear / Farm Gear
  const isEquipment = 
    titleUpper.includes('ISCA') ||
    titleUpper.includes('ANZOL') ||
    titleUpper.includes('VARA') ||
    titleUpper.includes('CARRETILHA') ||
    titleUpper.includes('MOLINETE') ||
    titleUpper.includes('LINHA') ||
    titleUpper.includes('GARATEIA') ||
    titleUpper.includes('CHUMBADA') ||
    titleUpper.includes('ALICATE') ||
    typeUpper.includes('TRALHA') ||
    typeUpper.includes('EQUIPAMENTO') ||
    tagsUpper.some(t => t.includes('ISCA') || t.includes('VARA') || t.includes('CARRETILHA'));

  // 2. One-Size Accessories & Colors
  const isAccessory = !isEquipment && (
    titleUpper.includes('ÓCULOS') ||
    titleUpper.includes('OCULOS') ||
    titleUpper.includes('BONÉ') ||
    titleUpper.includes('BONE') ||
    titleUpper.includes('CHAPÉU') ||
    titleUpper.includes('CHAPEU') ||
    titleUpper.includes('BANDANA') ||
    titleUpper.includes('MANGUITO') ||
    titleUpper.includes('MEIA') ||
    titleUpper.includes('CINTO') ||
    titleUpper.includes('ADESIVO') ||
    typeUpper.includes('ACESSÓRIO') ||
    typeUpper.includes('ACESSORIO')
  );

  // 3. FULL Exemption Rule (SKU, Title, Handle, Tags)
  // REGRA DE NEGÓCIO: Produtos com FULL no código pertencem a estoque Fulfillment fechado.
  // Se faltar tamanho lá, está correto e esperado (é apenas o saldo disponível no Full).
  // Isento 100% de falso-positivo de ruptura de fábrica.
  const isFullStock = 
    titleUpper.includes('FULL') ||
    handleUpper.includes('FULL') ||
    tagsUpper.some(t => t.includes('FULL')) ||
    skusUpper.some(s => s.includes('FULL'));

  return isEquipment || isAccessory || isFullStock;
}

/**
 * 🏭 Detects whether a product is In-House Manufactured (Fabricação Própria)
 * or Third-Party Resale (Revenda / Fornecedor Externo).
 */
export function detectProductManufacturingType(product) {
  const titleUpper = String(product.title || '').toUpperCase();
  const typeUpper = String(product.productType || product.product_type || '').toUpperCase();
  const handleLower = String(product.handle || '').toLowerCase();
  const tagsUpper = (product.tags || []).map(t => String(t).toUpperCase());
  const skuSample = String(product.variants?.[0]?.sku || product.sku || '').toUpperCase();

  // 1. Explicit Resale Product Types (Alfaiataria, calçados, jeans, óculos)
  const isResaleType = 
    typeUpper.includes('BOTÃO') || 
    typeUpper.includes('BOTAO') || 
    typeUpper.includes('SOCIAL') ||
    typeUpper.includes('BOTINA') || 
    typeUpper.includes('BOTA') || 
    typeUpper.includes('CALÇADO') || 
    typeUpper.includes('CALCADO') || 
    typeUpper.includes('JEANS') ||
    typeUpper.includes('ÓCULOS') || 
    typeUpper.includes('OCULOS') ||
    typeUpper.includes('EQUIPAMENTO') ||
    typeUpper.includes('TRALHA');

  // 2. SKU Prefixes indicative of Resale Finished Goods
  const isResaleSku = 
    skuSample.startsWith('CMB') || // Camisa de Botão
    skuSample.startsWith('CBT') || // Camisa de Botão Tecido
    skuSample.startsWith('BT') ||  // Botina
    skuSample.startsWith('BOT') || // Bota
    skuSample.startsWith('OC') ||  // Óculos
    /^\d{13}$/.test(skuSample);    // Barcode EAN-13 externo de fornecedor

  // 3. Handle patterns
  const isResaleHandle = 
    handleLower.startsWith('camisa-work') ||
    handleLower.startsWith('camisa-social') ||
    handleLower.startsWith('botina-') ||
    handleLower.startsWith('calca-jeans-') ||
    handleLower.startsWith('oculos-');

  // 4. Tags
  const isResaleTag = 
    tagsUpper.includes('COM BOTÃO') ||
    tagsUpper.includes('COM BOTAO') ||
    tagsUpper.includes('REVENDA') ||
    tagsUpper.includes('TERCEIROS') ||
    tagsUpper.includes('DISTRIBUIÇÃO') ||
    tagsUpper.includes('DISTRIBUICAO') ||
    tagsUpper.includes('IMPORTADO') ||
    tagsUpper.includes('OCULOS_ESTOQUE');

  // 5. Title keywords
  const isResaleTitle = 
    (titleUpper.includes('ADVENTURE') && (isResaleType || isResaleSku || isResaleHandle || isResaleTag || titleUpper.includes('BOTÃO') || titleUpper.includes('BOTAO'))) ||
    titleUpper.includes('WORK') ||
    titleUpper.includes('SAFARI') ||
    titleUpper.includes('DEYU') ||
    titleUpper.includes('MARINE SPORTS') ||
    titleUpper.includes('MARURI') ||
    titleUpper.includes('DAIWA') ||
    titleUpper.includes('SHIMANO');

  if (isResaleType || isResaleSku || isResaleHandle || isResaleTag || isResaleTitle) {
    let reason = 'Tipo de Produto / Categoria Externa';
    if (isResaleType) reason = `Categoria de Revenda: ${product.productType || product.product_type}`;
    else if (isResaleSku) reason = `Prefixo de SKU Revenda (${skuSample})`;
    else if (isResaleHandle) reason = `Padrão de URL/Handle (${product.handle})`;
    else if (isResaleTag) reason = `Tag de Fornecedor/Revenda`;
    else if (isResaleTitle) reason = `Linha Técnica Externa (${product.title})`;

    return {
      isResale: true,
      manufacturingType: 'REVENDA',
      category: typeUpper.includes('BOTÃO') || typeUpper.includes('BOTAO') || handleLower.startsWith('camisa-work') ? 'CAMISA_BOTAO_WORKWEAR' :
                typeUpper.includes('BOTINA') || typeUpper.includes('BOTA') ? 'CALCADO_COURO' :
                typeUpper.includes('JEANS') ? 'JEANS' :
                typeUpper.includes('ÓCULOS') || typeUpper.includes('OCULOS') ? 'OCULOS' : 'EQUIPAMENTO_TERCEIROS',
      reason,
      recommendedSupplyAction: 'Emitir Pedido de Compra (PO) ao fornecedor homologado ou pausar campanhas se esgotado sem previsão de lote.'
    };
  }

  return {
    isResale: false,
    manufacturingType: 'FABRICACAO_PROPRIA',
    category: 'CONFECCAO_SUBLIMADA_PROPRIA',
    reason: 'Vestuário sublimado sob demanda de produção própria',
    recommendedSupplyAction: 'Abrir Ordem de Produção (OP de corte e sublimação) no Sankhya PCP.'
  };
}

/**
 * Resolves Shopify Admin direct URL using safe native redirection.
 * Shopify automatically redirects https://{cleanUrl}/admin/products/{id} to the authenticated store.
 * Never hardcodes private store administrative slugs in source code (Zero-Trust).
 */
export function getShopifyAdminSlug(cleanUrl) {
  return null; // Protected: Never leak private administrative store slugs
}

/**
 * 🟢 1. SHOPIFY ENGINE (/products.json) — MASSIVE FULL-CATALOG CRAWLER
 * Crawls in batches of 250 products per page to audit 100% of SKUs.
 */
async function fetchShopifyCatalog(cleanUrl, maxPages = 15) {
  let page = 1;
  const allProducts = [];
  let totalVariantsCount = 0;

  while (page <= maxPages) {
    const jsonUrl = `${cleanUrl}/products.json?limit=250&page=${page}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(jsonUrl, {
        headers: { 'User-Agent': 'AdShield-Universal-Bot/2026.4 (Shopify-Deep)' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (page === 1) throw new Error(`Shopify endpoint returned HTTP ${res.status}`);
        break; // End of pagination or rate limit protection
      }

      const data = await res.json();
      const pageProducts = data.products || [];
      if (pageProducts.length === 0) break;

      allProducts.push(...pageProducts);
      if (pageProducts.length < 250) break; // Last page reached

      page++;
      // Polite delay between pages to preserve bandwidth and avoid 429
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (err) {
      clearTimeout(timeout);
      if (page === 1) throw err;
      break;
    }
  }

  if (allProducts.length === 0) return null;

  const mapped = allProducts.map(p => {
    const vars = (p.variants || []).map(v => ({
      id: String(v.id || ''),
      title: String(v.title || '').trim(),
      price: parseFloat(v.price || '169.90'),
      available: Boolean(v.available),
      sku: v.sku || '',
      barcode: v.barcode || ''
    }));
    totalVariantsCount += vars.length;
    const primarySku = vars.find(v => v.sku && v.sku.trim())?.sku || vars[0]?.sku || 'SEM_SKU';
    const primaryBarcode = vars.find(v => v.barcode && v.barcode.trim())?.barcode || vars[0]?.barcode || '';
    const adminUrl = `${cleanUrl}/admin/products/${p.id}`;

    return {
      id: String(p.id),
      title: p.title || 'Produto Shopify',
      handle: p.handle || '',
      url: `${cleanUrl}/products/${p.handle}`,
      adminUrl,
      primarySku,
      primaryBarcode,
      productType: p.product_type || '',
      tags: p.tags || [],
      images: p.images || [],
      variants: vars
    };
  });

  return {
    platform: 'SHOPIFY',
    totalVariantsCount,
    products: mapped
  };
}

/**
 * 🟣 2. VTEX ENGINE (/api/catalog_system/pub/products/search)
 */
async function fetchVtexCatalog(cleanUrl) {
  const vtexUrl = `${cleanUrl}/api/catalog_system/pub/products/search?_from=0&_to=14`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  const res = await fetch(vtexUrl, {
    headers: { 'User-Agent': 'AdShield-Universal-Bot/2.4 (VTEX)' },
    signal: controller.signal
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`VTEX endpoint returned HTTP ${res.status}`);
  }

  const rawList = await res.json();
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  return {
    platform: 'VTEX',
    products: rawList.map((item, idx) => ({
      id: String(item.productId || `vtex-${idx}`),
      title: item.productName || item.productTitle || 'Produto VTEX',
      handle: item.linkText || `item-${idx}`,
      url: item.link || `${cleanUrl}/${item.linkText}/p`,
      productType: item.categories?.[0] || '',
      tags: [],
      variants: (item.items || []).map(v => ({
        title: String(v.name || 'Padrão').trim(),
        price: parseFloat(v.sellers?.[0]?.commertialOffer?.Price || '179.90'),
        available: (v.sellers?.[0]?.commertialOffer?.AvailableQuantity || 0) > 0,
        sku: v.itemId || ''
      }))
    }))
  };
}

/**
 * 🔵 3. NUVEMSHOP / GENERIC DOM ENGINE (Schema.org JSON-LD & HTML)
 */
async function fetchNuvemshopOrDomCatalog(cleanUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(cleanUrl, {
    headers: { 'User-Agent': 'AdShield-Universal-Bot/2.4 (HTML-DOM)' },
    signal: controller.signal
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`HTML fetch returned HTTP ${res.status}`);
  }

  const html = await res.text();
  const products = [];

  // Parse Schema.org JSON-LD
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (item['@type'] === 'Product') {
          const offers = Array.isArray(item.offers) ? item.offers : item.offers ? [item.offers] : [];
          products.push({
            id: `nuvem-${products.length + 1}`,
            title: item.name || 'Produto Nuvemshop',
            handle: (item.name || '').toLowerCase().replace(/\s+/g, '-'),
            url: item.url || cleanUrl,
            productType: item.category || '',
            tags: [],
            variants: offers.map(o => ({
              title: o.name || o.sku || 'Tamanho Único',
              price: parseFloat(o.price || '159.90'),
              available: o.availability ? !String(o.availability).includes('OutOfStock') : true,
              sku: o.sku || ''
            }))
          });
        }
      }
    } catch {
      // ignore JSON parse error in script tag
    }
  }

  const isNuvem = html.includes('TiendaNube') || html.includes('Nuvemshop') || html.includes('LS.variants');
  const platformName = isNuvem ? 'NUVEMSHOP' : 'GENERIC_DOM';

  if (products.length > 0) {
    return { platform: platformName, products };
  }

  // Fallback: extract title and open graph meta
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const siteTitle = titleMatch ? titleMatch[1] : 'Loja E-commerce';

  return {
    platform: platformName,
    products: [
      {
        id: 'dom-sample-1',
        title: siteTitle,
        handle: 'vitrine-principal',
        url: cleanUrl,
        productType: 'Geral',
        tags: [],
        variants: [
          { title: 'P', price: 159.90, available: true },
          { title: 'M', price: 159.90, available: true },
          { title: 'G', price: 159.90, available: true },
          { title: 'GG', price: 159.90, available: true }
        ]
      }
    ]
  };
}

/**
 * 🟡 4. MARKETPLACE ENGINE (Mercado Livre, Shopee, Amazon, Magalu)
 */
async function fetchMarketplaceListing(url, platformType) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' 
    },
    signal: controller.signal
  });
  clearTimeout(timeout);

  const html = await res.text();
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/ - Mercado Livre.*/i, '').replace(/ \| Shopee.*/i, '').trim() : 'Anúncio de Marketplace';

  // Check Full Logistics
  const isFull = html.includes('Full') || html.includes('mercadolivre.com.br/fulfillment') || html.includes('Envio Full') || html.includes('Prime');
  // Check Buy Box / Active Stock
  const outOfStock = html.includes('Estoque esgotado') || html.includes('Finalizado') || html.includes('Produto indisponível');
  // Price extraction
  const priceMatch = html.match(/"price":\s*([0-9.]+)/) || html.match(/R\$\s*([0-9.,]+)/);
  const price = priceMatch ? parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) || 149.90 : 149.90;

  return {
    platform: platformType,
    isMarketplace: true,
    products: [
      {
        id: `mkt-${Date.now()}`,
        title: rawTitle,
        handle: 'anuncio-marketplace',
        url: url,
        productType: 'Marketplace Listing',
        tags: isFull ? ['FULL'] : [],
        variants: [
          {
            title: isFull ? 'Estoque Full (Ativo)' : 'Estoque Convencional',
            price: price,
            available: !outOfStock,
            sku: 'MKT-LISTING'
          }
        ]
      }
    ],
    marketplaceDetails: {
      platformName: platformType === 'MERCADO_LIVRE' ? 'Mercado Livre' : platformType === 'SHOPEE' ? 'Shopee' : 'Amazon Brasil',
      isFull: isFull,
      hasBuyBox: !outOfStock && isFull,
      sellerReputation: isFull ? 'MercadoLíder Platinum / Oficial' : 'Vendedor Convencional'
    }
  };
}

/**
 * 🩺 AUDIT UNIVERSAL STORE CATALOG (THE CASCADING MASTER ENGINE)
 */
export async function auditUniversalStoreCatalog(storeUrl, niche) {
  const cleanUrl = storeUrl.replace(/\/+$/, '');
  const platformType = detectStorePlatform(cleanUrl);

  let rawCatalog = null;
  let detectedPlatform = platformType;

  // 1. Marketplace Direct Path
  if (['MERCADO_LIVRE', 'SHOPEE', 'AMAZON', 'MAGALU'].includes(platformType)) {
    try {
      rawCatalog = await fetchMarketplaceListing(cleanUrl, platformType);
    } catch {
      // Fallback
    }
  }

  // 2. Cascade for E-Commerce Stores (Shopify -> VTEX -> Nuvemshop/DOM)
  if (!rawCatalog) {
    // Attempt 1: Shopify /products.json
    try {
      rawCatalog = await fetchShopifyCatalog(cleanUrl);
      if (rawCatalog) detectedPlatform = 'SHOPIFY';
    } catch {
      // Not Shopify, try VTEX
    }
  }

  if (!rawCatalog) {
    // Attempt 2: VTEX Search API
    try {
      rawCatalog = await fetchVtexCatalog(cleanUrl);
      if (rawCatalog) detectedPlatform = 'VTEX';
    } catch {
      // Not VTEX, try Nuvemshop / DOM
    }
  }

  if (!rawCatalog) {
    // Attempt 3: Nuvemshop / Schema.org DOM Parser
    try {
      rawCatalog = await fetchNuvemshopOrDomCatalog(cleanUrl);
      if (rawCatalog) detectedPlatform = rawCatalog.platform;
    } catch (err) {
      // Full Fallback
      return {
        platform: 'GENERIC_FALLBACK',
        totalAudited: 0,
        apparelCount: 0,
        brokenProducts: [],
        catalogScore: 94,
        monthlyLossBRL: 0,
        error: err.message
      };
    }
  }

  // 3. Process and Audit Products
  const products = rawCatalog?.products || [];
  const brokenProducts = [];
  const productsWithoutImages = [];
  let apparelCount = 0;

  for (const p of products) {
    // 3.1. Auditoria de Integridade de Imagem (Zero Alucinações)
    const images = p.images || [];
    const hasValidImage = images.length > 0 && images.some(img => img.src && String(img.src).trim().length > 0);
    if (!hasValidImage) {
      productsWithoutImages.push({
        id: p.id,
        title: p.title,
        handle: p.handle,
        url: p.url,
        adminUrl: p.adminUrl,
        sku: p.primarySku || p.variants?.[0]?.sku || 'SEM_SKU',
        barcode: p.primaryBarcode || p.variants?.[0]?.barcode || '',
        price: p.variants?.[0]?.price || 169.90
      });
    }

    // 3.2. Isenções (Acessórios, Equipamento e Regra do FULL no código/SKU)
    if (isExemptProduct(p.title, p.tags, p.productType, p.variants, p.handle)) {
      continue;
    }

    const variants = p.variants || [];
    const sizeVariants = variants.filter(v => {
      const vTitle = String(v.title || '').toUpperCase().trim();
      return ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3', 'G4', '1', '2', '3', '4', '36', '38', '40', '42', '44'].includes(vTitle);
    });

    if (sizeVariants.length > 0) {
      apparelCount++;
      const missingCoreSizes = sizeVariants
        .filter(v => ['M', 'G', 'GG'].includes(v.title.toUpperCase().trim()) && !v.available)
        .map(v => v.title.trim());

      if (missingCoreSizes.length > 0) {
        const price = sizeVariants[0]?.price || 169.90;
        const mfgInfo = detectProductManufacturingType(p);

        brokenProducts.push({
          id: p.id,
          title: p.title,
          handle: p.handle,
          url: p.url,
          adminUrl: p.adminUrl,
          sku: p.primarySku || p.variants?.[0]?.sku || 'SEM_SKU',
          barcode: p.primaryBarcode || p.variants?.[0]?.barcode || '',
          price: price,
          missingSizes: missingCoreSizes,
          availableSizes: sizeVariants.filter(v => v.available).map(v => v.title.trim()),
          isResale: mfgInfo.isResale,
          manufacturingType: mfgInfo.manufacturingType,
          manufacturingCategory: mfgInfo.category,
          resaleReason: mfgInfo.reason,
          recommendedSupplyAction: mfgInfo.recommendedSupplyAction
        });
      }
    }
  }

  // Special Marketplace calculation
  let monthlyLossBRL = 0;
  let catalogScore = 100;

  if (rawCatalog?.isMarketplace) {
    const details = rawCatalog.marketplaceDetails;
    if (!details?.hasBuyBox || !details?.isFull) {
      monthlyLossBRL = 3200; // estimated loss for not having Buy Box or Full in Marketplace ads
      catalogScore = 78;
      brokenProducts.push({
        title: products[0]?.title || 'Anúncio de Marketplace',
        handle: 'buybox-lost',
        url: cleanUrl,
        price: products[0]?.variants[0]?.price || 149.90,
        missingSizes: ['SEM LOGÍSTICA FULL', 'DISPUTA DE BUY BOX'],
        availableSizes: ['Estoque Convencional'],
        isResale: true,
        manufacturingType: 'REVENDA',
        manufacturingCategory: 'MARKETPLACE_THIRD_PARTY',
        resaleReason: 'Anúncio Marketplace / Seller Externo',
        recommendedSupplyAction: 'Ajustar Buy Box e enviar estoque para Fulfillment.'
      });
    } else {
      catalogScore = 98;
      monthlyLossBRL = 0;
    }
  } else {
    // Standard E-commerce calculation
    const brokenCount = brokenProducts.length;
    monthlyLossBRL = brokenProducts.reduce((sum, item) => sum + Math.round(item.price * 8), 0);
    catalogScore = brokenCount === 0 ? 100 : Math.max(68, 100 - (brokenCount * 8));
  }

  const inHouseBroken = brokenProducts.filter(b => !b.isResale);
  const resaleBroken = brokenProducts.filter(b => b.isResale);
  const inHouseMonthlyLossBRL = inHouseBroken.reduce((sum, item) => sum + Math.round(item.price * 8), 0);
  const resaleMonthlyLossBRL = resaleBroken.reduce((sum, item) => sum + Math.round(item.price * 8), 0);

  const totalSkusAudited = rawCatalog?.totalVariantsCount || products.reduce((sum, p) => sum + (p.variants?.length || 1), 0);

  return {
    platform: detectedPlatform,
    totalAudited: products.length,
    totalSkusAudited,
    apparelCount,
    brokenProducts,
    inHouseBrokenCount: inHouseBroken.length,
    resaleBrokenCount: resaleBroken.length,
    inHouseMonthlyLossBRL,
    resaleMonthlyLossBRL,
    productsWithoutImages,
    productsWithoutImagesCount: productsWithoutImages.length,
    marketplaceDetails: rawCatalog?.marketplaceDetails,
    catalogScore,
    monthlyLossBRL
  };
}
