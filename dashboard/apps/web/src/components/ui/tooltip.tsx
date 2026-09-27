import type { ReactNode } from 'react';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export function Tooltip({
  label,
  children,
  side = 'top',
  disabled = false,
  className,
}: Readonly<{
  label: string;
  children: ReactNode;
  side?: TooltipSide;
  disabled?: boolean;
  className?: string;
}>) {
  if (disabled || !label) {
    return <>{children}</>;
  }

  const sideClasses: Record<TooltipSide, string> = {
    top: 'bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    right: 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2',
    bottom: 'top-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    left: 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
  };

  return (
    <span className={`group/tooltip relative inline-flex ${className ?? ''}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${sideClasses[side] ?? sideClasses.top} z-50 hidden whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[11px] font-medium text-white shadow-lg border border-white/10 dark:bg-[#282828] dark:text-white dark:border-neutral-700/80 group-hover/tooltip:block select-none animate-in fade-in duration-100`}
      >
        {label}
      </span>
    </span>
  );
}
