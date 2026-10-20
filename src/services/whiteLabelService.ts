export interface WhiteLabelConfig {
  agencyName: string;
  logoUrl: string;
  primaryColor: string;
  consultantName: string;
  consultantRole: string;
  consultantWhatsApp: string;
  consultantEmail: string;
  agencyWebsite: string;
  checkoutUrlStarter: string;
  checkoutUrlPro: string;
  checkoutUrlAgency: string;
}

const STORAGE_KEY = 'whitelabel_config';
const AGENCY_CONFIG_KEY = 'adshield_agency_whitelabel_config_v1';

const defaultConfig: WhiteLabelConfig = {
  agencyName: 'AdShield',
  logoUrl: '',
  primaryColor: '#0AE448',
  consultantName: 'Especialista em Performance',
  consultantRole: 'Head de Conversão & Mídia Paga',
  consultantWhatsApp: '5511999999999',
  consultantEmail: 'contato@adshield.com.br',
  agencyWebsite: 'https://adshield.com.br',
  checkoutUrlStarter: '',
  checkoutUrlPro: '',
  checkoutUrlAgency: ''
};

export function getWhiteLabelConfig(): WhiteLabelConfig {
  if (typeof localStorage === 'undefined') return defaultConfig;
  const stored = localStorage.getItem(STORAGE_KEY);
  const agencyStored = localStorage.getItem(AGENCY_CONFIG_KEY);
  let merged = { ...defaultConfig };

  if (agencyStored) {
    try {
      const parsedAgency = JSON.parse(agencyStored);
      merged = {
        ...merged,
        agencyName: parsedAgency.agencyName || merged.agencyName,
        logoUrl: parsedAgency.agencyLogoUrl || merged.logoUrl,
        primaryColor: parsedAgency.primaryBrandColor || merged.primaryColor,
        consultantName: parsedAgency.consultantName || merged.consultantName,
        consultantRole: parsedAgency.consultantRole || merged.consultantRole,
        consultantWhatsApp: parsedAgency.consultantWhatsApp || merged.consultantWhatsApp,
        consultantEmail: parsedAgency.consultantEmail || merged.consultantEmail,
        agencyWebsite: parsedAgency.agencyWebsite || merged.agencyWebsite
      };
    } catch {
      // ignore
    }
  }

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      merged = { ...merged, ...parsed };
    } catch {
      // ignore
    }
  }

  return merged;
}

export function setWhiteLabelConfig(config: Partial<WhiteLabelConfig>) {
  const current = getWhiteLabelConfig();
  const next = { ...current, ...config };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // Sincroniza também com o gerador de Dossiê PDF White-Label (adshield_agency_whitelabel_config_v1)
    try {
      const existingAgencyRaw = localStorage.getItem(AGENCY_CONFIG_KEY);
      const existingAgency = existingAgencyRaw ? JSON.parse(existingAgencyRaw) : {};
      localStorage.setItem(
        AGENCY_CONFIG_KEY,
        JSON.stringify({
          includeCommercialProposal: true,
          proposedRetainerValue: 3500,
          customNotesToClient:
            'Este diagnóstico executivo foi elaborado com exclusividade para a diretoria da loja, identificando as principais oportunidades de ganho imediato de margem e conversão.',
          ...existingAgency,
          agencyName: next.agencyName,
          agencyLogoUrl: next.logoUrl,
          primaryBrandColor: next.primaryColor,
          consultantName: next.consultantName,
          consultantRole: next.consultantRole,
          consultantWhatsApp: next.consultantWhatsApp,
          consultantEmail: next.consultantEmail,
          agencyWebsite: next.agencyWebsite
        })
      );
    } catch {
      // ignore
    }
  }
  return next;
}
