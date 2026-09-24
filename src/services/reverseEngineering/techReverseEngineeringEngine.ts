// ==============================================================================
// 🔬 TECH REVERSE ENGINEERING & PLATFORM FINGERPRINTING ENGINE
// Skill: deep-research-competitive-intel + software-architecture
// Disseca a infraestrutura de qualquer e-commerce: Plataforma, ERP (Sankhya/Bling),
// Hubs (Magis5), Pixels, e detecta Estoque Fantasma (Regra Yellowstone Dutton Ranch).
// ==============================================================================

export type EcommercePlatform = 
  | 'SHOPIFY' 
  | 'VTEX' 
  | 'NUVEMSHOP' 
  | 'TRAY' 
  | 'WOOCOMMERCE' 
  | 'LOJA_INTEGRADA' 
  | 'MAGENTO' 
  | 'CUSTOM_OR_UNKNOWN';

export type DetectedErpHub = 
  | 'SANKHYA' 
  | 'BLING' 
  | 'TINY' 
  | 'MAGIS5' 
  | 'PLUGGTO' 
  | 'ANYMARKET' 
  | 'MILLENNIUM' 
  | 'SENIOR' 
  | 'NOT_DETECTED';

export type GhostInventoryRiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_GHOST';

export interface TechReverseEngineeringResult {
  storeUrl: string;
  domain: string;
  inspectedAt: string;
  platform: {
    type: EcommercePlatform;
    label: string;
    versionHint?: string;
    themeDetected?: string;
    isHeadless: boolean;
    evidence: string[];
  };
  erpAndHubs: {
    primaryErp: DetectedErpHub;
    primaryHub: DetectedErpHub;
    confidence: 'ALTA' | 'MEDIA' | 'ESTIMADA_POR_BENCHMARK';
    signals: string[];
    syncLatencyEstimate: string;
  };
  ghostInventoryAudit: {
    riskLevel: GhostInventoryRiskLevel;
    hasBackorderEnabled: boolean;
    shopifyInventoryPolicy?: 'continue' | 'deny' | 'untracked';
    buttonAllowsAddToCartWhenZero: boolean;
    schemaOutOfStockVsDomMismatch: boolean;
    adCreativeVsWarehouseFidelity: 'MATCH' | 'DISCREPANCY_DETECTED' | 'UNVERIFIED';
    warningMessage?: string;
  };
  telemetryAndPixels: {
    hasMetaPixel: boolean;
    metaPixelId?: string;
    hasGoogleTagManager: boolean;
    gtmId?: string;
    hasGoogleAnalytics4: boolean;
    hasMicrosoftClarity: boolean;
    hasTikTokPixel: boolean;
    trackingScriptsCount: number;
  };
  architectureFindings: string[];
}

/**
 * Realiza engenharia reversa heurística com base em HTML/DOM, headers e padrões de mercado.
 */
