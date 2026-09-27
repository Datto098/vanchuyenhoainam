import { vi } from './vi';
import { en } from './en';
import type { SupportedLocale } from '../i18n-types';
import type { TranslationSchema } from './vi';

export const dictionaries: Record<SupportedLocale, TranslationSchema> = {
  vi,
  en,
};

export { vi, en };
export type { TranslationSchema };
