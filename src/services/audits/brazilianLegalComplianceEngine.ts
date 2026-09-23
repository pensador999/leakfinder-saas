// ==============================================================================
// ⚖️ MOTOR DE AUDITORIA DE CONFORMIDADE LEGAL BRASILEIRA (ADSHIELD LEGAL)
// Regulamentação: Decreto Federal nº 7.962/2013 (Lei do E-commerce) + CDC Art. 49
// ==============================================================================

export interface LegalComplianceReport {
  isFullyCompliant: boolean;
  complianceScore: number; // 0 a 100
  cnpjFound?: string;
  hasCnpjInFooter: boolean;
  isCnpjValid: boolean;
  hasCompanyName: boolean;
  companyName?: string;
  hasPhysicalAddress: boolean;
  hasReturnPolicy7Days: boolean;
  hasPrivacyPolicyLgpd: boolean;
  hasVisibleSacPhoneOrEmail: boolean;
  violations: {
    rule: string;
    description: string;
    legalSeverity: 'CRITICA' | 'ALTA' | 'MEDIA';
    adAccountRisk: string;
  }[];
  pitchOutboundAngle: string;
}

/**
 * Validação estrita de CNPJ com cálculo de dígitos verificadores (Módulo 11)
 */
export function validateCnpj(cnpjStr: string): boolean {
  if (!cnpjStr) return false;
  const clean = cnpjStr.replace(/\D/g, '');
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false; // Bloqueia 00.000.000/0000-00, 111..., etc.

  let size = 12;
  let numbers = clean.substring(0, size);
  const digits = clean.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  size = 13;
  numbers = clean.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(1));
}

/**
 * Inspeciona o HTML público (em especial rodapé e headers) para avaliar
 * conformidade com a Lei do E-commerce Brasileira.
 */
