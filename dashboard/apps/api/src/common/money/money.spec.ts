import {
  currencyMinorUnit,
  formatMinorUnits,
  parseDecimalToMinorUnits,
} from '@auto-tags/shared-types';

describe('money helpers', () => {
  it.each([
    ['25.49', 'USD', 2549],
    ['25.495', 'USD', 2550],
    ['25.494', 'USD', 2549],
    ['1000.5', 'JPY', 1001],
    ['1.2344', 'KWD', 1234],
    ['-1.235', 'USD', -124],
  ])('parses %s %s into minor units', (value, currency, expected) => {
    expect(parseDecimalToMinorUnits(value, currency)).toBe(expected);
  });

  it('rejects malformed and unsafe monetary values', () => {
    expect(() => parseDecimalToMinorUnits('12.3.4', 'USD')).toThrow('Invalid monetary decimal');
    expect(() => parseDecimalToMinorUnits('999999999999999999', 'USD')).toThrow('safe integer');
  });

  it('resolves currency exponents and formats minor units', () => {
    expect(currencyMinorUnit('VND')).toBe(0);
    expect(currencyMinorUnit('KWD')).toBe(3);
    expect(currencyMinorUnit('USD')).toBe(2);
    expect(formatMinorUnits(2549, 'USD', 'en-US')).toBe('$25.49');
  });
});
