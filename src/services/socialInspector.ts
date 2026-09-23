import type { RealSiteData } from './siteInspector.ts';

export interface SocialAuditItem {
  id: string;
  category: 'Meta Pixel' | 'Google & GA4' | 'TikTok & Pinterest' | 'Gravação de Sessão (UX)' | 'Automação & E-mail' | 'OpenGraph' | 'Instagram Bio Link';
  status: 'OTIMIZADO' | 'ALERTA' | 'CRÍTICO';
  title: string;
  description: string;
  recommendation: string;
}

export interface TrackingStack {
  hasMetaPixel: boolean;
  hasGoogleAnalytics4: boolean;
  hasGtm: boolean;
  hasTiktokPixel: boolean;
  hasPinterestTag: boolean;
  hasClarityOrHotjar: boolean;
  hasEmailMarketingTag: boolean;
}

export interface SocialAuditResult {
  socialScore: number;
  hasMetaPixel: boolean;
  hasTiktokPixel: boolean;
  hasGtm: boolean;
  hasOgImage: boolean;
  ogImagePreview?: string;
  ogTitleDetected?: string;
  trackingStack: TrackingStack;
  instagramBioStrategy: {
    bioCtaHook: string;
    linkInBioType: string;
    conversionFunnelTip: string;
  };
  checks: SocialAuditItem[];
}

