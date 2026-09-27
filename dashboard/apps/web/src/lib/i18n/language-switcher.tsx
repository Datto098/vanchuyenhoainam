'use client';

import { useI18nStore } from './i18n-store';
import { cn } from '@/lib/styles/cn';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);

  const buttonBase =
    'rounded-md px-2 py-1 text-xs transition-all text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer';
  const buttonActive =
    'bg-white font-semibold text-neutral-900 shadow-2xs dark:bg-[#2c2c2c] dark:text-white';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-medium dark:border-neutral-800 dark:bg-[#1a1a1a]',
        className,
      )}
      role="group"
      aria-label={locale === 'vi' ? 'Chọn ngôn ngữ' : 'Select language'}
    >
      <button
        type="button"
        className={cn(buttonBase, locale === 'vi' && buttonActive)}
        onClick={() => setLocale('vi')}
        aria-pressed={locale === 'vi'}
      >
        VI
      </button>
      <button
        type="button"
        className={cn(buttonBase, locale === 'en' && buttonActive)}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
