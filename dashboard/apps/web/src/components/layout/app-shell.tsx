'use client';

import { Bot, PanelLeft, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@auto-tags/shared-types';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { Tooltip } from '@/components/ui/tooltip';
import { LanguageSwitcher, useTranslation, type TranslationKey } from '@/lib/i18n';
import { ThemeToggle } from '@/lib/theme';
import { TopProgressBar } from './top-progress-bar';
import { useIsSidebarCollapsed, useSidebarStore } from './sidebar-store';
import { cn } from '@/lib/styles/cn';

interface NavItem {
  href: string;
  labelKey?: TranslationKey;
  customLabel?: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const logout = useLogoutMutation();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const isCollapsed = useIsSidebarCollapsed();
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const navItems: NavItem[] = [
    { href: '/ai-orders', labelKey: 'aiOrders.title', icon: Bot },
    { href: '/ai-settings', labelKey: 'aiKeys.title', icon: Settings2, adminOnly: true },
  ];

  return (
    <div className={`app-frame ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <TopProgressBar />
      {/* Dark Shopify Horizon Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-0.5" aria-label="Main menu">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === UserRole.ADMIN)
            .map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const label = item.labelKey ? t(item.labelKey) : item.customLabel;

              return (
                <Tooltip
                  key={item.href}
                  label={label ?? ''}
                  side="right"
                  disabled={!isCollapsed}
                  className={isCollapsed ? 'w-full flex justify-center' : 'w-full'}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                      isCollapsed && 'size-9 justify-center p-0 mx-auto',
                      active
                        ? 'bg-[#2f2f2f] text-white font-semibold shadow-2xs'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    {!isCollapsed && <span className="truncate flex-1">{label}</span>}
                  </Link>
                </Tooltip>
              );
            })}
        </nav>
      </aside>

      {/* Main Workspace Frame (Window with rounded-tl-2xl) */}
      <div className="workspace">
        {/* Workspace Top Action Bar */}
        <header className="topbar">
          <div className="flex items-center gap-2.5">
            <Tooltip
              label={isCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')}
              side="bottom"
            >
              <button
                type="button"
                onClick={toggleCollapsed}
                className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700"
                aria-label={
                  isCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')
                }
              >
                <PanelLeft size={15} />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
            <button
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {t('common.actions.logout')}
            </button>
            <div
              className="flex size-7 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-bold text-white shadow-xs dark:bg-neutral-700"
              title={user?.fullName ?? 'User'}
            >
              {user?.fullName
                ?.split(/\s+/)
                ?.slice(-2)
                ?.map((part: string) => part[0])
                ?.join('')
                ?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content relative">{children}</main>
      </div>
    </div>
  );
}
