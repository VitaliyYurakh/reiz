'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Moon, Sun, User, Users, Car, ClipboardList, Receipt, Wrench, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/admin/ui/dropdown-menu';
import { getAdminNotifications, globalSearch, type AdminNotification, type SearchResult } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

type Rates = {
  USD_UAH: number;
  EUR_UAH: number;
  USD_EUR: number;
};

interface TopBarProps {
  title?: string;
}

const getTypeConfig = (dark: boolean): Record<
  AdminNotification['type'],
  { icon: typeof ClipboardList; color: string; bg: string; href: string }
> => ({
  request: { icon: ClipboardList, color: dark ? '#B39DDB' : '#7C4DFF', bg: dark ? 'rgba(124,77,255,0.15)' : '#EDE7F6', href: '/admin/requests' },
  service: { icon: Wrench, color: dark ? '#FFB74D' : '#FF9100', bg: dark ? 'rgba(255,145,0,0.15)' : '#FFF3E0', href: '/admin/service' },
  overdue: { icon: AlertTriangle, color: dark ? '#EF9A9A' : '#E53935', bg: dark ? 'rgba(229,57,53,0.15)' : '#FFEBEE', href: '/admin/rentals' },
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

const getSearchTypeConfig = (dark: boolean): Record<
  SearchResult['type'],
  { icon: typeof Users; color: string; bg: string; href: (id: number) => string }
> => ({
  client: { icon: Users, color: dark ? '#B39DDB' : '#7C4DFF', bg: dark ? 'rgba(124,77,255,0.15)' : '#EDE7F6', href: (id) => `/admin/clients/${id}` },
  car: { icon: Car, color: dark ? '#64B5F6' : '#2196F3', bg: dark ? 'rgba(33,150,243,0.15)' : '#E3F2FD', href: (id) => `/admin/cars/${id}` },
  request: { icon: ClipboardList, color: dark ? '#FFB74D' : '#FF9100', bg: dark ? 'rgba(255,145,0,0.15)' : '#FFF3E0', href: () => '/admin/requests' },
  rental: { icon: Receipt, color: dark ? '#81C784' : '#4CAF50', bg: dark ? 'rgba(76,175,80,0.15)' : '#E8F5E9', href: () => '/admin/rentals' },
});

export function TopBar({ title = 'Dashboard' }: TopBarProps) {
  const router = useRouter();
  const { t, locale } = useAdminLocale();
  const { theme, toggleTheme, H: TH } = useAdminTheme();
  const isDark = theme === 'dark';
  const TYPE_CONFIG = getTypeConfig(isDark);
  const SEARCH_TYPE_CONFIG = getSearchTypeConfig(isDark);
  const timeAgo = useTimeAgo();
  const [rates, setRates] = useState<Rates | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
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

  // Close on click outside
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
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  const fetchNotifications = useCallback(() => {
    getAdminNotifications()
      .then((data) => {
        setNotifications(data.items);
        setNotifCount(data.count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        height: '61px',
        width: '100%',
        background: TH.white,
        boxShadow: TH.shadow,
        borderRadius: '30px',
        padding: '0 10px 0 24px',
        fontFamily: TH.font,
      }}
    >
      {/* ── Page Title ── */}
      <span
        style={{
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: '24px',
          letterSpacing: '-0.01em',
          color: TH.navy,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Search ── */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '41px',
            width: '223px',
            background: TH.bg,
            borderRadius: '49px',
            paddingLeft: '17px',
            paddingRight: '12px',
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            style={{ flexShrink: 0, marginRight: '11px' }}
          >
            <circle
              cx="4.5"
              cy="4.5"
              r="3.8"
              stroke={TH.navy}
              strokeWidth="1.4"
            />
            <line
              x1="7.35"
              y1="7.35"
              x2="10"
              y2="10"
              stroke={TH.navy}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder={t('topbar.search')}
            className="topbar-search-input"
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
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontFamily: TH.font,
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '-0.02em',
              color: TH.navy,
            }}
          />
          <style>{`
            .topbar-search-input::placeholder { color: ${isDark ? '#718096' : '#8F9BBA'} !important; }
          `}</style>
        </div>

        {/* ── Search Results Dropdown ── */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '340px',
              background: TH.white,
              borderRadius: '16px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
              overflow: 'hidden',
              zIndex: 50,
              fontFamily: TH.font,
            }}
          >
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px 0' }}>
              {searchLoading ? (
                <div
                  style={{
                    padding: '20px 16px',
                    textAlign: 'center',
                    color: TH.gray,
                    fontSize: '13px',
                  }}
                >
                  {t('topbar.searching')}
                </div>
              ) : searchResults.length === 0 ? (
                <div
                  style={{
                    padding: '20px 16px',
                    textAlign: 'center',
                    color: TH.gray,
                    fontSize: '13px',
                  }}
                >
                  {t('topbar.noResults')}
                </div>
              ) : (
                searchResults.map((r) => {
                  const cfg = SEARCH_TYPE_CONFIG[r.type];
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
                        padding: '10px 16px',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = TH.bg;
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
                            color: TH.navy,
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
                              color: TH.gray,
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

      {/* ── Currency Rates ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '41px',
          background: TH.bg,
          borderRadius: '49px',
          padding: '0 12px 0 6px',
          gap: '6px',
        }}
      >
        <div
          style={{
            width: '29px',
            height: '29px',
            borderRadius: '50%',
            background: isDark ? TH.grayLight : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path
              d="M6 0.5V1.5M6 12.5V13.5M2.5 4.5C2.5 3.11929 3.61929 2 5 2H7C8.38071 2 9.5 3.11929 9.5 4.5C9.5 5.88071 8.38071 7 7 7H5C3.61929 7 2.5 8.11929 2.5 9.5C2.5 10.8807 3.61929 12 5 12H7C8.38071 12 9.5 10.8807 9.5 9.5"
              stroke={TH.navy}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {rates ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: TH.font,
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                letterSpacing: '0',
                color: TH.navy,
                whiteSpace: 'nowrap',
              }}
            >
              $ {rates.USD_UAH.toFixed(2)}
            </span>
            <div
              style={{
                width: '1px',
                height: '14px',
                background: TH.grayLight,
              }}
            />
            <span
              style={{
                fontFamily: TH.font,
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                letterSpacing: '0',
                color: TH.navy,
                whiteSpace: 'nowrap',
              }}
            >
              € {rates.EUR_UAH.toFixed(2)}
            </span>
          </div>
        ) : (
          <div
            style={{
              width: '80px',
              height: '14px',
              background: TH.grayLight,
              borderRadius: '7px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* ── Date ── */}
      <span
        style={{
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '-0.02em',
          color: TH.gray,
          whiteSpace: 'nowrap',
        }}
      >
        {new Date().toLocaleDateString(
          locale === 'uk' ? 'uk-UA' : locale === 'ru' ? 'ru-RU' : 'en-US',
          { day: 'numeric', month: 'long', year: 'numeric' },
        )}
      </span>

      {/* ── Theme toggle ── */}
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? t('topbar.lightTheme') : t('topbar.darkTheme')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: isDark ? '#F6AD55' : TH.gray,
          transition: 'color 0.2s',
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* ── Notifications Dropdown ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={t('topbar.notifications')}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: TH.gray,
            }}
          >
            <Bell size={20} />
            {notifCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#FF5252',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={12}
          style={{
            width: '340px',
            borderRadius: '16px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
            padding: 0,
            overflow: 'hidden',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <DropdownMenuLabel
            style={{
              padding: '16px 16px 12px',
              fontSize: '16px',
              fontWeight: 700,
              color: TH.navy,
            }}
          >
            {t('topbar.notifications')}
            {notifCount > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '20px',
                  minWidth: '20px',
                  borderRadius: '10px',
                  background: '#FF5252',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '0 6px',
                }}
              >
                {notifCount}
              </span>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator style={{ margin: 0, background: isDark ? 'rgba(255,255,255,0.08)' : '#F4F7FE' }} />

          <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '4px 0' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: TH.gray,
                  fontSize: '13px',
                }}
              >
                {t('topbar.noNotifications')}
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type];
                const Icon = cfg.icon;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      borderRadius: 0,
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
                          fontSize: '13px',
                          fontWeight: 600,
                          color: TH.navy,
                          lineHeight: '18px',
                        }}
                      >
                        {n.title}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: TH.gray,
                          lineHeight: '16px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {n.message}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: TH.gray,
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

      {/* ── User Avatar ── */}
      <div
        style={{
          width: '41px',
          height: '41px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <User size={20} color="#FFFFFF" strokeWidth={2} />
      </div>
    </div>
  );
}
