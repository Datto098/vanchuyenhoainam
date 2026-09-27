import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ResolvedTheme, Theme } from './theme-types';

export const THEME_STORAGE_KEY = 'auto-tags-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

export function applyThemeToDocument(resolvedTheme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const isDark = resolvedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', resolvedTheme);
}

type ThemeState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  syncSystemTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme: Theme) => {
        const resolvedTheme = resolveTheme(theme);
        applyThemeToDocument(resolvedTheme);
        set({ theme, resolvedTheme });
      },
      toggleTheme: () => {
        const currentResolved = get().resolvedTheme;
        const nextTheme: Theme = currentResolved === 'dark' ? 'light' : 'dark';
        const nextResolved = nextTheme;
        applyThemeToDocument(nextResolved);
        set({ theme: nextTheme, resolvedTheme: nextResolved });
      },
      syncSystemTheme: () => {
        const currentTheme = get().theme;
        if (currentTheme === 'system') {
          const resolvedTheme = getSystemTheme();
          applyThemeToDocument(resolvedTheme);
          set({ resolvedTheme });
        }
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolvedTheme = resolveTheme(state.theme);
          state.resolvedTheme = resolvedTheme;
          applyThemeToDocument(resolvedTheme);
        }
      },
    },
  ),
);
