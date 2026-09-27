'use client';

import type { ReactNode } from 'react';
import type { UserRole } from '@auto-tags/shared-types';
import { useAuthStore } from '../stores/auth-store';

export function RoleGate({
  roles,
  children,
  fallback = null,
}: Readonly<{ roles: UserRole[]; children: ReactNode; fallback?: ReactNode }>) {
  const role = useAuthStore((state) => state.user?.role);
  return role && roles.includes(role) ? children : fallback;
}
