export interface CnpjData {
  found: boolean;
  rawCnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  situacaoCadastral?: string;
  dataInicioAtividade?: string;
  capitalSocial?: number;
  idadeAnos?: number;
  source?: 'HTML_FOOTER' | 'RDAP_REGISTRO_BR' | 'RDAP_OWNER' | 'MANUAL';
  modulo11Valid?: boolean;
}

export interface OsintAnalysisResult {
  cnpjData: CnpjData;
  reputation: {
    reclameAquiScore: number; // 0 to 10
    trustFactor: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'CRÍTICA';
    reclameAquiVerifiedLive?: boolean;
    verificationNote?: string;
    reclameAquiNote?: string;
  };
  domainAge: {
    registeredYears: number;
    isSuspiciouslyNew: boolean;
    registrationDate?: string;
    rdapSource?: string;
  };
  warnings: string[];
}

/**
 * Validação algorítmica oficial Módulo 11 da Receita Federal para CNPJ (14 dígitos).
 */
export function isValidCnpjModulo11(rawInput: string): boolean {
  const digits = rawInput.replace(/[^\d]/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calcDigit = (slice: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += Number(slice[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(digits.slice(0, 12), weights1);
  if (d1 !== Number(digits[12])) return false;

  const d2 = calcDigit(digits.slice(0, 13), weights2);
  return d2 === Number(digits[13]);
}

function formatCnpj(digits: string): string {
  const clean = digits.replace(/[^\d]/g, '');
  if (clean.length !== 14) return digits;
  return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12, 14)}`;
}

/**
 * Extrai CNPJ e Razão Social da resposta oficial RDAP (Registro.br), incluindo entidades aninhadas
 */
export function extractOwnerFromRdap(rdapJson: any): { cnpj?: string; legalName?: string } {
  if (!rdapJson || typeof rdapJson !== 'object') return {};
  let cnpj: string | undefined;
  let legalName: string | undefined;

  const inspectEntityList = (list: any[]) => {
    for (const ent of list) {
      if (!ent || typeof ent !== 'object') continue;
      if (Array.isArray(ent.publicIds)) {
        for (const pub of ent.publicIds) {
          const idDigits = String(pub?.identifier || '').replace(/[^\d]/g, '');
          if (idDigits.length === 14 && isValidCnpjModulo11(idDigits)) {
            cnpj = formatCnpj(idDigits);
          }
        }
      }
      if (!cnpj && typeof ent.handle === 'string') {
        const handleDigits = ent.handle.replace(/[^\d]/g, '');
        if (handleDigits.length === 14 && isValidCnpjModulo11(handleDigits)) {
          cnpj = formatCnpj(handleDigits);
        }
      }
      if (!legalName && Array.isArray(ent.vcardArray) && Array.isArray(ent.vcardArray[1])) {
        const fnEntry = ent.vcardArray[1].find((item: any) => Array.isArray(item) && item[0] === 'fn');
        if (fnEntry && typeof fnEntry[3] === 'string' && fnEntry[3].trim().length > 2) {
          legalName = fnEntry[3].trim();
        }
      }
      if (!legalName && typeof ent.legalRepresentative === 'string') {
        legalName = ent.legalRepresentative.trim();
      }
      if (Array.isArray(ent.entities)) {
        inspectEntityList(ent.entities);
      }
    }
  };

  if (Array.isArray(rdapJson.entities)) {
    inspectEntityList(rdapJson.entities);
  }

  if (!cnpj) {
    const rawStr = JSON.stringify(rdapJson.entities || '');
    const matches = rawStr.match(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g) || [];
    for (const m of matches) {
      if (isValidCnpjModulo11(m)) {
        cnpj = formatCnpj(m);
        break;
      }
    }
  }

  return { cnpj, legalName };
}

/**
 * Motor OSINT (Off-Page Intelligence)
 * 1. Busca CNPJ no HTML (ou via RDAP Registro.br se omitido no rodapé)
 * 2. Valida com Módulo 11 e faz cross-reference na BrasilAPI
 * 3. Consulta idade real do domínio via API Pública RDAP (rdap.registro.br / rdap.org)
 */
export async function analyzeOsint(htmlSnippet: string, domain: string, manualCnpj?: string): Promise<OsintAnalysisResult> {
  const warnings: string[] = [];
  const isTestEnv = typeof process !== 'undefined' && Boolean(process.env?.VITEST);
  const networkTimeoutMs = isTestEnv ? 1200 : 3500;

  const cleanDomain = (domain || '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .trim()
    .toLowerCase();

  let rawCnpj = manualCnpj || '';
  let cnpjSource: CnpjData['source'] = manualCnpj ? 'MANUAL' : undefined;

  if (!rawCnpj && htmlSnippet) {
    // 1. Procura CNPJs formatados (XX.XXX.XXX/XXXX-XX) ou precedidos explicitamente por "CNPJ" (evita confundir Meta Pixel ID de 14 dígitos com CNPJ)
    const formattedCnpjMatches = htmlSnippet.match(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g) || [];
    const labeledCnpjMatches = Array.from(
      htmlSnippet.matchAll(/\bcnpj\b[^0-9]{0,20}(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})\b/gi)
    ).map(m => m[1]);
    const matches = [...formattedCnpjMatches, ...labeledCnpjMatches];

    // Prioriza CNPJ que passe no Módulo 11; se nenhum passar, mantém o primeiro encontrado para reportar
    const validMatch = matches.find(m => isValidCnpjModulo11(m));
    if (validMatch) {
      rawCnpj = validMatch;
      cnpjSource = 'HTML_FOOTER';
    } else if (matches[0]) {
      rawCnpj = matches[0];
      cnpjSource = 'HTML_FOOTER';
    }
  }

  const foundInHtml = Boolean(rawCnpj);
  if (!foundInHtml) {
    warnings.push('Nenhum CNPJ detectado no HTML (Rodapé). E-commerces sem CNPJ visível sofrem queda de até 40% na confiança e conversão (Decreto Federal 7.962/2013).');
  }

  // 1. Consulta ao vivo RDAP (Registro.br para .br, rdap.org para demais TLDs)
  let registeredYears = 3; // Baseline neutro caso RDAP esteja inacessível por rede/CORS
  let registrationDate: string | undefined;
  let rdapSource: string | undefined;
  let rdapOwnerCnpj: string | undefined;
  let rdapLegalName: string | undefined;

  if (cleanDomain && cleanDomain.includes('.')) {
    const isBrDomain = cleanDomain.endsWith('.br');
    const rdapEndpoint = isBrDomain
      ? `https://rdap.registro.br/domain/${encodeURIComponent(cleanDomain)}`
      : `https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`;

    try {
      const rdapController = new AbortController();
      const rdapTimer = setTimeout(() => rdapController.abort(), networkTimeoutMs);
      const rdapRes = await fetch(rdapEndpoint, {
        signal: rdapController.signal,
        headers: { Accept: 'application/rdap+json, application/json' }
      });
      clearTimeout(rdapTimer);

      if (rdapRes.ok) {
        const rdapData = await rdapRes.json();
        rdapSource = isBrDomain ? 'rdap.registro.br' : 'rdap.org';

        const events = Array.isArray(rdapData?.events) ? rdapData.events : [];
        const regEvent =
          events.find((e: any) => e?.eventAction === 'registration' && e?.eventDate) ||
          events.find((e: any) => typeof e?.eventDate === 'string');

        if (regEvent?.eventDate) {
          registrationDate = regEvent.eventDate;
          const regTime = new Date(regEvent.eventDate).getTime();
          if (!Number.isNaN(regTime)) {
            const diffYears = (Date.now() - regTime) / (1000 * 60 * 60 * 24 * 365.25);
            registeredYears = Math.max(0, Math.floor(diffYears));
          }
        }

        const ownerInfo = extractOwnerFromRdap(rdapData);
        rdapOwnerCnpj = ownerInfo.cnpj;
        rdapLegalName = ownerInfo.legalName;

        // Bônus de Cruzamento Real: se o HTML não tinha CNPJ (ou tinha CNPJ inválido), usa o CNPJ oficial do titular no Registro.br
        if ((!rawCnpj || !isValidCnpjModulo11(rawCnpj)) && rdapOwnerCnpj) {
          rawCnpj = rdapOwnerCnpj;
          cnpjSource = 'RDAP_REGISTRO_BR';
        }
      }
    } catch {
      // Mantém fallback neutro se RDAP falhar por timeout/rede
    }
  }

  let cnpjData: CnpjData = { found: false };

  if (rawCnpj) {
    const cleanCnpj = rawCnpj.replace(/[^\d]/g, '');
    const modulo11Valid = isValidCnpjModulo11(cleanCnpj);

    cnpjData = {
      found: true,
      rawCnpj: formatCnpj(cleanCnpj),
      razaoSocial: rdapLegalName,
      source: cnpjSource,
      modulo11Valid
    };

    if (modulo11Valid) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), networkTimeoutMs);

        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, { signal: controller.signal });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();

          let idadeAnos = 0;
          if (data.data_inicio_atividade) {
            const [ano, mes, dia] = data.data_inicio_atividade.split('-');
            const dataInicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
            const hoje = new Date();
            idadeAnos = Math.max(0, hoje.getFullYear() - dataInicio.getFullYear());
          }

          cnpjData = {
            found: true,
            rawCnpj: formatCnpj(cleanCnpj),
            razaoSocial: data.razao_social || rdapLegalName,
            nomeFantasia: data.nome_fantasia || data.razao_social || rdapLegalName,
            situacaoCadastral: data.descricao_situacao_cadastral,
            dataInicioAtividade: data.data_inicio_atividade,
            capitalSocial: data.capital_social,
            idadeAnos,
            source: cnpjSource,
            modulo11Valid: true
          };

          if (data.descricao_situacao_cadastral && data.descricao_situacao_cadastral !== 'ATIVA') {
            warnings.push(`ALERTA GRAVE: CNPJ encontrado (${cnpjData.rawCnpj}) não está ATIVO na Receita Federal (Status: ${data.descricao_situacao_cadastral}).`);
          }
          if (idadeAnos < 1 && data.data_inicio_atividade) {
            warnings.push('Empresa recente: O CNPJ tem menos de 1 ano de atividade na Receita Federal.');
          }
        } else {
          cnpjData.situacaoCadastral = 'NAO_LOCALIZADO_BRASILAPI';
        }
      } catch {
        cnpjData.situacaoCadastral = 'FALHA_NA_CONSULTA';
      }
    } else {
      cnpjData.situacaoCadastral = 'DIGITO_VERIFICADOR_MOD11_INVALIDO';
    }
  }

  const isSuspiciouslyNew = registeredYears < 2;
  if (isSuspiciouslyNew) {
    warnings.push(`Domínio recente (${registeredYears} ano(s) de registro). Consumidores e ad-networks exigem reforço de prova social para domínios novos.`);
  }

  // 3. Verificação transparente de sinais do Reclame Aqui no DOM (Sem penalizar falsamente por hash!)
  const htmlLower = (htmlSnippet || '').toLowerCase();
  const hasRaSealInDom =
    htmlLower.includes('reclameaqui.com.br') ||
    htmlLower.includes('selo-ra') ||
    htmlLower.includes('ra-verified') ||
    htmlLower.includes('ra1000');

  // Nota neutra de referência quando não há widget público do Reclame Aqui embutido no HTML
  const reclameAquiScore = hasRaSealInDom ? 8.8 : 8.0;
  const verificationNote = hasRaSealInDom
    ? 'Selo/Link oficial do Reclame Aqui detectado no DOM da loja.'
    : 'Nota do Reclame Aqui não verificada ao vivo no HTML (requer consulta direta ou widget oficial RA).';

  let trustFactor: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'CRÍTICA' = 'ALTA';
  if (!cnpjData.found) {
    trustFactor = 'CRÍTICA';
  } else if (cnpjData.situacaoCadastral && cnpjData.situacaoCadastral !== 'ATIVA' && cnpjData.situacaoCadastral !== 'FALHA_NA_CONSULTA' && cnpjData.situacaoCadastral !== 'DIGITO_VERIFICADOR_MOD11_INVALIDO' && cnpjData.situacaoCadastral !== 'NAO_LOCALIZADO_BRASILAPI') {
    trustFactor = 'CRÍTICA';
  } else if (!foundInHtml && cnpjSource === 'RDAP_REGISTRO_BR') {
    // Tem CNPJ válido no Registro.br, mas omitiu no rodapé da loja
    trustFactor = isSuspiciouslyNew ? 'BAIXA' : 'MÉDIA';
  } else if (isSuspiciouslyNew) {
    trustFactor = 'MÉDIA';
  }

  if (trustFactor === 'CRÍTICA' || trustFactor === 'BAIXA') {
    warnings.push(`Reputação em Risco: Fator de confiança é ${trustFactor}, o que gera atrito severo no Checkout.`);
  }

  return {
    cnpjData,
    reputation: {
      reclameAquiScore,
      trustFactor,
      reclameAquiVerifiedLive: hasRaSealInDom,
      verificationNote,
      reclameAquiNote: verificationNote
    },
    domainAge: {
      registeredYears,
      isSuspiciouslyNew,
      registrationDate,
      rdapSource
    },
    warnings
  };
}

