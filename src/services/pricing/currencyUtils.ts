// ==============================================================================
// 💵 BRAZILIAN REAL (BRL) CURRENCY PARSER & UTILITIES — ADSHIELD 2026.4
// Zero-error parsing for Brazilian e-commerce currency formats:
// "R$ 1.250,90", "1.499,00", "R$ 159,90", "159,90", "159.90", "0,00", etc.
// Prevents the classic thousands-separator bug where 1.250,90 becomes 1.25.
// ==============================================================================

/**
 * Parses any raw string or number into a valid float number in BRL.
 * Safely handles thousand separators (. in Brazil), decimal commas (,),
 * standard US dots, currency symbols, and non-breaking spaces.
 */
export function parseBRLPrice(rawValue: string | number | null | undefined): number {
  if (rawValue === null || rawValue === undefined) return 0;
  if (typeof rawValue === 'number') {
    return isNaN(rawValue) ? 0 : rawValue;
  }

  // Sanitize input
  let cleaned = String(rawValue)
    .replace(/<[^>]*>/g, '') // remove HTML tags if any
    .replace(/\u00a0/g, ' ') // non-breaking space
    .trim();

  if (!cleaned) return 0;

  // Case 1: Standard clean decimal format e.g. "159.90" or "0"
  if (/^\d+(\.\d+)?$/.test(cleaned)) {
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  // Remove currency prefix "R$", "BRL", and any non-numeric chars except dot, comma and minus
  let sanitized = cleaned.replace(/[^\d.,-]/g, '');
  if (!sanitized) return 0;

  // Case 2: Brazilian standard with both thousands and decimals e.g. "1.250,90" or "10.500,00"
  if (sanitized.includes('.') && sanitized.includes(',')) {
    // In Brazil, dots are thousand separators and comma is decimal
    const normalized = sanitized.replace(/\./g, '').replace(',', '.');
    const val = parseFloat(normalized);
    return isNaN(val) ? 0 : val;
  }

  // Case 3: Only comma e.g. "159,90" or "1250,90" or "0,00"
  if (sanitized.includes(',')) {
    const normalized = sanitized.replace(',', '.');
    const val = parseFloat(normalized);
    return isNaN(val) ? 0 : val;
  }

  // Case 4: Only dots e.g. "1.250" (one thousand two hundred and fifty) vs "159.90" (decimal)
  if (sanitized.includes('.')) {
    const parts = sanitized.split('.');
    // If it has multiple dots e.g. "1.250.000", they are all thousand separators
    if (parts.length > 2) {
      const val = parseFloat(sanitized.replace(/\./g, ''));
      return isNaN(val) ? 0 : val;
    }
    // If single dot and 3 digits after it, e.g. "1.250" or "2.000", in Brazilian context it's thousands
    if (parts.length === 2 && parts[1].length === 3 && parseInt(parts[0], 10) > 0) {
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
 * Formats a number to Brazilian Real string (e.g. "R$ 1.250,90")
 */
export function formatBRL(value: number): string {
  const safeVal = isNaN(value) ? 0 : value;
  return `R$ ${safeVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
