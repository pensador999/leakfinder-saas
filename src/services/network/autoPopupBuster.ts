/**
 * 🛡️ AUTO-POPUP BUSTER & OVERLAY NEUTRALIZER (ADSHIELD RESILIENCE ENGINE 2026.4)
 * 
 * Remove e neutraliza automaticamente modais obstrutivos em e-commerces:
 * 1. Popups de cupom e newsletter (Klaviyo, Mailchimp, Omnisend, RD Station, Dito, etc.)
 * 2. Banners de cookies / LGPD fixos na tela
 * 3. Backdrops escuros e overlays que interceptam cliques (pointer-events)
 * 4. Chat widgets invasivos (JivoChat, Z-API, botões gigantes de WhatsApp)
 * 5. Restaura o scroll nativo do <body> e <html> bloqueado por overflow: hidden
 */

export interface PopupBusterResult {
  dismissedCount: number;
  hiddenOverlaysCount: number;
  scrollRestored: boolean;
  actionsTaken: string[];
}

/**
 * Script puro que pode ser injetado diretamente em document / window / Puppeteer page.evaluate
 */
export function getInPagePopupBusterScript(): string {
  return `(${neutralizeOverlaysAndPopupsInPage.toString()})()`;
}

/**
 * Função executada dentro do contexto do DOM (browser ou Puppeteer)
 */
export function neutralizeOverlaysAndPopupsInPage(): PopupBusterResult {
  const actionsTaken: string[] = [];
  let dismissedCount = 0;
  let hiddenOverlaysCount = 0;
  let scrollRestored = false;

  try {
    // 1. Simular pressionamento da tecla Escape
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    actionsTaken.push('Disparado evento Escape');

    // 2. Seletores comuns de botões de fechar (Close buttons)
    const closeSelectors = [
      'button[aria-label*="close" i]',
      'button[aria-label*="fechar" i]',
      'button[aria-label*="cancelar" i]',
      'button[aria-label*="dismiss" i]',
      'button[title*="fechar" i]',
      'button[title*="close" i]',
      'a[aria-label*="close" i]',
      'a[aria-label*="fechar" i]',
      '.close-modal',
      '.modal-close',
      '.popup-close',
      '.newsletter-close',
      '.klaviyo-close-form',
      '.omnisend-close-button',
      '[data-action="close-modal"]',
      '[data-dismiss="modal"]',
      '#onesignal-slidedown-cancel-button',
      '.fancybox-close-small',
      '.mfp-close',
      '.featherlight-close',
      'button.close',
      '.btn-close',
      '.cookie-banner-accept',
      '#adopt-accept-all-button',
      '#lgpd-accept'
    ];

    for (const selector of closeSelectors) {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el instanceof HTMLElement && el.offsetParent !== null) {
            el.click();
            dismissedCount++;
            actionsTaken.push(`Clicado botão de fechar: ${selector}`);
          }
        });
      } catch {
        // Ignora seletores inválidos em engines antigas
      }
    }

    // 3. Neutralizar Overlays e Backdrops com z-index alto e fundos escuros
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;

      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex, 10);
      const isFixedOrAbsolute = style.position === 'fixed' || style.position === 'absolute';

      // Critério de Modal/Backdrop:
      // - Posição fixa ou absoluta
      // - z-index alto (>= 500)
      // - Cobre grande parte da tela (largura e altura > 60% da janela)
      if (isFixedOrAbsolute && !isNaN(zIndex) && zIndex >= 500) {
        const rect = el.getBoundingClientRect();
        const coversViewport = (rect.width >= window.innerWidth * 0.6) && (rect.height >= window.innerHeight * 0.6);
        const hasOverlayClass = 
          el.className.toString().toLowerCase().includes('backdrop') ||
          el.className.toString().toLowerCase().includes('overlay') ||
          el.className.toString().toLowerCase().includes('popup') ||
          el.className.toString().toLowerCase().includes('modal') ||
          el.id.toLowerCase().includes('popup') ||
          el.id.toLowerCase().includes('modal');

        if (coversViewport || hasOverlayClass) {
          const hasInput = el.querySelector('input[type="email"], input[type="text"], form');
          const isTransparentBackdrop = style.backgroundColor.includes('rgba') || style.opacity !== '1';

          if (hasInput || hasOverlayClass || isTransparentBackdrop) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            hiddenOverlaysCount++;
            actionsTaken.push(`Ocultado overlay/modal: ${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 30)}`);
          }
        }
      }
    });

    // 4. Restaurar Scroll no <body> e <html>
    const body = document.body;
    const html = document.documentElement;

    if (body) {
      const bodyStyle = window.getComputedStyle(body);
      if (bodyStyle.overflow === 'hidden' || body.style.overflow === 'hidden') {
        body.style.setProperty('overflow', 'auto', 'important');
        body.style.setProperty('position', 'static', 'important');
        scrollRestored = true;
      }
      body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden', 'popup-open', 'has-modal');
    }

    if (html) {
      const htmlStyle = window.getComputedStyle(html);
      if (htmlStyle.overflow === 'hidden' || html.style.overflow === 'hidden') {
        html.style.setProperty('overflow', 'auto', 'important');
        scrollRestored = true;
      }
      html.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
    }

  } catch (err: any) {
    actionsTaken.push(`Erro durante buster: ${err.message}`);
  }

  return {
    dismissedCount,
    hiddenOverlaysCount,
    scrollRestored,
    actionsTaken
  };
}
