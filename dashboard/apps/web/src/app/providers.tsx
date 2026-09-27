'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { createQueryClient } from '@/lib/query/query-client';
import { AuthBootstrap } from '@/features/auth/components/auth-bootstrap';
import { ThemeProvider } from '@/lib/theme';

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthBootstrap />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
