async function inspectFishingImages() {
  console.log("=== VERIFICAÇÃO DE IMAGENS NA BRK FISHING ===");
  let page = 1;
  let missingImagesFishing = [];
  while (page <= 10) {
    const res = await fetch(`https://www.brkfishing.com.br/products.json?limit=250&page=${page}`, {
      headers: { 'User-Agent': 'AdShield-Image-Audit/2026.4' }
    });
    if (!res.ok) break;
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    data.products.forEach(p => {
      const imgs = p.images || [];
      const hasValidImage = imgs.length > 0 && imgs.some(img => img.src && img.src.trim().length > 0);
      if (!hasValidImage) {
        missingImagesFishing.push({
          id: p.id,
          title: p.title,
          handle: p.handle,
          url: `https://www.brkfishing.com.br/products/${p.handle}`,
          price: p.variants?.[0]?.price
        });
      }
    });
    if (data.products.length < 250) break;
    page++;
  }
  console.log(`BRK Fishing: ${missingImagesFishing.length} produtos sem imagem encontrados.`);
  missingImagesFishing.forEach((p, idx) => {
    console.log(`[${idx + 1}] ID: ${p.id} | "${p.title}" | Preço: R$ ${p.price}`);
    console.log(`    URL: ${p.url}`);
  });
}
inspectFishingImages();
