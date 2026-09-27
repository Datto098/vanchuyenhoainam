import { useCallback } from 'react';
import { dictionaries, type TranslationSchema } from './dictionaries';
import { useI18nStore } from './i18n-store';
import type { TranslationParams } from './i18n-types';
import { formatMoney as rawFormatMoney } from '@/lib/money/format-money';

// Helper to get nested value by dot-notation string
function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

// Helper to interpolate params like {name} into "Hello {name}"
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

// Deep dot-path type extraction for autocomplete and type safety
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

export type TranslationKey = Join<PathsToStringProps<TranslationSchema>, '.'>;

export function useTranslation() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);
  const toggleLocale = useI18nStore((state) => state.toggleLocale);

  const t = useCallback(
    (key: TranslationKey | string, params?: TranslationParams): string => {
      const activeDict = dictionaries[locale] ?? dictionaries.vi;
      const fallbackDict = dictionaries.vi;

      const template = getNestedValue(activeDict, key) ?? getNestedValue(fallbackDict, key) ?? key;

      return interpolate(template, params);
    },
    [locale],
  );

  const formatMoney = useCallback(
    (valueMinor: number, currency: string): string => {
      const currencyLocale = locale === 'vi' ? 'vi-VN' : 'en-US';
      return rawFormatMoney(valueMinor, currency, currencyLocale);
    },
    [locale],
  );

  const formatDateTime = useCallback(
    (
      date: Date | string | number,
      options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' },
    ): string => {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      const dateLocale = locale === 'vi' ? 'vi-VN' : 'en-US';
      return new Intl.DateTimeFormat(dateLocale, options).format(d);
    },
    [locale],
  );

  const formatDate = useCallback(
    (
      date: Date | string | number,
      options: Intl.DateTimeFormatOptions = { dateStyle: 'short' },
    ): string => {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      const dateLocale = locale === 'vi' ? 'vi-VN' : 'en-US';
      return new Intl.DateTimeFormat(dateLocale, options).format(d);
    },
    [locale],
  );

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    dict: dictionaries[locale] ?? dictionaries.vi,
    formatMoney,
    formatDateTime,
    formatDate,
  };
}
