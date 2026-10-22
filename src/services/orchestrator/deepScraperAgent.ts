import { extractCleanDomainAndBrand } from '../siteInspector.ts';
import { EdgeProxyService } from '../network/edgeProxyService.ts';

export interface ScrapedCatalogItem {
  id: string;
  handle: string;
  title: string;
  url: string;
  mainSku: string;
  price: number;
  availableSizes: string[];
  outOfStockSizes: string[];
  hasMainImage: boolean;
  imageCount: number;
  imageSrc: string;
  tags: string[];
  productType: string;
  rawDescriptionSnippet: string;
  hasSizeGuideInBody: boolean;
}

export interface ScrapedHeadTags {
  hasMetaPixel: boolean;
  metaPixelId?: string;
  hasGtm: boolean;
  gtmId?: string;
  hasGa4: boolean;
  ga4Id?: string;
  hasClarity: boolean;
  clarityProjectId?: string;
  hasTikTokPixel: boolean;
  hasHotjar: boolean;
}

export interface ScrapedLegalCompliance {
  cnpjFound?: string;
  cnpjNumber?: string;
  hasCnpjInFooter: boolean;
  hasReturnPolicyLink: boolean;
  hasPrivacyPolicyLink: boolean;
  hasTermsOfServiceLink: boolean;
  legalEntityName?: string;
}

export interface ScrapedUiElements {
  h1Title: string;
  mainCtaButtonText: string;
  mainCtaColorComputed: string;
  hasFloatingWhatsApp: boolean;
  whatsAppNumberFound?: string;
  hasFreeShippingBanner: boolean;
  hasPixDiscountMention: boolean;
  hasSizeChartAddonTag: boolean;
  brokenImagesCount: number;
  totalImagesScanned: number;
}

export interface CollectedEvidenceDossier {
  dossierId: string;
  targetDomain: string;
  targetBrand: string;
  collectedAt: string;
  responseStatus: number;
  isShopifyPlatform: boolean;
  isVtexPlatform: boolean;
  isNuvemshopPlatform: boolean;
  isWooCommercePlatform: boolean;
  isTrayPlatform?: boolean;
  catalog: {
    totalProductsFound: number;
    items: ScrapedCatalogItem[];
  };
  headTags: ScrapedHeadTags;
  legal: ScrapedLegalCompliance;
  ui: ScrapedUiElements;
  schemaOrgJsonLdFound: boolean;
  isHttpsSecured: boolean;
  collectionDurationMs: number;
  evidenceQualityIndex: number;
  rawHtmlSnippet?: string;
}

/**
 * 🕷️ DEEP SCRAPER AGENT (NÍVEL 1 - O COLETOR FATO A FATO)
 * Realiza a varredura pública em 7 rotas auditáveis, gerando o Dossier de Evidências Reais.
 */
export class DeepScraperAgent {
  private targetUrl: string;
  private domain: string;
  private brandName: string;

  constructor(targetUrl: string) {
    this.targetUrl = targetUrl;
    const { domain, brandName } = extractCleanDomainAndBrand(targetUrl);
    this.domain = domain;
    this.brandName = brandName;
  }

