// ==============================================================================
// 📱 COMMERCIAL CONTACT SNIPER AGENT (MINERADOR DE IDENTIDADE & CONTATOS)
// Skill: deep-research-competitive-intel + growth-outbound-closer
// PAPEL EXCLUSIVO: Mineração forense de canais de contato corporativo (WhatsApp / SAC)
// e auditoria de identificação fiscal (Decreto Federal nº 7.962/2013 - CNPJ no rodapé).
// ISOLAMENTO: ZERO cálculos de perda financeira. Apenas prospecção e validação de contatos.
// ==============================================================================

export type ContactChannelType = 
  | 'WHATSAPP_VERIFIED_MOBILE' 
  | 'LANDLINE_SAC_ONLY' 
  | 'EMAIL_SAC_ONLY' 
  | 'CONTACT_NOT_FOUND';

export interface CommercialContactTarget {
  storeDomain: string;
  brandName: string;
  channelType: ContactChannelType;
  
  // WhatsApp / Telefone Móvel
  rawPhoneFound?: string;
  cleanFormattedPhone?: string;     // Ex: (34) 99135-1122
  e164InternationalPhone?: string;   // Ex: 5534991351122
  isMobilePhone: boolean;
  areaCodeDdd?: string;
  
  // Conformidade Legal Brasileira (Decreto Federal 7.962/2013)
  legalCompliance: {
    hasCnpjInFooter: boolean;
    detectedCnpj?: string;
    detectedCorporateReason?: string;
    isInfringingEcommerceDecree: boolean; // Verdadeiro se loja omitir CNPJ no rodapé
  };
  
  // Links de Ação
  whatsAppClickToChatUrl?: string;
  contactSourceLocation: string; // Ex: 'DOM:footer_link' | 'DOM:floating_button' | 'DOM:legal_text'
  confidenceScorePct: number;    // 0 a 100
}

/**
 * Validador e Higienizador de Telefone Brasileiro
 */
export function sanitizeBrazilianPhoneNumber(rawInput: string): {
  isValid: boolean;
  isMobile: boolean;
  cleanFormatted: string;
  e164: string;
  ddd: string;
} {
  const digits = rawInput.replace(/\D/g, '');
  
  // Remove 55 inicial se já existir para normalização
  let localDigits = digits;
  if (localDigits.startsWith('55') && localDigits.length >= 12) {
    localDigits = localDigits.slice(2);
  }

  // DDD brasileiro válido: 11 a 99
  if (localDigits.length < 10 || localDigits.length > 11) {
    return { isValid: false, isMobile: false, cleanFormatted: '', e164: '', ddd: '' };
  }

  const ddd = localDigits.slice(0, 2);
  const dddNumber = parseInt(ddd, 10);
  if (dddNumber < 11 || dddNumber > 99) {
    return { isValid: false, isMobile: false, cleanFormatted: '', e164: '', ddd: '' };
  }

  const numberPart = localDigits.slice(2);
  const isMobile = localDigits.length === 11 && numberPart.startsWith('9');

  let cleanFormatted = '';
  if (isMobile) {
    cleanFormatted = `(${ddd}) ${numberPart.slice(0, 5)}-${numberPart.slice(5)}`;
  } else {
    cleanFormatted = `(${ddd}) ${numberPart.slice(0, 4)}-${numberPart.slice(4)}`;
  }

  const e164 = `55${localDigits}`;

  return {
    isValid: true,
    isMobile,
    cleanFormatted,
    e164,
    ddd
  };
}

/**
 * AGENTE SNIPER DE CONTATO COMERCIAL & IDENTIDADE
 * Extrai canais reais de contato e audita a legalidade cadastral no DOM.
 */
