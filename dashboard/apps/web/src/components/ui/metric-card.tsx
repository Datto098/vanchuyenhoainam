import type { ElementType, ReactNode } from 'react';
import { Card } from './card';
import { cn } from '@/lib/styles/cn';

export type MetricTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';

const iconTones: Record<MetricTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
  className,
}: Readonly<{
  label: string;
  value: ReactNode;
  detail?: string;
  icon?: ElementType;
  tone?: MetricTone;
  className?: string;
}>) {
  return (
    <Card className={cn('p-3.5', className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
        {Icon ? (
          <span
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-lg transition-colors',
              iconTones[tone],
            )}
          >
            <Icon size={14} />
          </span>
        ) : null}
      </div>
      <strong className="mt-1 block text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {value}
      </strong>
      {detail ? (
        <small className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {detail}
        </small>
      ) : null}
    </Card>
  );
}

export { MetricCard as StatCard };
