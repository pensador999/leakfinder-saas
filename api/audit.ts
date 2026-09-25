/// <reference types="node" />
// ==============================================================================
// ⚡ VERCEL SERVERLESS FUNCTION: /api/audit
// Serverless Headless E-Commerce Inspector via @sparticuz/chromium & puppeteer-core
// Works natively inside Vercel without external servers!
// ==============================================================================

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import os from 'os';

export const config = {
  maxDuration: 60, // Até 60 segundos no Vercel Pro ou limite máximo do Hobby
};

function sendResponse(response: any, statusCode: number, data: any) {
  if (response?.status && typeof response.status === 'function') {
    return response.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

// ==============================================================================
// 🔒 VALIDAÇÃO ANTI-SSRF (Server-Side Request Forgery)
// ==============================================================================
function validateAndSanitizeUrl(rawUrl: string): { isValid: boolean; sanitizedUrl: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, sanitizedUrl: '', error: 'URL vazia ou inválida.' };
  }

  let formatted = rawUrl.trim();
  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(formatted);
  if (hasProtocol) {
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      return { isValid: false, sanitizedUrl: '', error: 'Protocolo proibido. Apenas HTTP e HTTPS são permitidos.' };
    }
  } else {
    formatted = `https://${formatted}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(formatted);
  } catch {
    return { isValid: false, sanitizedUrl: '', error: 'Formato de URL malformado.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, sanitizedUrl: '', error: 'Protocolo proibido. Apenas HTTP e HTTPS são permitidos.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Bloqueio de localhost e nomes locais
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === 'local') {
    return { isValid: false, sanitizedUrl: '', error: 'Acesso a endereços locais (localhost) é bloqueado por segurança.' };
  }

  // Bloqueio de metadados de Cloud Providers (AWS, GCP, Vercel, Azure)
  if (
    hostname === '169.254.169.254' ||
    hostname === 'metadata.google.internal' ||
    hostname === 'metadata' ||
    hostname.includes('internal')
  ) {
    return { isValid: false, sanitizedUrl: '', error: 'Acesso a serviços de metadados internos de nuvem é bloqueado.' };
  }

  // Bloqueio de ranges IPv4 privados e loopback
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipMatch = hostname.match(ipv4Regex);
  if (ipMatch) {
    const [, a, b, c, d] = ipMatch.map(Number);
    if (a === 0 || a === 127) {
      return { isValid: false, sanitizedUrl: '', error: 'Acesso a IPs de loopback (127.x.x.x ou 0.0.0.0) é proibido.' };
    }
    if (a === 10) {
      return { isValid: false, sanitizedUrl: '', error: 'Acesso à rede privada (10.x.x.x) é proibido.' };
    }
    if (a === 172 && b >= 16 && b <= 31) {
      return { isValid: false, sanitizedUrl: '', error: 'Acesso à rede privada (172.16-31.x.x) é proibido.' };
    }
    if (a === 192 && b === 168) {
      return { isValid: false, sanitizedUrl: '', error: 'Acesso à rede privada (192.168.x.x) é proibido.' };
    }
    if (a === 169 && b === 254) {
      return { isValid: false, sanitizedUrl: '', error: 'Acesso a link-local (169.254.x.x) é proibido.' };
    }
  }

  // Bloqueio de IPv6 loopback ou local
  if (hostname === '::1' || hostname === '[::1]' || hostname.startsWith('fe80:') || hostname.startsWith('fc00:')) {
    return { isValid: false, sanitizedUrl: '', error: 'Acesso a IPv6 de loopback ou privado é proibido.' };
  }

  // Bloqueio de portas de infraestrutura interna
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    const blockedPorts = [22, 25, 110, 143, 445, 2049, 2375, 2376, 3306, 5432, 6379, 8080, 9200, 27017];
    if (blockedPorts.includes(portNum)) {
      return { isValid: false, sanitizedUrl: '', error: `Acesso à porta ${portNum} é bloqueado por segurança.` };
    }
  }

  return { isValid: true, sanitizedUrl: formatted };
}

export default async function handler(request: any, response: any) {
  // 1. CORS Preflight
  const method = (request.method || (typeof request.headers?.get === 'function' ? 'GET' : 'GET')).toUpperCase();
  if (method === 'OPTIONS') {
    return sendResponse(response, 204, {});
  }

  // 2. Extrai URL da loja
  let targetUrl = '';
  let includeScreenshot = false;

  if (method === 'POST') {
    try {
      const body = typeof request.json === 'function' ? await request.json() : request.body;
      targetUrl = body?.url || '';
      includeScreenshot = Boolean(body?.includeScreenshot);
    } catch {
      targetUrl = request.body?.url || '';
      includeScreenshot = Boolean(request.body?.includeScreenshot);
    }
  } else if (method === 'GET') {
    const urlObj = new URL(request.url || 'http://localhost', 'http://localhost');
    targetUrl = urlObj.searchParams.get('url') || request.query?.url || '';
    includeScreenshot = urlObj.searchParams.get('screenshot') === 'true' || request.query?.screenshot === 'true';
  }

  if (!targetUrl) {
    return sendResponse(response, 400, {
      success: false,
      error: 'Parâmetro "url" é obrigatório. Envie no body (POST) ou na query string ?url=... (GET)'
    });
  }

  // Validação e Proteção Estrita Anti-SSRF
  const validation = validateAndSanitizeUrl(targetUrl);
  if (!validation.isValid) {
    return sendResponse(response, 403, {
      success: false,
      error: `[SSRF Protection] ${validation.error}`
    });
  }

  targetUrl = validation.sanitizedUrl;

  const startTime = Date.now();
  let browser = null;

  try {
    // 3. Determina o caminho do Chromium (Linux/Vercel vs Local Windows)
    const isWindows = os.platform() === 'win32';
    const executablePath = isWindows
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : await chromium.executablePath();

    const args = isWindows
      ? [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      : [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process',
          '--no-zygote'
        ];

    browser = await puppeteer.launch({
      args,
      defaultViewport: { width: 1280, height: 900 },
      executablePath,
      headless: isWindows ? 'new' : ((chromium as any).headless ?? true)
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    // Bloqueia mídias pesadas para economizar largura de banda na Vercel
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const rt = req.resourceType();
      if (['media', 'font'].includes(rt)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    let httpStatus = 200;
    try {
      const navRes = await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });
      if (navRes) {
        httpStatus = navRes.status();
      }
    } catch (navErr: any) {
      console.warn(`[Vercel Serverless Audit] Timeout parcial em ${targetUrl}:`, navErr.message);
    }

    const loadTimeMs = Date.now() - startTime;
    const pageTitle = await page.title().catch(() => 'Loja Virtual');

    // 4. Executa auditoria aprofundada do DOM hidratado
    const rawAudit = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerHTML).join(' ');
      const hasMetaPixel = scripts.includes('connect.facebook.net') || scripts.includes('fbq(') || !!(window as any).fbq;
      const hasGoogleTagManager = scripts.includes('googletagmanager.com') || !!(window as any).dataLayer;
      const hasTikTokPixel = scripts.includes('analytics.tiktok.com') || !!(window as any).ttq;
      const hasGoogleAnalytics4 = scripts.includes('gtag(') || scripts.includes('G-');

      let metaPixelId: string | undefined;
      const pixelMatch = scripts.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/);
      if (pixelMatch) {
        metaPixelId = pixelMatch[1];
      }

      // CTAs
      const allButtons = Array.from(document.querySelectorAll('button, a'));
      const ctas = allButtons.filter(el => {
        const txt = (el as HTMLElement).innerText?.toLowerCase() || el.textContent?.toLowerCase() || '';
        return txt.includes('comprar') || txt.includes('adicionar') || txt.includes('garantir') || txt.includes('eu quero');
      });

      const bodyText = document.body?.innerText?.toLowerCase() || '';
      const hasPixDiscount = bodyText.includes('pix') && (bodyText.includes('% off') || bodyText.includes('desconto'));
      const hasFreeShippingMention = bodyText.includes('frete grátis') || bodyText.includes('frete gratis');

      // WhatsApp
      let detectedWhatsApp: string | undefined;
      let whatsAppLink: string | undefined;

      const waAnchor = Array.from(document.querySelectorAll('a')).find(a => {
        const href = a.href || '';
        return href.includes('wa.me') || href.includes('api.whatsapp.com');
      });

      if (waAnchor) {
        whatsAppLink = waAnchor.href;
        const phoneMatch = waAnchor.href.match(/phone=(\d+)/) || waAnchor.href.match(/wa\.me\/(\d+)/);
        if (phoneMatch) {
          detectedWhatsApp = phoneMatch[1];
        }
      }

      if (!detectedWhatsApp) {
        const phonePattern = /(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))/;
        const match = bodyText.match(phonePattern);
        if (match && match[0]) {
          detectedWhatsApp = match[0].replace(/\D/g, '');
        }
      }

      const hasFloatingChatWidget = !!document.querySelector('[id*="whatsapp"], [class*="whatsapp"], [id*="chat"], [class*="chat-widget"]');

      // Produtos
      const productCards = Array.from(document.querySelectorAll('[class*="product"], [class*="card"], [data-product-id]'));
      const sampleProducts: {
        title: string;
        price: number;
        availableSizes: string[];
        missingSizes: string[];
        hasRupture: boolean;
      }[] = [];

      productCards.slice(0, 6).forEach(card => {
        const titleEl = card.querySelector('h2, h3, [class*="title"], [class*="name"]');
        const priceEl = card.querySelector('[class*="price"]');
        const title = titleEl?.textContent?.trim() || '';
        
        let price = 0;
        if (priceEl) {
          const rawPrice = priceEl.textContent || '';
          const cleaned = rawPrice.replace(/[^\d,]/g, '').replace(',', '.');
          price = parseFloat(cleaned) || 0;
        }

        if (title.length > 3 && price > 0) {
          const sizeButtons = Array.from(card.querySelectorAll('[class*="size"], [class*="variant"], button'));
          const availableSizes: string[] = [];
          const missingSizes: string[] = [];

          sizeButtons.forEach(btn => {
            const txt = btn.textContent?.trim().toUpperCase() || '';
            if (['PP', 'P', 'M', 'G', 'GG', 'XG', '38', '39', '40', '41', '42'].includes(txt)) {
              const isUnavailable = btn.classList.contains('disabled') || 
                                    btn.classList.contains('sold-out') || 
                                    btn.getAttribute('disabled') !== null;
              if (isUnavailable) {
                missingSizes.push(txt);
              } else {
                availableSizes.push(txt);
              }
            }
          });

          const hasRupture = missingSizes.some(s => ['M', 'G', '40', '41', '42'].includes(s));

          sampleProducts.push({
            title,
            price,
            availableSizes: availableSizes.length > 0 ? availableSizes : [],
            missingSizes: missingSizes.length > 0 ? missingSizes : [],
            hasRupture: missingSizes.length > 0
          });
        }
      });

      // Marketplace Seller & Listing Title Extraction (Shopee, Meli, Amazon)
      let marketplaceSellerName: string | undefined;
      let marketplaceItemTitle: string | undefined;

      const sellerEl = document.querySelector('.section-seller-overview-horizontal__seller-name, [data-sqe="seller_name"], [class*="seller-name"], [class*="seller_name"], .ui-pdp-seller__link-trigger');
      if (sellerEl) {
        marketplaceSellerName = sellerEl.textContent?.trim();
      }

      const itemTitleEl = document.querySelector('h1, [class*="product-briefing"] h1, [class*="item-title"], [data-sqe="item_name"], .ui-pdp-title');
      if (itemTitleEl) {
        marketplaceItemTitle = itemTitleEl.textContent?.trim();
      }

      return {
        hasMetaPixel,
        metaPixelId,
        hasGoogleTagManager,
        hasTikTokPixel,
        hasGoogleAnalytics4,
        ctaCount: ctas.length,
        primaryCtaText: ctas[0]?.textContent?.trim()?.slice(0, 40) || 'Comprar Agora',
        hasPixDiscount,
        hasFreeShippingMention,
        detectedWhatsApp,
        whatsAppLink,
        hasFloatingChatWidget,
        visibleProductsCount: productCards.length,
        sampleProducts,
        marketplaceSellerName,
        marketplaceItemTitle,
        rawHtmlSnippet: (document.documentElement ? document.documentElement.outerHTML : document.body.innerHTML || '').slice(0, 50000)
      };
    });

    // Se o título SPA for institucional da Shopee/Meli, prioriza o título do anúncio extraído do DOM
    let effectiveTitle = pageTitle;
    if (rawAudit.marketplaceItemTitle && (
      effectiveTitle.toLowerCase().includes('shopee brasil') || 
      effectiveTitle.toLowerCase().includes('mercado livre brasil') || 
      effectiveTitle.trim().toLowerCase() === 'shopee' ||
      effectiveTitle.trim().toLowerCase() === 'mercado livre'
    )) {
      effectiveTitle = rawAudit.marketplaceItemTitle;
    }

    let screenshotBase64: string | undefined;
    if (includeScreenshot) {
      const buffer = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 75 });
      screenshotBase64 = `data:image/jpeg;base64,${buffer}`;
    }

    return sendResponse(response, 200, {
      success: true,
      environment: isWindows ? 'local_windows' : 'vercel_serverless',
      data: {
        targetUrl,
        pageTitle: effectiveTitle,
        marketplaceSellerName: rawAudit.marketplaceSellerName,
        marketplaceItemTitle: rawAudit.marketplaceItemTitle,
        loadTimeMs,
        httpStatus,
        rawHtmlSnippet: rawAudit.rawHtmlSnippet || '',
        headTags: {
          hasMetaPixel: rawAudit.hasMetaPixel,
          metaPixelId: rawAudit.metaPixelId,
          hasGoogleTagManager: rawAudit.hasGoogleTagManager,
          hasTikTokPixel: rawAudit.hasTikTokPixel,
          hasGoogleAnalytics4: rawAudit.hasGoogleAnalytics4
        },
        conversionElements: {
          ctaCount: rawAudit.ctaCount,
          primaryCtaText: rawAudit.primaryCtaText,
          hasPixDiscount: rawAudit.hasPixDiscount,
          hasFreeShippingMention: rawAudit.hasFreeShippingMention
        },
        contactChannels: {
          detectedWhatsApp: rawAudit.detectedWhatsApp,
          whatsAppLink: rawAudit.whatsAppLink,
          hasFloatingChatWidget: rawAudit.hasFloatingChatWidget
        },
        catalogSnapshot: {
          visibleProductsCount: rawAudit.visibleProductsCount,
          sampleProducts: rawAudit.sampleProducts
        },
        screenshotBase64
      }
    });

  } catch (err: any) {
    console.error('[Vercel Serverless Audit Error]:', err);
    return sendResponse(response, 500, {
      success: false,
      error: err.message || 'Erro inesperado na execução do Chromium Serverless na Vercel.'
    });
  } finally {
    if (browser) {
      await browser.close().catch((closeErr: any) => {
        console.warn('[Vercel Serverless Audit] Aviso ao fechar Chromium:', closeErr.message);
      });
      browser = null;
    }
  }
}
