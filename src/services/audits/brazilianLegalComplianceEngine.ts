// ==============================================================================
// ⚖️ MOTOR DE AUDITORIA DE CONFORMIDADE LEGAL MULTI-MERCADO (ADSHIELD LEGAL)
// Regulamentações:
// - BR: Decreto Federal nº 7.962/2013 + CDC Art. 49 + LGPD
// - US: FTC Act + CCPA/CPRA Privacy + Return Policy
// - UK: UK Consumer Contracts Regulations (14-Day Return) + UK GDPR + Company Reg/VAT
// - DE: Impressumspflicht (§ 5 TMG/DDG) + 14 Tage Widerrufsrecht + DSGVO
// - FR: Mentions Légales (LCEN / SIRET) + 14 Jours Rétractation + RGPD
// - ES: LSSI-CE (Aviso Legal / NIF-CIF) + 14 Días Desistimiento + RGPD
// ==============================================================================

import { detectStoreMarketProfile } from '../../i18n/marketProfiles.ts';

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
  accessibilityCompliance?: {
    framework: string;
    isCompliant: boolean;
    totalImagesChecked: number;
    imagesMissingAlt: number;
    missingAltRatio: number;
    hasHtmlLangAttribute: boolean;
    unlabeledButtonsCount: number;
  };
  violations: {
    rule: string;
    description: string;
    legalSeverity: 'CRITICA' | 'ALTA' | 'MEDIA';
    adAccountRisk: string;
  }[];
  pitchOutboundAngle: string;
}

function evaluateDomAccessibility(html: string, localeId: string): NonNullable<LegalComplianceReport['accessibilityCompliance']> {
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const totalImagesChecked = imgTags.length;
  const imagesMissingAlt = imgTags.filter(tag => !/\balt\s*=\s*["'][^"']+["']/i.test(tag)).length;
  const missingAltRatio = totalImagesChecked > 0
    ? Math.round((imagesMissingAlt / totalImagesChecked) * 100) / 100
    : 0;

  const htmlOpenTagMatch = html.match(/<html\b[^>]*>/i);
  const hasHtmlLangAttribute = htmlOpenTagMatch
    ? /\blang\s*=\s*["'][^"']+["']/i.test(htmlOpenTagMatch[0])
    : true;

  const buttonMatches = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) || [];
  let unlabeledButtonsCount = 0;
  for (const btn of buttonMatches) {
    const openTag = btn.match(/<button\b[^>]*>/i)?.[0] || '';
    const hasAriaOrTitle = /\b(aria-label|aria-labelledby|title)\s*=\s*["'][^"']+["']/i.test(openTag);
    const innerText = btn.replace(/<[^>]*>/g, '').trim();
    const hasImgWithAltInside = /<img\b[^>]*\balt\s*=\s*["'][^"']+["'][^>]*>/i.test(btn);
    if (!hasAriaOrTitle && !innerText && !hasImgWithAltInside) {
      unlabeledButtonsCount++;
    }
  }

  const frameworkMap: Record<string, string> = {
    'en-US': 'ADA Title III & WCAG 2.1 Level AA',
    'en-GB': 'UK Equality Act 2010 & WCAG 2.1 Level AA',
    'de-DE': 'Barrierefreiheitsstärkungsgesetz (BFSG 2025) & EAA',
    'fr-FR': 'European Accessibility Act (EAA 2025) & RGAA',
    'es-ES': 'European Accessibility Act (EAA 2025) & UNE-EN 301549',
    'pt-BR': 'Lei Brasileira de Inclusão (LBI Art. 63) & WCAG 2.1',
  };

  const isCompliant = !(
    (totalImagesChecked > 0 && missingAltRatio > 0.3) ||
    !hasHtmlLangAttribute ||
    unlabeledButtonsCount > 0
  );

  return {
    framework: frameworkMap[localeId] || frameworkMap['en-US'],
    isCompliant,
    totalImagesChecked,
    imagesMissingAlt,
    missingAltRatio,
    hasHtmlLangAttribute,
    unlabeledButtonsCount,
  };
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
 * conformidade com a legislação de e-commerce aplicável ao mercado da loja.
 */
