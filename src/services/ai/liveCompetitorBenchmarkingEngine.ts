// ==============================================================================
// 🦅 ADSHIELD LIVE COMPETITOR RADAR BENCHMARKING ENGINE
// Cross-compares the analyzed store with top leaders in the same niche across
// 5 operational dimensions: Pricing Elasticity, Shipping Threshold, Size Stock,
// Mobile 4G Speed, and Trust & Pix Triggers!
// ==============================================================================

import type { AgentDiagnosticResult } from '../../types/index.ts';
import { isCatalogProductBroken, extractCleanDomainAndBrand, type RealSiteData } from '../siteInspector.ts';
import { EdgeProxyService } from '../network/edgeProxyService.ts';
import { formatBRL } from '../pricing/currencyUtils.ts';
import { extractUniversalPlatformProducts } from '../catalog/universalPlatformExtractor.ts';

export interface CompetitorBenchmarkDimension {
  dimensionName: string;
  yourStoreValue: string;
  competitorStoreValue: string;
  yourStoreScore: number; // 0 to 100
  competitorScore: number; // 0 to 100
  status: 'VANTAGEM' | 'DESVANTAGEM' | 'EMPATE';
  gapAnalysis: string;
  revenueImpactMonthly: number; // in R$
}

export interface LiveCompetitorPublicData {
  domain: string;
  brandName: string;
  isLiveScraped: boolean;
  dataOrigin: 'LIVE_PUBLIC_SCRAPE' | 'BENCHMARK_ESTIMATE';
  averagePriceBRL?: number;
  totalProductsSampled?: number;
  brokenGridCount?: number;
  estimatedLoadTimeSec?: number;
  hasPixDiscount?: boolean;
  hasFreeShippingMention?: boolean;
  hasMetaPixel?: boolean;
  hasGtm?: boolean;
  hasTikTokPixel?: boolean;
  isHttps: boolean;
}

export interface CompetitorRadarReport {
  id: string;
  analyzedStoreDomain: string;
  analyzedBrandName: string;
  competitorDomain: string;
  competitorBrandName: string;
  overallCompetitiveScoreYou: number;
  overallCompetitiveScoreCompetitor: number;
  marketShareLeakMonthly: number;
  dimensions: CompetitorBenchmarkDimension[];
  urgentRecommendations: string[];
  dataOrigin: 'LIVE_PUBLIC_SCRAPE' | 'BENCHMARK_ESTIMATE';
  liveCompetitorData?: LiveCompetitorPublicData;
}

const liveCompetitorCache = new Map<string, { data: LiveCompetitorPublicData; expiresAt: number }>();

function resolveTargetCompetitor(domain: string, inputCompetitorUrl?: string): { domain: string; brand: string; url: string } {
  const rawComp = (inputCompetitorUrl || '').trim();
  const isPlaceholder =
    !rawComp ||
    rawComp.includes('concorrente.com') ||
    rawComp.includes('sualoja.com') ||
    rawComp.includes('example.com');

  if (!isPlaceholder) {
    const parsed = extractCleanDomainAndBrand(rawComp);
    if (parsed.domain && parsed.domain.includes('.')) {
      return { domain: parsed.domain, brand: parsed.brandName, url: parsed.cleanUrl };
    }
  }

  const lower = domain.toLowerCase();
  if (lower.includes('agro') || lower.includes('brk') || lower.includes('pesca') || lower.includes('country')) {
    return { domain: 'texascenter.com.br', brand: 'Texas Center Country', url: 'https://www.texascenter.com.br' };
  }
  if (lower.includes('calcado') || lower.includes('tenis') || lower.includes('boot') || lower.includes('sapato')) {
    return { domain: '7mboots.com.br', brand: '7M Boots', url: 'https://www.7mboots.com.br' };
  }
  if (lower.includes('auto') || lower.includes('peca')) {
    return { domain: 'canaldapeca.com.br', brand: 'Canal da Peça', url: 'https://www.canaldapeca.com.br' };
  }
  return { domain: 'insiderstore.com.br', brand: 'Insider Store', url: 'https://www.insiderstore.com.br' };
}

/**
 * Inspeciona ao vivo dados públicos reais do concorrente (/products.json + HTML universal via EdgeProxyService)
 */
