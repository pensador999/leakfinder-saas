import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function testHeadlessBrowser() {
  console.log('🚀 Iniciando teste de navegação headless com Chrome nativo...');
  
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  console.log('📍 Executável do Chrome:', executablePath);

  const startTime = Date.now();
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const targetUrl = 'https://example.com';
    console.log(`🌐 Navegando para: ${targetUrl}...`);
    
    const response = await page.goto(targetUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    const status = response ? response.status() : 'N/A';
    const title = await page.title();
    const loadTimeMs = Date.now() - startTime;

    console.log(`✅ Página carregada com sucesso!`);
    console.log(`   - Status HTTP: ${status}`);
    console.log(`   - Título da Página: "${title}"`);
    console.log(`   - Tempo Total de Carga Headless: ${loadTimeMs}ms`);

    // Capturar métricas reais do Performance API do Chromium
    const perfMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      return {
        domInteractiveMs: nav ? Math.round(nav.domInteractive) : 0,
        fcpMs: fcp ? Math.round(fcp.startTime) : 0,
        domCompleteMs: nav ? Math.round(nav.domComplete) : 0
      };
    });

    console.log('📊 Métricas de Performance Reais do Chromium:');
    console.log(`   - First Contentful Paint (FCP): ${perfMetrics.fcpMs}ms`);
    console.log(`   - DOM Interactive: ${perfMetrics.domInteractiveMs}ms`);
    console.log(`   - DOM Complete: ${perfMetrics.domCompleteMs}ms`);

    // Salvar screenshot real de teste
    const screenshotPath = path.resolve('public', 'test_headless_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot salvo com sucesso em: ${screenshotPath}`);

    console.log('\n🎉 TESTE DE NAVEGAÇÃO HEADLESS CONCLUÍDO COM 100% DE SUCESSO!');
  } finally {
    await browser.close();
  }
}

testHeadlessBrowser().catch(err => {
  console.error('❌ Erro no teste headless:', err);
  process.exit(1);
});
