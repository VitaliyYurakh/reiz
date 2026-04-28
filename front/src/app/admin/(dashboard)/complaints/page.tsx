'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useRouter } from 'next/navigation';
import {
  AlertOctagon,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Complaint {
  id: number;
  ticketNumber: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  slaDeadline: string | null;
  createdAt: string;
  client: { id: number; firstName: string; lastName: string } | null;
  rental: { id: number; contractNumber: string } | null;
  assignedManager: { id: number; email: string; name: string } | null;
  _count: { messages: number };
}

interface Stats {
  open: number;
  inReview: number;
  awaitingClient: number;
  resolved: number;
  overdue: number;
}

const STATUS_TABS = [
  { value: '', label: 'Усі' },
  { value: 'open', label: 'Відкриті' },
  { value: 'in_review', label: 'В роботі' },
  { value: 'awaiting_client', label: 'Чекають клієнта' },
  { value: 'resolved', label: 'Вирішені' },
];

const CATEGORY_LABEL: Record<string, string> = {
  DEPOSIT: 'Застава',
  DAMAGE: 'Пошкодження',
  FINE: 'Штраф',
  SERVICE: 'Сервіс',
  GDPR: 'GDPR',
  OTHER: 'Інше',
};

const PRIORITY_COLOR: Record<string, string> = {
  low: '#90A4AE',
  normal: '#9aa5ff',
  high: '#FFB547',
  urgent: '#EE5D50',
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  open: { bg: '#EDE7F6', text: '#6a7bff' },
  in_review: { bg: '#FFF3E0', text: '#E65100' },
  awaiting_client: { bg: '#E0F7FA', text: '#00838F' },
  resolved: { bg: '#E8F5E9', text: '#2E7D32' },
  rejected: { bg: '#ECEFF1', text: '#546E7A' },
};

export default function ComplaintsPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [items, setItems] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const [listRes, statsRes] = await Promise.all([
        adminApiClient.get(`/complaint?${params}`),
        adminApiClient.get('/complaint/stats'),
      ]);
      setItems(listRes.data.items);
      setTotal(listRes.data.total);
      setStats(statsRes.data);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2),
    [totalPages, page],
  );

  const formatTimeLeft = (deadline: string | null) => {
    if (!deadline) return '—';
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms < 0) {
      const hOver = Math.ceil(-ms / 3600000);
      return hOver < 24 ? `−${hOver}год` : `−${Math.ceil(hOver / 24)}д`;
    }
    const h = Math.ceil(ms / 3600000);
    return h < 24 ? `${h}год` : `${Math.ceil(h / 24)}д`;
  };

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-red">
              <AlertOctagon size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="h-title">Скарги та спори</h1>
                {stats && stats.overdue > 0 && (
                  <span className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white" style={{ backgroundColor: '#EE5D50' }}>
                    <AlertTriangle size={11} /> {stats.overdue} прострочено
                  </span>
                )}
              </div>
              <span className="h-subtitle">Уніфіковане місце для всіх клієнтських спорів</span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: 'Відкриті', val: stats.open, color: '#6a7bff', icon: AlertOctagon },
              { label: 'В роботі', val: stats.inReview, color: '#FF9100', icon: Clock },
              { label: 'Чекають клієнта', val: stats.awaitingClient, color: '#00838F', icon: Clock },
              { label: 'Вирішені', val: stats.resolved, color: '#4CAF50', icon: CheckCircle2 },
              { label: 'Прострочено SLA', val: stats.overdue, color: '#EE5D50', icon: AlertTriangle },
            ].map(({ label, val, color, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ backgroundColor: isDark ? '#0F172A' : '#F7F9FB' }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color }} />
                  <span className="text-[11px] font-medium" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{label}</span>
                </div>
                <div className="mt-1 text-xl font-bold tabular-nums" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 flex-wrap">
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
              placeholder="Пошук за номером, темою, клієнтом…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              className="h-9 w-[260px] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#EE5D50]/20"
              style={{
                paddingLeft: 34,
                paddingRight: 12,
                backgroundColor: isDark ? '#1E293B' : '#F7F9FB',
                border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1',
                color: isDark ? '#E2E8F0' : '#263238',
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Номер</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Тема</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Категорія</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Клієнт</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Статус</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>SLA</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Менеджер</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded" style={{ background: isDark ? '#1E293B' : '#F0F4F8' }} />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  Скарг не знайдено
                </td>
              </tr>
            ) : (
              items.map((c) => {
                const st = STATUS_COLOR[c.status] || { bg: '#ECEFF1', text: '#546E7A' };
                const isOverdue = c.slaDeadline && new Date(c.slaDeadline).getTime() < Date.now() && c.status !== 'resolved';
                return (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin/complaints/${c.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8',
                      borderLeft: `3px solid ${PRIORITY_COLOR[c.priority] || '#90A4AE'}`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#1E293B' : '#F7F9FB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="px-4 py-3 font-mono text-[12px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                      {c.ticketNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-medium truncate max-w-[280px]" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                        {c.subject}
                      </div>
                      {c._count.messages > 1 && (
                        <div className="text-[11px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                          {c._count.messages} повідомлень
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: isDark ? '#1E293B' : '#F0F4F8', color: isDark ? '#E2E8F0' : '#263238' }}>
                        {CATEGORY_LABEL[c.category] || c.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                      {c.client
                        ? `${c.client.firstName} ${c.client.lastName}`
                        : c.contactName || c.contactEmail || c.contactPhone || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: st.bg, color: st.text }}>
                        {STATUS_TABS.find((t) => t.value === c.status)?.label || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] tabular-nums font-semibold" style={{ color: isOverdue ? '#EE5D50' : isDark ? '#718096' : '#90A4AE' }}>
                      {formatTimeLeft(c.slaDeadline)}
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                      {c.assignedManager?.name || c.assignedManager?.email || 'Не призначено'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4">
            <span className="text-[12px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              Сторінка {page} з {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-page-nav"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-page-num ${p === page ? 'h-page-num-active' : ''}`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-page-nav"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
