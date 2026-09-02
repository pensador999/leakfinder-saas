import { RealSiteData } from './siteInspector';

export type OmnichannelBusinessModel = 
  | 'E-COMMERCE_100_AUTOMATIZADO' 
  | 'HIBRIDO_SITE_WHATSAPP' 
  | 'VENDA_DIRETA_SOCIAL';

export interface SocialAuditItem {
  id: string;
  category: 'Meta Pixel & Ads' | 'Google & GA4' | 'TikTok & Pinterest' | 'Venda Direta & WhatsApp' | 'Gravação de Sessão (UX)' | 'Automação & E-mail' | 'OpenGraph & Social Share' | 'Instagram Bio & Funil';
  status: 'OTIMIZADO' | 'ALERTA' | 'CRÍTICO';
  title: string;
  description: string;
  recommendation: string;
}

export interface TrackingStack {
  hasMetaPixel: boolean;
  hasServerSideCapi: boolean;
  hasGoogleAnalytics4: boolean;
  hasGoogleAdsTag: boolean;
  hasGtm: boolean;
  hasTiktokPixel: boolean;
  hasPinterestTag: boolean;
  hasClarityOrHotjar: boolean;
  hasEmailMarketingTag: boolean;
}

export interface DirectSalesChannels {
  hasWhatsappButton: boolean;
  whatsappPhoneNumber?: string;
  hasFloatingChatWidget: boolean;
  chatWidgetBrand?: 'Typebot' | 'JivoChat' | 'ChatGuru' | 'Blip' | 'Zendesk' | 'Nativo WhatsApp' | 'Outro';
  hasInstagramLink: boolean;
  instagramHandleDetected?: string;
  hasDirectCheckoutAssistance: boolean;
}

export interface OmnichannelPlaybookAction {
  title: string;
  channel: 'WhatsApp 1-a-1' | 'Instagram Direct' | 'Meta Ads Retargeting' | 'Checkout Transparente';
  priority: 'ALTA' | 'MÉDIA' | 'CRÍTICA';
  scriptTemplate: string;
  expectedConversionLiftPct: number;
}

export interface OmnichannelSocialAuditResult {
  omnichannelScore: number;
  businessModel: OmnichannelBusinessModel;
  businessModelDescription: string;
  trackingStack: TrackingStack;
  directSales: DirectSalesChannels;
  socialPresence: {
    instagramProfile?: string;
    facebookPage?: string;
    tiktokProfile?: string;
    youtubeChannel?: string;
  };
  instagramBioStrategy: {
    bioCtaHook: string;
    linkInBioType: string;
    conversionFunnelTip: string;
  };
  playbookActions: OmnichannelPlaybookAction[];
  checks: SocialAuditItem[];
}

/**
 * 📲 OMNICHANNEL SOCIAL & DIRECT SALES INSPECTOR
 * Inspects social presence, direct sales signals (WhatsApp / Direct), ad tracking stacks, and business models.
 */
