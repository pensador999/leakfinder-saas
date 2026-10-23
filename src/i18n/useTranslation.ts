import { useAuditStore } from '../store/auditStore';
import { TRANSLATIONS, UiTranslations } from './translations';
import { MARKET_PROFILES, MarketProfile, StoreLocaleId } from './marketProfiles';
import { formatStoreCurrency } from '../services/pricing/currencyUtils';

export function useTranslation(): {
  locale: StoreLocaleId;
  uiLocale: StoreLocaleId;
  setLocale: (locale: StoreLocaleId) => void;
  setUiLocale: (locale: StoreLocaleId) => void;
  t: UiTranslations;
  marketProfile: MarketProfile;
  formatCurrency: (amount: number) => string;
  formatMoney: (amount: number) => string;
} {
  const locale = useAuditStore(state => state.uiLocale || 'pt-BR');
  const setLocale = useAuditStore(state => state.setUiLocale);
  const t = TRANSLATIONS[locale] || TRANSLATIONS['pt-BR'];
  const marketProfile = MARKET_PROFILES[locale] || MARKET_PROFILES['pt-BR'];
  const formatter = (amount: number) => formatStoreCurrency(amount, locale);

  return {
    locale,
    uiLocale: locale,
    setLocale,
    setUiLocale: setLocale,
    t,
    marketProfile,
    formatCurrency: formatter,
    formatMoney: formatter
  };
}
