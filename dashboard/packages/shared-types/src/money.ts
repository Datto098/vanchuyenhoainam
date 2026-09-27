const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'ISK',
  'JPY',
  'KMF',
  'KRW',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
]);
const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND']);

export function currencyMinorUnit(currency: string): number {
  const normalized = currency.trim().toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(normalized)) return 3;
  return 2;
}

export function parseDecimalToMinorUnits(value: string, currency: string): number {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) throw new Error(`Invalid monetary decimal: ${value}`);

  const exponent = currencyMinorUnit(currency);
  const fraction = match[3] ?? '';
  const keptFraction = fraction.slice(0, exponent).padEnd(exponent, '0');
  let absoluteMinor = BigInt(match[2] ?? '0') * 10n ** BigInt(exponent);
  absoluteMinor += BigInt(keptFraction || '0');

  if (fraction.length > exponent && Number(fraction[exponent]) >= 5) absoluteMinor += 1n;
  const minor = match[1] === '-' ? -absoluteMinor : absoluteMinor;
  const result = Number(minor);
  if (!Number.isSafeInteger(result)) throw new Error('Monetary value exceeds safe integer range');
  return result;
}

export function formatMinorUnits(value: number, currency: string, locale = 'en-US'): string {
  if (!Number.isSafeInteger(value)) throw new Error('Minor-unit value must be a safe integer');
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value / 10 ** currencyMinorUnit(currency),
  );
}
