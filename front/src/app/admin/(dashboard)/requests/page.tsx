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
  ClipboardList,
  Inbox,
  CheckCircle2,
} from 'lucide-react';
import { toast, toastError } from '@/lib/toast';
import { PartnerBadge } from '@/components/admin/PartnerBadge';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { fmtDateShort as fmtDate } from '@/app/admin/lib/format';

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
  car: {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    partner?: { id: number; fullName: string; companyName: string | null } | null;
  } | null;
  assignedTo: { id: number; email: string } | null;
}

export default function RequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAdminLocale();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';
  const [items, setItems] = useState<RentalRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') ?? '');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = useMemo(() => isDark ? {
    new: { label: t('requests.mapNew'), bg: 'rgba(106, 123, 255, 0.15)', text: 'var(--c-brand-light)', dot: 'var(--c-brand)' },
    in_review: { label: t('requests.mapProcessing'), bg: 'rgba(255,145,0,0.15)', text: 'var(--c-warning-light)', dot: 'var(--c-warning)' },
    approved: { label: t('requests.mapApproved'), bg: 'rgba(76,175,80,0.15)', text: 'var(--c-success-light)', dot: 'var(--c-success)' },
    rejected: { label: t('requests.mapRejected'), bg: 'rgba(239,83,80,0.15)', text: 'var(--c-error-light)', dot: 'var(--c-warning-light)' },
    cancelled: { label: t('requests.mapCancelled'), bg: 'rgba(144,164,174,0.15)', text: '#90A4AE', dot: '#78909C' },
  } : {
    new: { label: t('requests.mapNew'), bg: '#EDE7F6', text: 'var(--c-brand)', dot: 'var(--c-brand)' },
    in_review: { label: t('requests.mapProcessing'), bg: 'var(--c-warning-bg)', text: 'var(--c-warning)', dot: 'var(--c-warning)' },
    approved: { label: t('requests.mapApproved'), bg: 'var(--c-success-bg)', text: 'var(--c-success)', dot: 'var(--c-success)' },
    rejected: { label: t('requests.mapRejected'), bg: '#FFEBEE', text: 'var(--c-error)', dot: 'var(--c-warning-light)' },
    cancelled: { label: t('requests.mapCancelled'), bg: 'var(--c-surface-border)', text: '#546E7A', dot: '#90A4AE' },
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
      logError(err);
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

  const [quickApproveLoading, setQuickApproveLoading] = useState<number | null>(null);
  const [quickApproveError, setQuickApproveError] = useState<{ id: number; msg: string } | null>(null);

  // Inline quick-approve. Eligible only when the request is `new`, has a
  // pickup+return date, and a car is already attached. Saves Anna ~6 clicks
  // per straightforward booking.
  const handleQuickApprove = async (e: React.MouseEvent, r: RentalRequest) => {
    e.stopPropagation();
    if (!r.car || !r.pickupDate || !r.returnDate) return;
    setQuickApproveLoading(r.id);
    setQuickApproveError(null);

    // Build URL for direct fetch — bypass adminApiClient / toast system that
    // have repeatedly lost error details.
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    const url = `${apiBase}/rental-request/${r.id}/approve`;

    try {
      const fetchRes = await window.fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: r.car.id,
          pickupDate: new Date(r.pickupDate).toISOString(),
          returnDate: new Date(r.returnDate).toISOString(),
        }),
      });

      const bodyText = await fetchRes.text();
      console.log('[quick-approve] status:', fetchRes.status, 'body:', bodyText);

      if (!fetchRes.ok) {
        let detail = bodyText;
        try {
          const parsed = JSON.parse(bodyText);
          detail = parsed?.msg || parsed?.message || bodyText;
        } catch { /* not JSON */ }
        const msg = `[${fetchRes.status}] ${detail || fetchRes.statusText || 'no details'}`;
        setQuickApproveError({ id: r.id, msg });
        try { toast.error(msg); } catch { /* sonner may not be ready */ }
        return;
      }

      try { toast.success(`Заявку #${r.id} схвалено`); } catch { /* ignore */ }
      await fetchData();
    } catch (err: any) {
      const msg = `Мережева помилка: ${err?.message || String(err) || 'unknown'}`;
      console.error('[quick-approve] network error', err);
      setQuickApproveError({ id: r.id, msg });
      try { toast.error(msg); } catch { /* ignore */ }
    } finally {
      setQuickApproveLoading(null);
    }
  };

  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-6 rounded-[20px] px-7 py-5" style={{ boxShadow: H.shadow, backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-purple">
              <ClipboardList size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="h-title">{t('requests.title')}</h1>
                {newCount > 0 && (
                  <span
                    className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: 'var(--c-brand)' }}
                  >
                    {newCount} {t('requests.newBadge')}
                  </span>
                )}
              </div>
              <span className="h-subtitle">{t('requests.subtitle')}</span>
            </div>
          </div>
          <Link
            href="/admin/requests/new"
            className="ios-btn ios-btn-primary"
            style={{ textDecoration: 'none' }}
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

      {/* ── Quick-approve error banner ── */}
      {quickApproveError && (
        <div
          className="mb-4 rounded-xl border-2 p-3 flex items-start justify-between gap-3"
          style={{
            borderColor: 'var(--c-error)',
            background: 'rgba(238,93,80,0.08)',
            color: 'var(--c-error)',
          }}
        >
          <div className="text-sm font-mono break-all flex-1">
            <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">
              Помилка схвалення заявки #{quickApproveError.id}
            </div>
            <div className="font-semibold">{quickApproveError.msg}</div>
          </div>
          <button
            type="button"
            onClick={() => setQuickApproveError(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('flex items-center gap-4 border-b px-6 py-4', isDark ? 'border-[#1E293B]' : 'border-[var(--c-surface-muted)]')}>
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
                <tr style={{ backgroundColor: isDark ? '#111827' : 'var(--c-surface-muted)' }}>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 44, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thId')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 100, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thStatus')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thClient')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thPhone')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thCar')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 140, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thPeriod')}</th>
                  <th className="border-b px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ width: 76, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thSource')}</th>
                  <th className="border-b px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ width: 90, color: isDark ? '#718096' : '#90A4AE', borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}>{t('requests.thCreated')}</th>
                  <th className="border-b px-2 py-2" style={{ width: 40, borderColor: isDark ? '#2D3748' : 'var(--c-surface-border)' }}></th>
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
                  const st = STATUS_CONFIG[r.status] || { label: r.status, bg: 'var(--c-surface-border)', text: '#546E7A', dot: '#90A4AE' };
                  const isNew = r.status === 'new';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/admin/requests/${r.id}`)}
                      className={cn(
                        'cursor-pointer border-b transition-colors',
                        isDark ? 'border-[#1E293B] hover:bg-[#1E293B]' : 'border-[var(--c-surface-muted)] hover:bg-[var(--c-surface-muted)]',
                        isNew && (isDark ? 'bg-[#4A2B99]/25' : 'bg-[#EDE7F6]'),
                      )}
                      style={isNew ? { borderLeft: '3px solid var(--c-brand)' } : undefined}
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
                        {r.pickupDate ? `${fmtDate(r.pickupDate)} → ${fmtDate(r.returnDate)}` : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)', color: isDark ? '#90A4AE' : '#607D8B' }}>
                          {SOURCE_LABELS[r.source] || r.source}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[12px] whitespace-nowrap" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{timeAgo(r.createdAt)}</td>
                      <td className="px-2 py-2.5">
                        {isNew && r.car && r.pickupDate && r.returnDate && (
                          <button
                            type="button"
                            onClick={(e) => handleQuickApprove(e, r)}
                            disabled={quickApproveLoading === r.id}
                            title="Швидке схвалення (авто й дати з заявки)"
                            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                            style={{
                              background: quickApproveError?.id === r.id ? 'var(--c-error)' : 'var(--c-success)',
                              color: '#fff',
                            }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </td>
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
