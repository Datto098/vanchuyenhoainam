'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/styles/cn';

export function TopProgressBar({ className }: Readonly<{ className?: string }>) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;
  const [active, setActive] = useState(false);
  const [session, setSession] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const frame = requestAnimationFrame(() => {
        setActive(true);
        setSession((prev) => prev + 1);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      const timeout = setTimeout(() => {
        setActive(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && !active) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading..."
      aria-busy={isLoading}
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] overflow-hidden bg-transparent transition-opacity duration-300',
        isLoading ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <div key={session} className="shopify-top-loader h-full w-full" />
    </div>
  );
}
