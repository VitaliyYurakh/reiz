'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { fmtDate } from '@/app/admin/lib/format';
import { AlertTriangle, Plus, Search } from 'lucide-react';

interface Accident {
  id: number;
  incidentAt: string;
  location: string | null;
  description: string;
  fault: string;
  status: string;
  clientDebtMinor: number;
  currency: string;
  car: { id: number; brand: string; model: string; plateNumber: string };
  client: { id: number; firstName: string; lastName: string; phone: string } | null;
  rental: { id: number; contractNumber: string | null } | null;
}

interface Stats {
  open: number;
  awaitingPayout: number;
  resolvedThisMonth: number;
  outstandingClientDebtMinor: number;
}

const STATUS_COLORS: Record<string, [string, string]> = {
  REPORTED: ['orangeBg', 'orange'],
  INVESTIGATING: ['blueBg', 'blue'],
  AWAITING_PAYOUT: ['purpleLight', 'purple'],
  RESOLVED: ['greenBg', 'green'],
  CLOSED: ['grayLight', 'gray'],
};

export default function AccidentsPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();

  const [items, setItems] = useState<Accident[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('open');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const [list, st] = await Promise.all([
        adminApiClient.get(`/accident?${params}`),
        adminApiClient.get('/accident/stats'),
      ]);
      setItems(list.data.items);
      setStats(st.data);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmtMoney = (minor: number, ccy: string) => `${(minor / 100).toFixed(2)} ${ccy}`;

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px' }}>
      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '20px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: H.orangeBg, color: H.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, margin: 0 }}>{t('accidents.title')}</h1>
              <div style={{ fontSize: 13, color: H.gray, marginTop: 2 }}>{t('accidents.subtitle')}</div>
            </div>
          </div>
          <Link
            href="/admin/accidents/new"
            style={{ background: H.purple, color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> {t('accidents.newAccident')}
          </Link>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: t('accidents.open'), value: stats.open, color: H.orange },
            { label: t('accidents.awaitingPayout'), value: stats.awaitingPayout, color: H.purple },
            { label: t('accidents.resolvedThisMonth'), value: stats.resolvedThisMonth, color: H.green },
            { label: t('accidents.outstandingDebt'), value: fmtMoney(stats.outstandingClientDebtMinor, 'UAH'), color: H.red },
          ].map((card) => (
            <div key={card.label} style={{ background: H.white, borderRadius: 14, boxShadow: H.shadow, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: H.gray, marginBottom: 6 }}>{card.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: H.gray }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px 10px 36px', color: H.navyDark, fontFamily: H.font, fontSize: 14, minWidth: 220 }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14 }}>
          <option value="open">{t('accidents.open')}</option>
          <option value="closed">{t('accidents.closed')}</option>
          <option value="">{t('common.all')}</option>
          <option value="REPORTED">{t('accidents.statusReported')}</option>
          <option value="INVESTIGATING">{t('accidents.statusInvestigating')}</option>
          <option value="AWAITING_PAYOUT">{t('accidents.statusAwaitingPayout')}</option>
          <option value="RESOLVED">{t('accidents.statusResolved')}</option>
          <option value="CLOSED">{t('accidents.statusClosed')}</option>
        </select>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('accidents.noResults')}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: H.bg }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.incidentAt')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.car')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.client')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.fault')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.status')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('accidents.clientDebt')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => {
                const [bgKey, fgKey] = STATUS_COLORS[a.status] || ['grayLight', 'gray'];
                return (
                  <tr
                    key={a.id}
                    onClick={() => router.push(`/admin/accidents/${a.id}`)}
                    style={{ borderTop: `1px solid ${H.grayLight}`, cursor: 'pointer' }}
                  >
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13 }}>{fmtDate(a.incidentAt)}</td>
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13 }}>
                      {a.car.brand} {a.car.model}
                      <div style={{ color: H.gray, fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>{a.car.plateNumber}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13 }}>
                      {a.client ? `${a.client.lastName} ${a.client.firstName}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13 }}>
                      {t(`accidents.fault${a.fault.charAt(0)}${a.fault.slice(1).toLowerCase().replace(/_./, m => m[1].toUpperCase())}` as any) || a.fault}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: (H as any)[bgKey], color: (H as any)[fgKey], padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                        {t(`accidents.status${a.status.charAt(0)}${a.status.slice(1).toLowerCase().replace(/_./, m => m[1].toUpperCase())}` as any) || a.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: H.red, fontWeight: 600, fontSize: 13, textAlign: 'right' }}>
                      {a.clientDebtMinor > 0 ? fmtMoney(a.clientDebtMinor, a.currency) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