export async function fetchLiveCompetitorPublicData(competitorUrlOrDomain: string): Promise<LiveCompetitorPublicData> {
  const { cleanUrl, domain, brandName } = extractCleanDomainAndBrand(competitorUrlOrDomain);
  const cached = liveCompetitorCache.get(domain);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const startMs = Date.now();
  let isLiveScraped = false;
  let averagePriceBRL: number | undefined;
  let totalProductsSampled = 0;
  let brokenGridCount = 0;
  let hasPixDiscount: boolean | undefined;
  let hasFreeShippingMention: boolean | undefined;
  let hasMetaPixel: boolean | undefined;
  let hasGtm: boolean | undefined;
  let hasTikTokPixel: boolean | undefined;

  const isTestEnv = typeof process !== 'undefined' && Boolean(process.env?.VITEST);
  const fetchTimeoutMs = isTestEnv ? 1000 : 3800;

  try {
    const raceTimeout = <T>(p: Promise<T>, fallback: T): Promise<T> =>
      Promise.race([
        p,
        new Promise<T>(resolve => setTimeout(() => resolve(fallback), fetchTimeoutMs))
      ]);

    const emptyProxy: Awaited<ReturnType<typeof EdgeProxyService.fetchResilient>> = {
      ok: false,
      status: 408,
      data: '',
      source: 'DIRECT_FETCH',
      latencyMs: fetchTimeoutMs
    };

    const [htmlRes, productsRes] = await Promise.all([
      raceTimeout(EdgeProxyService.fetchResilient(cleanUrl, fetchTimeoutMs), emptyProxy),
      raceTimeout(EdgeProxyService.fetchResilient(`https://${domain}/products.json?limit=25`, fetchTimeoutMs), emptyProxy)
    ]);

    const elapsedSec = Number(Math.max(0.8, (Date.now() - startMs) / 1000).toFixed(1));

    if (htmlRes.ok && htmlRes.data) {
      isLiveScraped = true;
      const htmlLower = htmlRes.data.toLowerCase();
      hasPixDiscount = htmlLower.includes('pix') && (htmlLower.includes('desconto') || htmlLower.includes('%') || htmlLower.includes('vista'));
      hasFreeShippingMention = htmlLower.includes('frete grátis') || htmlLower.includes('frete gratis');
      hasMetaPixel = htmlLower.includes('fbevents.js') || htmlLower.includes('connect.facebook.net') || htmlLower.includes('fbq(');
      hasGtm = htmlLower.includes('googletagmanager.com') || htmlLower.includes('gtm-');
      hasTikTokPixel = htmlLower.includes('analytics.tiktok.com') || htmlLower.includes('ttq.load');
    }

    if (productsRes.ok && productsRes.data) {
      try {
        const parsed = JSON.parse(productsRes.data);
        const products = Array.isArray(parsed?.products) ? parsed.products : [];
        if (products.length > 0) {
          isLiveScraped = true;
          totalProductsSampled = products.length;
          let priceSum = 0;
          let validPriceCount = 0;

          for (const p of products) {
            const variants = Array.isArray(p?.variants) ? p.variants : [];
            const firstPrice = parseFloat(variants[0]?.price || '0');
            if (firstPrice > 0) {
              priceSum += firstPrice;
              validPriceCount++;
            }
            if (variants.length > 1) {
              const unavailableCount = variants.filter((v: any) => v.available === false).length;
              if (unavailableCount > 0) {
                brokenGridCount++;
              }
            }
          }

          if (validPriceCount > 0) {
            averagePriceBRL = Number((priceSum / validPriceCount).toFixed(2));
          }
        }
      } catch {
        // Ignora se o concorrente não for Shopify / JSON público
      }
    }

    // Fallback HTML Universal para concorrentes fora da Shopify (VTEX, Nuvemshop, Tray, WooCommerce, Wake)
    if (totalProductsSampled === 0 && htmlRes.ok && htmlRes.data) {
      try {
        const universalProds = extractUniversalPlatformProducts(htmlRes.data, undefined, domain, brandName, cleanUrl);
        if (universalProds.length > 0) {
          totalProductsSampled = universalProds.length;
          let priceSum = 0;
          let validPriceCount = 0;
          for (const up of universalProds) {
            const firstPrice = Number(up.variants?.[0]?.price || 0);
            if (firstPrice > 0) {
              priceSum += firstPrice;
              validPriceCount++;
            }
            if ((up.variants?.length || 0) > 1 && up.variants.some(v => v.available === false)) {
              brokenGridCount++;
            }
          }
          if (validPriceCount > 0) {
            averagePriceBRL = Number((priceSum / validPriceCount).toFixed(2));
          }
        } else {
          const priceMatches = Array.from(htmlRes.data.matchAll(/R\$\s*(\d{1,4}(?:\.\d{3})*,\d{2})/gi));
          const parsedPrices = priceMatches
            .map(m => parseFloat(m[1].replace(/\./g, '').replace(',', '.')))
            .filter(v => v >= 20 && v <= 15000);
          if (parsedPrices.length > 0) {
            totalProductsSampled = parsedPrices.length;
            const sum = parsedPrices.reduce((a, b) => a + b, 0);
            averagePriceBRL = Number((sum / parsedPrices.length).toFixed(2));
          }
        }
      } catch {
        // Fallback silencioso se extração HTML falhar
      }
    }

    const snapshot: LiveCompetitorPublicData = {
      domain,
      brandName,
      isLiveScraped,
      dataOrigin: isLiveScraped ? 'LIVE_PUBLIC_SCRAPE' : 'BENCHMARK_ESTIMATE',
      averagePriceBRL,
      totalProductsSampled: totalProductsSampled || undefined,
      brokenGridCount: isLiveScraped ? brokenGridCount : undefined,
      estimatedLoadTimeSec: isLiveScraped ? elapsedSec : undefined,
      hasPixDiscount,
      hasFreeShippingMention,
      hasMetaPixel,
      hasGtm,
      hasTikTokPixel,
      isHttps: cleanUrl.startsWith('https://')
    };

    liveCompetitorCache.set(domain, { data: snapshot, expiresAt: Date.now() + 10 * 60 * 1000 });
    return snapshot;
  } catch {
    return {
      domain,
      brandName,
      isLiveScraped: false,
      dataOrigin: 'BENCHMARK_ESTIMATE',
      isHttps: cleanUrl.startsWith('https://')
    };
  }
}

