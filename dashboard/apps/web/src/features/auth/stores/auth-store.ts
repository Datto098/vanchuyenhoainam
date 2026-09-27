import type { AuthUser } from '@auto-tags/shared-types';
import { create } from 'zustand';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  initialized: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  setInitialized: () => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  initialized: false,
  setSession: (accessToken, user) => set({ accessToken, user, initialized: true }),
  setInitialized: () => set({ initialized: true }),
  clearSession: () => set({ accessToken: null, user: null, initialized: true }),
}));