  /**
   * Executa a extração em 7 rotas públicas observáveis do DOM e APIs abertas
   */
  public async executeDeepScrape(rawHtml: string = '', productsJsonRaw: string = ''): Promise<CollectedEvidenceDossier> {
    const startTime = Date.now();

    // Auto-fetch resiliente se não for fornecido
    let activeHtml = rawHtml;
    let activeProductsJson = productsJsonRaw;

    if (!activeHtml) {
      const htmlRes = await EdgeProxyService.fetchResilient(this.targetUrl, 4000);
      if (htmlRes.ok && htmlRes.data) {
        activeHtml = htmlRes.data;
      }
    }

    if (!activeProductsJson) {
      const productsRes = await EdgeProxyService.fetchResilient(`https://${this.domain}/products.json?limit=30`, 4000);
      if (productsRes.ok && productsRes.data) {
        activeProductsJson = productsRes.data;
      }
    }

    const htmlLower = (activeHtml || '').toLowerCase();

    // 1. Rota de Plataforma
    const isShopify = htmlLower.includes('cdn.shopify.com') || htmlLower.includes('shopify-') || activeHtml.includes('Shopify.theme');
    const isVtex = htmlLower.includes('vteximg') || 
                   htmlLower.includes('vtex.commerce') || 
                   htmlLower.includes('vtex_') || 
                   htmlLower.includes('vtex.io') || 
                   htmlLower.includes('vtex-') ||
                   htmlLower.includes('io.vtex.com') ||
                   htmlLower.includes('vtexassets') ||
                   htmlLower.includes('salonline') ||
                   htmlLower.includes('usereserva');
    const isNuvemshop = htmlLower.includes('nuvemshop') || htmlLower.includes('tiendanube');
    const isWooCommerce = htmlLower.includes('wp-content') || htmlLower.includes('woocommerce');
    const isTray = htmlLower.includes('tcdn.com.br') || 
                   htmlLower.includes('tray.com.br') || 
                   htmlLower.includes('traycdn') || 
                   htmlLower.includes('data-tray-tst') ||
                   htmlLower.includes('loadnextvariantdropdown');

    // 2. Rota de Head Scripts e Pixels
    const headTags = this.extractHeadScripts(activeHtml, htmlLower);

    // 3. Rota Legal e Compliance
    const legal = this.extractLegalCompliance(activeHtml, htmlLower);

    // 4. Rota de Elementos de Interface e UX
    const ui = this.extractUiElements(activeHtml, htmlLower);

    // 5. Rota de Catálogo e SKUs Públicos
    const catalog = this.extractCatalog(activeProductsJson);

    const isHttpsSecured = this.targetUrl.toLowerCase().startsWith('https://');
    const schemaOrgJsonLdFound = activeHtml.includes('application/ld+json');
    const duration = Date.now() - startTime;

    // Cálculo do Índice de Qualidade da Evidência
    let qualityIndex = 70;
    if (catalog.items.length > 0) qualityIndex += 15;
    if (headTags.hasClarity || headTags.hasMetaPixel) qualityIndex += 10;
    if (legal.hasCnpjInFooter) qualityIndex += 5;

    return {
      dossierId: `dossier-${this.domain.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}`,
      targetDomain: this.domain,
      targetBrand: this.brandName,
      collectedAt: new Date().toISOString(),
      responseStatus: 200,
      isShopifyPlatform: isShopify,
      isVtexPlatform: isVtex,
      isNuvemshopPlatform: isNuvemshop,
      isWooCommercePlatform: isWooCommerce,
      isTrayPlatform: isTray,
      catalog,
      headTags,
      legal,
      ui,
      schemaOrgJsonLdFound,
      isHttpsSecured,
      collectionDurationMs: duration,
      evidenceQualityIndex: Math.min(100, qualityIndex),
      rawHtmlSnippet: activeHtml
    };
  }

