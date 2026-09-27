import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SupportedLocale } from './i18n-types';

type I18nState = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'vi',
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set((state) => ({ locale: state.locale === 'vi' ? 'en' : 'vi' })),
    }),
    {
      name: 'auto-tags-locale',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
