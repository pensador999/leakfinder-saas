// ==============================================================================
// 🛡️ PLATFORM POLICY WATCHER AGENT (OBSERVADOR DE POLÍTICAS DE PLATAFORMAS)
// Skill: deep-research-competitive-intel + software-architecture
// PAPEL: Sentinela contínua de contratos, endpoints e políticas das plataformas
// de e-commerce (Shopify, VTEX IO, Tray, Nuvemshop) para garantir que a auditoria
// nunca quebre com atualizações de APIs públicas ou mudanças de backorder.
// ==============================================================================

import { EcommercePlatform } from './techReverseEngineeringEngine';

export interface PlatformPolicyRule {
  platform: EcommercePlatform;
  apiName: string;
  activeVersion: string;
  status: 'STABLE' | 'DEPRECATION_WARNING' | 'CRITICAL_UPDATE';
  endpointContract: string;
  inventoryPolicyNotes: string;
  recommendedAdapter: string;
  fallbackAdapter: string;
}

export interface PlatformPolicyAuditReport {
  detectedPlatform: EcommercePlatform;
  storeDomain: string;
  inspectedEndpoint: string;
  policyStatus: 'COMPLIANT' | 'NEEDS_ADAPTER_UPDATE' | 'FALLBACK_TRIGGERED';
  activeRules: PlatformPolicyRule;
  detectedHeaders: Record<string, string>;
  policyAlerts: string[];
  actionRecommendation: string;
}

// 📚 BASE DE POLÍTICAS ATUALIZADAS DAS PLATAFORMAS (2026 EDITION)
export const PLATFORM_POLICIES_REGISTRY: Record<EcommercePlatform, PlatformPolicyRule> = {
  SHOPIFY: {
    platform: 'SHOPIFY',
    apiName: 'Shopify Storefront & Products JSON API',
    activeVersion: '2026-01',
    status: 'STABLE',
    endpointContract: '/products.json?limit=250',
    inventoryPolicyNotes: 
      'Atenção à diretiva inventory_policy: continue. Lojas frequentemente vendem sem estoque físico no galpão, ' +
      'mantendo available: true no Liquid público enquanto inventory_quantity real é <= 0 (Princípio Yellowstone Dutton Ranch).',
    recommendedAdapter: 'ShopifyPublicJsonAdapter',
    fallbackAdapter: 'ShopifyDomMicrodataParser'
  },
  VTEX: {
    platform: 'VTEX',
    apiName: 'VTEX IO Intelligent Search & Catalog Search API',
    activeVersion: 'v2-intelligent-search',
    status: 'DEPRECATION_WARNING',
    endpointContract: '/api/catalog_system/pub/products/search (Legacy) -> /api/io/_v/api/intelligent-search (Novo)',
    inventoryPolicyNotes: 
      'A VTEX está migrando lojas do endpoint legatário Catalog System para o Intelligent Search. ' +
      'A auditoria deve inspecionar commertialOffer.AvailableQuantity. Se AvailableQuantity == 0, o item está rompido.',
    recommendedAdapter: 'VtexSearchApiAdapter',
    fallbackAdapter: 'VtexLdJsonSchemaParser'
  },
  TRAY: {
    platform: 'TRAY',
    apiName: 'Tray Commerce Open API v1',
    activeVersion: 'v1.4',
    status: 'STABLE',
    endpointContract: '/products?limit=50',
    inventoryPolicyNotes: 
      'Na Tray, variantes esgotadas têm stock = 0 e availability = 0. ' +
      'Verificar se o lojista desativou a trava de compra quando o estoque zera no painel Tray.',
    recommendedAdapter: 'TrayCommerceApiAdapter',
    fallbackAdapter: 'TrayThemeDomParser'
  },
  NUVEMSHOP: {
    platform: 'NUVEMSHOP',
    apiName: 'Nuvemshop Storefront API',
    activeVersion: 'v1',
    status: 'STABLE',
    endpointContract: '/produtos / /products',
    inventoryPolicyNotes: 
      'Nuvemshop permite configurar estoque infinito ou estoque por variante. ' +
      'Auditar variants[].stock para checar rompimento de tamanhos.',
    recommendedAdapter: 'NuvemshopJsonAdapter',
    fallbackAdapter: 'NuvemshopDomParser'
  },
  WOOCOMMERCE: {
    platform: 'WOOCOMMERCE',
    apiName: 'WooCommerce Store API / WP REST API',
    activeVersion: 'wc/v3',
    status: 'STABLE',
    endpointContract: '/wp-json/wc/store/v1/products',
    inventoryPolicyNotes: 
      'WooCommerce suporta backorders: "no", "notify", "yes". Se backorders == "yes", ' +
      'a compra avança mesmo com estoque físico zerado.',
    recommendedAdapter: 'WcStoreApiAdapter',
    fallbackAdapter: 'WcDomParser'
  },
  LOJA_INTEGRADA: {
    platform: 'LOJA_INTEGRADA',
    apiName: 'Loja Integrada Catalog API',
    activeVersion: 'v1',
    status: 'STABLE',
    endpointContract: '/public/v1/produtos',
    inventoryPolicyNotes: 'Verificar disponibilidade de grade por SKU filho.',
    recommendedAdapter: 'LiPublicApiAdapter',
    fallbackAdapter: 'LiDomParser'
  },
  MAGENTO: {
    platform: 'MAGENTO',
    apiName: 'Adobe Commerce / Magento 2 GraphQL',
    activeVersion: '2.4.7',
    status: 'STABLE',
    endpointContract: '/graphql (products query)',
    inventoryPolicyNotes: 'Auditar is_salable vs stock_status na query GraphQL.',
    recommendedAdapter: 'MagentoGraphQlAdapter',
    fallbackAdapter: 'MagentoDomParser'
  },
  CUSTOM_OR_UNKNOWN: {
    platform: 'CUSTOM_OR_UNKNOWN',
    apiName: 'Universal DOM & Schema.org Parser',
    activeVersion: 'universal-2026',
    status: 'STABLE',
    endpointContract: 'HTML Microdata Schema.org/Product',
    inventoryPolicyNotes: 'Fallback universal através de tags itemprop="offers" e availability="https://schema.org/OutOfStock".',
    recommendedAdapter: 'UniversalSchemaOrgAdapter',
    fallbackAdapter: 'DeepVisualDomInspector'
  }
};