export function auditBrazilianLegalCompliance(
  html: string,
  isMarketplaceOrDomain: boolean | string = false,
  domainOrLocale?: string
): LegalComplianceReport {
  const isMarketplace = typeof isMarketplaceOrDomain === 'boolean' ? isMarketplaceOrDomain : false;
  const domain = typeof isMarketplaceOrDomain === 'string'
    ? isMarketplaceOrDomain
    : (domainOrLocale || '');
  const explicitLocale = typeof isMarketplaceOrDomain === 'string' && domainOrLocale
    ? domainOrLocale
    : undefined;

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
  const marketProfile = detectStoreMarketProfile(domain, html, explicitLocale);
  const accessibilityCompliance = evaluateDomAccessibility(html || '', marketProfile.id);

  // Internacional (US, UK, DE, FR, ES): avalia conformidade legal da jurisdição local + Acessibilidade (ADA Title III / EAA 2025 / BFSG) sem penalizar por falta de CNPJ brasileiro
  if (marketProfile.id !== 'pt-BR') {
    const violations: LegalComplianceReport['violations'] = [];
    const hasEntityDisclosure = marketProfile.legalEntityKeywords.some(kw => htmlLower.includes(kw.toLowerCase()));
    const hasPrivacy = marketProfile.privacyLawKeywords.some(kw => htmlLower.includes(kw.toLowerCase()));
    const hasReturnRight = marketProfile.returnRightKeywords.some(kw => htmlLower.includes(kw.toLowerCase()));
    const hasContact = htmlLower.includes('contact') || htmlLower.includes('support') || htmlLower.includes('help') || htmlLower.includes('impressum') || htmlLower.includes('@');
    const hasAddress = /\b\d{5}\b/.test(html) || htmlLower.includes('street') || htmlLower.includes('road') || htmlLower.includes('ave') || htmlLower.includes('straße') || htmlLower.includes('rue') || htmlLower.includes('calle') || hasEntityDisclosure;

    if (!hasEntityDisclosure) {
      violations.push({
        rule: `${marketProfile.legalFrameworkName} (Corporate / Legal Entity Disclosure)`,
        description: `Missing corporate entity disclosure (${marketProfile.legalEntityKeywords.slice(0, 3).join(', ')}) in store footer.`,
        legalSeverity: 'ALTA',
        adAccountRisk: 'Risk of Google Merchant Center misrepresentation suspension and Meta Ads trust score penalty.'
      });
    }
    if (!hasReturnRight) {
      violations.push({
        rule: `${marketProfile.legalFrameworkName} (Consumer Return / Withdrawal Policy)`,
        description: 'Return & refund window not clearly disclosed in storefront footer.',
        legalSeverity: 'MEDIA',
        adAccountRisk: 'Elevated chargeback rate and Google Shopping policy warnings.'
      });
    }
    if (!hasPrivacy) {
      violations.push({
        rule: `${marketProfile.legalFrameworkName} (Privacy & Data Protection Policy)`,
        description: 'Privacy policy / data protection notice not detected in footer.',
        legalSeverity: 'MEDIA',
        adAccountRisk: 'Ad pixel compliance risk under GDPR/CCPA.'
      });
    }
    if (!accessibilityCompliance.isCompliant) {
      const a11yDetails: string[] = [];
      if (accessibilityCompliance.totalImagesChecked > 0 && accessibilityCompliance.missingAltRatio > 0.3) {
        a11yDetails.push(`${accessibilityCompliance.imagesMissingAlt}/${accessibilityCompliance.totalImagesChecked} images missing alt text (${Math.round(accessibilityCompliance.missingAltRatio * 100)}%)`);
      }
      if (!accessibilityCompliance.hasHtmlLangAttribute) {
        a11yDetails.push('missing lang attribute on <html> root');
      }
      if (accessibilityCompliance.unlabeledButtonsCount > 0) {
        a11yDetails.push(`${accessibilityCompliance.unlabeledButtonsCount} unlabeled interactive <button> element(s)`);
      }
      violations.push({
        rule: `${accessibilityCompliance.framework} (Digital Accessibility Compliance)`,
        description: `Storefront DOM exhibits screen-reader accessibility barriers: ${a11yDetails.join(', ')}.`,
        legalSeverity: 'ALTA',
        adAccountRisk: marketProfile.id === 'en-US'
          ? 'High risk of ADA Title III demand letters / class-action litigation and reduced ad landing page quality score.'
          : 'Risk of regulatory penalties under the European Accessibility Act (EAA 2025 / BFSG) and reduced ad quality score.'
      });
    }

    let intlScore = 100;
    if (!hasEntityDisclosure) intlScore -= 25;
    if (!hasReturnRight) intlScore -= 15;
    if (!hasPrivacy) intlScore -= 15;
    if (!hasContact) intlScore -= 10;
    if (!accessibilityCompliance.isCompliant) intlScore -= 15;
    intlScore = Math.max(0, Math.min(100, intlScore));

    return {
      isFullyCompliant: violations.length === 0,
      complianceScore: intlScore,
      cnpjFound: hasEntityDisclosure ? `${marketProfile.country} Registered Entity` : undefined,
      hasCnpjInFooter: hasEntityDisclosure,
      isCnpjValid: hasEntityDisclosure,
      hasCompanyName: hasEntityDisclosure,
      hasPhysicalAddress: hasAddress,
      hasReturnPolicy7Days: hasReturnRight,
      hasPrivacyPolicyLgpd: hasPrivacy,
      hasVisibleSacPhoneOrEmail: hasContact,
      accessibilityCompliance,
      violations,
      pitchOutboundAngle: violations.length === 0
        ? `Store complies with ${marketProfile.legalFrameworkName} and ${accessibilityCompliance.framework} requirements.`
        : `Store has ${violations.length} compliance gap(s) under ${marketProfile.legalFrameworkName} / ${accessibilityCompliance.framework} that may impact Google Merchant Center & Meta Ads approval.`
    };
  }

  const violations: LegalComplianceReport['violations'] = [];

  // 1. Extração de CNPJ (Apenas formato oficial XX.XXX.XXX/XXXX-XX ou 14 dígitos explicitamente precedidos por "CNPJ")
  const formattedCnpjMatches = html.match(/\d{2}\.?\d{3}\.?\d{3}\/\d{4}-\d{2}/g) || [];
  const contextualRawMatches = Array.from(html.matchAll(/cnpj\s*[:º°\-]?\s*(\d{14})\b/gi)).map(m => m[1]);
  const cnpjMatches = [...formattedCnpjMatches, ...contextualRawMatches];
  let cnpjFound: string | undefined = undefined;
  let isCnpjValid = false;

  for (const raw of cnpjMatches) {
    if (validateCnpj(raw)) {
      cnpjFound = raw.includes('/') ? raw : raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      isCnpjValid = true;
      break;
    }
  }

  // Se encontrou padrão explícito de CNPJ formatado (com barra/hífen) mas os dígitos verificadores falharam
  if (!cnpjFound && formattedCnpjMatches.length > 0) {
    cnpjFound = formattedCnpjMatches[0];
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
    accessibilityCompliance,
    violations,
    pitchOutboundAngle
  };
}