export function auditOmnichannelSocialCommerce(
  siteData: RealSiteData,
  instagramHandleInput?: string
): OmnichannelSocialAuditResult {
  const checks: SocialAuditItem[] = [];
  const htmlStr = (siteData.rawHtmlSnippet || '').toLowerCase();
  const domain = siteData.domain || 'sualoja.com.br';
  const brandName = siteData.brandName || 'Sua Loja';

  // 1. EXTRACT TRACKING STACK & AD PIXELS
  const hasMeta = siteData.hasMetaPixel || htmlStr.includes('fbevents.js') || htmlStr.includes('fbq(') || htmlStr.includes('connect.facebook.net');
  const hasCapi = htmlStr.includes('capi') || htmlStr.includes('conversions-api') || htmlStr.includes('stape.io') || (hasMeta && htmlStr.includes('event_id'));
  const hasGtm = siteData.hasGtm || htmlStr.includes('googletagmanager.com') || htmlStr.includes('gtm-');
  const hasGA4 = htmlStr.includes('gtag(') || htmlStr.includes('google-analytics.com') || htmlStr.includes('g-') || htmlStr.includes('analytics.js');
  const hasGoogleAds = htmlStr.includes('aw-') || htmlStr.includes('google_conversion');
  const hasTiktok = siteData.hasTiktokPixel || htmlStr.includes('analytics.tiktok.com') || htmlStr.includes('ttq.load');
  const hasPinterest = htmlStr.includes('pintrk') || htmlStr.includes('pinit.js');
  const hasClarityOrHotjar = htmlStr.includes('clarity.ms') || htmlStr.includes('hotjar.com') || htmlStr.includes('hj(');
  const hasEmailMarketingTag = htmlStr.includes('klaviyo') || htmlStr.includes('rdstation') || htmlStr.includes('activecampaign') || htmlStr.includes('mailchimp');

  const trackingStack: TrackingStack = {
    hasMetaPixel: hasMeta,
    hasServerSideCapi: hasCapi,
    hasGoogleAnalytics4: hasGA4,
    hasGoogleAdsTag: hasGoogleAds,
    hasGtm,
    hasTiktokPixel: hasTiktok,
    hasPinterestTag: hasPinterest,
    hasClarityOrHotjar,
    hasEmailMarketingTag
  };

  // 2. EXTRACT DIRECT SALES CHANNELS (WHATSAPP, LIVE CHAT, DIRECT)
  const hasWaLink = htmlStr.includes('wa.me') || htmlStr.includes('api.whatsapp.com') || htmlStr.includes('whatsapp.com/send');
  const hasTypebot = htmlStr.includes('typebot') || htmlStr.includes('viewer.typebot');
  const hasJivo = htmlStr.includes('jivochat') || htmlStr.includes('jivosite');
  const hasChatguru = htmlStr.includes('chatguru') || htmlStr.includes('chat-guru');
  const hasBlip = htmlStr.includes('blip.ai') || htmlStr.includes('take.net');
  const hasZendesk = htmlStr.includes('zendesk') || htmlStr.includes('zopim');

  let chatWidgetBrand: DirectSalesChannels['chatWidgetBrand'] = undefined;
  if (hasTypebot) chatWidgetBrand = 'Typebot';
  else if (hasJivo) chatWidgetBrand = 'JivoChat';
  else if (hasChatguru) chatWidgetBrand = 'ChatGuru';
  else if (hasBlip) chatWidgetBrand = 'Blip';
  else if (hasZendesk) chatWidgetBrand = 'Zendesk';
  else if (hasWaLink) chatWidgetBrand = 'Nativo WhatsApp';

  // Extract phone number from WhatsApp URL if present
  let whatsappPhoneNumber: string | undefined = undefined;
  const waMatch = htmlStr.match(/(?:wa\.me\/|phone=)(\d{10,13})/i);
  if (waMatch && waMatch[1]) {
    whatsappPhoneNumber = waMatch[1];
  }

  // 3. EXTRACT SOCIAL LINKS (INSTAGRAM, TIKTOK, YOUTUBE)
  let instagramHandle = instagramHandleInput ? instagramHandleInput.replace('@', '') : undefined;
  if (!instagramHandle) {
    const instaMatch = htmlStr.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (instaMatch && instaMatch[1] && !['p', 'explore', 'reels', 'stories'].includes(instaMatch[1].toLowerCase())) {
      instagramHandle = instaMatch[1].replace(/\/$/, '');
    }
  }

  const directSales: DirectSalesChannels = {
    hasWhatsappButton: hasWaLink || !!chatWidgetBrand,
    whatsappPhoneNumber,
    hasFloatingChatWidget: !!chatWidgetBrand,
    chatWidgetBrand,
    hasInstagramLink: !!instagramHandle,
    instagramHandleDetected: instagramHandle,
    hasDirectCheckoutAssistance: hasWaLink || hasTypebot || hasJivo
  };

  // 4. CLASSIFY OMNICHANNEL BUSINESS MODEL
  let businessModel: OmnichannelBusinessModel;
  let businessModelDescription: string;

  if (directSales.hasDirectCheckoutAssistance && (!hasMeta || !hasGoogleAds)) {
    businessModel = 'VENDA_DIRETA_SOCIAL';
    businessModelDescription = 'Operação focada em Venda Assistida 1-a-1 via WhatsApp/Direct. O site funciona primariamente como vitrine e catálogo.';
  } else if (directSales.hasDirectCheckoutAssistance && hasMeta) {
    businessModel = 'HIBRIDO_SITE_WHATSAPP';
    businessModelDescription = 'Modelo Híbrido de Alta Performance: Tráfego pago direcionado para o site com fechamento e suporte humanizado via WhatsApp.';
  } else {
    businessModel = 'E-COMMERCE_100_AUTOMATIZADO';
    businessModelDescription = 'E-commerce 100% Transacional: Conversão depende inteiramente do fluxo autônomo de checkout e autorização do gateway.';
  }

  // 5. AUDIT CHECKS GENERATION
  // WhatsApp / Direct Sales Check
  if (directSales.hasWhatsappButton) {
    checks.push({
      id: 'omni-wa-ok',
      category: 'Venda Direta & WhatsApp',
      status: 'OTIMIZADO',
      title: `Canal de Venda Direta Ativo (${directSales.chatWidgetBrand || 'WhatsApp'})`,
      description: `Detectamos suporte e fechamento direto via WhatsApp (${whatsappPhoneNumber || 'Link Ativo'}) em ${domain}.`,
      recommendation: 'Ativar mensagem pré-preenchida com o nome do produto e SKU para acelerar o fechamento pelo time comercial.'
    });
  } else {
    checks.push({
      id: 'omni-wa-alert',
      category: 'Venda Direta & WhatsApp',
      status: 'ALERTA',
      title: 'Ausência de Botão de Venda Direta / WhatsApp Flutuante',
      description: 'Clientes com dúvidas sobre tamanhos ou frete não têm como falar em 1-clique com um atendente.',
      recommendation: 'Instalar botão flutuante de WhatsApp no canto inferior esquerdo para não cobrir o Sticky Buy Button mobile.'
    });
  }

  // Meta Pixel & CAPI Check
  if (hasMeta) {
    checks.push({
      id: 'omni-meta-ok',
      category: 'Meta Pixel & Ads',
      status: 'OTIMIZADO',
      title: `Meta Pixel Ativo no Código de ${domain}`,
      description: 'Pixel do Facebook/Instagram Ads rastreando visualizações de página e adições ao carrinho.',
      recommendation: hasCapi 
        ? 'CAPI Server-Side detectada: rastreamento de dados em conformidade máxima com iOS 14.5+.' 
        : 'Recomendamos configurar a API de Conversões (CAPI) para recuperar até 35% dos eventos bloqueados por navegadores.'
    });
  } else {
    checks.push({
      id: 'omni-meta-crit',
      category: 'Meta Pixel & Ads',
      status: 'CRÍTICO',
      title: 'Nenhum Pixel do Meta Ads Detectado',
      description: 'A loja está vendendo sem rastrear o público de remarketing ou otimizar para compras no Instagram.',
      recommendation: 'Instalar o Meta Pixel imediatamente via GTM para alimentar os algoritmos de tráfego.'
    });
  }

  // Google & GA4
  if (hasGA4) {
    checks.push({
      id: 'omni-ga4-ok',
      category: 'Google & GA4',
      status: 'OTIMIZADO',
      title: 'Google Analytics 4 (GA4) Integrado',
      description: 'Rastreamento analítico do tráfego orgânico e canais de aquisição ativo.',
      recommendation: 'Garantir que a métrica de valor monetário de compra (purchase value) está sendo enviada.'
    });
  } else {
    checks.push({
      id: 'omni-ga4-alert',
      category: 'Google & GA4',
      status: 'ALERTA',
      title: 'Google Analytics 4 Não Identificado',
      description: 'Sem GA4, fica impossível auditar a jornada de compra entre celular e computador.',
      recommendation: 'Criar contêiner no Google Tag Manager e injetar o GA4.'
    });
  }

  // Clarity / Hotjar UX Recording
  if (hasClarityOrHotjar) {
    checks.push({
      id: 'omni-clarity-ok',
      category: 'Gravação de Sessão (UX)',
      status: 'OTIMIZADO',
      title: 'Gravação de Sessões & Heatmaps Ativa (Clarity/Hotjar)',
      description: 'Permite assistir aos vídeos de navegação dos usuários e identificar onde desistem.',
      recommendation: 'Filtrar gravações com mais de 3 cliques de raiva (Rage Clicks) na seleção de tamanhos.'
    });
  } else {
    checks.push({
      id: 'omni-clarity-alert',
      category: 'Gravação de Sessão (UX)',
      status: 'ALERTA',
      title: 'Sem Gravação de Telas em Vídeo',
      description: 'Você não sabe exatamente em qual etapa do carrinho os visitantes estão travando.',
      recommendation: 'Instalar o Microsoft Clarity (gratuito) via Google Tag Manager.'
    });
  }

  // Instagram Strategy
  const instaHandleClean = instagramHandle || brandName.toLowerCase().replace(/\s+/g, '');
  const instagramBioStrategy = {
    bioCtaHook: `👉 Garanta 10% OFF no primeiro pedido em ${brandName} com o cupom BEMVINDO!`,
    linkInBioType: 'Direcionamento Direto para Catálogo Mobile com Sticky CTA',
    conversionFunnelTip: 'Substitua árvores lentas de links por uma página de vendas direta com o Sticky Buy Button mobile ativo.'
  };

  checks.push({
    id: 'omni-insta-strategy',
    category: 'Instagram Bio & Funil',
    status: 'OTIMIZADO',
    title: `Estratégia de Funil & Bio para @${instaHandleClean}`,
    description: `Plano de monetização direta de Stories e Tráfego Orgânico para o Instagram @${instaHandleClean}.`,
    recommendation: 'Utilizar Stories diários com Sticker de Link direto para os SKUs mais vendidos com cupom pré-aplicado.'
  });

  // 6. ACTIONABLE PLAYBOOK GENERATION
  const playbookActions: OmnichannelPlaybookAction[] = [
    {
      title: 'Automação de Recuperação de Carrinho no WhatsApp (15min)',
      channel: 'WhatsApp 1-a-1',
      priority: 'CRÍTICA',
      scriptTemplate: `Olá, [Nome]! Notei que você quase garantiu o(a) [Produto] em ${brandName}, mas não concluiu. Separei seu pedido com frete reduzido por 1 hora aqui: [Link]`,
      expectedConversionLiftPct: 18.5
    },
    {
      title: 'Gancho de Stories com Cupom Dinâmico na Bio',
      channel: 'Instagram Direct',
      priority: 'ALTA',
      scriptTemplate: `Quer o link com 10% OFF no Pix de ${brandName}? Responda "QUERO" aqui que nosso assistente envia o link direto com o desconto aplicado!`,
      expectedConversionLiftPct: 12.0
    },
    {
      title: 'Público Personalizado de Remarketing para Abandonos de Tamanho',
      channel: 'Meta Ads Retargeting',
      priority: 'ALTA',
      scriptTemplate: 'Campanha de Catálogo Dinâmico no Instagram Feed/Stories exibindo exclusivamente produtos com grade completa.',
      expectedConversionLiftPct: 14.8
    }
  ];

  // Score Calculation
  const criticals = checks.filter(c => c.status === 'CRÍTICO').length;
  const alerts = checks.filter(c => c.status === 'ALERTA').length;
  const omnichannelScore = Math.max(35, Math.min(98, 100 - (criticals * 25) - (alerts * 8)));

  return {
    omnichannelScore,
    businessModel,
    businessModelDescription,
    trackingStack,
    directSales,
    socialPresence: {
      instagramProfile: instagramHandle ? `https://instagram.com/${instagramHandle}` : undefined
    },
    instagramBioStrategy,
    playbookActions,
    checks
  };
}
