import { formatMinorUnits } from '@auto-tags/shared-types';

export function formatMoney(valueMinor: number, currency: string, locale = 'vi-VN'): string {
  return formatMinorUnits(valueMinor, currency, locale);
}
