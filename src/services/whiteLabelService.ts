export interface WhiteLabelConfig {
  agencyName: string;
  logoUrl: string;
  primaryColor: string;
  checkoutUrlStarter: string;
  checkoutUrlPro: string;
  checkoutUrlAgency: string;
}

const STORAGE_KEY = 'whitelabel_config';

const defaultConfig: WhiteLabelConfig = {
  agencyName: 'AdShield',
  logoUrl: '',
  primaryColor: '#2563eb', // blue-600
  checkoutUrlStarter: '',
  checkoutUrlPro: '',
  checkoutUrlAgency: ''
};

export function getWhiteLabelConfig(): WhiteLabelConfig {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) };
    } catch {
      return defaultConfig;
    }
  }
  return defaultConfig;
}

export function setWhiteLabelConfig(config: Partial<WhiteLabelConfig>) {
  const current = getWhiteLabelConfig();
  const next = { ...current, ...config };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
