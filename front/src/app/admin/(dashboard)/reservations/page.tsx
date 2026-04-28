'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { cn } from '@/lib/cn';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  BookOpen,
  Inbox,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { fmtDateShort as fmtDate } from '@/app/admin/lib/format';
import { PartnerBadge } from '@/components/admin/PartnerBadge';

interface Reservation {
  id: number;
  status: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  createdAt: string;
  client: { id: number; firstName: string; lastName: string; phone: string } | null;
  car: {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    partner?: { id: number; fullName: string; companyName: string | null } | null;
  } | null;
  coveragePackage: { id: number; name: string } | null;
}

export default function ReservationsPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';
  const [items, setItems] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = useMemo(() => isDark ? {
    confirmed: { label: t('reservations.mapConfirmed'), bg: 'rgba(76,175,80,0.15)', text: 'var(--c-success-light)', dot: 'var(--c-success)' },
    picked_up: { label: t('reservations.mapIssued'), bg: 'rgba(154, 165, 255, 0.15)', text: 'var(--c-brand-light)', dot: 'var(--c-brand-light)' },
    cancelled: { label: t('reservations.mapCancelled'), bg: 'rgba(144,164,174,0.15)', text: '#90A4AE', dot: '#78909C' },
    no_show: { label: t('reservations.mapNoShow'), bg: 'rgba(239,83,80,0.15)', text: 'var(--c-error-light)', dot: 'var(--c-warning-light)' },
  } : {
    confirmed: { label: t('reservations.mapConfirmed'), bg: 'var(--c-success-bg)', text: 'var(--c-success)', dot: 'var(--c-success)' },
    picked_up: { label: t('reservations.mapIssued'), bg: 'var(--c-info-bg)', text: '#1565C0', dot: 'var(--c-brand-light)' },
    cancelled: { label: t('reservations.mapCancelled'), bg: 'var(--c-surface-border)', text: '#546E7A', dot: '#90A4AE' },
    no_show: { label: t('reservations.mapNoShow'), bg: '#FFEBEE', text: 'var(--c-error)', dot: 'var(--c-warning-light)' },
  }, [t, isDark]);

  const STATUS_TABS = [
    { value: '', label: t('reservations.statusAll') },
    { value: 'confirmed', label: t('reservations.statusConfirmed') },
    { value: 'picked_up', label: t('reservations.statusIssued') },
    { value: 'cancelled', label: t('reservations.statusCancelled') },
    { value: 'no_show', label: t('reservations.statusNoShow') },
  ];

  const timeAgo = useCallback((d: string) => {
    const now = Date.now();
    const diff = now - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('topbar.justNow');
    if (mins < 60) return t('topbar.minutesAgo', { n: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('topbar.hoursAgo', { n: hrs });
    const days = Math.floor(hrs / 24);
    if (days < 7) return t('topbar.daysAgo', { n: days });
    return new Date(d).toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }, [t]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await adminApiClient.get(`/reservation?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  const confirmedCount = useMemo(() => {
    if (statusFilter === 'confirmed') return total;
    return items.filter((r) => r.status === 'confirmed').length;
  }, [items, total, statusFilter]);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-6 rounded-[20px] px-7 py-5" style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-cyan">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="h-title">{t('reservations.title')}</h1>
                {confirmedCount > 0 && (
                  <span
                    className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: 'var(--c-brand)' }}
                  >
                    {confirmedCount} {t('reservations.activeBadge')}
                  </span>
                )}
              </div>
              <span className="h-subtitle">{t('reservations.subtitle')}</span>
            </div>
          </div>
          <Link
            href="/admin/reservations/new"
            className="ios-btn ios-btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Plus className="h-4 w-4" />
            <span>{t('reservations.create')}</span>
          </Link>
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
              placeholder={t('reservations.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { setSearch(searchInput); setPage(1); }
              }}
              className="h-9 w-[220px] rounded-lg text-[13px] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--c-brand)]/20"
              style={{ paddingLeft: 34, paddingRight: 12, backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)', border: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-border)', color: isDark ? '#E2E8F0' : '#263238' }}
            />
          </div>

          <div
            className="flex h-9 items-center rounded-lg px-3"
            style={{ backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)', border: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-border)' }}
          >
            <span className="text-[12px] font-medium" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('common.total')}</span>
            <span className="ml-1.5 text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{total}</span>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b px-6 py-4" style={{ borderColor: isDark ? '#1E293B' : 'var(--c-surface-muted)' }}>
                <div className={cn('h-10 w-10 animate-pulse rounded-xl', isDark ? 'bg-[#1E293B]' : 'bg-[var(--c-surface-muted)]')} />
                <div className="flex-1 space-y-2">
                  <div className={cn('h-3.5 w-48 animate-pulse rounded', isDark ? 'bg-[#1E293B]' : 'bg-[var(--c-surface-muted)]')} />
                  <div className={cn('h-3 w-32 animate-pulse rounded', isDark ? 'bg-[#1E293B]' : 'bg-[var(--c-surface-muted)]')} />
                </div>
                <div className={cn('h-6 w-20 animate-pulse rounded-full', isDark ? 'bg-[#1E293B]' : 'bg-[var(--c-surface-muted)]')} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl', isDark ? 'bg-[#1E293B]' : 'bg-[var(--c-surface-muted)]')}>
              <Inbox className="h-8 w-8" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }} />
            </div>
            <p className="mt-4 text-[15px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('reservations.emptyTitle')}</p>
            <p className="mt-1 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              {statusFilter ? t('reservations.emptyFilter') : t('reservations.emptyDefault')}
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? '#111827' : 'var(--c-surface-muted)' }}>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 44, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thId')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 110, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thStatus')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thClient')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thPhone')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thCar')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 140, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thPeriod')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 100, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thLocation')}</th>
                  <th className="border-b px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ width: 90, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('reservations.thCreated')}</th>
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
                  const st = STATUS_CONFIG[r.status] || { label: r.status, bg: isDark ? 'rgba(144,164,174,0.15)' : 'var(--c-surface-border)', text: isDark ? '#90A4AE' : '#546E7A', dot: isDark ? '#78909C' : '#90A4AE' };
                  const isConfirmed = r.status === 'confirmed';
                  const location = r.pickupLocation || '—';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/admin/reservations/${r.id}`)}
                      className={cn(
                        'cursor-pointer border-b transition-colors',
                        isDark ? 'border-[#1E293B] hover:bg-[#1E293B]' : 'border-[var(--c-surface-muted)] hover:bg-[var(--c-surface-muted)]',
                        isConfirmed && (isDark ? 'bg-[#164E63]/30' : 'bg-[var(--c-info-bg)]/30'),
                      )}
                    >
                      <td className="px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>#{r.id}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
                          style={{ backgroundColor: st.bg, color: st.text }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] font-medium truncate max-w-[160px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{name}</td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{phone}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[13px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{carName}</span>
                          {plate && <span className="text-[11px]" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>{plate}</span>}
                          <PartnerBadge partner={r.car?.partner} />
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                        {fmtDate(r.pickupDate)} → {fmtDate(r.returnDate)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap" style={{ backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)', color: isDark ? '#90A4AE' : '#607D8B' }}>
                          {location}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[12px] whitespace-nowrap" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{timeAgo(r.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
            {t('common.page', { page, pages: totalPages })}
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
