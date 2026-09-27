'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '@/lib/i18n';
import { IconButton } from './button';
import { cn } from '@/lib/styles/cn';

export function Drawer({
  title,
  description,
  onClose,
  children,
  className,
  closeAriaLabel,
}: Readonly<{
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeAriaLabel?: string;
}>) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={onClose}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className={cn(
          'absolute top-0 right-0 h-full w-full max-w-xl border-l border-neutral-200/80 bg-white shadow-2xl overflow-y-auto dark:border-neutral-800 dark:bg-[#1a1a1a]',
          className,
        )}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-200/80 bg-white/95 px-5 py-3.5 backdrop-blur-sm dark:border-neutral-800 dark:bg-[#1a1a1a]/95">
          <div className="min-w-0">
            <h2 className="m-0 text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            aria-label={closeAriaLabel ?? t('common.actions.close')}
            size="sm"
            onClick={onClose}
          >
            <X size={16} />
          </IconButton>
        </header>
        <div className="p-5">{children}</div>
      </motion.aside>
    </motion.div>
  );
}

export { AnimatePresence };
