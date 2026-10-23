// ==============================================================================
// 💵 GLOBAL MULTI-CURRENCY PARSER & UTILITIES — ADSHIELD 2026.5
// Zero-error parsing for both Brazilian/European ("R$ 1.250,90", "1.499,00 €")
// and Anglo-Saxon US/UK ("$1,250.90", "£2,499.00", "$159.90") currency formats.
// Prevents the thousands-separator bug across all global markets.
// ==============================================================================

import { MARKET_PROFILES, StoreLocaleId } from '../../i18n/marketProfiles.ts';

/**
 * Parses any raw string or number into a valid float number, automatically
 * detecting whether '.' or ',' is the decimal separator by position and context.
 */
export function parsePriceByMarket(
  rawValue: string | number | null | undefined,
  locale?: StoreLocaleId
): number {
  if (rawValue === null || rawValue === undefined) return 0;
  if (typeof rawValue === 'number') {
    return isNaN(rawValue) ? 0 : rawValue;
  }

  // Sanitize input
  const cleaned = String(rawValue)
    .replace(/<[^>]*>/g, '') // remove HTML tags if any
    .replace(/\u00a0/g, ' ') // non-breaking space
    .trim();

  if (!cleaned) return 0;

  // Case 1: Standard clean decimal format e.g. "159.90" or "0"
  if (/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  const isAngloCurrencyExplicit =
    /(\$|£|\bUSD\b|\bGBP\b)/i.test(cleaned) && !/R\$/i.test(cleaned);
  const isAngloLocale = locale === 'en-US' || locale === 'en-GB' || isAngloCurrencyExplicit;

  // Normalize space/non-breaking-space thousands separators between digits (e.g. "1 250,90 €" -> "1250,90 €")
  const normalizedSpaces = cleaned.replace(/(\d)\s+(?=\d{3}(?:\D|$))/g, '$1');

  // If the string contains multiple prices (e.g. "From $45.00 to $1,250.90" or "De R$ 199,90 por R$ 149,90" or "$45.00 - $60.00"),
  // extract the first distinct price token so digits from separate prices are never concatenated.
  const priceTokenMatches = normalizedSpaces.match(/-?\d[\d.,]*/g);
  if (!priceTokenMatches || priceTokenMatches.length === 0) return 0;

  // When a "De R$ X por R$ Y" / "Was $X Now $Y" discount pattern exists (where the discount keyword follows an initial price),
  // extract the active promotional price after the keyword, while keeping priceTokenMatches[0] for ranges like "From $45.00 to $1,250.90"
  // or leading keywords like "Por R$ 149,90 em 3x de R$ 49,96".
  let targetToken = priceTokenMatches[0];
  if (priceTokenMatches.length > 1) {
    const firstTokenEscaped = priceTokenMatches[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const isLeadingInstallmentCount =
      /^\d+$/.test(priceTokenMatches[0]) &&
      new RegExp(`^\\D*${firstTokenEscaped}\\s*x\\b`, 'i').test(normalizedSpaces);

    if (isLeadingInstallmentCount) {
      targetToken = priceTokenMatches[1];
    } else {
      const discountAfterFirstPriceMatch = normalizedSpaces.match(
        /-?\d[\d.,]*[\s\S]*\b(?:por|now|sale|apenas|only|jetzt|seulement|ahora)\b[^0-9]*(-?\d[\d.,]*)/i
      );
      if (discountAfterFirstPriceMatch && discountAfterFirstPriceMatch[1]) {
        targetToken = discountAfterFirstPriceMatch[1];
      }
    }
  }

  const sanitized = targetToken.replace(/[^\d.,-]/g, '').replace(/(?!^)-/g, '');
  if (!sanitized) return 0;

  // Case 2: Both dot and comma present
  // Compare lastIndexOf('.') vs lastIndexOf(',') to distinguish "$1,250.90" from "R$ 1.250,90"
  if (sanitized.includes('.') && sanitized.includes(',')) {
    if (sanitized.lastIndexOf('.') > sanitized.lastIndexOf(',')) {
      // Anglo-Saxon format (US/UK): comma is thousands separator, dot is decimal ("$1,250.90" -> 1250.90)
      const normalized = sanitized.replace(/,/g, '');
      const val = parseFloat(normalized);
      return isNaN(val) ? 0 : val;
    } else {
      // Brazilian / Continental European format: dot is thousands separator, comma is decimal ("R$ 1.250,90" -> 1250.90)
      const normalized = sanitized.replace(/\./g, '').replace(',', '.');
      const val = parseFloat(normalized);
      return isNaN(val) ? 0 : val;
    }
  }

  // Case 3: Only comma present
  if (sanitized.includes(',')) {
    const parts = sanitized.split(',');
    // Multiple commas e.g. "1,250,000" -> thousands separators
    if (parts.length > 2) {
      const val = parseFloat(sanitized.replace(/,/g, ''));
      return isNaN(val) ? 0 : val;
    }
    // Single comma with exactly 3 digits after it in Anglo context e.g. "$1,250" -> 1250
    if (isAngloLocale && parts.length === 2 && parts[1].length === 3 && parseInt(parts[0], 10) > 0) {
      const val = parseFloat(sanitized.replace(/,/g, ''));
      return isNaN(val) ? 0 : val;
    }
    // Otherwise decimal comma e.g. "159,90" or "1250,90" or "0,00"
    const normalized = sanitized.replace(',', '.');
    const val = parseFloat(normalized);
    return isNaN(val) ? 0 : val;
  }

  // Case 4: Only dots e.g. "1.250" (one thousand two hundred and fifty in BR/DE) vs "159.90" (decimal)
  if (sanitized.includes('.')) {
    const parts = sanitized.split('.');
    // If it has multiple dots e.g. "1.250.000", they are all thousand separators
    if (parts.length > 2) {
      const val = parseFloat(sanitized.replace(/\./g, ''));
      return isNaN(val) ? 0 : val;
    }
    // If single dot and 3 digits after it, e.g. "1.250" or "2.000", in Brazilian/EU context it's thousands
    if (!isAngloLocale && parts.length === 2 && parts[1].length === 3 && parseInt(parts[0], 10) > 0) {
      const val = parseFloat(sanitized.replace(/\./g, ''));
      return isNaN(val) ? 0 : val;
    }
    // Otherwise standard decimal dot e.g. "159.90"
    const val = parseFloat(sanitized);
    return isNaN(val) ? 0 : val;
  }

  const val = parseFloat(sanitized);
  return isNaN(val) ? 0 : val;
}

/**
 * Backward-compatible alias that safely parses BRL, USD, GBP, and EUR prices.
 */
export function parseBRLPrice(rawValue: string | number | null | undefined): number {
  return parsePriceByMarket(rawValue);
}

/**
 * Formats a numeric value using the target store locale's native currency symbol and separators.
 */
export function formatStoreCurrency(value: number, locale: StoreLocaleId = 'pt-BR'): string {
  const safeVal = isNaN(value) ? 0 : value;
  const profile = MARKET_PROFILES[locale] || MARKET_PROFILES['pt-BR'];

  if (locale === 'pt-BR') {
    return `R$ ${safeVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (locale === 'en-US') {
    return `$${safeVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (locale === 'en-GB') {
    return `£${safeVal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  // de-DE, fr-FR, es-ES (EUR)
  return `${profile.currencySymbol}${safeVal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a number to Brazilian Real string (e.g. "R$ 1.250,90")
 */
export function formatBRL(value: number): string {
  return formatStoreCurrency(value, 'pt-BR');
}

/**
 * Calculates price spread between our store and a competitor
 */
export function calculatePriceSpread(ourPrice: number, competitorPrice: number): {
  diffBRL: number;
  diffPercent: number;
  isCheaper: boolean;
  isMoreExpensive: boolean;
} {
  const diffBRL = Number((competitorPrice - ourPrice).toFixed(2));
  const base = ourPrice > 0 ? ourPrice : (competitorPrice > 0 ? competitorPrice : 1);
  const diffPercent = Number(((diffBRL / base) * 100).toFixed(1));

  return {
    diffBRL,
    diffPercent,
    isCheaper: ourPrice < competitorPrice,
    isMoreExpensive: ourPrice > competitorPrice
  };
}
