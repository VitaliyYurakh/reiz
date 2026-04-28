'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect, useState, useCallback } from 'react';
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
  Home,
  Tag,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Moon,
  Sun,
  AlertOctagon,
  Handshake,
  Target,
  Mail,
  AlertTriangle,
  Package,
  FileText,
  UserX,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Toaster } from 'sonner';
import { TopBar } from '@/components/admin/TopBar';
import { ConfirmProvider } from '@/components/admin/ConfirmProvider';
import { useAdminLocale, type AdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminAuth } from '@/context/AdminAuthContext';

// Admin pages fetch live CRM state client-side with cookies — never let
// Next.js statically pre-render this shell (audit M-8).
export const dynamic = 'force-dynamic';

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
      { href: '/admin/dashboard', labelKey: 'nav.dashboard', icon: Home, module: 'dashboard' },
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
      { href: '/admin/blacklist', labelKey: 'nav.blacklist', icon: UserX, module: 'clients' },
      { href: '/admin/cars', labelKey: 'nav.cars', icon: Car, module: 'cars' },
      { href: '/admin/partners', labelKey: 'nav.partners', icon: Handshake, module: 'cars' },
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
      { href: '/admin/accidents', labelKey: 'nav.accidents', icon: AlertTriangle, module: 'service' },
      { href: '/admin/inventory', labelKey: 'nav.inventory', icon: Package, module: 'service' },
      { href: '/admin/complaints', labelKey: 'nav.complaints', icon: AlertOctagon, module: 'rentals' },
      { href: '/admin/leads', labelKey: 'nav.leads', icon: Target, module: 'crm' },
      { href: '/admin/mail', labelKey: 'nav.mail', icon: Mail, module: 'settings' },
      { href: '/admin/reports', labelKey: 'nav.reports', icon: BarChart3, module: 'reports' },
      { href: '/admin/document-templates', labelKey: 'nav.documentTemplates', icon: FileText, module: 'settings' },
      { href: '/admin/settings', labelKey: 'nav.settings', icon: Settings, module: 'settings' },
    ],
  },
];

const LOCALE_LABELS: Record<AdminLocale, string> = {
  uk: 'UA',
  en: 'EN',
  ru: 'RU',
  pl: 'PL',
  ro: 'RO',
};

const LOCALE_ORDER: AdminLocale[] = ['uk', 'en', 'ru'];