export function auditSocialConversion(siteData: RealSiteData, instagramHandle?: string): SocialAuditResult {
  const checks: SocialAuditItem[] = [];
  const htmlStr = (siteData.rawHtmlSnippet || '').toLowerCase();

  // 1. Scanner de MarTech & Pixels
  const hasMeta = siteData.hasMetaPixel || htmlStr.includes('fbevents.js') || htmlStr.includes('fbq(') || htmlStr.includes('connect.facebook.net');
  const hasGtm = siteData.hasGtm || htmlStr.includes('googletagmanager.com') || htmlStr.includes('gtm-');
  const hasGA4 = htmlStr.includes('gtag(') || htmlStr.includes('google-analytics.com') || htmlStr.includes('g-') || htmlStr.includes('analytics.js');
  const hasTiktok = siteData.hasTiktokPixel || htmlStr.includes('analytics.tiktok.com') || htmlStr.includes('ttq.load');
  const hasPinterest = htmlStr.includes('pintrk') || htmlStr.includes('pinit.js');
  const hasClarityOrHotjar = htmlStr.includes('clarity.ms') || htmlStr.includes('hotjar.com') || htmlStr.includes('hj(');
  const hasEmailMarketingTag = htmlStr.includes('klaviyo') || htmlStr.includes('rdstation') || htmlStr.includes('activecampaign') || htmlStr.includes('mailchimp');

  const trackingStack: TrackingStack = {
    hasMetaPixel: hasMeta,
    hasGoogleAnalytics4: hasGA4,
    hasGtm,
    hasTiktokPixel: hasTiktok,
    hasPinterestTag: hasPinterest,
    hasClarityOrHotjar,
    hasEmailMarketingTag
  };

  // Meta Pixel Check
  if (hasMeta) {
    checks.push({
      id: 'soc-meta-ok',
      category: 'Meta Pixel',
      status: 'OTIMIZADO',
      title: `Pixel do Meta Ads Detectado em ${siteData.domain}`,
      description: 'O script de base do Meta Ads (fbevents.js) está ativo no código.',
      recommendation: 'Recomendamos configurar a API de Conversões (CAPI) via servidor para recuperar até 35% dos eventos bloqueados pelo iOS 14.5+.'
    });
  } else {
    checks.push({
      id: 'soc-meta-crit',
      category: 'Meta Pixel',
      status: 'CRÍTICO',
      title: `Nenhum Pixel do Meta Ads Detectado em ${siteData.domain}`,
      description: 'O site não possui o script de rastreamento do Facebook/Instagram Ads.',
      recommendation: 'Instalar o Pixel do Meta imediatamente no GTM para permitir remarketing e criação de públicos semelhantes (Lookalike).'
    });
  }

  // Google Analytics 4 & GTM Check
  if (hasGtm) {
    checks.push({
      id: 'soc-gtm-ok',
      category: 'Google & GA4',
      status: 'OTIMIZADO',
      title: 'Google Tag Manager (GTM) Integrado',
      description: 'Contêiner GTM detectado, permitindo injeção de tags sem reescrever o código do tema.',
      recommendation: 'Manter a tag de Consent Mode V2 ativada no GTM.'
    });
  } else {
    checks.push({
      id: 'soc-gtm-alert',
      category: 'Google & GA4',
      status: 'ALERTA',
      title: 'Google Tag Manager (GTM) Ausente',
      description: 'Tags inseridas diretamente no código-fonte tornam a loja mais lenta e difícil de gerenciar.',
      recommendation: 'Instalar o GTM no <head> e centralizar todas as tags de tráfego.'
    });
  }

  if (hasGA4) {
    checks.push({
      id: 'soc-ga4-ok',
      category: 'Google & GA4',
      status: 'OTIMIZADO',
      title: 'Google Analytics 4 (GA4) Ativo',
      description: 'Métricas de engajamento e funil de conversão sendo coletadas pelo GA4.',
      recommendation: 'Verificar se o evento de comércio eletrônico "purchase" com valores monetários está populando.'
    });
  } else {
    checks.push({
      id: 'soc-ga4-alert',
      category: 'Google & GA4',
      status: 'ALERTA',
      title: 'Google Analytics 4 Não Identificado',
      description: 'Sem o GA4, a mensuração de canais orgânicos e pagos fica fragmentada.',
      recommendation: 'Configurar a propriedade GA4 com Enhanced Measurement ativado.'
    });
  }

  // UX Heatmap Tools (Clarity / Hotjar)
  if (hasClarityOrHotjar) {
    checks.push({
      id: 'soc-clarity-ok',
      category: 'Gravação de Sessão (UX)',
      status: 'OTIMIZADO',
      title: 'Ferramenta de Gravação de Sessões & Heatmaps Detectada',
      description: 'O site utiliza gravação de cliques e rolagem (Clarity/Hotjar) para auditoria contínua de UX.',
      recommendation: 'Analisar mapas de rolagem nas páginas de produtos mais vendidos.'
    });
  } else {
    checks.push({
      id: 'soc-clarity-alert',
      category: 'Gravação de Sessão (UX)',
      status: 'ALERTA',
      title: 'Sem Gravação de Sessões (Microsoft Clarity Grátis Não Instalado)',
      description: 'Você não consegue assistir em vídeo onde os clientes estão travando no checkout.',
      recommendation: 'Instalar o Microsoft Clarity (100% gratuito e sem limite de tráfego) via GTM.'
    });
  }

  // Retention / E-mail Marketing Tools
  if (hasEmailMarketingTag) {
    checks.push({
      id: 'soc-email-ok',
      category: 'Automação & E-mail',
      status: 'OTIMIZADO',
      title: 'Tag de Automação de E-mail / CRM Identificada',
      description: 'Script de captura e recuperação de abandono de carrinho detectado.',
      recommendation: 'Ativar fluxo de boas-vindas com cupom dinâmico e lembrete de abandono em 1h via WhatsApp/E-mail.'
    });
  } else {
    checks.push({
      id: 'soc-email-alert',
      category: 'Automação & E-mail',
      status: 'ALERTA',
      title: 'Ausência de Tag de Automação de Abandono de Carrinho',
      description: 'Clientes que adicionam camisas/produtos e saem do site não recebem lembrete automatizado.',
      recommendation: 'Integrar Klaviyo ou RD Station para recuperar até 14% dos carrinhos abandonados.'
    });
  }

  // OpenGraph Social Share Card Check
  if (siteData.hasOgTags) {
    checks.push({
      id: 'soc-og-ok',
      category: 'OpenGraph',
      status: 'OTIMIZADO',
      title: 'Tags OpenGraph de Compartilhamento Social Ativas',
      description: `O site ${siteData.domain} exibe card formatado quando o link é compartilhado no WhatsApp e Direct.`,
      recommendation: 'Garantir que a imagem og:image esteja em proporção 1.91:1 (1200x630px) com o produto em evidência.'
    });
  } else {
    checks.push({
      id: 'soc-og-crit',
      category: 'OpenGraph',
      status: 'CRÍTICO',
      title: 'Ausência de Tags OpenGraph no Head',
      description: 'Quando alguém envia o link da sua loja no WhatsApp, aparece apenas um link azul sem foto e sem resumo.',
      recommendation: 'Inserir meta-tags <meta property="og:image"> e <meta property="og:title">.'
    });
  }

  // Instagram Strategy
  let instagramBioStrategy = {
    bioCtaHook: `👉 Garanta 10% OFF no primeiro pedido em ${siteData.brandName} com o cupom PRIMEIRACOMPRA!`,
    linkInBioType: 'Direcionamento Direto para Catálogo VIP & Lançamentos',
    conversionFunnelTip: 'Substitua árvores lentas de links por uma página de vendas direta com o Sticky Buy Button mobile ativo.'
  };

  if (instagramHandle) {
    checks.push({
      id: 'soc-insta-ok',
      category: 'Instagram Bio Link',
      status: 'OTIMIZADO',
      title: `Estratégia de Bio & Funil para @${instagramHandle.replace('@', '')}`,
      description: `Identificamos o canal social @${instagramHandle.replace('@', '')} para alavancagem de vendas.`,
      recommendation: `No perfil @${instagramHandle.replace('@', '')}, utilize Stories diários com Sticker de Link direto para a página do produto com cupom pré-aplicado.`
    });
    instagramBioStrategy.bioCtaHook = `👉 Siga @${instagramHandle.replace('@', '')} e clique no link para garantir frete facilitado no primeiro pedido!`;
  }

  const criticals = checks.filter(c => c.status === 'CRÍTICO').length;
  const alerts = checks.filter(c => c.status === 'ALERTA').length;
  const socialScore = Math.max(30, Math.min(98, 100 - (criticals * 30) - (alerts * 10)));

  return {
    socialScore,
    hasMetaPixel: hasMeta,
    hasTiktokPixel: hasTiktok,
    hasGtm,
    hasOgImage: siteData.hasOgTags,
    trackingStack,
    instagramBioStrategy,
    checks
  };
}
