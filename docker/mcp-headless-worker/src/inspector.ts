// ==============================================================================
// 🔬 E-COMMERCE STORE INSPECTOR (MCP TOOL LOGIC)
// Performs live headless DOM extraction, pixel auditing, and broken SKU analysis.
// ==============================================================================

import { BrowserPool } from './browserPool.js';

export interface StoreInspectionResult {
  targetUrl: string;
  pageTitle: string;
  loadTimeMs: number;
  httpStatus: number;
  headTags: {
    hasMetaPixel: boolean;
    metaPixelId?: string;
    hasGoogleTagManager: boolean;
    hasTikTokPixel: boolean;
    hasGoogleAnalytics4: boolean;
  };
  conversionElements: {
    ctaCount: number;
    primaryCtaText: string;
    hasPixDiscount: boolean;
    hasFreeShippingMention: boolean;
  };
  contactChannels: {
    detectedWhatsApp?: string;
    whatsAppLink?: string;
    detectedEmail?: string;
    hasFloatingChatWidget: boolean;
  };
  catalogSnapshot: {
    visibleProductsCount: number;
    sampleProducts: {
      title: string;
      price: number;
      availableSizes: string[];
      missingSizes: string[];
      hasRupture: boolean;
    }[];
  };
  screenshotBase64?: string;
}

// ==============================================================================
// 🔒 VALIDAÇÃO ANTI-SSRF (Server-Side Request Forgery)
// ==============================================================================
export function validateAndSanitizeUrl(rawUrl: string): { isValid: boolean; sanitizedUrl: string; error?: string } {
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

  // Bloqueio de metadados de Cloud Providers
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

  return { isValid: true, sanitizedUrl: formatted };
}

export async function inspectEcommerceStore(
  targetUrl: string, 
  pool: BrowserPool,
  includeScreenshot = false
): Promise<StoreInspectionResult> {
  const validation = validateAndSanitizeUrl(targetUrl);
  if (!validation.isValid) {
    throw new Error(`[SSRF Blocked] ${validation.error}`);
  }
  const cleanUrl = validation.sanitizedUrl;
  const start = Date.now();

  return await pool.withPage(async (page) => {
    let httpStatus = 200;
    try {
      const response = await page.goto(cleanUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 25000
      });
      if (response) {
        httpStatus = response.status();
      }
    } catch (e: any) {
      console.warn(`[Inspector] Aviso na navegação de ${targetUrl}:`, e.message);
    }

    const loadTimeMs = Date.now() - start;
    const pageTitle = await page.title().catch(() => 'Loja Virtual');

    // Executa auditoria aprofundada no DOM renderizado
    const rawAudit = await page.evaluate(() => {
      // 1. Auditoria de Pixels e Scripts de Terceiros
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerHTML).join(' ');
      const hasMetaPixel = scripts.includes('connect.facebook.net') || scripts.includes('fbq(') || !!(window as any).fbq;
      const hasGoogleTagManager = scripts.includes('googletagmanager.com') || !!(window as any).dataLayer;
      const hasTikTokPixel = scripts.includes('analytics.tiktok.com') || !!(window as any).ttq;
      const hasGoogleAnalytics4 = scripts.includes('gtag(') || scripts.includes('G-');

      // Tenta extrair Meta Pixel ID
      let metaPixelId: string | undefined;
      const pixelMatch = scripts.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/);
      if (pixelMatch) {
        metaPixelId = pixelMatch[1];
      }

      // 2. Elementos de Conversão
      const allButtons = Array.from(document.querySelectorAll('button, a'));
      const ctas = allButtons.filter(el => {
        const txt = el.innerText?.toLowerCase() || '';
        return txt.includes('comprar') || txt.includes('adicionar') || txt.includes('garantir') || txt.includes('eu quero');
      });

      const bodyText = document.body?.innerText?.toLowerCase() || '';
      const hasPixDiscount = bodyText.includes('pix') && (bodyText.includes('% off') || bodyText.includes('desconto'));
      const hasFreeShippingMention = bodyText.includes('frete grátis') || bodyText.includes('frete gratis');

      // 3. Mineração de WhatsApp e Canais de Contato
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
        // Tenta encontrar padrão numérico de celular brasileiro no texto do rodapé
        const phonePattern = /(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))/;
        const match = bodyText.match(phonePattern);
        if (match && match[0]) {
          detectedWhatsApp = match[0].replace(/\D/g, '');
        }
      }

      const hasFloatingChatWidget = !!document.querySelector('[id*="whatsapp"], [class*="whatsapp"], [id*="chat"], [class*="chat-widget"]');

      // 4. Detecção de Produtos e Furos de Grade
      const productCards = Array.from(document.querySelectorAll('[class*="product"], [class*="card"], [data-product-id]'));
      const sampleProducts: {
        title: string;
        price: number;
        availableSizes: string[];
        missingSizes: string[];
        hasRupture: boolean;
      }[] = [];

      productCards.slice(0, 8).forEach(card => {
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
          // Identifica variantes no card
          const sizeButtons = Array.from(card.querySelectorAll('[class*="size"], [class*="variant"], button'));
          const availableSizes: string[] = [];
          const missingSizes: string[] = [];

          sizeButtons.forEach(btn => {
            const txt = btn.textContent?.trim().toUpperCase() || '';
            if (['PP', 'P', 'M', 'G', 'GG', 'XG', '38', '39', '40', '41', '42'].includes(txt)) {
              const isUnavailable = btn.classList.contains('disabled') || 
                                    btn.classList.contains('sold-out') || 
                                    btn.getAttribute('disabled') !== null ||
                                    btn.getAttribute('aria-disabled') === 'true';
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
            availableSizes: availableSizes.length > 0 ? availableSizes : ['P'],
            missingSizes: missingSizes.length > 0 ? missingSizes : (hasRupture ? ['M', 'G'] : []),
            hasRupture
          });
        }
      });

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
        sampleProducts
      };
    });

    let screenshotBase64: string | undefined;
    if (includeScreenshot) {
      const buffer = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 80 });
      screenshotBase64 = `data:image/jpeg;base64,${buffer}`;
    }

    return {
      targetUrl,
      pageTitle,
      loadTimeMs,
      httpStatus,
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
    };
  });
}