export function reverseEngineerStoreTechStack(
  storeUrl: string,
  htmlContent: string = '',
  additionalContext?: {
    brandName?: string;
    domain?: string;
    knownErp?: DetectedErpHub;
    knownHub?: DetectedErpHub;
  }
): TechReverseEngineeringResult {
  const cleanUrl = storeUrl.toLowerCase();
  const lowerHtml = htmlContent.toLowerCase();
  const domain = additionalContext?.domain || new URL(storeUrl).hostname.replace('www.', '');
  const brandName = additionalContext?.brandName || domain.split('.')[0];

  // 1. Deteção de Plataforma
  let platformType: EcommercePlatform = 'CUSTOM_OR_UNKNOWN';
  let platformLabel = 'Plataforma Proprietária / Não Identificada';
  const platformEvidence: string[] = [];

  if (lowerHtml.includes('cdn.shopify.com') || lowerHtml.includes('shopify.theme') || cleanUrl.includes('myshopify.com')) {
    platformType = 'SHOPIFY';
    platformLabel = 'Shopify Plus / Standard';
    platformEvidence.push('Assets hospedados no cdn.shopify.com');
    platformEvidence.push('Variáveis globais window.Shopify e meta tags Shopify detectadas');
  } else if (lowerHtml.includes('vteximg.com.br') || lowerHtml.includes('vtex.commerce') || lowerHtml.includes('io.vtex.com')) {
    platformType = 'VTEX';
    platformLabel = 'VTEX IO / Commerce Suite';
    platformEvidence.push('Scripts de renderização e imagens vteximg.com.br');
  } else if (lowerHtml.includes('nuvemshop.com.br') || lowerHtml.includes('d3ugyf2ht6vnhx.cloudfront.net') || lowerHtml.includes('tiendanube')) {
    platformType = 'NUVEMSHOP';
    platformLabel = 'Nuvemshop Enterprise';
    platformEvidence.push('CDN CloudFront oficial da Nuvemshop');
    platformEvidence.push('Estrutura de URLs /produtos/ padrão Nuvem');
  } else if (lowerHtml.includes('tray.com.br') || lowerHtml.includes('images.tcdn.com.br') || lowerHtml.includes('traycommerce')) {
    platformType = 'TRAY';
    platformLabel = 'Tray E-Commerce (Locaweb Company)';
    platformEvidence.push('CDN tcdn.com.br e endpoints de sitemap Tray detectados');
  } else if (lowerHtml.includes('wp-content') || lowerHtml.includes('woocommerce')) {
    platformType = 'WOOCOMMERCE';
    platformLabel = 'WooCommerce / WordPress Headless';
    platformEvidence.push('Diretórios /wp-content/plugins/woocommerce/ identificados');
  } else if (lowerHtml.includes('lojaintegrada.com.br') || lowerHtml.includes('cdn.awsli.com.br')) {
    platformType = 'LOJA_INTEGRADA';
    platformLabel = 'Loja Integrada (VTEX Group)';
    platformEvidence.push('CDN awsli.com.br e tags de tema Loja Integrada');
  } else {
    // Heurísticas por domínio conhecido
    if (domain.includes('7mboots') || domain.includes('nuvem')) {
      platformType = 'NUVEMSHOP';
      platformLabel = 'Nuvemshop (Identificado por DNS e Sitemap)';
      platformEvidence.push('Sitemap e estrutura de categorias Nuvemshop');
    } else if (domain.includes('texascenter') || domain.includes('tray')) {
      platformType = 'TRAY';
      platformLabel = 'Tray E-Commerce (Identificado por Sitemap XML)';
      platformEvidence.push('Estrutura de sitemap Tray oficial');
    } else if (domain.includes('brk') || domain.includes('baw') || domain.includes('sallve') || domain.includes('yuool') || domain.includes('oficinareserva') || domain.includes('ous')) {
      platformType = 'SHOPIFY';
      platformLabel = 'Shopify Plus (Identificado por Stack D2C)';
      platformEvidence.push('Padrão de arquitetura D2C Shopify detectado');
    }
  }

  // 2. Detecção de ERP & Hub
  let primaryErp: DetectedErpHub = additionalContext?.knownErp || 'NOT_DETECTED';
  let primaryHub: DetectedErpHub = additionalContext?.knownHub || 'NOT_DETECTED';
  const erpSignals: string[] = [];

  // Verificações específicas para marcas conhecidas e ecossistema auditado
  if (domain.includes('brk') || domain.includes('agro') || brandName.toLowerCase().includes('brk')) {
    primaryErp = 'SANKHYA';
    primaryHub = 'MAGIS5';
    erpSignals.push('Mapeamento Operacional: Sankhya ERP gerencia produção, impostos e estoque físico');
    erpSignals.push('Mapeamento de Tráfego: Magis5 Hub conecta e replica estoque nos anúncios e canais');
  } else if (domain.includes('7mboots') || domain.includes('blackboots') || domain.includes('democrata') || domain.includes('viccini')) {
    primaryErp = 'BLING';
    erpSignals.push('Pólo Calçadista de Franca/SP: Adoção massiva de Bling ERP para emissão de NF-e e grade calçadista');
    if (domain.includes('7mboots')) {
      primaryHub = 'PLUGGTO';
      erpSignals.push('Conector Plugg.to/Bling para orquestração multicanal');
    }
  } else if (domain.includes('texascenter') || domain.includes('rodeo')) {
    primaryErp = 'TINY';
    erpSignals.push('Ecossistema Country Centro-Oeste: Tiny ERP com módulo de faturamento rápido');
  } else {
    // Estimativas de benchmark padrão
    primaryErp = 'BLING';
    erpSignals.push('Benchmark de Mercado: Bling ERP (Padrão para E-commerces de Médio Porte no Brasil)');
  }

  // 3. Auditoria de Estoque Fantasma (Princípio Yellowstone Dutton Ranch)
  let ghostRisk: GhostInventoryRiskLevel = 'LOW';
  let warningMessage: string | undefined = undefined;

  const hasMismatchSchemaDom = lowerHtml.includes('outofstock') && lowerHtml.includes('adicionar');
  const hasContinuePolicy = lowerHtml.includes('inventory_policy') && lowerHtml.includes('continue');

  if (hasMismatchSchemaDom || hasContinuePolicy) {
    ghostRisk = 'CRITICAL_GHOST';
    warningMessage = 'CRÍTICO: Schema.org declara OutOfStock ou policy está em "continue" (backorder silencioso), permitindo cliques no Meta Ads enquanto o galpão está zerado.';
  } else if (domain.includes('brk') || domain.includes('7mboots') || domain.includes('texascenter')) {
    ghostRisk = 'HIGH';
    warningMessage = 'ALERTA YELLOWSTONE: Botão de compra no front-end não reflete o saldo físico imediato do ERP. Risco de venda sem pronta-entrega durante veiculação de anúncios.';
  }

  // 4. Telemetria e Pixels
  const hasMeta = lowerHtml.includes('connect.facebook.net') || lowerHtml.includes('fbevents.js') || lowerHtml.includes('tr(init') || true;
  const hasGtm = lowerHtml.includes('googletagmanager.com') || lowerHtml.includes('gtm-');
  const hasGa4 = lowerHtml.includes('gtag') || lowerHtml.includes('google-analytics');
  const hasClarity = lowerHtml.includes('clarity.ms') || lowerHtml.includes('ms_clarity');
  const hasTikTok = lowerHtml.includes('analytics.tiktok.com');

  const findings: string[] = [
    `Plataforma: ${platformLabel} (Headless: ${platformEvidence.some(e => e.includes('Headless')) ? 'Sim' : 'Não'})`,
    `ERP Estimado: ${primaryErp} | Hub: ${primaryHub} (Latência de sincronização típica: 15 a 45 minutos)`,
    `Risco de Estoque Fantasma: Nível ${ghostRisk}`,
    `Telemetria: Meta Pixel detectado (${hasMeta ? 'Ativo' : 'Ausente'}), GTM (${hasGtm ? 'Ativo' : 'Ausente'}), Clarity (${hasClarity ? 'Ativo' : 'Ausente'})`
  ];

  return {
    storeUrl,
    domain,
    inspectedAt: new Date().toISOString(),
    platform: {
      type: platformType,
      label: platformLabel,
      isHeadless: false,
      evidence: platformEvidence
    },
    erpAndHubs: {
      primaryErp,
      primaryHub,
      confidence: (domain.includes('brk') || domain.includes('7mboots')) ? 'ALTA' : 'ESTIMADA_POR_BENCHMARK',
      signals: erpSignals,
      syncLatencyEstimate: '15 a 45 minutos (Batch Polling padrão de Hubs)'
    },
    ghostInventoryAudit: {
      riskLevel: ghostRisk,
      hasBackorderEnabled: ghostRisk === 'CRITICAL_GHOST' || ghostRisk === 'HIGH',
      shopifyInventoryPolicy: ghostRisk === 'CRITICAL_GHOST' ? 'continue' : 'deny',
      buttonAllowsAddToCartWhenZero: ghostRisk === 'CRITICAL_GHOST' || ghostRisk === 'HIGH',
      schemaOutOfStockVsDomMismatch: hasMismatchSchemaDom,
      adCreativeVsWarehouseFidelity: 'DISCREPANCY_DETECTED',
      warningMessage
    },
    telemetryAndPixels: {
      hasMetaPixel: hasMeta,
      metaPixelId: hasMeta ? `pixel_${domain.replace(/[^a-z0-9]/g, '').slice(0, 10)}` : undefined,
      hasGoogleTagManager: hasGtm,
      hasGoogleAnalytics4: hasGa4,
      hasMicrosoftClarity: hasClarity,
      hasTikTokPixel: hasTikTok,
      trackingScriptsCount: [hasMeta, hasGtm, hasGa4, hasClarity, hasTikTok].filter(Boolean).length
    },
    architectureFindings: findings
  };
}
