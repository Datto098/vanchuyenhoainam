'use client';

import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from './theme-store';

export function ThemeProvider({ children }: { children?: ReactNode }) {
  const syncSystemTheme = useThemeStore((state) => state.syncSystemTheme);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Initial sync
    syncSystemTheme();

    // Listen to OS dark mode preference changes
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      syncSystemTheme();
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [syncSystemTheme, theme]);

  return <>{children}</>;
}
