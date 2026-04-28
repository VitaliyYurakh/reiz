'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Package, Plus, Search } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  serialNumber: string | null;
  status: string;
  quantity: number;
  currentValueMinor: number | null;
  currency: string;
  location: { id: number; nameUk: string; nameEn: string } | null;
  responsibleUser: { id: number; name: string; email: string } | null;
}

interface Stats {
  total: number;
  available: number;
  assigned: number;
  maintenance: number;
  lost: number;
  totalValueMinor: number;
}

const STATUS_COLORS: Record<string, [string, string]> = {
  AVAILABLE: ['greenBg', 'green'],
  ASSIGNED: ['blueBg', 'blue'],
  MAINTENANCE: ['orangeBg', 'orange'],
  LOST: ['redBg', 'red'],
  WRITTEN_OFF: ['grayLight', 'gray'],
};

export default function InventoryPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const [list, st] = await Promise.all([
        adminApiClient.get(`/inventory?${params}`),
        adminApiClient.get('/inventory/stats'),
      ]);
      setItems(list.data.items);
      setStats(st.data);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmtMoney = (minor: number | null, ccy = 'UAH') =>
    minor != null ? `${(minor / 100).toFixed(2)} ${ccy}` : '—';

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px' }}>
      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '20px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: H.purpleLight + '22', color: H.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, margin: 0 }}>{t('inventory.title')}</h1>
              <div style={{ fontSize: 13, color: H.gray, marginTop: 2 }}>{t('inventory.subtitle')}</div>
            </div>
          </div>
          <Link
            href="/admin/inventory/new"
            style={{ background: H.purple, color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> {t('inventory.newItem')}
          </Link>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: t('inventory.total'), value: stats.total, color: H.navy },
            { label: t('inventory.available'), value: stats.available, color: H.green },
            { label: t('inventory.assigned'), value: stats.assigned, color: H.blue },
            { label: t('inventory.maintenance'), value: stats.maintenance, color: H.orange },
            { label: t('inventory.lost'), value: stats.lost, color: H.red },
            { label: t('inventory.totalValue'), value: fmtMoney(stats.totalValueMinor), color: H.purple },
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
          <option value="">{t('common.all')} — {t('inventory.status')}</option>
          {['AVAILABLE','ASSIGNED','MAINTENANCE','LOST','WRITTEN_OFF'].map(s => (
            <option key={s} value={s}>{t(`inventory.status${s.charAt(0) + s.slice(1).toLowerCase().replace(/_./, m => m[1].toUpperCase())}` as any)}</option>
          ))}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14 }}>
          <option value="">{t('common.all')} — {t('inventory.category')}</option>
          <option value="TOOL">{t('inventory.catTool')}</option>
          <option value="EQUIPMENT">{t('inventory.catEquipment')}</option>
          <option value="ACCESSORY">{t('inventory.catAccessory')}</option>
          <option value="KEYS">{t('inventory.catKeys')}</option>
          <option value="OTHER">{t('inventory.catOther')}</option>
        </select>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('inventory.noResults')}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: H.bg }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.name')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.category')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.serialNumber')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.status')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.responsibleUser')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('inventory.currentValue')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const [bgKey, fgKey] = STATUS_COLORS[it.status] || ['grayLight', 'gray'];
                return (
                  <tr
                    key={it.id}
                    onClick={() => router.push(`/admin/inventory/${it.id}`)}
                    style={{ borderTop: `1px solid ${H.grayLight}`, cursor: 'pointer' }}
                  >
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontWeight: 500 }}>{it.name}</td>
                    <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13 }}>{t(`inventory.cat${it.category.charAt(0)}${it.category.slice(1).toLowerCase()}` as any) || it.category}</td>
                    <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{it.serialNumber || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: (H as any)[bgKey], color: (H as any)[fgKey], padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                        {it.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13 }}>{it.responsibleUser?.name || it.responsibleUser?.email || '—'}</td>
                    <td style={{ padding: '14px 16px', color: H.navyDark, fontSize: 13, textAlign: 'right' }}>{fmtMoney(it.currentValueMinor, it.currency)}</td>
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
