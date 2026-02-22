'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Plus,
  Users,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminTheme, type ThemeTokens } from '@/context/AdminThemeContext';
import { fmtDate } from '@/app/admin/lib/format';

function getSourceStyles(H: ThemeTokens): Record<string, { bg: string; color: string }> {
  return {
    website: { bg: H.blueBg, color: H.blue },
    walk_in: { bg: H.greenBg, color: H.green },
    referral: { bg: H.orangeBg, color: H.orange },
    phone: { bg: `${H.purple}12`, color: H.purple },
  };
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  rating: number | null;
  source: string | null;
  createdAt: string;
}

function getInitials(firstName: string, lastName: string) {
  return `${(firstName || '?')[0]}${(lastName || '?')[0]}`.toUpperCase();
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)',
  'linear-gradient(135deg, #01B574 0%, #0BB783 100%)',
  'linear-gradient(135deg, #3965FF 0%, #6B8AFF 100%)',
  'linear-gradient(135deg, #FFB547 0%, #FF9A23 100%)',
  'linear-gradient(135deg, #EE5D50 0%, #FF8A80 100%)',
];

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [items, setItems] = useState<Client[]>([]);

  const SOURCE_LABEL: Record<string, string> = {
    website: t('clients.sourceWebsite'),
    walk_in: t('clients.sourceWalkIn'),
    referral: t('clients.sourceReferral'),
    phone: t('clients.sourcePhone'),
  };
  const SOURCE_STYLES = getSourceStyles(H);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set('search', search);
      const res = await adminApiClient.get(`/client?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ fontFamily: H.font }}>
      {/* ══════════════════════════════════════════
          Header Card
          ══════════════════════════════════════════ */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
          padding: '20px 24px',
          marginBottom: 20,
        }}
      >
        {/* Row 1: Title + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
              }}
            >
              <Users style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: H.navy,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {t('clients.title')}
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: H.gray,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {t('clients.subtitle')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Total badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 49,
                background: H.bg,
                fontSize: 13,
                fontWeight: 700,
                color: H.navy,
              }}
            >
              <UserCheck style={{ width: 14, height: 14, color: H.purple }} />
              {total}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchData()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 49,
                border: 'none',
                background: H.white,
                boxShadow: H.shadowMd,
                color: H.gray,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = H.purple;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = H.gray;
              }}
            >
              <RefreshCw
                style={{ width: 15, height: 15 }}
                className={loading ? 'animate-spin' : ''}
              />
            </button>

            {/* Create */}
            <Link
              href="/admin/clients/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                height: 40,
                padding: '0 20px',
                borderRadius: 49,
                background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: H.font,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              {t('clients.create')}
            </Link>
          </div>
        </div>

        {/* Row 2: Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${H.grayLight}40`,
          }}
        >
          <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
            <Search
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 14,
                height: 14,
                color: H.gray,
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder={t('clients.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                width: '100%',
                height: 40,
                paddingLeft: 38,
                paddingRight: 14,
                borderRadius: 49,
                border: 'none',
                background: H.bg,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: H.font,
                color: H.navy,
                outline: 'none',
                transition: 'box-shadow 0.2s',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 0 2px ${H.purpleLight}50`)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 40,
              padding: '0 20px',
              borderRadius: 49,
              border: 'none',
              background: H.navy,
              color: isDark ? '#1A2332' : '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: H.font,
              cursor: 'pointer',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(43, 54, 116, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <Search style={{ width: 13, height: 13 }} />
            {t('clients.find')}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Table Card
          ══════════════════════════════════════════ */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            fontFamily: H.font,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${H.grayLight}`,
              }}
            >
              {[t('clients.thId'), t('clients.thClient'), t('clients.thPhone'), t('clients.thEmail'), t('clients.thCity'), t('clients.thRating'), t('clients.thSource'), t('clients.thCreated')].map(
                (col) => (
                  <th
                    key={col}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: H.gray,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `1px solid ${H.grayLight}40`,
                    }}
                  >
                    <td colSpan={8} style={{ padding: '16px' }}>
                      <div
                        style={{
                          height: 16,
                          borderRadius: 8,
                          background: H.grayLight,
                          opacity: 0.4,
                        }}
                        className="animate-pulse"
                      />
                    </td>
                  </tr>
                ))
              : items.length === 0
                ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: '48px 16px',
                          textAlign: 'center',
                          color: H.gray,
                          fontSize: 14,
                        }}
                      >
                        <Users
                          style={{
                            width: 32,
                            height: 32,
                            color: H.grayLight,
                            margin: '0 auto 8px',
                          }}
                        />
                        {t('clients.emptyTitle')}
                      </td>
                    </tr>
                  )
                : items.map((c, idx) => {
                    const name =
                      [c.lastName, c.firstName, c.middleName]
                        .filter(Boolean)
                        .join(' ') || '—';
                    const srcStyle = SOURCE_STYLES[c.source || ''] || { bg: H.bg, color: H.gray };
                    const srcLabel = SOURCE_LABEL[c.source || ''] || c.source || '—';
                    const avatarBg =
                      AVATAR_COLORS[c.id % AVATAR_COLORS.length];

                    return (
                      <tr
                        key={c.id}
                        onClick={() => router.push(`/admin/clients/${c.id}`)}
                        style={{
                          borderBottom: `1px solid ${H.grayLight}40`,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${H.bg}80`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* # */}
                        <td
                          style={{
                            padding: '12px 16px',
                            fontWeight: 600,
                            color: H.gray,
                            fontSize: 12,
                          }}
                        >
                          {c.id}
                        </td>

                        {/* Client name + avatar */}
                        <td style={{ padding: '12px 16px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: avatarBg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#fff',
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(c.firstName, c.lastName)}
                            </div>
                            <span
                              style={{
                                fontWeight: 600,
                                color: H.navy,
                              }}
                            >
                              {name}
                            </span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td
                          style={{
                            padding: '12px 16px',
                            color: H.navy,
                            fontWeight: 500,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Phone
                              style={{
                                width: 12,
                                height: 12,
                                color: H.gray,
                              }}
                            />
                            {c.phone}
                          </div>
                        </td>

                        {/* Email */}
                        <td
                          style={{
                            padding: '12px 16px',
                            color: c.email ? H.navy : H.grayLight,
                            fontWeight: 500,
                          }}
                        >
                          {c.email ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <Mail
                                style={{
                                  width: 12,
                                  height: 12,
                                  color: H.gray,
                                }}
                              />
                              <span
                                style={{
                                  maxWidth: 180,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {c.email}
                              </span>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>

                        {/* City */}
                        <td
                          style={{
                            padding: '12px 16px',
                            color: c.city ? H.navy : H.grayLight,
                            fontWeight: 500,
                          }}
                        >
                          {c.city ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <MapPin
                                style={{
                                  width: 12,
                                  height: 12,
                                  color: H.gray,
                                }}
                              />
                              {c.city}
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>

                        {/* Rating */}
                        <td style={{ padding: '12px 16px' }}>
                          {c.rating != null ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '3px 10px',
                                borderRadius: 49,
                                background: H.orangeBg,
                              }}
                            >
                              <Star
                                style={{
                                  width: 12,
                                  height: 12,
                                  fill: H.orange,
                                  color: H.orange,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: H.orange,
                                }}
                              >
                                {c.rating}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: H.grayLight }}>—</span>
                          )}
                        </td>

                        {/* Source */}
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 10px',
                              borderRadius: 49,
                              background: srcStyle.bg,
                              fontSize: 11,
                              fontWeight: 700,
                              color: srcStyle.color,
                            }}
                          >
                            {srcLabel}
                          </span>
                        </td>

                        {/* Created */}
                        <td
                          style={{
                            padding: '12px 16px',
                            color: H.gray,
                            fontWeight: 500,
                            fontSize: 12,
                          }}
                        >
                          {fmtDate(c.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════
          Pagination
          ══════════════════════════════════════════ */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            padding: '0 4px',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: H.gray,
            }}
          >
            {t('common.page', { page: String(page), pages: String(totalPages) })}
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 49,
                border: 'none',
                background: page <= 1 ? H.bg : H.white,
                boxShadow: page <= 1 ? 'none' : H.shadowMd,
                color: page <= 1 ? H.grayLight : H.navy,
                cursor: page <= 1 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pNum: number;
              if (totalPages <= 5) {
                pNum = i + 1;
              } else if (page <= 3) {
                pNum = i + 1;
              } else if (page >= totalPages - 2) {
                pNum = totalPages - 4 + i;
              } else {
                pNum = page - 2 + i;
              }

              const isActive = pNum === page;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPage(pNum)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 49,
                    border: 'none',
                    background: isActive
                      ? `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`
                      : H.white,
                    boxShadow: isActive
                      ? '0 4px 12px rgba(67, 24, 255, 0.3)'
                      : H.shadowMd,
                    color: isActive ? '#fff' : H.navy,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: H.font,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 49,
                border: 'none',
                background: page >= totalPages ? H.bg : H.white,
                boxShadow: page >= totalPages ? 'none' : H.shadowMd,
                color: page >= totalPages ? H.grayLight : H.navy,
                cursor: page >= totalPages ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
