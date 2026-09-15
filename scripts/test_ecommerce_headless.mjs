import puppeteer from 'puppeteer-core';
import path from 'path';

async function testEcommerceHeadless() {
  console.log('🛍️ Iniciando teste headless em loja real de e-commerce...');
  
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,900'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    const targetUrl = 'https://www.insiderstore.com.br';
    console.log(`🌐 Acessando vitrine: ${targetUrl}...`);
    
    const start = Date.now();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const loadTime = Date.now() - start;

    const title = await page.title();
    console.log(`✅ Título da Loja: "${title}" (${loadTime}ms)`);

    // Inspecionar botões e seletores reais renderizados
    const auditData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a')).filter(el => {
        const txt = el.innerText?.toLowerCase() || '';
        return txt.includes('comprar') || txt.includes('adicionar') || txt.includes('garantir');
      });

      const pixDetected = document.body.innerText.toLowerCase().includes('pix');
      const freteDetected = document.body.innerText.toLowerCase().includes('frete');

      return {
        ctaCount: buttons.length,
        firstCtaText: buttons[0]?.innerText?.trim()?.slice(0, 40) || 'Nenhum botão óbvio',
        hasPix: pixDetected,
        hasFrete: freteDetected
      };
    });

    console.log('🔍 Auditoria Headless Realizada no DOM Renderizado:');
    console.log(`   - Botões de Compra Renderizados: ${auditData.ctaCount}`);
    console.log(`   - Primeiro CTA Encontrado: "${auditData.firstCtaText}"`);
    console.log(`   - Pix Identificado na Renderização: ${auditData.hasPix ? 'Sim ✓' : 'Não'}`);
    console.log(`   - Frete Identificado na Renderização: ${auditData.hasFrete ? 'Sim ✓' : 'Não'}`);

    const screenshotPath = path.resolve('public', 'ecommerce_headless_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot real da vitrine salvo em: ${screenshotPath}`);

    console.log('\n🎉 TESTE EM LOJA REAL CONCLUÍDO COM 100% DE SUCESSO!');
  } finally {
    await browser.close();
  }
}

testEcommerceHeadless().catch(err => {
  console.error('❌ Erro no teste em e-commerce:', err);
  process.exit(1);
});