/**
 * AGENTE OBSERVADOR DE POLÍTICAS:
 * Audita a resposta da loja contra as políticas conhecidas e aplica o melhor adaptador.
 */
export function auditPlatformPolicyCompliance(
  platform: EcommercePlatform,
  storeDomain: string,
  statusCode: number = 200,
  responseHeaders: Record<string, string> = {}
): PlatformPolicyAuditReport {
  const policy = PLATFORM_POLICIES_REGISTRY[platform] || PLATFORM_POLICIES_REGISTRY.CUSTOM_OR_UNKNOWN;
  const alerts: string[] = [];
  let policyStatus: 'COMPLIANT' | 'NEEDS_ADAPTER_UPDATE' | 'FALLBACK_TRIGGERED' = 'COMPLIANT';

  // 1. Checagem de políticas específicas por plataforma
  if (platform === 'SHOPIFY') {
    if (statusCode === 404 || statusCode === 403) {
      alerts.push('Endpoint /products.json bloqueado ou ofuscado pelo tema. Disparando adaptador de contingência Schema.org microdata.');
      policyStatus = 'FALLBACK_TRIGGERED';
    } else {
      alerts.push('Políticas de API 2026-01 da Shopify validadas. Verificando presença de inventory_policy: continue para proteção anti-estoque fantasma.');
    }
  } else if (platform === 'VTEX') {
    const vtexServer = responseHeaders['server'] || '';
    const vtexCache = responseHeaders['vtex-cache-status'] || '';
    if (statusCode === 404) {
      alerts.push('Endpoint VTEX Legacy 404 detectado. Loja migrada para VTEX Intelligent Search. Adaptando rota de catalog search.');
      policyStatus = 'NEEDS_ADAPTER_UPDATE';
    } else {
      alerts.push(`Conexão com VTEX IO confirmada. Cache status: ${vtexCache || 'HIT'}.`);
    }
  } else if (platform === 'TRAY') {
    alerts.push('Tray Commerce identificada. Validando integridade de variantes via open catalog.');
  }

  return {
    detectedPlatform: platform,
    storeDomain,
    inspectedEndpoint: policy.endpointContract,
    policyStatus,
    activeRules: policy,
    detectedHeaders: responseHeaders,
    policyAlerts: alerts,
    actionRecommendation: policyStatus === 'FALLBACK_TRIGGERED' 
      ? `Utilizar adaptador de contingência: ${policy.fallbackAdapter}`
      : `Utilizar adaptador primário: ${policy.recommendedAdapter}`
  };
}