export function extractCommercialContactsFromHtml(
  htmlContent: string,
  storeDomain: string,
  brandName: string = ''
): CommercialContactTarget {
  let rawPhoneFound: string | undefined;
  let sourceLocation = 'DOM:not_found';
  let isMobile = false;
  let cleanFormattedPhone: string | undefined;
  let e164Phone: string | undefined;
  let dddFound: string | undefined;

  // 1. Procura por links diretos do WhatsApp (wa.me, api.whatsapp.com, send?phone=)
  const waLinkRegex = /(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com\/send\?phone=)(\d{10,13})/i;
  const waMatch = htmlContent.match(waLinkRegex);

  if (waMatch && waMatch[1]) {
    const sanitized = sanitizeBrazilianPhoneNumber(waMatch[1]);
    if (sanitized.isValid) {
      rawPhoneFound = waMatch[1];
      cleanFormattedPhone = sanitized.cleanFormatted;
      e164Phone = sanitized.e164;
      isMobile = sanitized.isMobile;
      dddFound = sanitized.ddd;
      sourceLocation = 'DOM:whatsapp_click_link';
    }
  }

  // 2. Se não encontrou link direto, procura por padrões de telefone com DDD no rodapé/HTML
  if (!rawPhoneFound) {
    const phonePattern = /(?:\+?55\s?)?(?:\(?([1-9]{2})\)?\s?)?(?:9\s?)?([2-9]\d{3})[-.\s]?(\d{4})/g;
    const matches = [...htmlContent.matchAll(phonePattern)];

    for (const m of matches) {
      const fullText = m[0];
      const sanitized = sanitizeBrazilianPhoneNumber(fullText);
      if (sanitized.isValid) {
        rawPhoneFound = fullText;
        cleanFormattedPhone = sanitized.cleanFormatted;
        e164Phone = sanitized.e164;
        isMobile = sanitized.isMobile;
        dddFound = sanitized.ddd;
        sourceLocation = sanitized.isMobile ? 'DOM:mobile_in_footer' : 'DOM:landline_sac';
        if (sanitized.isMobile) break; // Prioriza celular móvel
      }
    }
  }

  // 3. Auditoria do Decreto Federal nº 7.962/2013 (CNPJ e Razão Social no rodapé)
  const cnpjRegex = /\b(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\b/;
  const cnpjMatch = htmlContent.match(cnpjRegex);

  const legalCompliance = {
    hasCnpjInFooter: Boolean(cnpjMatch),
    detectedCnpj: cnpjMatch ? cnpjMatch[1] : undefined,
    detectedCorporateReason: undefined as string | undefined,
    isInfringingEcommerceDecree: !Boolean(cnpjMatch)
  };

  // Se houver CNPJ, tenta inferir a razão social que comumente o acompanha
  if (cnpjMatch) {
    const snippetAroundCnpj = htmlContent.slice(Math.max(0, cnpjMatch.index! - 100), cnpjMatch.index! + 100);
    const cleanSnippet = snippetAroundCnpj.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    legalCompliance.detectedCorporateReason = cleanSnippet.length > 10 ? cleanSnippet.slice(0, 60) : brandName;
  }

  // 4. Determina o tipo de canal
  let channelType: ContactChannelType = 'CONTACT_NOT_FOUND';
  if (e164Phone && isMobile) {
    channelType = 'WHATSAPP_VERIFIED_MOBILE';
  } else if (e164Phone && !isMobile) {
    channelType = 'LANDLINE_SAC_ONLY';
  }

  // 5. Constrói link Click-to-Chat se houver número móvel
  let whatsAppClickToChatUrl: string | undefined;
  if (channelType === 'WHATSAPP_VERIFIED_MOBILE' && e164Phone) {
    whatsAppClickToChatUrl = `https://api.whatsapp.com/send?phone=${e164Phone}`;
  }

  const confidenceScorePct = channelType === 'WHATSAPP_VERIFIED_MOBILE' ? 98 : (channelType === 'LANDLINE_SAC_ONLY' ? 75 : 10);

  return {
    storeDomain,
    brandName,
    channelType,
    rawPhoneFound,
    cleanFormattedPhone,
    e164InternationalPhone: e164Phone,
    isMobilePhone: isMobile,
    areaCodeDdd: dddFound,
    legalCompliance,
    whatsAppClickToChatUrl,
    contactSourceLocation: sourceLocation,
    confidenceScorePct
  };
}

/**
 * Constrói URL Click-to-Chat com texto formatado
 */
export function buildVerifiedClickToChat(phoneE164: string, messageText: string): string {
  const digits = phoneE164.replace(/\D/g, '');
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(messageText)}`;
}