export function auditBrazilianLegalCompliance(html: string, isMarketplace: boolean = false): LegalComplianceReport {
  if (isMarketplace) {
    return {
      isFullyCompliant: true,
      complianceScore: 96,
      hasCnpjInFooter: true,
      isCnpjValid: true,
      hasCompanyName: true,
      hasPhysicalAddress: true,
      hasReturnPolicy7Days: true,
      hasPrivacyPolicyLgpd: true,
      hasVisibleSacPhoneOrEmail: true,
      violations: [],
      pitchOutboundAngle: 'Operação em Marketplace Oficial: A conformidade legal de checkout, intermediação financeira, CDC Art. 49 e proteção LGPD são geridas e asseguradas pela plataforma contratada.'
    };
  }

  const htmlLower = (html || '').toLowerCase();
  const violations: LegalComplianceReport['violations'] = [];

  // 1. Extração de CNPJ
  const cnpjMatches = html.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g) || 
                      html.match(/\b\d{14}\b/g) || [];
  let cnpjFound: string | undefined = undefined;
  let isCnpjValid = false;

  for (const raw of cnpjMatches) {
    if (validateCnpj(raw)) {
      cnpjFound = raw.includes('/') ? raw : raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      isCnpjValid = true;
      break;
    }
  }

  // Se encontrou padrão de CNPJ mas os dígitos verificadores falharam
  if (!cnpjFound && cnpjMatches.length > 0) {
    cnpjFound = cnpjMatches[0];
    isCnpjValid = false;
  }

  const hasCnpjInFooter = Boolean(cnpjFound || htmlLower.includes('cnpj'));

  if (!cnpjFound) {
    violations.push({
      rule: 'Decreto Federal nº 7.962/2013 - Art. 2º, I (CNPJ no Rodapé)',
      description: 'Ausência de CNPJ visível no rodapé ou na vitrine da loja.',
      legalSeverity: 'CRITICA',
      adAccountRisk: 'Risco de suspensão de conta no Google Merchant Center e bloqueio de catálogo no Meta Ads por falta de transparência empresarial.'
    });
  } else if (!isCnpjValid) {
    violations.push({
      rule: 'Validação Cadastral Receita Federal - CNPJ com Dígitos Inválidos',
      description: `O CNPJ identificado no rodapé (${cnpjFound}) não passou no cálculo do Módulo 11 da Receita Federal. Pode ser erro de digitação ou cadastro inválido.`,
      legalSeverity: 'ALTA',
      adAccountRisk: 'Reprovação de contas comerciais no Meta Business Manager e Google Merchant Center.'
    });
  }

  // 2. Razão Social / Nome Empresarial
  const hasCompanyName = htmlLower.includes('ltda') || 
                         htmlLower.includes('s.a.') || 
                         htmlLower.includes('s/a') || 
                         htmlLower.includes('eireli') || 
                         htmlLower.includes('sociedade anonima') ||
                         htmlLower.includes('razão social') ||
                         htmlLower.includes('razao social');

  if (!hasCompanyName && !cnpjFound) {
    violations.push({
      rule: 'Decreto Federal nº 7.962/2013 - Art. 2º, I (Razão Social)',
      description: 'Razão social da pessoa jurídica não identificada no rodapé da loja.',
      legalSeverity: 'ALTA',
      adAccountRisk: 'Reprovação de anúncios em campanhas locais e desconfiança de novos compradores no checkout.'
    });
  }

  // 3. Endereço Físico
  const hasPhysicalAddress = htmlLower.includes('cep:') || 
                            htmlLower.includes('cep ') || 
                            /\b\d{5}-\d{3}\b/.test(html) ||
                            htmlLower.includes('rua ') || 
                            htmlLower.includes('av.') || 
                            htmlLower.includes('avenida ') || 
                            htmlLower.includes('rodovia ');

  if (!hasPhysicalAddress) {
    violations.push({
      rule: 'Decreto Federal nº 7.962/2013 - Art. 2º, II (Endereço Físico)',
      description: 'Endereço físico de localização da empresa não divulgado de forma clara.',
      legalSeverity: 'MEDIA',
      adAccountRisk: 'Sinalização de baixa reputação por robôs do Google Safe Browsing.'
    });
  }

  // 4. Direito de Arrependimento (CDC Art. 49 - 7 Dias)
  const hasReturnPolicy7Days = htmlLower.includes('7 dias') || 
                               htmlLower.includes('sete dias') || 
                               htmlLower.includes('devolu') || 
                               htmlLower.includes('troca') ||
                               htmlLower.includes('arrependimento');

  if (!hasReturnPolicy7Days) {
    violations.push({
      rule: 'Código de Defesa do Consumidor - Art. 49 (Direito de Arrependimento de 7 Dias)',
      description: 'Ausência de menção clara sobre o direito de arrependimento e devolução gratuita em 7 dias.',
      legalSeverity: 'MEDIA',
      adAccountRisk: 'Risco de multas do PROCON e estornos diretos com adquirentes (chargebacks).'
    });
  }

  // 5. Política de Privacidade / LGPD
  const hasPrivacyPolicyLgpd = htmlLower.includes('privacidade') || 
                               htmlLower.includes('lgpd') || 
                               htmlLower.includes('termos de uso') ||
                               htmlLower.includes('política de privacidade');

  // 6. SAC / Contato Visível
  const hasVisibleSacPhoneOrEmail = htmlLower.includes('sac') || 
                                    htmlLower.includes('fale conosco') || 
                                    htmlLower.includes('whatsapp') ||
                                    htmlLower.includes('atendimento') ||
                                    htmlLower.includes('@');

  // Cálculo de Score
  let score = 100;
  if (!cnpjFound) score -= 40;
  else if (!isCnpjValid) score -= 25;
  if (!hasCompanyName) score -= 15;
  if (!hasPhysicalAddress) score -= 15;
  if (!hasReturnPolicy7Days) score -= 15;
  if (!hasPrivacyPolicyLgpd) score -= 10;
  if (!hasVisibleSacPhoneOrEmail) score -= 5;
  score = Math.max(0, Math.min(100, score));

  // Pitch de Outbound personalizado
  let pitchOutboundAngle = '';
  if (!cnpjFound) {
    pitchOutboundAngle = 'Sua loja está vulnerável a bloqueios no Google Merchant Center e Meta Ads porque o CNPJ da empresa não está visível no rodapé, descumprindo o Decreto Federal nº 7.962/2013.';
  } else if (!hasReturnPolicy7Days) {
    pitchOutboundAngle = 'A loja não exibe política visível do Art. 49 do CDC (7 dias de arrependimento), o que aumenta a desconfiança de novos compradores e gera perda de conversão no checkout.';
  } else {
    pitchOutboundAngle = `A loja possui CNPJ regular (${cnpjFound}) e boas práticas de transparência legal.`;
  }

  return {
    isFullyCompliant: violations.length === 0,
    complianceScore: score,
    cnpjFound,
    hasCnpjInFooter,
    isCnpjValid,
    hasCompanyName,
    hasPhysicalAddress,
    hasReturnPolicy7Days,
    hasPrivacyPolicyLgpd,
    hasVisibleSacPhoneOrEmail,
    violations,
    pitchOutboundAngle
  };
}