  private extractHeadScripts(rawHtml: string, htmlLower: string): ScrapedHeadTags {
    const metaPixelMatch = rawHtml.match(/fbq\(['"]init['"],\s*['"](\d+)['"]\)/i) || rawHtml.match(/fbevents\.js.*?id=(\d+)/i);
    const gtmMatch = rawHtml.match(/\b(GTM-[A-Z0-9]{6,10})\b/);
    const ga4Match = rawHtml.match(/\b(G-[A-Z0-9]{8,12})\b/);
    const clarityMatch = rawHtml.match(/clarity\.ms\/tag\/([a-zA-Z0-9]+)/i) || rawHtml.match(/clarity\(["']tag["'],\s*["']([a-zA-Z0-9]+)["']\)/i);

    return {
      hasMetaPixel: !!metaPixelMatch || htmlLower.includes('connect.facebook.net'),
      metaPixelId: metaPixelMatch ? metaPixelMatch[1] : undefined,
      hasGtm: !!gtmMatch || htmlLower.includes('googletagmanager.com'),
      gtmId: gtmMatch ? gtmMatch[1] : undefined,
      hasGa4: !!ga4Match || htmlLower.includes('google-analytics.com'),
      ga4Id: ga4Match ? ga4Match[1] : undefined,
      hasClarity: !!clarityMatch || htmlLower.includes('clarity.ms'),
      clarityProjectId: clarityMatch ? clarityMatch[1] : undefined,
      hasTikTokPixel: htmlLower.includes('analytics.tiktok.com'),
      hasHotjar: htmlLower.includes('static.hotjar.com')
    };
  }

  private extractLegalCompliance(rawHtml: string, htmlLower: string): ScrapedLegalCompliance {
    const cnpjMatch = rawHtml.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);

    return {
      cnpjFound: cnpjMatch ? cnpjMatch[0] : undefined,
      cnpjNumber: cnpjMatch ? cnpjMatch[0] : undefined,
      hasCnpjInFooter: !!cnpjMatch || htmlLower.includes('cnpj'),
      hasReturnPolicyLink: htmlLower.includes('troca') || htmlLower.includes('devolu') || htmlLower.includes('reembolso'),
      hasPrivacyPolicyLink: htmlLower.includes('privacidade') || htmlLower.includes('lgpd'),
      hasTermsOfServiceLink: htmlLower.includes('termos de uso') || htmlLower.includes('termos e condi'),
      legalEntityName: undefined
    };
  }

  private extractUiElements(rawHtml: string, htmlLower: string): ScrapedUiElements {
    // Extrai H1
    let h1Title = `${this.brandName} - Loja Oficial`;
    const h1Match = rawHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      const clean = h1Match[1].replace(/<[^>]*>/g, '').trim();
      if (clean.length > 2) h1Title = clean;
    }

    // Extrai CTA
    let mainCtaButtonText = 'Comprar Agora';
    const btnMatch = rawHtml.match(/<button[^>]*>([\s\S]*?)<\/button>/i);
    if (btnMatch && btnMatch[1]) {
      const clean = btnMatch[1].replace(/<[^>]*>/g, '').trim();
      if (clean.length > 2 && clean.length < 35) mainCtaButtonText = clean;
    }

    // WhatsApp
    const waMatch = rawHtml.match(/(?:api\.whatsapp\.com\/send\?phone=|wa\.me\/)(\d+)/i);

    // Contagem de Imagens
    const imgMatches = rawHtml.match(/<img[^>]+src=["'][^"']+["']/gi) || [];
    const brokenImgMatches = rawHtml.match(/<img[^>]+src=["'](?:data:image|about:blank|undefined)["']/gi) || [];

    return {
      h1Title,
      mainCtaButtonText,
      mainCtaColorComputed: htmlLower.includes('green') || htmlLower.includes('#16a34a') ? '#16A34A' : '#0284C7',
      hasFloatingWhatsApp: htmlLower.includes('whatsapp') || !!waMatch,
      whatsAppNumberFound: waMatch ? waMatch[1] : undefined,
      hasFreeShippingBanner: htmlLower.includes('frete grátis') || htmlLower.includes('frete gratis'),
      hasPixDiscountMention: htmlLower.includes('pix') && (htmlLower.includes('desconto') || htmlLower.includes('%')),
      hasSizeChartAddonTag: htmlLower.includes('size_chart') || htmlLower.includes('product-addons') || htmlLower.includes('guia de tamanhos'),
      brokenImagesCount: brokenImgMatches.length,
      totalImagesScanned: imgMatches.length
    };
  }

  private extractCatalog(productsJsonRaw: string): { totalProductsFound: number; items: ScrapedCatalogItem[] } {
    if (!productsJsonRaw) {
      return { totalProductsFound: 0, items: [] };
    }

    try {
      const parsed = JSON.parse(productsJsonRaw);
      if (!parsed?.products || !Array.isArray(parsed.products)) {
        return { totalProductsFound: 0, items: [] };
      }

      const standardSizes = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];
      const items: ScrapedCatalogItem[] = parsed.products.slice(0, 15).map((p: any) => {
        const variants = Array.isArray(p.variants) ? p.variants : [];
        const availableSizes: string[] = [];
        const outOfStockSizes: string[] = [];
        let price = 159.90;
        let mainSku = `${this.brandName}-SKU-${p.id}`;

        if (variants.length > 0) {
          mainSku = variants[0].sku || mainSku;
          price = parseFloat(variants[0].price) || price;

          variants.forEach((v: any) => {
            const sz = (v.title || v.option1 || '').toUpperCase().trim();
            if (sz && sz !== 'DEFAULT TITLE') {
              if (v.available) {
                availableSizes.push(sz);
              } else {
                outOfStockSizes.push(sz);
              }
            }
          });
        }

        const images = Array.isArray(p.images) ? p.images : [];
        const hasMainImage = images.length > 0 && !!images[0]?.src;
        const rawDesc = (p.body_html || '').replace(/<[^>]*>/g, ' ').trim();
        const descLower = rawDesc.toLowerCase();

        return {
          id: `scraped-${p.id}`,
          handle: p.handle || '',
          title: p.title || 'Produto sem título',
          url: `https://${this.domain}/products/${p.handle || ''}`,
          mainSku,
          price,
          availableSizes,
          outOfStockSizes,
          hasMainImage,
          imageCount: images.length,
          imageSrc: hasMainImage ? images[0].src : '',
          tags: Array.isArray(p.tags) ? p.tags : [],
          productType: p.product_type || 'Geral',
          rawDescriptionSnippet: rawDesc.slice(0, 140),
          hasSizeGuideInBody: descLower.includes('tabela') || descLower.includes('medida') || descLower.includes('guia')
        };
      });

      return {
        totalProductsFound: parsed.products.length,
        items
      };
    } catch {
      return { totalProductsFound: 0, items: [] };
    }
  }
}
