// ==============================================================================
// 🛡️ ADSHIELD CHROME EXTENSION CONTENT SCRIPT 2.0
// Inspects active e-commerce DOM for platforms, Meta pixels, stock ruptures,
// size chart widgets, and Brazilian legal compliance (CNPJ)
// ==============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUDIT_PAGE') {
    try {
      const html = document.documentElement.outerHTML || '';
      const bodyText = document.body ? document.body.innerText || '' : '';

      // 1. Detect E-Commerce Platform
      let platform = 'E-commerce';
      if (html.includes('cdn.shopify.com') || (window as any).Shopify) {
        platform = 'Shopify';
      } else if (html.includes('vtexassets.com') || html.includes('vtex.com')) {
        platform = 'VTEX';
      } else if (html.includes('nuvemshop.com.br') || html.includes('d3ugyf2ht6aenh.cloudfront.net')) {
        platform = 'Nuvemshop';
      } else if (html.includes('tray.com.br')) {
        platform = 'Tray';
      } else if (html.includes('lojaintegrada.com.br')) {
        platform = 'Loja Integrada';
      } else if (html.includes('wp-content/plugins/woocommerce')) {
        platform = 'WooCommerce';
      }

      // 2. Detect Meta Pixel, GTM, GA4
      const hasMetaPixel = html.includes('fbevents.js') || html.includes('fbq(') || html.includes('connect.facebook.net');
      const hasGtm = html.includes('googletagmanager.com/gtm.js');
      const hasGa4 = html.includes('gtag/js') || html.includes('GoogleAnalyticsObject');

      // 3. Detect Stock Rupture in Sizes
      let ruptureDetected = false;
      let ruptureDetails = 'Grade Completa';
      let estimatedWasteMonthly = 0;

      // Look for unavailable variant buttons or options
      const soldOutSelectors = [
        '[data-available="false"]',
        '.sold-out',
        '.sold_out',
        '.is-sold-out',
        '.disabled[data-value]',
        '.unavailable',
        'button[disabled][data-variant-id]',
        '.variant-input--unavailable'
      ];

      const unavailableElements = document.querySelectorAll(soldOutSelectors.join(','));
      const pageHasSoldOutText = bodyText.includes('Esgotado') || bodyText.includes('Avise-me quando chegar') || bodyText.includes('Sem estoque');

      // Check if product has exemption rule _FULL
      const isFullExempted = html.includes('_FULL') || html.includes('_full') || bodyText.includes('Tamanho Único');

      if ((unavailableElements.length > 0 || pageHasSoldOutText) && !isFullExempted) {
        ruptureDetected = true;
        const count = unavailableElements.length || 2;
        ruptureDetails = `${count} tamanhos esgotados`;
        estimatedWasteMonthly = Math.round(count * 1250);
      } else if (isFullExempted) {
        ruptureDetails = 'Isento (Regra _FULL / Único)';
      }

      // 4. Detect Size Chart Widget (Respect Theme-level widgets)
      const hasSizeChart = 
        Boolean(document.querySelector('product-addons[data-custom-class*="size_chart"]')) ||
        Boolean(document.querySelector('.tabela-medidas, .tabela_medidas, .size-chart, .guia-tamanhos, #tabela-medidas, a[href*="tabela-de-medidas"]')) ||
        bodyText.includes('Tabela de Medidas') ||
        bodyText.includes('Guia de Tamanhos');

      // 5. Detect Brazilian Legal Compliance (CNPJ in footer)
      const cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/;
      const hasCnpj = cnpjRegex.test(bodyText) || cnpjRegex.test(html);

      // 6. Calculate Integrity Score (0 to 100)
      let integrityScore = 100;
      if (ruptureDetected) integrityScore -= 30;
      if (!hasMetaPixel) integrityScore -= 20;
      if (!hasSizeChart) integrityScore -= 15;
      if (!hasCnpj) integrityScore -= 10;
      integrityScore = Math.max(35, Math.min(100, integrityScore));

      sendResponse({
        success: true,
        platform,
        hasMetaPixel,
        hasGtm,
        hasGa4,
        ruptureDetected,
        ruptureDetails,
        estimatedWasteMonthly,
        hasSizeChart,
        hasCnpj,
        integrityScore
      });
    } catch (err) {
      sendResponse({
        success: false,
        error: String(err)
      });
    }
  }
  return true;
});

