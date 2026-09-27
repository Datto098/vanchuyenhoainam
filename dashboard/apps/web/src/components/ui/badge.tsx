'use client';

import type { HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/styles/cn';

export type BadgeTone =
  | 'draft'
  | 'active'
  | 'archived'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple';

export type BadgeSize = 'sm' | 'md';

const tones: Record<BadgeTone, string> = {
  // Shopify Polaris / Horizon exact tones: flat fill, 0px border, high contrast text
  draft: 'bg-[#8be0f8] text-[#06596f] dark:bg-[#064b5c] dark:text-[#8be0f8]',
  active: 'bg-[#b2f781] text-[#264c0b] dark:bg-[#1d460d] dark:text-[#b2f781]',
  success: 'bg-[#b2f781] text-[#264c0b] dark:bg-[#1d460d] dark:text-[#b2f781]',
  archived: 'bg-[#e4e5e7] text-[#303030] dark:bg-[#323232] dark:text-[#e4e5e7]',
  neutral: 'bg-[#e4e5e7] text-[#303030] dark:bg-[#323232] dark:text-[#e4e5e7]',
  info: 'bg-[#cce4ff] text-[#003866] dark:bg-[#002d59] dark:text-[#cce4ff]',
  warning: 'bg-[#fed978] text-[#4a3500] dark:bg-[#4a3500] dark:text-[#fed978]',
  danger: 'bg-[#ffd2cd] text-[#6e1711] dark:bg-[#5c130d] dark:text-[#ffd2cd]',
  purple: 'bg-[#e3d1ff] text-[#3c1f7b] dark:bg-[#35156a] dark:text-[#e3d1ff]',
};

const sizes: Record<BadgeSize, string> = {
  // Shopify Polaris standard badge is 20px high (h-5) with 8px horizontal padding
  sm: 'h-5 px-2 text-[11px] leading-none',
  md: 'h-6 px-2.5 text-xs leading-none',
};

export function Badge({
  className,
  tone = 'neutral',
  size = 'sm',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; size?: BadgeSize }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center justify-center whitespace-nowrap rounded-[8px] font-semibold tracking-normal select-none',
        sizes[size],
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/**
 * Product Tag Pill (as seen in Shopify Admin Product Organization)
 */
export function TagPill({
  label,
  onRemove,
  className,
  removeAriaLabel,
}: Readonly<{
  label: string;
  onRemove?: () => void;
  className?: string;
  removeAriaLabel?: string;
}>) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-[8px] border border-neutral-300/80 bg-neutral-100/90 px-2 text-xs font-normal text-neutral-800 transition-colors hover:bg-neutral-200/70 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-750 select-none',
        className,
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-0.5 text-neutral-500 hover:bg-neutral-300/80 hover:text-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 cursor-pointer"
          aria-label={removeAriaLabel ?? t('common.actions.removeTag', { label })}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
