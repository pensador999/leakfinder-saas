async function inspectBrkAgroLive() {
  console.log("=== INSPEÇÃO AO VIVO BRK AGRO ===");
  
  // 1. Tags do DOM
  const t0 = Date.now();
  const resHtml = await fetch('https://www.brkagro.com.br', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await resHtml.text();
  console.log('HTML Status:', resHtml.status, 'Tamanho:', html.length, 'Tempo:', Date.now() - t0, 'ms');
  
  const ga4Matches = html.match(/G-[A-Z0-9]{6,12}/g);
  console.log('GA4 ID Real:', ga4Matches ? Array.from(new Set(ga4Matches)) : 'NONE');

  const clarityMatch = html.match(/clarity\.ms\/tag\/([a-zA-Z0-9]+)/i);
  console.log('Clarity Project ID Real:', clarityMatch ? clarityMatch[1] : 'NONE');

  const gtmMatch = html.match(/GTM-[A-Z0-9]{4,10}/i);
  console.log('GTM ID Real:', gtmMatch ? gtmMatch[0] : 'NONE');

  const pixelMatch = html.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/i);
  console.log('Meta Pixel ID Real:', pixelMatch ? pixelMatch[1] : 'NONE');

  const hasCnpj = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(html);
  console.log('CNPJ no Rodapé:', hasCnpj);

  // 2. Paginação do Catálogo
  let page = 1;
  let totalProducts = 0;
  let totalVariants = 0;

  while (page <= 20) {
    const pageUrl = `https://www.brkagro.com.br/products.json?limit=250&page=${page}`;
    const pStart = Date.now();
    const resP = await fetch(pageUrl, {
      headers: { 'User-Agent': 'AdShield-War-Audit/2026.4' }
    });
    if (!resP.ok) break;
    const data = await resP.json();
    const list = data.products || [];
    if (list.length === 0) break;

    let pVariants = 0;
    list.forEach(p => pVariants += (p.variants || []).length);

    totalProducts += list.length;
    totalVariants += pVariants;
    console.log(`Página ${page}: ${list.length} produtos | ${pVariants} SKUs | ${Date.now() - pStart}ms`);
    if (list.length < 250) break;
    page++;
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🏆 TOTAL REAL BRK AGRO: ${totalProducts} produtos pai | ${totalVariants} SKUs de variantes reais!`);
}
inspectBrkAgroLive();
