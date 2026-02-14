'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import adminApi, { checkAuthReq, getNewRequestsCount } from '@/lib/api/admin';
import {
  Car,
  CalendarDays,
  Users,
  ClipboardList,
  BookOpen,
  Receipt,
  DollarSign,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  Tag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/admin/TopBar';
import { useAdminLocale, type AdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof Car;
  badge?: number;
  module?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: '',
    items: [
      { href: '/admin/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, module: 'dashboard' },
    ],
  },
  {
    label: '',
    items: [
      { href: '/admin/requests', labelKey: 'nav.requests', icon: ClipboardList, module: 'requests' },
      { href: '/admin/reservations', labelKey: 'nav.reservations', icon: BookOpen, module: 'reservations' },
      { href: '/admin/rentals', labelKey: 'nav.rentals', icon: Receipt, module: 'rentals' },
    ],
  },
  {
    label: '',
    items: [
      { href: '/admin/calendar', labelKey: 'nav.calendar', icon: CalendarDays, module: 'calendar' },
      { href: '/admin/clients', labelKey: 'nav.clients', icon: Users, module: 'clients' },
      { href: '/admin/cars', labelKey: 'nav.cars', icon: Car, module: 'cars' },
      { href: '/admin/locations', labelKey: 'nav.locations', icon: MapPin, module: 'locations' },
    ],
  },
  {
    label: '',
    items: [
      { href: '/admin/pricing', labelKey: 'nav.pricing', icon: Tag, module: 'pricing' },
      { href: '/admin/finance', labelKey: 'nav.finance', icon: DollarSign, module: 'finance' },
    ],
  },
  {
    label: '',
    items: [
      { href: '/admin/service', labelKey: 'nav.service', icon: Wrench, module: 'service' },
      { href: '/admin/reports', labelKey: 'nav.reports', icon: BarChart3, module: 'reports' },
      { href: '/admin/settings', labelKey: 'nav.settings', icon: Settings, module: 'settings' },
    ],
  },
];

const LOCALE_LABELS: Record<AdminLocale, string> = {
  uk: 'UA',
  en: 'EN',
  ru: 'RU',
  pl: 'PL',
};

const LOCALE_ORDER: AdminLocale[] = ['uk', 'en', 'ru'];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useAdminLocale();
  const { theme, toggleTheme, mounted } = useAdminTheme();
  const isDark = theme === 'dark';
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [userRole, setUserRole] = useState('admin');
  const [userPermissions, setUserPermissions] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await checkAuthReq();
        if (!isAuth) throw new Error('Not authorized');

        // Fetch user data including permissions
        const meRes = await adminApi.get('/auth/me');
        const user = meRes.data.user;
        if (user) {
          setUserRole(user.role || 'admin');
          setUserPermissions(user.permissions || {});
        }

        setIsAuthorized(true);
      } catch {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  // Poll new requests count every 30s
  const fetchBadges = useCallback(() => {
    getNewRequestsCount()
      .then(setNewRequestsCount)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    fetchBadges();
    const interval = setInterval(fetchBadges, 30_000);
    return () => clearInterval(interval);
  }, [isAuthorized, fetchBadges]);

  const handleLogout = async () => {
    try {
      await adminApi.post('/auth/logout');
    } catch { /* ignore */ }
    router.push('/admin/login');
  };

  const cycleLocale = () => {
    const idx = LOCALE_ORDER.indexOf(locale);
    const next = LOCALE_ORDER[(idx + 1) % LOCALE_ORDER.length];
    setLocale(next);
  };

  if (!isAuthorized || !mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const themeVars = isDark ? {
    '--color-background': '#111827',
    '--color-foreground': '#E2E8F0',
    '--color-card': '#1A2332',
    '--color-card-foreground': '#E2E8F0',
    '--color-popover': '#1A2332',
    '--color-popover-foreground': '#E2E8F0',
    '--color-primary': '#7C5CFF',
    '--color-primary-foreground': '#FFFFFF',
    '--color-secondary': '#1E293B',
    '--color-secondary-foreground': '#A0AEC0',
    '--color-muted': '#2D3748',
    '--color-muted-foreground': '#718096',
    '--color-accent': '#1E293B',
    '--color-accent-foreground': '#E2E8F0',
    '--color-destructive': '#FC8181',
    '--color-destructive-foreground': '#FFFFFF',
    '--color-border': '#2D3748',
    '--color-input': '#2D3748',
    '--color-ring': '#7C5CFF',
    '--color-chart-blue': '#63B3ED',
    '--color-chart-green': '#48BB78',
    '--color-chart-red': '#FC8181',
    '--color-chart-orange': '#F6AD55',
    '--color-chart-purple': '#A78BFA',
    '--color-chart-gray': '#2D3748',
    '--color-h-navy': '#E2E8F0',
    '--color-h-gray': '#718096',
    '--color-h-bg': '#111827',
    '--color-h-purple': '#7C5CFF',
    '--color-h-purple-light': '#A78BFA',
    '--color-h-green': '#48BB78',
    '--color-h-red': '#FC8181',
    '--color-h-orange': '#F6AD55',
    '--color-h-border': '#2D3748',
    '--shadow-h': '0 2px 8px rgba(0, 0, 0, 0.4)',
    '--shadow-h-md': '0 4px 12px rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties : {};

  return (
    <div className={cn('fixed inset-0 z-50 flex transition-colors duration-300', isDark ? 'bg-[#111827]' : 'bg-[#F0F4F8]')} data-theme={theme} style={themeVars}>
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'relative flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[230px]',
          isDark ? 'bg-[#1A2332]' : 'bg-white',
        )}
        style={{
          boxShadow: isDark ? '1px 0 0 0 rgba(255,255,255,0.04)' : '1px 0 0 0 rgba(0,0,0,0.04)',
        }}
      >
        {/* ── Brand ── */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-between py-4',
            collapsed ? 'px-4' : 'px-6',
          )}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span
              className={cn(
                'font-black tracking-tight',
                collapsed ? 'text-[15px]' : 'text-[18px]',
                isDark ? 'text-white' : 'text-[#1a1a1a]',
              )}
            >
              REIZ
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
              isDark ? 'text-[#718096] hover:bg-[#2D3748] hover:text-[#A0AEC0]' : 'text-[#B0BEC5] hover:bg-[#F5F5F5] hover:text-[#607D8B]',
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3">
          {NAV_GROUPS.map((group, gi) => {
            // Filter items by permissions (admin sees all)
            const visibleItems = userRole === 'admin'
              ? group.items
              : group.items.filter((item) => {
                  if (!item.module) return true;
                  const level = userPermissions[item.module];
                  return level === 'full' || level === 'view';
                });

            if (visibleItems.length === 0) return null;

            const showSeparator = gi > 0;

            return (
              <div key={gi}>
                {showSeparator && (
                  <div className={cn('my-1 mx-3 border-t', isDark ? 'border-[#2D3748]' : 'border-[#ECEFF1]')} />
                )}
                <ul className="flex flex-col gap-0.5">
                  {visibleItems.map((item) => {
                    const badge = item.href === '/admin/requests' ? newRequestsCount : item.badge;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    const label = t(item.labelKey);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 text-[13px] transition-all duration-150',
                            isActive
                              ? isDark
                                ? 'bg-[#1E293B] font-semibold'
                                : 'bg-[#F7F9FB] font-semibold'
                              : isDark
                                ? 'font-medium hover:bg-[#1E293B]'
                                : 'font-medium hover:bg-[#FAFBFC]',
                            collapsed && 'justify-center px-0',
                          )}
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            color: isActive
                              ? isDark ? '#E2E8F0' : '#263238'
                              : isDark ? '#718096' : '#607D8B',
                          }}
                          title={collapsed ? label : undefined}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.color = isDark ? '#A0AEC0' : '#37474F';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.color = isDark ? '#718096' : '#607D8B';
                          }}
                        >
                          {/* Icon in teal circle */}
                          <div className="relative shrink-0">
                            <div
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150',
                                isActive
                                  ? 'bg-gradient-to-br from-[#26C6DA] to-[#00ACC1] shadow-sm'
                                  : isDark ? 'bg-[#2D3748]' : 'bg-[#ECEFF1]',
                              )}
                            >
                              <item.icon
                                className="h-3.5 w-3.5"
                                style={{ color: isActive ? '#FFFFFF' : isDark ? '#718096' : '#78909C' }}
                                strokeWidth={1.8}
                              />
                            </div>
                            {collapsed && badge != null && badge > 0 && (
                              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5252] px-1 text-[9px] font-bold text-white shadow-sm">
                                {badge > 9 ? '9+' : badge}
                              </span>
                            )}
                          </div>

                          {!collapsed && (
                            <>
                              <span className="flex-1">{label}</span>
                              {/* Badge */}
                              {badge != null && badge > 0 && (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5252] px-1.5 text-[10px] font-bold text-white">
                                  {badge > 99 ? '99+' : badge}
                                </span>
                              )}
                              {/* Active chevron */}
                              {isActive && (
                                <ChevronRight className="h-4 w-4" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }} />
                              )}
                            </>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* ── User card + Language + Logout ── */}
        <div className="shrink-0 px-3 pb-2">
          <div className={cn('mx-3 mb-2 border-t', isDark ? 'border-[#2D3748]' : 'border-[#ECEFF1]')} />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-all duration-150',
              isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-[#FAFBFC]',
              collapsed && 'justify-center px-0',
            )}
            style={{ paddingTop: 5, paddingBottom: 5, color: isDark ? '#718096' : '#607D8B' }}
            title={collapsed ? (isDark ? 'Light' : 'Dark') : undefined}
            onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? '#A0AEC0' : '#37474F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? '#718096' : '#607D8B'; }}
          >
            <div className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
              isDark ? 'bg-[#2D3748]' : 'bg-[#ECEFF1]',
            )}>
              {isDark ? (
                <Sun className="h-3.5 w-3.5" style={{ color: '#F6AD55' }} strokeWidth={1.8} />
              ) : (
                <Moon className="h-3.5 w-3.5" style={{ color: '#78909C' }} strokeWidth={1.8} />
              )}
            </div>
            {!collapsed && <span className="flex-1 text-left">{isDark ? t('nav.lightMode') : t('nav.darkMode')}</span>}
          </button>

          {/* Language switcher */}
          <button
            type="button"
            onClick={cycleLocale}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-all duration-150',
              isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-[#FAFBFC]',
              collapsed && 'justify-center px-0',
            )}
            style={{ paddingTop: 5, paddingBottom: 5, color: isDark ? '#718096' : '#607D8B' }}
            title={collapsed ? LOCALE_LABELS[locale] : undefined}
            onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? '#A0AEC0' : '#37474F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? '#718096' : '#607D8B'; }}
          >
            <div className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
              isDark ? 'bg-[#2D3748]' : 'bg-[#ECEFF1]',
            )}>
              <Globe className="h-3.5 w-3.5" style={{ color: isDark ? '#718096' : '#78909C' }} strokeWidth={1.8} />
            </div>
            {!collapsed && <span className="flex-1 text-left">{LOCALE_LABELS[locale]}</span>}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-all duration-150',
              isDark ? 'hover:bg-[#3B1F1F]' : 'hover:bg-[#FFF3F3]',
              collapsed && 'justify-center px-0',
            )}
            style={{ color: isDark ? '#718096' : '#90A4AE' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? '#FC8181' : '#E53935'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? '#718096' : '#90A4AE'; }}
          >
            <div className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
              isDark ? 'bg-[#2D3748]' : 'bg-[#ECEFF1]',
            )}>
              <LogOut className="h-3.5 w-3.5" style={{ color: isDark ? '#718096' : '#90A4AE' }} />
            </div>
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>

        {/* ── Decorative gradient wave at bottom ── */}
        <div
          className={cn('pointer-events-none absolute bottom-0 left-0 right-0 h-16', isDark ? 'opacity-20' : 'opacity-30')}
          style={{
            background: isDark
              ? 'linear-gradient(180deg, transparent 0%, rgba(38,198,218,0.06) 40%, rgba(38,198,218,0.12) 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(38,198,218,0.08) 40%, rgba(38,198,218,0.15) 100%)',
            borderRadius: '0 0 0 0',
          }}
        />

      </aside>

      {/* ── Main content ── */}
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        {/* ── Top Bar Row (only on dashboard) ── */}
        {pathname === '/admin/dashboard' && (
          <div className="sticky top-0 z-10 px-8 pt-6 pb-0">
            <TopBar title={t('nav.dashboard')} />
          </div>
        )}
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
