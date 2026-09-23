import fs from 'node:fs';

const stores = [
  { name: 'Honey Be', url: 'https://www.honeybe.com.br', domain: 'honeybe.com.br' },
  { name: 'DLK Moda Fitness', url: 'https://www.dlk.com.br', domain: 'dlk.com.br' },
  { name: 'Alto Giro', url: 'https://www.altogiro.com.br', domain: 'altogiro.com.br' }
];

async function fetchStoreAudit(store) {
  console.log(`\n========================================`);
  console.log(`🔍 AUDITANDO AO VIVO: ${store.name} (${store.domain})`);
  console.log(`========================================`);

  // 1. Fetch HTML to extract CNPJ, Phone, WhatsApp, Address, Meta Pixels
  const res = await fetch(store.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();

  // CNPJ regex
  const cnpjMatch = html.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);
  const cnpj = cnpjMatch ? cnpjMatch[0] : 'Não identificado no HTML principal';

  // WhatsApp / Phone
  const whatsappMatch = html.match(/(?:api\.whatsapp\.com\/send\?phone=|wa\.me\/|whatsapp:)(\d{10,13})/i) ||
                        html.match(/(?:whatsapp|whats|zap)[^\d]{1,15}(\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4})/i);
  const whatsapp = whatsappMatch ? whatsappMatch[1] : 'Verificar SAC';

  // Meta Pixel
  const hasMetaPixel = html.includes('fbq(') || html.includes('connect.facebook.net');
  const hasGtm = html.includes('googletagmanager.com') || html.includes('gtm.start');
  const hasClarity = html.includes('clarity.ms');

  // 2. Fetch products.json
  const prodRes = await fetch(`${store.url}/products.json?limit=30`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    },
    signal: AbortSignal.timeout(10000)
  });
  const prodData = await prodRes.json();
  const products = prodData.products || [];

  console.log(`📦 Produtos extraídos via API pública: ${products.length}`);
  console.log(`🏛️ CNPJ: ${cnpj}`);
  console.log(`📱 WhatsApp: ${whatsapp}`);
  console.log(`📊 Tags: Meta Pixel=${hasMetaPixel}, GTM=${hasGtm}, Clarity=${hasClarity}`);

  // Analyze size breaks and stock issues
  const auditedProducts = [];

  for (const p of products) {
    const variants = p.variants || [];
    const availableVariants = variants.filter(v => v.available);
    const outOfStockVariants = variants.filter(v => !v.available);

    const availableTitles = availableVariants.map(v => v.title.trim());
    const outOfStockTitles = outOfStockVariants.map(v => v.title.trim());

    // Check anchor sizes rupture (M or G out of stock while other sizes are available)
    const hasSizeGrid = variants.length > 1;
    const isMOut = outOfStockTitles.some(t => t.toUpperCase() === 'M');
    const isGOut = outOfStockTitles.some(t => t.toUpperCase() === 'G');
    const isAnchorBroken = hasSizeGrid && (isMOut || isGOut) && availableVariants.length > 0;
    const isCompletelyOutOfStock = variants.length > 0 && availableVariants.length === 0;

    const prodUrl = `${store.url}/products/${p.handle}`;
    const firstImg = p.images && p.images[0] ? p.images[0].src : '';
    const price = variants[0] ? variants[0].price : '0.00';
    const sku = variants[0] ? variants[0].sku : 'N/A';

    auditedProducts.push({
      id: p.id,
      title: p.title,
      handle: p.handle,
      url: prodUrl,
      price,
      sku,
      image: firstImg,
      totalVariants: variants.length,
      availableVariantsCount: availableVariants.length,
      availableSizes: availableTitles,
      outOfStockSizes: outOfStockTitles,
      isAnchorBroken,
      isCompletelyOutOfStock,
      metaAdsLibraryUrl: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(store.domain)}&search_type=keyword_unordered&media_type=all`
    });
  }

  const brokenAnchorProducts = auditedProducts.filter(p => p.isAnchorBroken);
  const totalStockouts = auditedProducts.filter(p => p.isCompletelyOutOfStock);

  console.log(`⚠️ Produtos com Ruptura de Tamanho Âncora (M/G): ${brokenAnchorProducts.length}`);
  console.log(`🛑 Produtos 100% Esgotados: ${totalStockouts.length}`);

  return {
    storeName: store.name,
    domain: store.domain,
    url: store.url,
    cnpj,
    whatsapp,
    hasMetaPixel,
    hasGtm,
    hasClarity,
    totalAudited: auditedProducts.length,
    brokenAnchorCount: brokenAnchorProducts.length,
    totalStockoutsCount: totalStockouts.length,
    brokenAnchorProducts: brokenAnchorProducts.slice(0, 5),
    totalStockouts: totalStockouts.slice(0, 3)
  };
}

async function main() {
  const results = [];
  for (const s of stores) {
    try {
      const res = await fetchStoreAudit(s);
      results.push(res);
    } catch (e) {
      console.error(`Erro ao auditar ${s.name}:`, e.message);
    }
  }

  fs.writeFileSync(
    'data/audit_results/live_audit_3_stores_result.json',
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log('\n✅ Auditoria concluída e salva em data/audit_results/live_audit_3_stores_result.json');
}

main();
