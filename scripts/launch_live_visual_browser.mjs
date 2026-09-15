// ==============================================================================
// 👁️ NAVEGAÇÃO VISUAL AO VIVO DO ROBÔ (HEADFUL MODE COM JANELA ABERTA)
// Abre a janela real do Google Chrome na tela do Windows para o usuário ver
// o robô navegando, rolando e inspecionando como se fosse um humano.
// ==============================================================================

import puppeteer from 'puppeteer-core';
import path from 'path';

async function launchLiveVisualBrowser() {
  console.log('🚀 [AdShield Live Visual] Abrindo janela física do Chrome na sua tela...');

  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  
  // headless: false -> ABRE A JANELA FÍSICA DO CHROME NA ÁREA DE TRABALHO
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null, // Usa o tamanho natural da janela
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled' // Minimiza detecção de bot
    ]
  });

  try {
    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();

    console.log('🌐 Navegando até a Insider Store (https://www.insiderstore.com.br)...');
    await page.goto('https://www.insiderstore.com.br', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    console.log('✨ Loja carregada! O robô iniciará a inspeção visual na sua frente...');

    // 1. Injeta uma mira visual / laser scanner no topo da página
    await page.evaluate(() => {
      const banner = document.createElement('div');
      banner.id = 'adshield-scanner-hud';
      banner.innerHTML = `
        <div style="
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 9999999;
          background: rgba(15, 23, 42, 0.92);
          border: 2px solid #ef4444;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 20px rgba(239, 68, 68, 0.4);
          color: white;
          padding: 12px 18px;
          border-radius: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(8px);
        ">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 10px #ef4444; animation: pulse 1s infinite;"></div>
          <div>
            <div style="font-weight: 800; color: #f87171; letter-spacing: 0.5px;">🦅 ADSHIELD SWARM: MODO CAÇADOR ATIVO</div>
            <div style="font-size: 11px; color: #cbd5e1;">Inspecionando Vitrine, CTAs e Meta Pixel em tempo real...</div>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    });

    await new Promise(r => setTimeout(r, 1500));

    // 2. Rolagem suave (scroll) para simular inspeção humana e ativar lazy loading
    console.log('📜 Rolando a vitrine suavemente para carregar produtos e ofertas...');
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 900));
    }

    // 3. Destacar botões de compra com contorno neon verde/vermelho
    console.log('🎯 Destacando botões de compra (CTAs) e identificando ofertas...');
    await page.evaluate(() => {
      const buyButtons = Array.from(document.querySelectorAll('button, a')).filter(el => {
        const txt = el.innerText?.toLowerCase() || '';
        return txt.includes('comprar') || txt.includes('adicionar') || txt.includes('garantir') || txt.includes('combine');
      });

      buyButtons.slice(0, 5).forEach(btn => {
        btn.style.outline = '3px solid #10b981';
        btn.style.boxShadow = '0 0 15px #10b981';
        btn.style.transition = 'all 0.3s ease';
      });
    });

    await new Promise(r => setTimeout(r, 2000));

    // 4. Captura screenshot da inspeção ao vivo
    const screenshotPath = path.resolve('public', 'live_visual_inspection_insider.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot salvo com sucesso em: ${screenshotPath}`);

    console.log('⏳ Mantendo a janela aberta por 10 segundos para você visualizar a navegação...');
    await new Promise(r => setTimeout(r, 10000));

    console.log('✅ Inspeção visual concluída com sucesso!');
  } finally {
    await browser.close();
  }
}

launchLiveVisualBrowser().catch(err => {
  console.error('❌ Erro na inspeção visual:', err);
  process.exit(1);
});
