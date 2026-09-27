import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/styles/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-[#1a1a1a]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 px-4 py-3.5 dark:border-neutral-800',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  title,
  description,
  action,
}: Readonly<{ title: string; description?: string; action?: React.ReactNode }>) {
  return (
    <div className="flex w-full items-start justify-between gap-2">
      <div>
        <h2 className="m-0 text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
        ) : null}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
