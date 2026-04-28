'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Search, ClipboardList, Wrench, AlertTriangle, Users, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/admin/ui/dropdown-menu';
import {
  getAdminNotifications,
  globalSearch,
  type AdminNotification,
  type SearchResult,
} from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminAuth } from '@/context/AdminAuthContext';

const NOTIF_MODULE_MAP: Record<string, string> = {
  request: 'requests',
  service: 'service',
  overdue: 'rentals',
};

const SEARCH_MODULE_MAP: Record<string, string> = {
  client: 'clients',
  car: 'cars',
  request: 'requests',
  rental: 'rentals',
};

type Rates = {
  USD_UAH: number;
  EUR_UAH: number;
  USD_EUR: number;
};

const getNotifTypeConfig = (dark: boolean): Record<
  AdminNotification['type'],
  { icon: typeof ClipboardList; color: string; bg: string; href: string }
> => ({
  request: {
    icon: ClipboardList,
    color: dark ? '#9aa5ff' : '#6a7bff',
    bg: dark ? 'rgba(106, 123, 255, 0.15)' : '#EDE7F6',
    href: '/admin/requests',
  },
  service: {
    icon: Wrench,
    color: dark ? '#FFB74D' : '#FF9100',
    bg: dark ? 'rgba(255,145,0,0.15)' : '#FFF3E0',
    href: '/admin/service',
  },
  overdue: {
    icon: AlertTriangle,
    color: dark ? '#EF9A9A' : '#E53935',
    bg: dark ? 'rgba(229,57,53,0.15)' : '#FFEBEE',
    href: '/admin/rentals',
  },
});

const getSearchTypeConfig = (dark: boolean): Record<
  SearchResult['type'],
  { icon: typeof Users; color: string; bg: string; href: (id: number) => string }
> => ({
  client: {
    icon: Users,
    color: dark ? '#9aa5ff' : '#6a7bff',
    bg: dark ? 'rgba(106, 123, 255, 0.15)' : '#EDE7F6',
    href: (id) => `/admin/clients/${id}`,
  },
  car: {
    icon: Car,
    color: dark ? '#9aa5ff' : '#6a7bff',
    bg: dark ? 'rgba(106, 123, 255, 0.15)' : '#E3F2FD',
    href: (id) => `/admin/cars/${id}`,
  },
  request: {
    icon: ClipboardList,
    color: dark ? '#FFB74D' : '#FF9100',
    bg: dark ? 'rgba(255,145,0,0.15)' : '#FFF3E0',
    href: () => '/admin/requests',
  },
  rental: {
    icon: AlertTriangle,
    color: dark ? '#81C784' : '#4CAF50',
    bg: dark ? 'rgba(76,175,80,0.15)' : '#E8F5E9',
    href: () => '/admin/rentals',
  },
});

