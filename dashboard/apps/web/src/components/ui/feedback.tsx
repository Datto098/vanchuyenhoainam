import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/styles/cn';
import { Card } from './card';

export function Alert({
  children,
  tone = 'error',
  className,
}: {
  children: ReactNode;
  tone?: 'error' | 'success' | 'warning' | 'info';
  className?: string;
}) {
  const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: AlertCircle,
    info: AlertCircle,
  };
  const toneStyles = {
    error:
      'border-rose-200 bg-rose-50/80 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300',
    success:
      'border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning:
      'border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
    info: 'border-sky-200 bg-sky-50/80 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300',
  };
  const Icon = icons[tone];

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
    >
      <Icon className="shrink-0" size={15} /> {children}
    </div>
  );
}

export function ContentState({
  title,
  description,
  error = false,
  contained = true,
  action,
}: Readonly<{
  title: string;
  description?: string;
  error?: boolean;
  contained?: boolean;
  action?: ReactNode;
}>) {
  const content = (
    <div
      className={cn(
        'grid min-h-40 place-content-center gap-1.5 p-6 text-center',
        error ? 'text-rose-700 dark:text-rose-400' : 'text-neutral-500 dark:text-neutral-400',
      )}
    >
      <strong
        className={cn(
          'text-[13px] font-semibold',
          !error && 'text-neutral-800 dark:text-neutral-200',
        )}
      >
        {title}
      </strong>
      {description ? (
        <span className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
          {description}
        </span>
      ) : null}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
  return contained ? <Card>{content}</Card> : content;
}

export function LoadingState({
  label,
  contained = true,
  compact = false,
}: Readonly<{ label: string; contained?: boolean; compact?: boolean }>) {
  const content = (
    <div
      className={cn(
        'grid place-content-center text-neutral-500 dark:text-neutral-400',
        compact ? 'min-h-16 p-3' : 'min-h-40 p-6',
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex items-center gap-2 text-xs font-medium">
        <LoaderCircle
          className="animate-spin text-neutral-600 dark:text-neutral-300"
          size={compact ? 16 : 20}
          aria-hidden="true"
        />
        <span>{label}</span>
      </div>
    </div>
  );
  return contained ? <Card>{content}</Card> : content;
}
