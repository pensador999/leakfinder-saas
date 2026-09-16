// ==============================================================================
// 🛡️ ADSHIELD SENTINEL • CONTENT SCRIPT 3.1 (ZERO-FALSE-POSITIVE ENGINE)
// Live DOM & Native Payload Variant Extractor across Shopify, Nuvemshop,
// VTEX, Yampi and Custom e-commerce platforms.
// ==============================================================================

(function () {
  let auditResult = null;

  // Single-size accessory terms that must NOT trigger false alerts for P/M/G
  const SINGLE_SIZE_TERMS = [
    'BONÉ', 'BONE', 'MEIA', 'CINTO', 'BANDANA', 'MANGUITO', 'GARRAFA', 
    'COPO', 'ÓCULOS', 'OCULOS', 'CARTEIRA', 'ADESIVO', 'CHAVEIRO', 
    'WHEY', 'CREATINA', 'SUPLEMENTO', 'MOCHILA', 'BOLSA', 'CAPA', 
    'PULSEIRA', 'COLAR', 'BRINCO', 'LENÇO', 'LENCO', 'MÁSCARA', 'MASCARA'
  ];

  function runAudit() {
    const html = document.documentElement.outerHTML || '';
    const bodyText = document.body ? document.body.innerText || '' : '';
    const pageTitle = (document.querySelector('h1')?.innerText || document.title || '').trim();
    const titleUpper = pageTitle.toUpperCase();

    // 1. Detect E-Commerce Platform
    let platform = 'E-commerce';
    if (html.includes('cdn.shopify.com') || window.Shopify) {
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
    } else if (html.includes('yampi.io') || html.includes('yampi.com.br')) {
      platform = 'Yampi';
    }

    // 2. Check Exemption Rules (Zero False-Positive Guard)
    const isFullTag = html.includes('_FULL') || html.includes('_full') || titleUpper.includes('_FULL');
    const isAccessory = SINGLE_SIZE_TERMS.some((term) => titleUpper.includes(term));
    const isOneSizeText = bodyText.includes('Tamanho Único') || bodyText.includes('Tamanho Unico') || bodyText.includes('One Size');

    const isExempt = isFullTag || isAccessory || isOneSizeText;
    const exemptionReason = isFullTag 
      ? 'Isento (Regra _FULL Fulfillment)' 
      : (isAccessory ? 'Isento (Acessório / Tamanho Único)' : (isOneSizeText ? 'Isento (Tamanho Único)' : ''));

    // 3. Detect Stock Rupture in Sizes with Multiplatform Selectors
    let ruptureDetected = false;
    let ruptureDetails = 'Grade Completa';
    let estimatedWasteMonthly = 0;
    const rupturedSizes = [];

    if (!isExempt) {
      // Platform-specific selectors
      let soldOutSelector = '';

      if (platform === 'Shopify') {
        soldOutSelector = [
          'fieldset.product-form__input input[type="radio"]:disabled + label',
          '.product-form__input option:disabled',
          '.variant-input--unavailable label',
          '.swatch-element.soldout label',
          'variant-radios input:disabled + label',
          '[data-available="false"]'
        ].join(',');
      } else if (platform === 'Nuvemshop') {
        soldOutSelector = [
          '.product-variants-item.out-of-stock',
          '.product-variants-item.js-outofstock',
          '.js-variant-select option:disabled',
          'input[name*="variation"]:disabled + label'
        ].join(',');
      } else if (platform === 'VTEX') {
        soldOutSelector = [
          '.vtex-sku-selector-1-x-unavailable',
          '.vtex-sku-selector-1-x-skuSelectorItem--unavailable',
          '.item_unavailable',
          '.item_unavaliable',
          '.skuselector .unavailable'
        ].join(',');
      } else if (platform === 'Yampi') {
        soldOutSelector = [
          '.yampi-variation-item.is-disabled',
          '.swatch-option.disabled',
          '[data-variation-id].out-of-stock'
        ].join(',');
      } else {
        // Fallback for custom e-commerces
        soldOutSelector = [
          '.sold-out',
          '.sold_out',
          '.is-sold-out',
          '.disabled[data-value]',
          'button[disabled][data-variant-id]',
          '[data-available="false"]'
        ].join(',');
      }

      const unavailableElements = document.querySelectorAll(soldOutSelector);
      
      unavailableElements.forEach((el) => {
        const txt = (el.textContent || el.innerText || el.getAttribute('data-value') || '').trim().toUpperCase();
        if (txt && !rupturedSizes.includes(txt) && txt.length <= 6) {
          rupturedSizes.push(txt);
        }
      });

      if (rupturedSizes.length > 0) {
        ruptureDetected = true;
        ruptureDetails = `${rupturedSizes.join(', ')} esgotado(s)`;
        estimatedWasteMonthly = Math.round(rupturedSizes.length * 1250);
      } else if (unavailableElements.length > 0) {
        ruptureDetected = true;
        ruptureDetails = `${unavailableElements.length} tamanho(s) esgotado(s)`;
        estimatedWasteMonthly = Math.round(unavailableElements.length * 1250);
      }
    } else {
      ruptureDetails = exemptionReason;
    }

    // 4. Detect Meta Pixel, GTM, GA4
    const hasMetaPixel = html.includes('fbevents.js') || html.includes('fbq(') || html.includes('connect.facebook.net');
    const hasGtm = html.includes('googletagmanager.com/gtm.js');
    const hasGa4 = html.includes('gtag/js') || html.includes('GoogleAnalyticsObject');

    // 5. Detect Size Chart Widget
    const hasSizeChart = 
      Boolean(document.querySelector('product-addons[data-custom-class*="size_chart"]')) ||
      Boolean(document.querySelector('.tabela-medidas, .tabela_medidas, .size-chart, .guia-tamanhos, #tabela-medidas, a[href*="tabela-de-medidas"]')) ||
      bodyText.includes('Tabela de Medidas') ||
      bodyText.includes('Guia de Tamanhos');

    // 6. Detect Brazilian Legal Compliance (CNPJ)
    const cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/;
    const hasCnpj = cnpjRegex.test(bodyText) || cnpjRegex.test(html);

    // 7. Calculate Integrity Score (0 to 100)
    let integrityScore = 100;
    if (ruptureDetected) integrityScore -= 30;
    if (!hasMetaPixel) integrityScore -= 20;
    if (!hasSizeChart && !isExempt) integrityScore -= 15;
    if (!hasCnpj) integrityScore -= 10;
    integrityScore = Math.max(35, Math.min(100, integrityScore));

    auditResult = {
      success: true,
      platform,
      hasMetaPixel,
      hasGtm,
      hasGa4,
      ruptureDetected,
      ruptureDetails,
      isExempt,
      exemptionReason,
      estimatedWasteMonthly,
      hasSizeChart,
      hasCnpj,
      integrityScore,
      url: window.location.href,
      domain: window.location.hostname.replace(/^www\./, '')
    };

    // Notify background worker to update browser badge
    try {
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          action: 'UPDATE_BADGE',
          hasRupture: ruptureDetected,
          score: integrityScore
        });
      }
    } catch (e) {
      // Worker sleeping
    }

    // Mount In-Page Floating HUD if this is a product page or rupture detected
    injectFloatingHUD(auditResult);

    return auditResult;
  }

  // Injects an isolated, non-intrusive HUD in the bottom right corner
  function injectFloatingHUD(result) {
    if (document.getElementById('adshield-sentinel-hud-container')) return;

    const isPdp = window.location.pathname.includes('/products/') ||
                  window.location.pathname.includes('/produto/') ||
                  window.location.pathname.includes('/p/') ||
                  document.querySelector('form[action*="/cart/add"], button[name="add"], .add-to-cart');

    if (!isPdp && !result.ruptureDetected) return;

    const host = document.createElement('div');
    host.id = 'adshield-sentinel-hud-container';
    host.style.position = 'fixed';
    host.style.bottom = '20px';
    host.style.right = '20px';
    host.style.zIndex = '2147483647';
    host.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const shadow = host.attachShadow({ mode: 'closed' });

    let statusText = '';
    if (result.ruptureDetected) {
      statusText = `🚨 AdShield Alerta: ${result.ruptureDetails} (Risco est. R$ ${result.estimatedWasteMonthly.toLocaleString('pt-BR')}/mês)`;
    } else if (result.isExempt) {
      statusText = `🛡️ AdShield: ${result.exemptionReason} • Score ${result.integrityScore}`;
    } else {
      statusText = `🛡️ AdShield: Grade 100% Íntegra • Score ${result.integrityScore}`;
    }

    shadow.innerHTML = `
      <style>
        .hud-card {
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #1e293b;
          border-radius: 9999px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        .hud-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }
        .hud-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${result.ruptureDetected ? '#ef4444' : '#10b981'};
          box-shadow: 0 0 10px ${result.ruptureDetected ? '#ef4444' : '#10b981'};
          animation: ${result.ruptureDetected ? 'pulse 1.5s infinite' : 'none'};
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .hud-btn-close {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          padding: 2px 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .hud-btn-close:hover {
          color: #cbd5e1;
        }
      </style>
      <div class="hud-card" id="hudCard">
        <div class="hud-pill" id="hudPill">
          <div class="hud-status-dot"></div>
          <span>${statusText}</span>
        </div>
        <button class="hud-btn-close" id="hudClose" title="Minimizar">✕</button>
      </div>
    `;

    document.body.appendChild(host);

    const closeBtn = shadow.getElementById('hudClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        host.style.display = 'none';
      });
    }

    const pill = shadow.getElementById('hudPill');
    if (pill) {
      pill.addEventListener('click', () => {
        if (result.ruptureDetected) {
          alert(`[AdShield Sentinel]\n\n⚠️ Atenção: Detectamos ruptura neste produto!\n• ${result.ruptureDetails}\n• Risco financeiro estimado: R$ ${result.estimatedWasteMonthly.toLocaleString('pt-BR')}/mês em anúncios.\n\nAbra o ícone do AdShield no Chrome para ativar o monitoramento contínuo 24/7.`);
        }
      });
    }
  }

  // Listen to requests from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'AUDIT_PAGE') {
      const res = runAudit();
      sendResponse(res);
      return true;
    }
  });

  // Auto-run on page load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(runAudit, 1200);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(runAudit, 1200));
  }
})();
