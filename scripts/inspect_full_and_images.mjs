async function inspectFullAndImages() {
  console.log("=== DIAGNÓSTICO: REGRAS FULL & PRODUTOS SEM IMAGEM (BRK AGRO) ===");
  
  let page = 1;
  let allProducts = [];
  while (page <= 11) {
    const res = await fetch(`https://www.brkagro.com.br/products.json?limit=250&page=${page}`, {
      headers: { 'User-Agent': 'AdShield-Diagnostic/2026.4' }
    });
    if (!res.ok) break;
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    allProducts.push(...data.products);
    if (data.products.length < 250) break;
    page++;
  }
  console.log(`Total baixado: ${allProducts.length} produtos.`);

  // 1. Identificar produtos com "FULL"
  let fullCount = 0;
  const sampleFull = [];
  allProducts.forEach(p => {
    const inTitle = (p.title || '').toUpperCase().includes('FULL');
    const inHandle = (p.handle || '').toUpperCase().includes('FULL');
    const inTags = (p.tags || []).some(t => String(t).toUpperCase().includes('FULL'));
    const inSku = (p.variants || []).some(v => String(v.sku || '').toUpperCase().includes('FULL'));
    if (inTitle || inHandle || inTags || inSku) {
      fullCount++;
      if (sampleFull.length < 5) {
        sampleFull.push({
          id: p.id,
          title: p.title,
          handle: p.handle,
          inTitle, inHandle, inTags, inSku,
          skus: p.variants.slice(0, 3).map(v => v.sku)
        });
      }
    }
  });
  console.log(`\n📦 Produtos com flag FULL detectados: ${fullCount}`);
  console.log("Amostra de produtos FULL:", JSON.stringify(sampleFull, null, 2));

  // 2. Identificar produtos SEM IMAGEM (images.length === 0 ou sem src)
  const missingImages = [];
  allProducts.forEach(p => {
    const images = p.images || [];
    const hasValidImage = images.length > 0 && images.some(img => img.src && img.src.trim().length > 0);
    if (!hasValidImage) {
      missingImages.push({
        id: p.id,
        title: p.title,
        handle: p.handle,
        url: `https://www.brkagro.com.br/products/${p.handle}`,
        imagesCount: images.length,
        variantsCount: (p.variants || []).length,
        price: p.variants?.[0]?.price
      });
    }
  });

  console.log(`\n🚨 PRODUTOS REAIS SEM IMAGEM DETECTADOS: ${missingImages.length}`);
  if (missingImages.length > 0) {
    console.log("Lista completa de produtos sem imagem:");
    missingImages.forEach((p, idx) => {
      console.log(`[${idx + 1}] ID: ${p.id} | "${p.title}" | Preço: R$ ${p.price}`);
      console.log(`    URL: ${p.url}`);
    });
  }
}
inspectFullAndImages();