/* Route → required permission module mapping */
function getRequiredModule(path: string): string | null {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (path === item.href || path.startsWith(`${item.href}/`)) {
        return item.module || null;
      }
    }
  }
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useAdminLocale();
  const { theme, toggleTheme, mounted } = useAdminTheme();
  const { setAuth, hasPermission, userRole, userPermissions } = useAdminAuth();
  const isDark = theme === 'dark';
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await checkAuthReq();
        if (!isAuth) throw new Error('Not authorized');

        // Fetch user data including permissions
        const meRes = await adminApi.get('/auth/me');
        const user = meRes.data.user;
        if (user) {
          setAuth(user.role || 'admin', user.permissions || {});
        }

        setIsAuthorized(true);
      } catch {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router, setAuth]);

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

  /* Route-level permission guard */
  const requiredModule = getRequiredModule(pathname);
  if (requiredModule && !hasPermission(requiredModule)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#E2E8F0' : '#2B3674', marginBottom: 8 }}>
            {t('common.accessDenied')}
          </h2>
          <p style={{ fontSize: 14, color: isDark ? '#718096' : '#A3AED0', marginBottom: 24 }}>
            {t('common.noAccess')}
          </p>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="h-btn h-btn-primary"
          >
            {t('common.back')}
          </button>
        </div>
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
    '--color-primary': '#6a7bff',
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
    '--color-ring': '#6a7bff',
    '--color-chart-blue': '#9aa5ff',
    '--color-chart-green': '#48BB78',
    '--color-chart-red': '#FC8181',
    '--color-chart-orange': '#F6AD55',
    '--color-chart-purple': '#9aa5ff',
    '--color-chart-gray': '#2D3748',
    '--color-h-navy': '#E2E8F0',
    '--color-h-gray': '#718096',
    '--color-h-bg': '#111827',
    '--color-h-purple': '#6a7bff',
    '--color-h-purple-light': '#9aa5ff',
    '--color-h-green': '#48BB78',
    '--color-h-red': '#FC8181',
    '--color-h-orange': '#F6AD55',
    '--color-h-border': '#2D3748',
    '--shadow-h': '0 2px 8px rgba(0, 0, 0, 0.4)',
    '--shadow-h-md': '0 4px 12px rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties : {};

  // Filter visible nav items by user permissions
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items:
      userRole === 'admin'
        ? group.items
        : group.items.filter((item) => {
            if (!item.module) return true;
            const level = userPermissions[item.module];
            return level === 'full' || level === 'view';
          }),
  })).filter((g) => g.items.length > 0);

  return (
    <ConfirmProvider>
      <div className="as-shell fixed inset-0 z-50 flex" data-theme={theme} style={themeVars}>
        {/* ═══════════════ Sidebar ═══════════════ */}
        <aside className={cn('as-sidebar', !collapsed && 'expanded')}>
          {/* Navigation */}
          <nav className="as-nav">
            {visibleGroups.map((group, gi) => (
              <Fragment key={gi}>
                {gi > 0 && <div className="as-nav-divider" />}
                {group.items.map((item) => {
                  const badge = item.href === '/admin/requests' ? newRequestsCount : item.badge;
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const label = t(item.labelKey);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn('as-nav-item', isActive && 'active')}
                      title={collapsed ? label : undefined}
                    >
                      <Icon strokeWidth={1.8} />
                      <span className="as-nav-label">{label}</span>
                      {badge != null && badge > 0 && (
                        <>
                          <span className="as-nav-badge">{badge > 99 ? '99+' : badge}</span>
                          {collapsed && <span className="as-nav-badge-dot" />}
                        </>
                      )}
                    </Link>
                  );
                })}
              </Fragment>
            ))}
          </nav>

          {/* Bottom utilities */}
          <div className="as-sidebar-bottom">
            <div className="as-nav-divider" />

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="as-nav-item"
              title={collapsed ? (isDark ? t('nav.lightMode') : t('nav.darkMode')) : undefined}
            >
              {isDark ? <Sun strokeWidth={1.8} /> : <Moon strokeWidth={1.8} />}
              <span className="as-nav-label">
                {isDark ? t('nav.lightMode') : t('nav.darkMode')}
              </span>
            </button>

            {/* Language */}
            <button
              type="button"
              onClick={cycleLocale}
              className="as-nav-item"
              title={collapsed ? LOCALE_LABELS[locale] : undefined}
            >
              <Globe strokeWidth={1.8} />
              <span className="as-nav-label">{LOCALE_LABELS[locale]}</span>
            </button>

            {/* Collapse / expand */}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="as-nav-item"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight strokeWidth={1.8} /> : <ChevronLeft strokeWidth={1.8} />}
              <span className="as-nav-label">{collapsed ? '' : ' '}</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="as-nav-item"
              title={collapsed ? t('nav.logout') : undefined}
            >
              <LogOut strokeWidth={1.8} />
              <span className="as-nav-label">{t('nav.logout')}</span>
            </button>
          </div>
        </aside>

        {/* ═══════════════ Main content ═══════════════ */}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          {pathname === '/admin/dashboard' && (
            <div className="px-8 pt-6 pb-0">
              <TopBar />
            </div>
          )}
          <div className="px-8 py-6">{children}</div>
        </main>
      </div>
      <Toaster richColors position="top-right" theme={isDark ? 'dark' : 'light'} closeButton />
    </ConfirmProvider>
  );
}
