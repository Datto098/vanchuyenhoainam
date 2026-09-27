import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/styles/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1a1a1a] text-white border-black/15 shadow-xs hover:bg-[#2c2c2c] active:bg-[#111111] dark:bg-white dark:text-[#1a1a1a] dark:border-white/20 dark:hover:bg-neutral-200 font-semibold',
  secondary:
    'bg-white text-neutral-800 border-neutral-300 shadow-2xs hover:bg-neutral-50 active:bg-neutral-100 dark:bg-[#222222] dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-[#2a2a2a] font-medium',
  ghost:
    'border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-neutral-800 font-medium',
  danger:
    'bg-red-600 text-white border-red-700 shadow-xs hover:bg-red-700 active:bg-red-800 font-medium',
  green:
    'bg-[#008060] text-white border-[#006e52] shadow-xs hover:bg-[#006e52] active:bg-[#005741] font-semibold',
};

const sizes: Record<ButtonSize, string> = {
  xs: 'h-6 px-2.5 text-[11px] gap-1 rounded-full',
  sm: 'h-7 px-3 text-[12px] gap-1.5 rounded-full',
  md: 'h-8 px-3.5 text-[13px] gap-1.5 rounded-full',
  lg: 'h-9 px-4 text-[13px] gap-2 rounded-full',
};

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap border text-center transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({
  className,
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const iconSizes = {
    sm: 'size-7 rounded-full p-1',
    md: 'size-8 rounded-full p-1.5',
    lg: 'size-9 rounded-full p-2',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center justify-center border border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:shrink-0 cursor-pointer',
        iconSizes[size],
        className,
      )}
      {...props}
    />
  );
}
