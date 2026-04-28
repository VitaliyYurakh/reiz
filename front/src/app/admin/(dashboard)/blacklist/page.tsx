'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { fmtDate } from '@/app/admin/lib/format';
import { UserX, Search, ExternalLink } from 'lucide-react';

interface BlockedClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  blockReason: string | null;
  blockedAt: string | null;
}

export default function BlacklistPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const [items, setItems] = useState<BlockedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ isBlocked: 'true', limit: '200' });
      if (search) params.set('search', search);
      const res = await adminApiClient.get(`/client?${params}`);
      setItems(res.data.items);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUnblock = async (id: number) => {
    if (!confirm(t('blacklist.unblock') + '?')) return;
    try {
      await adminApiClient.post(`/client/${id}/unblock`);
      fetchData();
    } catch (err) {
      logError(err);
    }
  };

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px' }}>
      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '20px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: H.redBg, color: H.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserX size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, margin: 0 }}>{t('blacklist.title')}</h1>
              <div style={{ fontSize: 13, color: H.gray, marginTop: 2 }}>{t('blacklist.subtitle')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: H.gray }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('common.search')}
                style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px 10px 36px', color: H.navyDark, fontFamily: H.font, fontSize: 14, minWidth: 220 }}
              />
            </div>
            <span style={{ color: H.gray, fontSize: 13 }}>{t('blacklist.countTotal')}: <strong style={{ color: H.navyDark }}>{items.length}</strong></span>
          </div>
        </div>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('blacklist.noResults')}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: H.bg }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('common.name')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('common.phone')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('blacklist.blockedAt')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('blacklist.reason')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${H.grayLight}` }}>
                  <td style={{ padding: '14px 16px', color: H.navyDark, fontWeight: 500 }}>
                    <Link href={`/admin/clients/${c.id}`} style={{ color: H.navyDark, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {c.lastName} {c.firstName}
                      <ExternalLink size={12} style={{ color: H.gray }} />
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px', color: H.gray, fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>{c.phone}</td>
                  <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13 }}>{c.blockedAt ? fmtDate(c.blockedAt) : '—'}</td>
                  <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13, maxWidth: 400 }}>{c.blockReason || '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleUnblock(c.id)}
                      style={{ background: H.greenBg, color: H.green, border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: H.font }}
                    >
                      {t('blacklist.unblock')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
