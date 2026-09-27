import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from '@/lib/styles/cn';

export function TableScroll({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />;
}

const densities = {
  compact: '[&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 text-[12px]',
  default: '[&_td]:px-3 [&_td]:py-2.5 [&_th]:px-3 [&_th]:py-2.5 text-[13px]',
} as const;

export function DataTable({
  className,
  density = 'default',
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { density?: keyof typeof densities }) {
  return (
    <table
      className={cn(
        'w-full border-collapse text-left select-text',
        // Headers: Shopify Polaris uses subtle font-medium, sentence case, 12px
        '[&_th]:border-b [&_th]:border-neutral-200 dark:[&_th]:border-neutral-800 [&_th]:bg-white dark:[&_th]:bg-[#1a1a1a] [&_th]:text-[12px] [&_th]:font-medium [&_th]:text-neutral-500 dark:[&_th]:text-neutral-400',
        // Cells: Subtle bottom border, compact vertical padding, crisp typography
        '[&_td]:border-b [&_td]:border-neutral-100 dark:[&_td]:border-neutral-800/80 [&_td]:text-neutral-800 dark:[&_td]:text-neutral-200 [&_td]:align-middle',
        // Row hover
        '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-neutral-50/70 dark:[&_tbody_tr:hover]:bg-neutral-800/40',
        densities[density],
        className,
      )}
      {...props}
    />
  );
}
