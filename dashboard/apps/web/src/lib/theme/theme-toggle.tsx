'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/styles/cn';
import { Tooltip } from '@/components/ui/tooltip';
import { useThemeStore } from './theme-store';

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const containerClasses = cn(
    'inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-medium dark:border-neutral-800 dark:bg-[#1a1a1a]',
    className,
  );

  const buttonBase =
    'flex size-7 items-center justify-center rounded-md transition-all text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer';
  const buttonActive =
    'bg-white text-neutral-900 shadow-2xs dark:bg-[#2c2c2c] dark:text-white font-medium';

  if (!mounted) {
    return (
      <div className={containerClasses}>
        <span className="flex size-7 items-center justify-center" />
        <span className="flex size-7 items-center justify-center" />
        <span className="flex size-7 items-center justify-center" />
      </div>
    );
  }

  return (
    <div className={containerClasses} role="group" aria-label={t('common.theme.toggle')}>
      <Tooltip label={t('common.theme.light')} side="bottom">
        <button
          type="button"
          className={cn(buttonBase, theme === 'light' && buttonActive)}
          onClick={() => setTheme('light')}
          aria-label={t('common.theme.light')}
          aria-pressed={theme === 'light'}
        >
          <Sun size={14} />
        </button>
      </Tooltip>
      <Tooltip label={t('common.theme.dark')} side="bottom">
        <button
          type="button"
          className={cn(buttonBase, theme === 'dark' && buttonActive)}
          onClick={() => setTheme('dark')}
          aria-label={t('common.theme.dark')}
          aria-pressed={theme === 'dark'}
        >
          <Moon size={14} />
        </button>
      </Tooltip>
      <Tooltip label={t('common.theme.system')} side="bottom">
        <button
          type="button"
          className={cn(buttonBase, theme === 'system' && buttonActive)}
          onClick={() => setTheme('system')}
          aria-label={t('common.theme.system')}
          aria-pressed={theme === 'system'}
        >
          <Monitor size={14} />
        </button>
      </Tooltip>
    </div>
  );
}
