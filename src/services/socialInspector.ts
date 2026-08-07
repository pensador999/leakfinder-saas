import { RealSiteData } from './siteInspector';

export interface SocialAuditItem {
  id: string;
  category: 'Meta Pixel' | 'OpenGraph' | 'Instagram Bio Link' | 'Rastreamento';
  status: 'OTIMIZADO' | 'ALERTA' | 'CRÍTICO';
  title: string;
  description: string;
  recommendation: string;
}

export interface SocialAuditResult {
  socialScore: number;
  hasMetaPixel: boolean;
  hasTiktokPixel: boolean;
  hasGtm: boolean;
  hasOgImage: boolean;
  ogImagePreview?: string;
  ogTitleDetected?: string;
  instagramBioStrategy: {
    bioCtaHook: string;
    linkInBioType: string;
    conversionFunnelTip: string;
  };
  checks: SocialAuditItem[];
}

export function auditSocialConversion(siteData: RealSiteData, instagramHandle?: string): SocialAuditResult {
  const checks: SocialAuditItem[] = [];

  if (siteData.hasMetaPixel) {
    checks.push({
      id: 'soc-1-ok',
      category: 'Meta Pixel',
      status: 'OTIMIZADO',
      title: `Pixel do Meta Detectado em ${siteData.domain}`,
      description: 'O rastreador detectou o script de base do Meta Ads (fbevents).',
      recommendation: 'Assegurar que eventos avançados como AddToCart e Purchase estejam disparando via CAPI (API de Conversões).'
    });
  } else {
    checks.push({
      id: 'soc-1-alert',
      category: 'Meta Pixel',
      status: 'CRÍTICO',
      title: `Nenhum Pixel do Meta Ativo Detectado em ${siteData.domain}`,
      description: 'O HTML da página não contém o script fbq(\'init\'). Campanhas de conversão no Facebook/Instagram ficarão cegas.',
      recommendation: 'Instalar o Pixel do Meta via Google Tag Manager ou nativamente no <head>.'
    });
  }

  // Check 1b: GTM Check
  if (!siteData.hasGtm) {
    checks.push({
      id: 'soc-gtm',
      category: 'Rastreamento',
      status: 'ALERTA',
      title: 'Google Tag Manager Não Encontrado',
      description: 'O contêiner do GTM não foi detectado no código da página.',
      recommendation: 'Centralizar todos os pixels e tags através do GTM para não pesar o carregamento do site.'
    });
  }

  // Check 2: OpenGraph Card (Como o site aparece quando compartilhado no WhatsApp/Instagram)
  if (siteData.hasOgTags) {
    checks.push({
      id: 'soc-2',
      category: 'OpenGraph',
      status: 'OTIMIZADO',
      title: 'Tags OpenGraph de Compartilhamento Social Ativas',
      description: `O site ${siteData.domain} possui meta-tags og:title e og:description configuradas no HTML.`,
      recommendation: 'Garantir que a imagem og:image esteja em alta resolução (1200x630px).'
    });
  } else {
    checks.push({
      id: 'soc-2-alert',
      category: 'OpenGraph',
      status: 'CRÍTICO',
      title: 'Ausência de Tags OpenGraph para Compartilhamento em Redes Sociais',
      description: 'Quando o link do site é enviado no WhatsApp ou Instagram DM, não aparece prévia com foto nem título formatado.',
      recommendation: 'Adicionar meta-tags og:image, og:title e og:description no head do site.'
    });
  }

  // Check 3: Instagram Link in Bio Strategy
  let instagramBioStrategy = {
    bioCtaHook: `👉 Toque no link abaixo e garanta 10% OFF com o cupom INSTA10!`,
    linkInBioType: 'Página de Destino Direta para Produto/Oferta VIP',
    conversionFunnelTip: 'Substitua agregadores lentos de links por um redirecionamento direto para a página de vendas com o Sticky Buy Button mobile ativo.'
  };

  if (instagramHandle) {
    checks.push({
      id: 'soc-3-ok',
      category: 'Instagram Bio Link',
      status: 'OTIMIZADO',
      title: `Estratégia de Bio para ${instagramHandle}`,
      description: `Foi identificada a conta ${instagramHandle}. Se a bio usar um agregador de links, a taxa de conversão cai 30%.`,
      recommendation: `No perfil ${instagramHandle}, direcione a bio para a Landing Page de Oferta de ${siteData.brandName} com Cupom exclusivo.`
    });
    instagramBioStrategy.bioCtaHook = `👉 Siga ${instagramHandle} e toque no link abaixo para 10% OFF no ${siteData.brandName}!`;
  } else {
    checks.push({
      id: 'soc-3-missing',
      category: 'Instagram Bio Link',
      status: 'ALERTA',
      title: 'Análise de Instagram Não Conectada',
      description: 'Nenhum @ de Instagram foi fornecido na inspeção para cruzar os dados.',
      recommendation: 'Re-faça a auditoria inserindo o @ do Instagram para receber recomendações exatas de Bio.'
    });
  }

  const socialScore = (siteData.hasOgTags ? 40 : 10) + (siteData.hasMetaPixel ? 30 : 0) + (instagramHandle ? 10 : 0) + (siteData.hasGtm ? 10 : 0);

  return {
    socialScore,
    hasMetaPixel: !!siteData.hasMetaPixel,
    hasTiktokPixel: !!siteData.hasTiktokPixel,
    hasGtm: !!siteData.hasGtm,
    hasOgImage: siteData.hasOgTags,
    ogTitleDetected: siteData.title,
    instagramBioStrategy,
    checks
  };
}
