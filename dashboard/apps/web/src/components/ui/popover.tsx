'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/styles/cn';

type PopoverProps = {
  trigger: (controls: { open: boolean; toggle: () => void }) => ReactNode;
  children: (controls: { close: () => void }) => ReactNode;
  className?: string;
};

export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const placePanel = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const panelWidth = panelRef.current?.offsetWidth ?? 260;
      const panelHeight = panelRef.current?.offsetHeight ?? 300;
      const left = Math.max(
        12,
        Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 12),
      );
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow >= Math.min(panelHeight + 8, 360)
          ? rect.bottom + 6
          : Math.max(12, rect.top - panelHeight - 6);
      if (panelRef.current) {
        panelRef.current.style.left = `${left}px`;
        panelRef.current.style.top = `${top}px`;
        panelRef.current.style.visibility = 'visible';
      }
    };
    placePanel();
    const closeFromOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeFromOutside);
    document.addEventListener('keydown', closeFromKeyboard);
    window.addEventListener('resize', placePanel);
    window.addEventListener('scroll', placePanel, true);
    return () => {
      document.removeEventListener('mousedown', closeFromOutside);
      document.removeEventListener('keydown', closeFromKeyboard);
      window.removeEventListener('resize', placePanel);
      window.removeEventListener('scroll', placePanel, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger({ open, toggle: () => setOpen((current) => !current) })}
      {open
        ? createPortal(
            <div
              ref={panelRef}
              style={{ left: 0, top: 0, visibility: 'hidden' }}
              className={cn(
                'fixed z-[80] max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-neutral-200/90 bg-white p-3 shadow-xl dark:border-neutral-800 dark:bg-[#1c1c1c] dark:text-neutral-100',
                className,
              )}
            >
              {children({ close: () => setOpen(false) })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
