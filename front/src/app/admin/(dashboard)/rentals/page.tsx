'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/cn';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { fmtDateShort as fmtDate } from '@/app/admin/lib/format';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Receipt,
  Inbox,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Rental {
  id: number;
  status: string;
  contractNumber: string;
  pickupDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  createdAt: string;
  client: { id: number; firstName: string; lastName: string; phone: string } | null;
  car: { id: number; brand: string; model: string; plateNumber: string } | null;
}

function getStatusStyles(isDark: boolean): Record<string, { bg: string; text: string; dot: string }> {
  return isDark ? {
    active: { bg: 'rgba(76,175,80,0.15)', text: '#81C784', dot: '#4CAF50' },
    completed: { bg: 'rgba(66,165,245,0.15)', text: '#90CAF9', dot: '#42A5F5' },
    cancelled: { bg: 'rgba(144,164,174,0.15)', text: '#90A4AE', dot: '#78909C' },
  } : {
    active: { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' },
    completed: { bg: '#E3F2FD', text: '#1565C0', dot: '#42A5F5' },
    cancelled: { bg: '#ECEFF1', text: '#546E7A', dot: '#90A4AE' },
  };
}

function timeAgo(d: string) {
  const now = Date.now();
  const diff = now - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч назад`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} дн назад`;
  return new Date(d).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function RentalsPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const STATUS_STYLES = useMemo(() => getStatusStyles(isDark), [isDark]);
  const [items, setItems] = useState<Rental[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const STATUS_LABEL_MAP: Record<string, string> = {
    active: t('rentals.mapActive'),
    completed: t('rentals.mapCompleted'),
    cancelled: t('rentals.mapCancelled'),
  };

  const STATUS_TABS = [
    { value: '', label: t('rentals.statusAll') },
    { value: 'active', label: t('rentals.statusActive') },
    { value: 'completed', label: t('rentals.statusCompleted') },
    { value: 'cancelled', label: t('rentals.statusCancelled') },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await adminApiClient.get(`/rental?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  const activeCount = useMemo(() => {
    if (statusFilter === 'active') return total;
    return items.filter((r) => r.status === 'active').length;
  }, [items, total, statusFilter]);

  return (
    <div>
      {/* -- Page header -- */}
      <div
        className="mb-6 rounded-2xl px-8 py-6"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#66BB6A] to-[#43A047]"
              style={{ boxShadow: '0 4px 12px rgba(76,175,80,0.3)' }}
            >
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('rentals.title')}</h1>
                {activeCount > 0 && (
                  <span
                    className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    {activeCount} {t('rentals.activeBadge')}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                {t('rentals.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Status tabs + search */}
        <div className="mt-5 flex items-center gap-3">
          <div className="ios-segmented" style={{ display: 'inline-flex' }}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                className={`ios-segment ${statusFilter === tab.value ? 'ios-segment-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: isDark ? '#718096' : '#90A4AE' }}
            />
            <input
              type="text"
              placeholder={t('rentals.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { setSearch(searchInput); setPage(1); }
              }}
              className="h-9 w-[220px] rounded-lg text-[13px] transition-all focus:outline-none focus:ring-2 focus:ring-[#66BB6A]/20"
              style={{ paddingLeft: 34, paddingRight: 12, backgroundColor: isDark ? '#1E293B' : '#F7F9FB', border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1', color: isDark ? '#E2E8F0' : '#263238' }}
            />
          </div>

          <div
            className="flex h-9 items-center rounded-lg px-3"
            style={{ backgroundColor: isDark ? '#1E293B' : '#F7F9FB', border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}
          >
            <span className="text-[12px] font-medium" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('common.total')}</span>
            <span className="ml-1.5 text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{total}</span>
          </div>
        </div>
      </div>

      {/* -- Table -- */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4"
                style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}
              >
                <div className="h-10 w-10 animate-pulse rounded-xl" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-48 animate-pulse rounded" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8' }} />
                  <div className="h-3 w-32 animate-pulse rounded" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8' }} />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8' }} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8' }}>
              <Inbox className="h-8 w-8" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }} />
            </div>
            <p className="mt-4 text-[15px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('rentals.emptyTitle')}</p>
            <p className="mt-1 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              {statusFilter ? t('rentals.emptyFilter') : t('rentals.emptyDefault')}
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? '#111827' : '#FAFBFC' }}>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 44, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thId')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 100, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thStatus')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 110, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thContract')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thClient')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thPhone')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thCar')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 140, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thPeriod')}</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 90, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thActualReturn')}</th>
                  <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ width: 90, color: isDark ? '#718096' : '#90A4AE', borderBottom: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}>{t('rentals.thCreated')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => {
                  const name = r.client
                    ? `${r.client.firstName} ${r.client.lastName}`
                    : '—';
                  const phone = r.client?.phone || '—';
                  const carName = r.car ? `${r.car.brand} ${r.car.model}` : '—';
                  const plate = r.car?.plateNumber || '';
                  const fallback = isDark ? { bg: 'rgba(144,164,174,0.15)', text: '#90A4AE', dot: '#78909C' } : { bg: '#ECEFF1', text: '#546E7A', dot: '#90A4AE' };
                  const stStyle = STATUS_STYLES[r.status] || fallback;
                  const stLabel = STATUS_LABEL_MAP[r.status] || r.status;
                  const isActive = r.status === 'active';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/admin/rentals/${r.id}`)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isActive && (isDark ? 'bg-[#1A3A2A]/30' : 'bg-[#E8F5E9]/30'),
                      )}
                      style={{
                        borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = isActive
                          ? (isDark ? 'rgba(26,58,42,0.5)' : 'rgba(232,245,233,0.5)')
                          : (isDark ? '#1E293B' : '#F7F9FB');
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = isActive
                          ? (isDark ? 'rgba(26,58,42,0.3)' : 'rgba(232,245,233,0.3)')
                          : '';
                      }}
                    >
                      <td className="px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>#{r.id}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
                          style={{ backgroundColor: stStyle.bg, color: stStyle.text }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stStyle.dot }} />
                          {stLabel}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-mono font-medium" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8', color: isDark ? '#90A4AE' : '#607D8B' }}>
                          {r.contractNumber || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] font-medium truncate max-w-[160px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{name}</td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{phone}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-[13px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{carName}</span>
                        {plate && <span className="ml-1.5 text-[11px]" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>{plate}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                        {fmtDate(r.pickupDate)} → {fmtDate(r.returnDate)}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>{fmtDate(r.actualReturnDate)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] whitespace-nowrap" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{timeAgo(r.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -- Pagination -- */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
            {t('common.page', { page: String(page), pages: String(totalPages) })}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="ios-page-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'ios-page-btn text-[13px]',
                    page === pageNum && (isDark ? 'bg-[#E2E8F0] !text-[#1A2332] hover:bg-[#E2E8F0]' : 'bg-[#263238] !text-white hover:bg-[#263238]'),
                  )}
                  style={{ minWidth: 36 }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="ios-page-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
