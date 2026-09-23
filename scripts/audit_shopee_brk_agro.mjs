import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_URL = 'https://shopee.com.br/brk_agro';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\lucas\\.gemini\antigravity\\brain\\1a5c0ad3-35fd-4004-84f2-d5e80ec21c0b\\live_execution_prints';

async function auditShopeeStore() {
  console.log('🚀 [AdShield Swarm] Soltando enxame na Shopee Brasil...');
  console.log(`🎯 URL Alvo: ${TARGET_URL}`);

  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false, // Modo visível real para driblar WAF de fingerprinting
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--lang=pt-BR,pt'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  // Stealth injections
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR', 'pt', 'en-US', 'en'] });
    window.chrome = { runtime: {} };
  });

  // Set extra headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
  });

  try {
    console.log('🌐 Navegando até a página da loja/produto na Shopee...');
    const response = await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 45000
    });

    console.log(`📡 Resposta HTTP: ${response ? response.status() : 'N/A'}`);

    // Wait 2 seconds for modal to settle
    await new Promise(r => setTimeout(r, 2000));

    console.log('🛡️ [Popup Buster] Clicando no seletor de idioma "Português (BR)" e Cookies...');
    try {
      // 1. Click "Português (BR)" button
      const clickedLang = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, div, a'));
        const langBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'Português (BR)');
        if (langBtn) {
          langBtn.click();
          return true;
        }
        return false;
      });
      console.log(`🔘 Botão "Português (BR)" clicado: ${clickedLang}`);

      // 2. Click "Aceitar todos os cookies"
      await new Promise(r => setTimeout(r, 1500));
      const clickedCookie = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cookieBtn = buttons.find(b => b.textContent && b.textContent.includes('Aceitar todos os cookies'));
        if (cookieBtn) {
          cookieBtn.click();
          return true;
        }
        return false;
      });
      console.log(`🍪 Botão "Aceitar todos os cookies" clicado: ${clickedCookie}`);

      // Wait 5 seconds for redirection/hydration
      await new Promise(r => setTimeout(r, 5000));

      // If still not on the target page, re-navigate now that cookies are set
      const currentUrl = page.url();
      if (currentUrl.includes('error') || currentUrl.includes('verify')) {
        console.log('🔄 Re-navegando para a URL alvo com cookies definidos...');
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 4000));
      }
    } catch (e) {
      console.log('⚠️ Erro ao clicar no popup:', e.message);
    }

    // Take Full Screen Print of the unlocked page
    const screenshotPath = path.join(ARTIFACT_DIR, '17_shopee_brk_agro_unlocked.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 Screenshot desbloqueado salvo em: ${screenshotPath}`);

    // Extract DOM Information
    const pageData = await page.evaluate(() => {
      const pageTitle = document.title || '';
      const currentUrl = window.location.href;

      // Extract shop info if present
      const shopNameEl = document.querySelector('.section-seller-overview-horizontal__seller-name, .shop-page-header__shop-name, .page-product__seller, h1');
      const shopName = shopNameEl?.textContent?.trim() || '';

      // Seller metrics (Shopee seller badges)
      const sellerStatsEls = document.querySelectorAll('.section-seller-overview-horizontal__seller-stat, .shop-page-header__stat');
      const sellerStats = [];
      sellerStatsEls.forEach(el => sellerStats.push(el.textContent?.trim() || ''));

      // Product details if it resolved to PDP
      const productTitleEl = document.querySelector('.section-product-header__title, ._44qnta, [data-qa-id="product_title"], h1 span');
      const productTitle = productTitleEl?.textContent?.trim() || '';

      const priceEl = document.querySelector('.section-product-header__price, .pqTWkA, .IZexXJ');
      const priceText = priceEl?.textContent?.trim() || '';

      // Product variations (sizes, models)
      const variationButtons = document.querySelectorAll('.product-variation, [role="button"]');
      const variations = [];
      variationButtons.forEach(btn => {
        const txt = btn.textContent?.trim() || '';
        const isDisabled = btn.classList.contains('product-variation--disabled') || 
                           btn.hasAttribute('disabled') || 
                           btn.getAttribute('aria-disabled') === 'true';
        if (txt && txt.length < 30 && !txt.includes('Comprar') && !txt.includes('Adicionar')) {
          variations.push({ name: txt, disabled: isDisabled });
        }
      });

      // Products in shop section
      const itemCards = document.querySelectorAll('.shop-search-result-view__item, .shopee-search-item-result__item, .row > div');
      const productsFound = [];
      itemCards.forEach(card => {
        const tEl = card.querySelector('.Cve6sh, ._10Wbs-');
        const pEl = card.querySelector('.vioxXd, ._1dknjA');
        const sEl = card.querySelector('._1uqDAu, .r6HknA');
        if (tEl && pEl) {
          productsFound.push({
            title: tEl.textContent?.trim() || '',
            price: pEl.textContent?.trim() || '',
            sold: sEl?.textContent?.trim() || ''
          });
        }
      });

      // Check if blocked by captcha
      const isCaptcha = document.body.innerText.includes('Verificação de Segurança') || 
                        document.body.innerText.includes('Deslize para verificar') ||
                        document.body.innerText.includes('Access Denied');

      return {
        pageTitle,
        currentUrl,
        shopName,
        sellerStats,
        productTitle,
        priceText,
        variations: variations.slice(0, 15),
        productsFound: productsFound.slice(0, 10),
        isCaptcha,
        htmlLength: document.body.innerHTML.length
      };
    });

    console.log('\n📊 DADOS EXTRAÍDOS DO DOM DA SHOPEE:');
    console.log(JSON.stringify(pageData, null, 2));

    // Save JSON data
    fs.writeFileSync(
      'data/audit_results/shopee_brk_agro_inspection.json',
      JSON.stringify(pageData, null, 2),
      'utf-8'
    );

    await browser.close();
    return pageData;
  } catch (err) {
    console.error('❌ Erro na inspeção da Shopee:', err.message);
    await browser.close();
    throw err;
  }
}

auditShopeeStore().catch(console.error);