function useTimeAgo() {
  const { t } = useAdminLocale();
  return (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('topbar.justNow');
    if (mins < 60) return t('topbar.minutesAgo', { n: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('topbar.hoursAgo', { n: hours });
    const days = Math.floor(hours / 24);
    return t('topbar.daysAgo', { n: days });
  };
}

export function TopBar() {
  const router = useRouter();
  const { t, locale } = useAdminLocale();
  const { theme } = useAdminTheme();
  const { hasPermission } = useAdminAuth();
  const isDark = theme === 'dark';
  const NOTIF_CONFIG = getNotifTypeConfig(isDark);
  const SEARCH_CONFIG = getSearchTypeConfig(isDark);
  const timeAgo = useTimeAgo();

  const [rates, setRates] = useState<Rates | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const filteredNotifications = notifications.filter((n) => hasPermission(NOTIF_MODULE_MAP[n.type]));
  const filteredNotifCount = filteredNotifications.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setSearchLoading(true);
      globalSearch(value.trim())
        .then((results) => {
          setSearchResults(results);
          setSearchOpen(true);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.rates) setRates(data.rates);
      })
      .catch(() => {});
  }, []);

  const fetchNotifications = useCallback(() => {
    getAdminNotifications()
      .then((data) => setNotifications(data.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const dateLabel = new Date().toLocaleDateString(
    locale === 'uk' ? 'uk-UA'
      : locale === 'ru' ? 'ru-RU'
      : locale === 'pl' ? 'pl-PL'
      : locale === 'ro' ? 'ro-RO'
      : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <div className="as-topbar">
      {/* ── Search pill ── */}
      <div ref={searchRef} className="as-pill as-search">
        <Search />
        <input
          type="text"
          placeholder={t('topbar.search')}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setSearchOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
        <kbd>⌘K</kbd>

        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '340px',
              background: isDark ? '#21242C' : '#FFFFFF',
              borderRadius: '18px',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
              boxShadow: isDark ? '0 20px 50px -12px rgba(0,0,0,0.6)' : '0 20px 50px -12px rgba(16, 24, 40, 0.18)',
              overflow: 'hidden',
              zIndex: 100,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px 0' }}>
              {searchLoading ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '13px' }}>
                  {t('topbar.searching')}
                </div>
              ) : searchResults.filter((r) => hasPermission(SEARCH_MODULE_MAP[r.type])).length === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '13px' }}>
                  {t('topbar.noResults')}
                </div>
              ) : (
                searchResults
                  .filter((r) => hasPermission(SEARCH_MODULE_MAP[r.type]))
                  .map((r) => {
                    const cfg = SEARCH_CONFIG[r.type];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={`${r.type}-${r.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                          router.push(cfg.href(r.id));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSearchOpen(false);
                            setSearchQuery('');
                            setSearchResults([]);
                            router.push(cfg.href(r.id));
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          margin: '0 6px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = isDark ? '#1B1E25' : '#EDEEF2';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: cfg.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} color={cfg.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: isDark ? '#F4F5F7' : '#1A1D23',
                              lineHeight: '18px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {r.title}
                          </div>
                          {r.subtitle && (
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                color: isDark ? '#9CA3AF' : '#6B7280',
                                lineHeight: '16px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {r.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="as-spacer" />

      {/* ── Currency rates pill ── */}
      <div className="as-pill as-rates">
        {rates ? (
          <>
            <span>
              <span className="as-rate-label">$</span>
              {rates.USD_UAH.toFixed(2)}
            </span>
            <div className="as-rates-divider" />
            <span>
              <span className="as-rate-label">€</span>
              {rates.EUR_UAH.toFixed(2)}
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--as-text-dim)' }}>—</span>
        )}
      </div>

      {/* ── Date pill ── */}
      <div className="as-pill as-date">{dateLabel}</div>

      {/* ── Notifications ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="as-icon-btn" title={t('topbar.notifications')}>
            <Bell />
            {filteredNotifCount > 0 && <span className="as-icon-dot" />}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={12}
          style={{
            width: '340px',
            borderRadius: '18px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
            boxShadow: isDark
              ? '0 20px 50px -12px rgba(0, 0, 0, 0.6)'
              : '0 20px 50px -12px rgba(16, 24, 40, 0.18)',
            padding: 0,
            overflow: 'hidden',
            fontFamily: "'DM Sans', sans-serif",
            background: isDark ? '#21242C' : '#FFFFFF',
            zIndex: 100,
          }}
        >
          <DropdownMenuLabel
            style={{
              padding: '16px 18px 12px',
              fontSize: '15px',
              fontWeight: 700,
              color: isDark ? '#F4F5F7' : '#1A1D23',
              letterSpacing: '-0.015em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {t('topbar.notifications')}
            {filteredNotifCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '20px',
                  minWidth: '20px',
                  borderRadius: '10px',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '0 6px',
                }}
              >
                {filteredNotifCount}
              </span>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator
            style={{
              margin: 0,
              height: '1px',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#EDEEF2',
            }}
          />

          <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px 0' }}>
            {filteredNotifications.length === 0 ? (
              <div
                style={{
                  padding: '28px 16px',
                  textAlign: 'center',
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  fontSize: '13px',
                }}
              >
                {t('topbar.noNotifications')}
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const cfg = NOTIF_CONFIG[n.type];
                const Icon = cfg.icon;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    style={{
                      padding: '12px 18px',
                      margin: '0 6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      borderRadius: '10px',
                      outline: 'none',
                    }}
                    onSelect={() => router.push(cfg.href)}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: cfg.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: isDark ? '#F4F5F7' : '#1A1D23',
                          lineHeight: '18px',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {t(n.title)}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: isDark ? '#9CA3AF' : '#6B7280',
                          lineHeight: '16px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '2px',
                        }}
                      >
                        {n.message}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: isDark ? '#6B7280' : '#9CA3AF',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {timeAgo(n.createdAt)}
                    </span>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Avatar ── */}
      <div className="as-avatar">ЕВ</div>
    </div>
  );
}
