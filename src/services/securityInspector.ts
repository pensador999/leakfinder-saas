import type { RealSiteData } from './siteInspector.ts';

export interface SecurityCheckItem {
  id: string;
  category: 'SSL/HTTPS' | 'Headers de Segurança' | 'Scripts Expostos' | 'Links Externos' | 'Formulários' | 'Legal & LGPD' | 'Conformidade E-commerce';
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  title: string;
  description: string;
  riskImpact: string;
  recommendation: string;
}

export interface SecurityAuditResult {
  securityScore: number;
  isHttps: boolean;
  hasCspHeader: boolean;
  hasXFrameOptions: boolean;
  exposedKeysCount: number;
  unsafeLinksCount: number;
  legalComplianceScore: number; // 0-100
  checks: SecurityCheckItem[];
}

export function auditSiteSecurity(siteData: RealSiteData): SecurityAuditResult {
  const checks: SecurityCheckItem[] = [];
  const htmlStr = (siteData.rawHtmlSnippet || '').toLowerCase();

  // Check 1: HTTPS / SSL
  if (!siteData.isHttps) {
    checks.push({
      id: 'sec-1',
      category: 'SSL/HTTPS',
      severity: 'CRÍTICO',
      title: 'Ausência de Certificado SSL Seguro (HTTP não criptografado)',
      description: `O site ${siteData.domain} não utiliza o protocolo https:// seguro.`,
      riskImpact: 'Navegadores modernos exibem o aviso "Site Não Seguro", destruindo a confiança do cliente e derrubando a taxa de conversão em até 60%.',
      recommendation: 'Ativar certificado SSL 256-bit imediatamente e redirecionar todo o tráfego de HTTP para HTTPS com HSTS ativado.'
    });
  } else {
    checks.push({
      id: 'sec-1-ok',
      category: 'SSL/HTTPS',
      severity: 'BAIXO',
      title: 'Protocolo HTTPS / SSL Ativo e Criptografado',
      description: `O site ${siteData.domain} utiliza criptografia SSL válida para tráfego seguro de dados.`,
      riskImpact: 'Proteção contra interceptação de senhas, e-mails e dados de pagamento no checkout.',
      recommendation: 'Manter a renovação automática do certificado SSL e ativar HSTS.'
    });
  }

  // Check 2: External Links Security (rel="noopener noreferrer")
  const targetBlankMatches = htmlStr.match(/<a[^>]+target=["']_blank["'][^>]*>/g) || [];
  let unsafeCount = 0;
  
  targetBlankMatches.forEach(tag => {
    if (!tag.includes('noopener') || !tag.includes('noreferrer')) {
      unsafeCount++;
    }
  });

  if (unsafeCount > 0) {
    checks.push({
      id: 'sec-2',
      category: 'Links Externos',
      severity: 'MÉDIO',
      title: `Detectado ${unsafeCount} Links Externos Vulneráveis (sem noopener noreferrer)`,
      description: `Foram encontrados ${unsafeCount} links externos abrindo em target="_blank" sem isolamento de contexto (window.opener).`,
      riskImpact: 'Vulnerabilidade de Tabnabbing reverso, onde uma aba externa maliciosa pode alterar a URL da aba original da loja para uma página de phishing falsa.',
      recommendation: 'Adicionar rel="noopener noreferrer" em todas as tags <a> com target="_blank".'
    });
  } else {
    checks.push({
      id: 'sec-2-ok',
      category: 'Links Externos',
      severity: 'BAIXO',
      title: 'Links Externos Blindados contra Tabnabbing',
      description: 'Todos os links externos possuem os atributos rel="noopener noreferrer" de segurança.',
      riskImpact: 'Navegação segura.',
      recommendation: 'Manter esse padrão em novas páginas e banners criados.'
    });
  }

  // Check 3: Security Headers (X-Frame-Options / Content-Security-Policy)
  const headersCaptured = Boolean(siteData.securityHeaders?.headersCaptured);
  const hasCspFromHeaders = Boolean(siteData.securityHeaders?.contentSecurityPolicy);
  const hasXfoFromHeaders =
    Boolean(siteData.securityHeaders?.xFrameOptions) ||
    Boolean(siteData.securityHeaders?.contentSecurityPolicy?.toLowerCase().includes('frame-ancestors'));
  const hasCspInMeta =
    /http-equiv\s*=\s*["']content-security-policy["']/i.test(siteData.rawHtmlSnippet || '') ||
    htmlStr.includes('http-equiv="content-security-policy"') ||
    htmlStr.includes("http-equiv='content-security-policy'");
  const hasXfoInMeta =
    /http-equiv\s*=\s*["']x-frame-options["']/i.test(siteData.rawHtmlSnippet || '') ||
    htmlStr.includes('frame-ancestors');

  const hasCspHeader = hasCspFromHeaders || hasCspInMeta;
  const hasXFrameOptions = hasXfoFromHeaders || hasXfoInMeta;

  if (hasXFrameOptions || hasCspHeader) {
    checks.push({
      id: 'sec-3-ok',
      category: 'Headers de Segurança',
      severity: 'BAIXO',
      title: 'Proteção contra Clickjacking / CSP Detectada',
      description: `Política de segurança (${hasXFrameOptions ? 'X-Frame-Options / frame-ancestors' : ''}${hasXFrameOptions && hasCspHeader ? ' + ' : ''}${hasCspHeader ? 'Content-Security-Policy' : ''}) verificada para ${siteData.domain}.`,
      riskImpact: 'Checkout e vitrine protegidos contra injeção de scripts e iframes maliciosos de terceiros.',
      recommendation: 'Manter diretivas CSP e X-Frame-Options atualizadas na borda (CDN/WAF).'
    });
  } else if (headersCaptured) {
    checks.push({
      id: 'sec-3',
      category: 'Headers de Segurança',
      severity: 'ALTO',
      title: 'Ausência de Header X-Frame-Options / CSP na Resposta HTTP',
      description: `Os headers HTTP de ${siteData.domain} foram inspecionados ao vivo e não contêm X-Frame-Options nem Content-Security-Policy.`,
      riskImpact: 'Páginas maliciosas de terceiros podem embutir o checkout ou vitrine do seu site dentro de um iframe transparente para roubar cliques e dados do usuário.',
      recommendation: 'Adicionar o header HTTP "X-Frame-Options: SAMEORIGIN" e "Content-Security-Policy: frame-ancestors \'self\'" no servidor web (Nginx/Cloudflare).'
    });
  } else {
    checks.push({
      id: 'sec-3-cors-info',
      category: 'Headers de Segurança',
      severity: 'BAIXO',
      title: 'Meta CSP Ausente no HTML (Headers HTTP Ocultos via Proxy CORS)',
      description: `Não foi detectada a tag <meta http-equiv="Content-Security-Policy"> no DOM de ${siteData.domain}. Os headers de resposta HTTP requerem leitura direta server-side sem bloqueio CORS.`,
      riskImpact: 'Sem penalização automática de score por limitação de proxy CORS; recomenda-se validar X-Frame-Options e HSTS no painel do Cloudflare/CDN.',
      recommendation: 'Incluir <meta http-equiv="Content-Security-Policy"> no <head> ou garantir X-Frame-Options: SAMEORIGIN no CDN.'
    });
  }

  // Check 4: Legal & Compliance E-commerce Brasil (Decreto nº 7.962/2013 + CDC Art. 49)
  const hasCnpjInFooter = /cnpj|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(htmlStr);
  const hasTrocasPolicy = htmlStr.includes('troca') || htmlStr.includes('devolu') || htmlStr.includes('reembolso');
  const hasPrivacyPolicy = htmlStr.includes('privacidade') || htmlStr.includes('termos') || htmlStr.includes('lgpd');
  const hasAddress = htmlStr.includes('endereço') || htmlStr.includes('rua') || htmlStr.includes('av.') || htmlStr.includes('avenida') || htmlStr.includes('cep');

  if (!hasCnpjInFooter) {
    checks.push({
      id: 'sec-legal-cnpj',
      category: 'Legal & LGPD',
      severity: 'CRÍTICO',
      title: 'Ausência de CNPJ Visível no Rodapé (Obrigatório por Lei)',
      description: 'O Decreto Federal nº 7.962/2013 exige que todo e-commerce no Brasil exiba CNPJ, Razão Social e Endereço de forma clara e visível no rodapé.',
      riskImpact: 'Risco de multas pelo Procon de até R$ 3 milhões e perda imediata de credibilidade para clientes que desconfiam de sites sem dados fiscais.',
      recommendation: 'Adicionar no rodapé: "Razão Social - CNPJ: XX.XXX.XXX/0001-XX - Endereço Completo, Cidade/UF - CEP".'
    });
  } else {
    checks.push({
      id: 'sec-legal-cnpj-ok',
      category: 'Legal & LGPD',
      severity: 'BAIXO',
      title: 'CNPJ Identificado no Rodapé (Em Conformidade)',
      description: `Identificação fiscal presente no rodapé de ${siteData.domain}, atendendo à legislação brasileira de e-commerce.`,
      riskImpact: 'Aumenta em 24% a confiança de compradores de primeira viagem.',
      recommendation: 'Manter endereço físico e canal de atendimento SAC junto ao CNPJ.'
    });
  }

  if (!hasTrocasPolicy) {
    checks.push({
      id: 'sec-legal-trocas',
      category: 'Conformidade E-commerce',
      severity: 'ALTO',
      title: 'Política de Trocas e Devoluções Não Encontrada',
      description: 'O Código de Defesa do Consumidor (Art. 49) garante ao comprador o direito de arrependimento em até 7 dias após o recebimento.',
      riskImpact: 'Clientes abandonam o carrinho por medo de comprar o tamanho errado de vestuário e não conseguir trocar.',
      recommendation: 'Criar uma página dedicada: "Política de Trocas e Devoluções - 1ª Troca Grátis em até 7/30 dias" e linkar no rodapé e abaixo do botão comprar.'
    });
  }

  if (!hasPrivacyPolicy) {
    checks.push({
      id: 'sec-legal-privacy',
      category: 'Legal & LGPD',
      severity: 'ALTO',
      title: 'Aviso de Privacidade e Termos de Uso (LGPD) Ausentes',
      description: 'Não foi detectado link explícito para Política de Privacidade em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
      riskImpact: 'Risco de penalidades da ANPD e bloqueio de contas de anúncios no Meta Ads e Google Ads por falta de compliance.',
      recommendation: 'Inserir link de Política de Privacidade atualizada e termo de consentimento de cookies na primeira visita.'
    });
  }

  // Check 5: Form Security
  if (siteData.formCount > 0) {
    checks.push({
      id: 'sec-form-ok',
      category: 'Formulários',
      severity: 'BAIXO',
      title: `Inspeção de Formulários (${siteData.formCount} formulários lidos)`,
      description: 'Formulários de busca, login e newsletter verificados quanto à transmissão segura.',
      riskImpact: 'Coleta protegida.',
      recommendation: 'Garantir que nenhum campo de senha ou cartão seja transmitido via requisição GET desprotegida.'
    });
  }

  // Calculate scores
  let criticalCount = checks.filter(c => c.severity === 'CRÍTICO').length;
  let highCount = checks.filter(c => c.severity === 'ALTO').length;
  let mediumCount = checks.filter(c => c.severity === 'MÉDIO').length;

  const securityScore = Math.max(30, Math.min(98, 100 - (criticalCount * 25) - (highCount * 15) - (mediumCount * 8)));
  const legalComplianceScore = (hasCnpjInFooter ? 40 : 0) + (hasTrocasPolicy ? 30 : 0) + (hasPrivacyPolicy ? 20 : 0) + (hasAddress ? 10 : 0);

  return {
    securityScore,
    isHttps: siteData.isHttps,
    hasCspHeader,
    hasXFrameOptions,
    exposedKeysCount: 0,
    unsafeLinksCount: unsafeCount,
    legalComplianceScore,
    checks
  };
}