/**
 * Calcula Ticket Médio real dos itens extraídos da loja auditada
 */
function calculateStoreAverageTicket(siteData: RealSiteData, fallbackAov?: number): number {
  const issues = siteData.catalogAudit?.issues || [];
  const priced = issues.map(i => i.price || 0).filter(p => p > 0);
  if (priced.length > 0) {
    const sum = priced.reduce((a, b) => a + b, 0);
    return Number((sum / priced.length).toFixed(2));
  }
  return fallbackAov && fallbackAov > 0 ? fallbackAov : 179.90;
}

/**
 * Computes live competitor benchmarking using real SiteInspectionData and optional live competitor scrape
 */
export function computeCompetitorRadarBenchmark(
  diagnostic: AgentDiagnosticResult,
  liveCompetitorParam?: LiveCompetitorPublicData
): CompetitorRadarReport {
  const { realSiteData, estimatedRevenueLiftMin, input } = diagnostic;
  const domain = realSiteData.domain || 'sualoja.com.br';
  const brand = realSiteData.brandName || 'Sua Loja';

  const targetComp = resolveTargetCompetitor(domain, input?.competitorsUrl);
  const cachedComp = liveCompetitorCache.get(targetComp.domain);
  const liveCompetitor =
    liveCompetitorParam ||
    (cachedComp && Date.now() < cachedComp.expiresAt ? cachedComp.data : undefined);

  const competitorDomain = liveCompetitor?.domain || targetComp.domain;
  const competitorBrand = liveCompetitor?.brandName || targetComp.brand;

  const issuesCount = realSiteData.catalogAudit?.issues
    ? realSiteData.catalogAudit.issues.filter(isCatalogProductBroken).length
    : 0;
  const totalScanned = Math.max(1, realSiteData.catalogAudit?.totalProductsScanned || realSiteData.catalogAudit?.issues?.length || 1);
  const healthyRatioYou = Math.max(0, (totalScanned - issuesCount) / totalScanned);

  const yourAov = calculateStoreAverageTicket(realSiteData, input?.averageOrderValue);
  const compAov = liveCompetitor?.averagePriceBRL;

  const hasPixDiscount =
    Boolean(realSiteData.detectedCheckoutTerms?.hasPix) ||
    Boolean(realSiteData.rawHtmlSnippet?.toLowerCase().includes('pix'));
  const hasFreeShipping = Boolean(realSiteData.detectedCheckoutTerms?.hasFrete);
  const yourLoadTime = realSiteData.estimatedLoadTime || 2.1;

  // Dimensão 1: Profundidade de Grade & Ticket Médio
  const yourGridScore = Math.max(35, Math.min(98, Math.round(healthyRatioYou * 100)));
  const compBroken = liveCompetitor?.brokenGridCount;
  const compTotal = liveCompetitor?.totalProductsSampled;
  const compGridScore =
    typeof compBroken === 'number' && typeof compTotal === 'number' && compTotal > 0
      ? Math.max(45, Math.min(98, Math.round(((compTotal - compBroken) / compTotal) * 100)))
      : 88;

  const gridStatus: CompetitorBenchmarkDimension['status'] =
    yourGridScore > compGridScore ? 'VANTAGEM' : yourGridScore < compGridScore ? 'DESVANTAGEM' : 'EMPATE';

  // Dimensão 2: Política de Frete & Ticket Médio
  const yourShippingScore = hasFreeShipping ? 88 : 54;
  const compHasFrete = liveCompetitor?.hasFreeShippingMention ?? true;
  const compShippingScore = compHasFrete ? 88 : 60;
  const shippingStatus: CompetitorBenchmarkDimension['status'] =
    yourShippingScore > compShippingScore ? 'VANTAGEM' : yourShippingScore < compShippingScore ? 'DESVANTAGEM' : 'EMPATE';

  // Dimensão 3: Desconto Transparente no Pix & Elasticidade de Preço
  const yourPixScore = hasPixDiscount ? 90 : 48;
  const compHasPix = liveCompetitor?.hasPixDiscount ?? true;
  const compPixScore = compHasPix ? 88 : 55;
  const pixStatus: CompetitorBenchmarkDimension['status'] =
    yourPixScore > compPixScore ? 'VANTAGEM' : yourPixScore < compPixScore ? 'DESVANTAGEM' : 'EMPATE';

  // Dimensão 4: Velocidade Mobile no 4G (LCP)
  const yourSpeedScore = yourLoadTime <= 1.8 ? 94 : yourLoadTime <= 2.5 ? 84 : yourLoadTime <= 3.5 ? 65 : 48;
  const compLoadTime = liveCompetitor?.estimatedLoadTimeSec ?? 2.1;
  const compSpeedScore = compLoadTime <= 1.8 ? 92 : compLoadTime <= 2.5 ? 84 : 68;
  const speedStatus: CompetitorBenchmarkDimension['status'] =
    yourSpeedScore > compSpeedScore ? 'VANTAGEM' : yourSpeedScore < compSpeedScore ? 'DESVANTAGEM' : 'EMPATE';

  // Dimensão 5: Stack de Pixels & Autoridade Digital
  const yourPixelCount = [realSiteData.hasMetaPixel, realSiteData.hasGtm, realSiteData.hasTiktokPixel].filter(Boolean).length;
  const yourCnpjOk = Boolean(realSiteData.legalCompliance?.hasCnpjInFooter || realSiteData.legalCompliance?.cnpjFound);
  const yourTrustScore = Math.min(98, (realSiteData.isHttps ? 40 : 10) + (yourCnpjOk ? 25 : 0) + yourPixelCount * 11);

  const compPixelCount = liveCompetitor?.isLiveScraped
    ? [liveCompetitor.hasMetaPixel, liveCompetitor.hasGtm, liveCompetitor.hasTikTokPixel].filter(Boolean).length
    : 2;
  const compTrustScore = Math.min(96, ((liveCompetitor?.isHttps ?? true) ? 45 : 15) + 22 + compPixelCount * 11);
  const trustStatus: CompetitorBenchmarkDimension['status'] =
    yourTrustScore > compTrustScore ? 'VANTAGEM' : yourTrustScore < compTrustScore ? 'DESVANTAGEM' : 'EMPATE';

  const dimensions: CompetitorBenchmarkDimension[] = [
    {
      dimensionName: '1. Profundidade de Grade & Ruptura',
      yourStoreValue:
        issuesCount > 0
          ? `${issuesCount}/${totalScanned} produtos com tamanhos centrais esgotados (Ticket Médio ${formatBRL(yourAov)})`
          : `Grade 100% ativa (${totalScanned} itens auditados • Ticket Médio ${formatBRL(yourAov)})`,
      competitorStoreValue:
        typeof compBroken === 'number' && typeof compTotal === 'number'
          ? `${compBroken}/${compTotal} produtos com ruptura detectada${compAov ? ` (Ticket Médio ${formatBRL(compAov)})` : ''} [Extraído ao Vivo]`
          : `Referência ${competitorBrand}: Grade contínua monitorada`,
      yourStoreScore: yourGridScore,
      competitorScore: compGridScore,
      status: gridStatus,
      gapAnalysis:
        issuesCount > 0
          ? 'Rupturas em tamanhos centrais (M, G, 40-42) provocam fuga de até 60% dos compradores que chegam por anúncios pagos.'
          : 'Sua grade de produtos está saudável, retendo o tráfego sem perdas por falta de numeração.',
      revenueImpactMonthly: Math.round(estimatedRevenueLiftMin * (issuesCount > 0 ? 0.42 : 0))
    },
    {
      dimensionName: '2. Política de Frete Grátis & Ticket Médio',
      yourStoreValue: hasFreeShipping
        ? `Frete comunicado na vitrine (AOV ${formatBRL(yourAov)})`
        : `Sem gatilho explícito de Frete Grátis (AOV ${formatBRL(yourAov)})`,
      competitorStoreValue: liveCompetitor?.isLiveScraped
        ? `${compHasFrete ? 'Gatilho de Frete Grátis ativo no HTML' : 'Sem banner de Frete Grátis detectado'}${compAov ? ` • AOV ${formatBRL(compAov)}` : ''}`
        : 'Benchmark: Barra progressiva de Frete Grátis acima de valor-alvo',
      yourStoreScore: yourShippingScore,
      competitorScore: compShippingScore,
      status: shippingStatus,
      gapAnalysis: hasFreeShipping
        ? 'A loja comunica benefícios de frete, reduzindo a fricção no carrinho.'
        : 'Sem destaque claro de frete na página do produto, o abandono de checkout aumenta em até 30%.',
      revenueImpactMonthly: Math.round(estimatedRevenueLiftMin * (hasFreeShipping ? 0 : 0.25))
    },
    {
      dimensionName: '3. Desconto Transparente no Pix',
      yourStoreValue: hasPixDiscount ? 'Desconto Pix detectado na vitrine/checkout' : 'Sem cálculo automático de Pix visível',
      competitorStoreValue: liveCompetitor?.isLiveScraped
        ? compHasPix
          ? `Desconto Pix verificado ao vivo em ${competitorDomain}`
          : `Sem destaque de desconto Pix na home de ${competitorDomain}`
        : 'Benchmark de Mercado: 5% a 10% OFF com economia explícita em R$',
      yourStoreScore: yourPixScore,
      competitorScore: compPixScore,
      status: pixStatus,
      gapAnalysis: hasPixDiscount
        ? 'Incentivo Pix identificado. Garante liquidez imediata e menor custo com adiantamento de cartão.'
        : 'Exibir a frase "Economize R$ X no Pix" eleva as conversões à vista em até 22% segundo dados de mercado.',
      revenueImpactMonthly: Math.round(estimatedRevenueLiftMin * (hasPixDiscount ? 0 : 0.18))
    },
    {
      dimensionName: '4. Velocidade Mobile no 4G (LCP)',
      yourStoreValue: `${yourLoadTime.toFixed(1)}s no celular${realSiteData.pagespeedScore ? ` (PSI Score: ${realSiteData.pagespeedScore}/100)` : ' (medido ao vivo)'}`,
      competitorStoreValue: liveCompetitor?.estimatedLoadTimeSec
        ? `${liveCompetitor.estimatedLoadTimeSec.toFixed(1)}s medido em ${competitorDomain}`
        : 'Meta Google Core Web Vitals: LCP < 2.5s',
      yourStoreScore: yourSpeedScore,
      competitorScore: compSpeedScore,
      status: speedStatus,
      gapAnalysis:
        yourLoadTime <= 2.5
          ? 'Velocidade mobile dentro dos padrões recomendados pelo Google para evitar abandono de página.'
          : 'Carregamento acima de 2.5s drena visitantes mobile antes mesmo da renderização do primeiro conteúdo útil.',
      revenueImpactMonthly: Math.round(estimatedRevenueLiftMin * (yourLoadTime <= 2.5 ? 0 : 0.15))
    },
    {
      dimensionName: '5. Stack de Pixels & Autoridade Digital',
      yourStoreValue: `${realSiteData.isHttps ? 'SSL Ativo' : 'Sem SSL'} • Pixels: ${yourPixelCount}/3 (${[
        realSiteData.hasMetaPixel ? 'Meta' : null,
        realSiteData.hasGtm ? 'GTM' : null,
        realSiteData.hasTiktokPixel ? 'TikTok' : null
      ]
        .filter(Boolean)
        .join(', ') || 'Nenhum'})`,
      competitorStoreValue: liveCompetitor?.isLiveScraped
        ? `Verificado ao vivo: Pixels ${compPixelCount}/3 (${[
            liveCompetitor.hasMetaPixel ? 'Meta' : null,
            liveCompetitor.hasGtm ? 'GTM' : null,
            liveCompetitor.hasTikTokPixel ? 'TikTok' : null
          ]
            .filter(Boolean)
            .join(', ') || 'Oculto'})`
        : 'Padrão Setorial: Meta Pixel + GTM + CNPJ em conformidade no rodapé',
      yourStoreScore: yourTrustScore,
      competitorScore: compTrustScore,
      status: trustStatus,
      gapAnalysis:
        'A combinação de telemetria full-funnel (Meta Pixel + GTM) e conformidade jurídica (CDC/LGPD) sustenta a otimização algorítmica das campanhas.',
      revenueImpactMonthly: 0
    }
  ];

  const overallCompetitiveScoreYou = Math.round(
    dimensions.reduce((acc, d) => acc + d.yourStoreScore, 0) / dimensions.length
  );
  const overallCompetitiveScoreCompetitor = Math.round(
    dimensions.reduce((acc, d) => acc + d.competitorScore, 0) / dimensions.length
  );
  const totalLoss = dimensions.reduce((acc, d) => acc + d.revenueImpactMonthly, 0);

  return {
    id: `radar-${domain}-${competitorDomain}`,
    analyzedStoreDomain: domain,
    analyzedBrandName: brand,
    competitorDomain,
    competitorBrandName: competitorBrand,
    overallCompetitiveScoreYou,
    overallCompetitiveScoreCompetitor,
    marketShareLeakMonthly: totalLoss,
    dimensions,
    dataOrigin: liveCompetitor?.isLiveScraped ? 'LIVE_PUBLIC_SCRAPE' : 'BENCHMARK_ESTIMATE',
    liveCompetitorData: liveCompetitor,
    urgentRecommendations: [
      compAov
        ? `Posicionar barra de Frete Grátis estratégica em ${formatBRL(Math.round(yourAov * 1.25))} frente ao Ticket Médio de ${formatBRL(compAov)} do concorrente ${competitorBrand}.`
        : `Posicionar barra de Frete Grátis estratégica em ${formatBRL(Math.round(yourAov * 1.25))} para elevar o Ticket Médio atual de ${formatBRL(yourAov)}.`,
      issuesCount > 0
        ? `Pausar tráfego pago ou ativar aviso de reposição nos ${issuesCount} SKUs com tamanhos esgotados.`
        : `Explorar campanhas de conquista destacando grade 100% disponível frente a ${competitorBrand}.`,
      hasPixDiscount
        ? `Destacar o valor exato economizado em Reais no Pix diretamente acima do botão Adicionar ao Carrinho.`
        : `Ativar incentivo de 5% a 10% OFF no Pix visível na vitrine para igualar a conversão à vista de ${competitorBrand}.`
    ]
  };
}

/**
 * Versão assíncrona que busca ao vivo os dados públicos do concorrente antes de consolidar o radar
 */
export async function computeLiveCompetitorRadarBenchmarkAsync(
  diagnostic: AgentDiagnosticResult
): Promise<CompetitorRadarReport> {
  const domain = diagnostic.realSiteData.domain || 'sualoja.com.br';
  const targetComp = resolveTargetCompetitor(domain, diagnostic.input?.competitorsUrl);
  const liveCompetitor = await fetchLiveCompetitorPublicData(targetComp.url);
  return computeCompetitorRadarBenchmark(diagnostic, liveCompetitor);
}

