import { RealSiteData, inspectRealWebsite } from './siteInspector';
import { auditSiteSecurity, SecurityAuditResult } from './securityInspector';
import { auditSocialConversion, SocialAuditResult } from './socialInspector';
import { analyzeCopyNLP, CopyNlpResult } from './copyNLPInspector';
import { analyzeComputerVision, VisionAnalysisResult } from './visionCoreEngine';
import { analyzeOsint, OsintAnalysisResult } from './osintEngine';
import { TargetRegion } from '../types';

export interface BlindspotItem {
  id: string;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO';
  title: string;
  description: string;
  impactOnSales: string;
  fixAction: string;
}

export interface WorkerInspectionResult {
  siteData: RealSiteData;
  security: SecurityAuditResult;
  social: SocialAuditResult;
  copyNlp: CopyNlpResult;
  blindspots: BlindspotItem[];
  detectedNiche: string;
  inferredBrandName: string;
  visionAnalysis: VisionAnalysisResult;
  osintData: OsintAnalysisResult;
  targetRegion: TargetRegion;
}

export async function runSiteInspectorWorker(inputUrl: string, targetRegion: TargetRegion, customNiche?: string, instagramHandle?: string, manualCnpj?: string): Promise<WorkerInspectionResult> {
  const siteData = await inspectRealWebsite(inputUrl);
  const security = auditSiteSecurity(siteData);
  const social = auditSocialConversion(siteData, instagramHandle);
  const copyNlp = analyzeCopyNLP(siteData);
  const visionAnalysis = await analyzeComputerVision(siteData.domain, siteData.rawHtmlSnippet || '');
  const osintData = await analyzeOsint(siteData.rawHtmlSnippet || '', siteData.domain, manualCnpj);

  const domainParts = siteData.domain.split('.');
  let rawBrand = domainParts[0] || 'MARCA';
  if (rawBrand === 'www' && domainParts.length > 1) {
    rawBrand = domainParts[1];
  }
  const inferredBrandName = siteData.isMarketplaceSeller && siteData.brandName
    ? siteData.brandName
    : rawBrand.toUpperCase();

  let detectedNiche = customNiche || 'Geral & E-commerce';
  const catalogTitles = (siteData.catalogAudit?.issues || []).map(i => i.productTitle).join(' ').toLowerCase();
  const combinedText = `${siteData.title} ${siteData.metaDescription} ${siteData.h1List.join(' ')} ${catalogTitles}`.toLowerCase();
  const domainLower = siteData.domain.toLowerCase();

  const shoeKeywords = ['calçado', 'calcado', 'calçados', 'calcados', 'tênis', 'tenis', 'sapato', 'sapatos', 'sandália', 'sandalia', 'bota', 'botas', 'mule', 'mocassim', 'sneaker', 'sneakers', 'coturno', 'scarpin', 'chinelo', 'chinelos', 'rasteira', 'rasteirinha', 'sapatilha', 'shoes', 'footwear'];
  const hasShoeSignal = shoeKeywords.some(w => combinedText.includes(w) || domainLower.includes(w));

  if (hasShoeSignal) {
    detectedNiche = 'Calçados, Tênis & Sapatos';
  } else if (combinedText.includes('suplemento') || combinedText.includes('whey') || combinedText.includes('creatina') || domainLower.includes('suplemento')) {
    detectedNiche = 'Saúde, Suplementos & Nutrição';
  } else if (combinedText.includes('pesca') || combinedText.includes('fishing') || domainLower.includes('fishing') || domainLower.includes('pesca')) {
    detectedNiche = 'Pesca Esportiva & Aventura';
  } else if (combinedText.includes('agro') || combinedText.includes('campo') || domainLower.includes('agro')) {
    detectedNiche = 'Agropecuária & Campo';
  } else if (combinedText.includes('motor') || combinedText.includes('moto') || domainLower.includes('motors')) {
    detectedNiche = 'Motociclismo & Off-Road';
  } else if (combinedText.includes('moda') || combinedText.includes('roupa') || combinedText.includes('vestido') || combinedText.includes('camisa') || combinedText.includes('calça')) {
    detectedNiche = 'Moda, Roupas & Vestuário';
  } else if (combinedText.includes('eletrônico') || combinedText.includes('tech') || combinedText.includes('gadget') || combinedText.includes('fone')) {
    detectedNiche = 'Eletrônicos & Tecnologia';
  } else if (combinedText.includes('beleza') || combinedText.includes('cosmético') || combinedText.includes('skincare') || combinedText.includes('maquiagem')) {
    detectedNiche = 'Beleza & Cosméticos';
  }

  const blindspots: BlindspotItem[] = [];

  if (!siteData.detectedCheckoutTerms.hasPix) {
    blindspots.push({
      id: 'bs-1',
      severity: 'CRÍTICO',
      title: 'Ausência de Oferta Pix com Desconto Direto na Primeira Dobra',
      description: `O rastreador analisou o HTML de ${siteData.domain} e não encontrou chamadas em destaque para pagamento em Pix com desconto.`,
      impactOnSales: 'Perda estimada de 15% a 25% nas conversões mobile de clientes que buscam aprovação instantânea.',
      fixAction: 'Inserir caixa verde com destaque: "⚡ Pagamento no Pix com 5% a 10% OFF + Aprovação Instantânea".'
    });
  }

  // Real Gap Analysis: Contact Info
  if (!siteData.hasWhatsapp && !siteData.hasPhone && !siteData.hasEmail) {
    blindspots.push({
      id: 'bs-contact-critical',
      severity: 'CRÍTICO',
      title: 'Lacuna Crítica de Confiança: Nenhum Meio de Contato Encontrado',
      description: `O rastreador analisou todo o texto de ${siteData.domain} e não detectou nenhum número de WhatsApp, telefone ou e-mail.`,
      impactOnSales: 'Queda extrema na taxa de conversão (até 80% de abandono). Clientes não compram se não encontram meios de suporte.',
      fixAction: 'Adicionar botão flutuante de WhatsApp e e-mail visível no rodapé e no topo.'
    });
  } else if (!siteData.hasWhatsapp) {
    blindspots.push({
      id: 'bs-contact-whatsapp',
      severity: 'MÉDIO',
      title: 'Ausência de Atendimento via WhatsApp',
      description: 'Nenhum link ou número de WhatsApp foi detectado no código principal.',
      impactOnSales: 'Perda de recuperação de boletos/Pix e fechamento de vendas de alto ticket.',
      fixAction: 'Integrar botão do WhatsApp (api.whatsapp.com) visível na tela de produtos.'
    });
  }

  if (!siteData.hasSchemaJsonLd) {
    blindspots.push({
      id: 'bs-2',
      severity: 'ALTO',
      title: 'Ponto Cego de SEO: Ausência de Marcação Estruturada Schema org',
      description: `O site ${siteData.domain} não possui marcação JSON-LD do tipo Product ou Offer no HTML.`,
      impactOnSales: 'O Google não exibe estrelas de avaliação ou preço diretamente nos resultados de busca, reduzindo o CTR orgânico.',
      fixAction: 'Ativar o código Schema JSON-LD gerado pelo Agente SEO LeakFinder no head da página.'
    });
  }

  if (!siteData.isHttps) {
    blindspots.push({
      id: 'bs-sec-ssl',
      severity: 'CRÍTICO',
      title: 'Vulnerabilidade de Segurança: Site executando em HTTP Não Seguro',
      description: `O protocolo de ${siteData.domain} não utiliza criptografia SSL.`,
      impactOnSales: 'Queda drástica de confiança e bloqueio de navegadores modernos.',
      fixAction: 'Ativar certificado SSL 256-bit imediatamente.'
    });
  }

  return {
    siteData,
    security,
    social,
    copyNlp,
    visionAnalysis,
    osintData,
    blindspots,
    detectedNiche,
    inferredBrandName,
    targetRegion
  };
}
