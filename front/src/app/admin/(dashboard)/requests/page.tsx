'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  ClipboardList,
  Inbox,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface RentalRequest {
  id: number;
  source: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  pickupDate: string | null;
  returnDate: string | null;
  createdAt: string;
  client: { id: number; firstName: string; lastName: string; phone: string } | null;
  car: { id: number; brand: string; model: string; plateNumber: string } | null;
  assignedTo: { id: number; email: string } | null;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('uk', { day: '2-digit', month: 'short' });
}

export default function RequestsPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [items, setItems] = useState<RentalRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = useMemo(() => isDark ? {
    new: { label: t('requests.mapNew'), bg: 'rgba(124,77,255,0.15)', text: '#B39DDB', dot: '#7C4DFF' },
    in_review: { label: t('requests.mapProcessing'), bg: 'rgba(255,145,0,0.15)', text: '#FFB74D', dot: '#FF9100' },
    approved: { label: t('requests.mapApproved'), bg: 'rgba(76,175,80,0.15)', text: '#81C784', dot: '#4CAF50' },
    rejected: { label: t('requests.mapRejected'), bg: 'rgba(239,83,80,0.15)', text: '#EF9A9A', dot: '#EF5350' },
    cancelled: { label: t('requests.mapCancelled'), bg: 'rgba(144,164,174,0.15)', text: '#90A4AE', dot: '#78909C' },
  } : {
    new: { label: t('requests.mapNew'), bg: '#EDE7F6', text: '#5E35B1', dot: '#7C4DFF' },
    in_review: { label: t('requests.mapProcessing'), bg: '#FFF3E0', text: '#E65100', dot: '#FF9100' },
    approved: { label: t('requests.mapApproved'), bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' },
    rejected: { label: t('requests.mapRejected'), bg: '#FFEBEE', text: '#C62828', dot: '#EF5350' },
    cancelled: { label: t('requests.mapCancelled'), bg: '#ECEFF1', text: '#546E7A', dot: '#90A4AE' },
  }, [t, isDark]);

  const STATUS_TABS = useMemo(() => [
    { value: '', label: t('requests.statusAll') },
    { value: 'new', label: t('requests.statusNew') },
    { value: 'in_review', label: t('requests.statusProcessing') },
    { value: 'approved', label: t('requests.statusApproved') },
    { value: 'rejected', label: t('requests.statusRejected') },
  ], [t]);

  const SOURCE_LABELS: Record<string, string> = useMemo(() => ({
    website: t('requests.sourceWebsite'),
    phone: t('requests.sourcePhone'),
    telegram: t('requests.sourceTelegram'),
    instagram: t('requests.sourceInstagram'),
    walk_in: t('requests.sourceWalkIn'),
    referral: t('requests.sourceReferral'),
    other: t('requests.sourceOther'),
  }), [t]);

  function timeAgo(d: string) {
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
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await adminApiClient.get(`/rental-request?${params}`);
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

  const newCount = useMemo(() => {
    if (statusFilter === 'new') return total;
    return items.filter((r) => r.status === 'new').length;
  }, [items, total, statusFilter]);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-6 rounded-2xl px-8 py-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#651FFF]"
              style={{ boxShadow: '0 4px 12px rgba(124,77,255,0.3)' }}
            >
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('requests.title')}</h1>
                {newCount > 0 && (
                  <span
                    className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: '#7C4DFF' }}
                  >
                    {newCount} {t('requests.newBadge')}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                {t('requests.subtitle')}
              </p>
            </div>
          </div>
          <Link
            href="/admin/requests/new"
            className="inline-flex h-10 items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#26C6DA] to-[#00ACC1] text-[13px] font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            style={{ paddingLeft: 28, paddingRight: 28 }}
          >
            <Plus className="h-4 w-4" />
            <span>{t('requests.create')}</span>
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
              placeholder={t('requests.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { setSearch(searchInput); setPage(1); }
              }}
              className="h-9 w-[220px] rounded-lg text-[13px] transition-all focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]/20"
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

      {/* ── Table ── */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('flex items-center gap-4 border-b px-6 py-4', isDark ? 'border-[#1E293B]' : 'border-[#F0F4F8]')}>
                <div className={cn('h-10 w-10 animate-pulse rounded-xl', isDark ? 'bg-[#1E293B]' : 'bg-[#F0F4F8]')} />
                <div className="flex-1 space-y-2">
                  <div className={cn('h-3.5 w-48 animate-pulse rounded', isDark ? 'bg-[#1E293B]' : 'bg-[#F0F4F8]')} />
                  <div className={cn('h-3 w-32 animate-pulse rounded', isDark ? 'bg-[#1E293B]' : 'bg-[#F0F4F8]')} />
                </div>
                <div className={cn('h-6 w-20 animate-pulse rounded-full', isDark ? 'bg-[#1E293B]' : 'bg-[#F0F4F8]')} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl', isDark ? 'bg-[#1E293B]' : 'bg-[#F0F4F8]')}>
              <Inbox className="h-8 w-8" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }} />
            </div>
            <p className="mt-4 text-[15px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('requests.emptyTitle')}</p>
            <p className="mt-1 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              {statusFilter ? t('requests.emptyFilter') : t('requests.emptyDefault')}
            </p>
          </div>
        ) : (
          <div>
            {/* Table */}
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? '#111827' : '#FAFBFC' }}>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 44, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thId')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 100, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thStatus')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thClient')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thPhone')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thCar')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 140, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thPeriod')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 76, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thSource')}</th>
                  <th className="border-b px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ width: 90, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : '#ECEFF1' }}>{t('requests.thCreated')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => {
                  const name = r.client
                    ? `${r.client.firstName} ${r.client.lastName}`
                    : [r.firstName, r.lastName].filter(Boolean).join(' ') || '—';
                  const phone = r.client?.phone || r.phone || '—';
                  const carName = r.car ? `${r.car.brand} ${r.car.model}` : '—';
                  const plate = r.car?.plateNumber || '';
                  const st = STATUS_CONFIG[r.status] || { label: r.status, bg: '#ECEFF1', text: '#546E7A', dot: '#90A4AE' };
                  const isNew = r.status === 'new';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/admin/requests/${r.id}`)}
                      className={cn(
                        'cursor-pointer border-b transition-colors',
                        isDark ? 'border-[#1E293B] hover:bg-[#1E293B]' : 'border-[#F0F4F8] hover:bg-[#F7F9FB]',
                        isNew && (isDark ? 'bg-[#2D1B69]/40' : 'bg-[#F5F0FF]/40'),
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
                        <span className="text-[13px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{carName}</span>
                        {plate && <span className="ml-1.5 text-[11px]" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>{plate}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                        {r.pickupDate ? `${fmtDate(r.pickupDate)} → ${fmtDate(r.returnDate)}` : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: isDark ? '#1E293B' : '#F0F4F8', color: isDark ? '#90A4AE' : '#607D8B' }}>
                          {SOURCE_LABELS[r.source] || r.source}
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
                    page === pageNum && (isDark ? 'bg-[#E2E8F0] !text-[#1A202C] hover:bg-[#E2E8F0]' : 'bg-[#263238] !text-white hover:bg-[#263238]'),
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
