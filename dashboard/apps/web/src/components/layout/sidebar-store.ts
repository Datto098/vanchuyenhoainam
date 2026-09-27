import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SidebarState = {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'auto-tags-sidebar-collapsed',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useIsSidebarCollapsed(): boolean {
  return useSyncExternalStore(
    (callback) => useSidebarStore.subscribe(callback),
    () => useSidebarStore.getState().isCollapsed,
    () => false,
  );
}
