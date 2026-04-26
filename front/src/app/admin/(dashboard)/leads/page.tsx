'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { toast, toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Target, Plus, Search, Phone, Mail, Globe, MessageSquare, Play, RefreshCcw } from 'lucide-react';

interface LeadRow {
  id: number;
  companyName: string;
  country: string;
  city: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  ownerName: string | null;
  language: string;
  status: string;
  contactedAt: string | null;
  repliedAt: string | null;
  followUpCount: number;
  createdAt: string;
  assignedManager: { id: number; name: string; email: string } | null;
  _count: { emails: number };
}

interface ListResp {
  items: LeadRow[];
  total: number;
  page: number;
  limit: number;
}

interface Stats {
  total: number;
  contacted: number;
  replied: number;
  replyRate: number;
  byStatus: Record<string, number>;
  byCountry: Record<string, number>;
}

const COUNTRY_FLAGS: Record<string, string> = {
  TR: '🇹🇷', ME: '🇲🇪', RS: '🇷🇸', AM: '🇦🇲',
  TH: '🇹🇭', ID: '🇮🇩', KZ: '🇰🇿',
};

const STATUS_OPTIONS = [
  '', 'NEW', 'ENRICHED', 'READY',
  'CONTACTED', 'FOLLOWED_UP_1', 'FOLLOWED_UP_2', 'BREAKUP_SENT',
  'REPLIED', 'INTERESTED', 'CLIENT',
  'DISQUALIFIED', 'BOUNCED', 'UNSUBSCRIBED', 'PAUSED',
];

const COUNTRY_OPTIONS = ['', 'TR', 'ME', 'RS', 'AM', 'TH', 'ID', 'KZ'];

function statusBadge(status: string, isDark: boolean) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    NEW:           { bg: '#94A3B8', fg: '#fff',    label: 'Новый' },
    ENRICHED:      { bg: '#60A5FA', fg: '#fff',    label: 'Enriched' },
    READY:         { bg: '#22D3EE', fg: '#063545', label: 'Готов' },
    CONTACTED:     { bg: '#A78BFA', fg: '#fff',    label: 'Написано' },
    FOLLOWED_UP_1: { bg: '#8B5CF6', fg: '#fff',    label: 'FU 3д' },
    FOLLOWED_UP_2: { bg: '#7C3AED', fg: '#fff',    label: 'FU 7д' },
    BREAKUP_SENT:  { bg: '#6D28D9', fg: '#fff',    label: 'Break-up' },
    REPLIED:       { bg: '#FBBF24', fg: '#3F2A06', label: 'Ответил' },
    INTERESTED:    { bg: '#F59E0B', fg: '#fff',    label: 'Интерес' },
    CLIENT:        { bg: '#10B981', fg: '#fff',    label: 'Клиент' },
    DISQUALIFIED:  { bg: '#64748B', fg: '#fff',    label: 'Disq' },
    BOUNCED:       { bg: '#EF4444', fg: '#fff',    label: 'Bounced' },
    UNSUBSCRIBED:  { bg: '#9CA3AF', fg: '#fff',    label: 'Отписан' },
    PAUSED:        { bg: '#475569', fg: '#fff',    label: 'Пауза' },
  };
  const entry = map[status] ?? { bg: '#94A3B8', fg: '#fff', label: status };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: entry.bg, color: entry.fg, opacity: isDark ? 0.95 : 1 }}
    >
      {entry.label}
    </span>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [items, setItems] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminApiClient.get<Stats>('/lead/stats');
      setStats(res.data);
    } catch (err) {
      logError(err);
    }
  }, []);

  const runStep = async (step: 'discovery' | 'enrichment' | 'outreach' | 'inbox' | 'report') => {
    setRunning(step);
    try {
      const res = await adminApiClient.post(`/lead/run/${step}`);
      toast.success(`Шаг "${step}" выполнен: ${JSON.stringify(res.data.result).slice(0, 80)}`);
      fetchStats();
    } catch (err) {
      toastError(err, `Не удалось запустить ${step}`);
    } finally {
      setRunning(null);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (countryFilter) params.set('country', countryFilter);
      params.set('limit', '100');
      const res = await adminApiClient.get<ListResp>(`/lead?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, countryFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-cyan">
              <Target size={24} />
            </div>
            <div>
              <h1 className="h-title">B2B Аутрич</h1>
              <span className="h-subtitle">Холодная рассылка автопрокатам по странам — {total} лидов</span>
            </div>
          </div>
          <Link href="/admin/leads/new" className="ios-btn ios-btn-primary text-sm">
            <Plus className="h-4 w-4" /> Добавить вручную
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: isDark ? '#718096' : '#90A4AE' }}
            />
            <input
              type="text"
              placeholder="Поиск по компании, email, городу…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput); }}
              className="h-9 w-[300px] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              style={{
                paddingLeft: 34,
                paddingRight: 12,
                backgroundColor: isDark ? '#1E293B' : '#F7F9FB',
                border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1',
                color: isDark ? '#E2E8F0' : '#263238',
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg px-3 text-[13px]"
            style={{
              backgroundColor: isDark ? '#1E293B' : '#F7F9FB',
              border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1',
              color: isDark ? '#E2E8F0' : '#263238',
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || 'Все статусы'}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="h-9 rounded-lg px-3 text-[13px]"
            style={{
              backgroundColor: isDark ? '#1E293B' : '#F7F9FB',
              border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1',
              color: isDark ? '#E2E8F0' : '#263238',
            }}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c ? `${COUNTRY_FLAGS[c] ?? ''} ${c}` : 'Все страны'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats + manual triggers */}
      {stats && (
        <div
          className="mb-6 rounded-[20px] px-7 py-5"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
            <Stat label="Всего лидов" value={stats.total} isDark={isDark} />
            <Stat label="Контактировано" value={stats.contacted} isDark={isDark} />
            <Stat label="Ответили" value={stats.replied} isDark={isDark} accent />
            <Stat label="Reply rate" value={`${stats.replyRate}%`} isDark={isDark} />
            <Stat
              label="Активных"
              value={(stats.byStatus.READY ?? 0) + (stats.byStatus.CONTACTED ?? 0) + (stats.byStatus.FOLLOWED_UP_1 ?? 0) + (stats.byStatus.FOLLOWED_UP_2 ?? 0)}
              isDark={isDark}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold opacity-70 mr-2">Запустить вручную:</span>
            {(['discovery', 'enrichment', 'outreach', 'inbox', 'report'] as const).map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => runStep(step)}
                disabled={running !== null}
                className="ios-btn ios-btn-ghost text-[12px] disabled:opacity-50"
                title={STEP_HELP[step]}
              >
                {running === step ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {step}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
              <Th isDark={isDark}>Компания</Th>
              <Th isDark={isDark}>Локация</Th>
              <Th isDark={isDark}>Контакты</Th>
              <Th isDark={isDark}>Статус</Th>
              <Th isDark={isDark} align="right">Письма</Th>
              <Th isDark={isDark}>Контакт</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
                  <td colSpan={6} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded" style={{ background: isDark ? '#1E293B' : '#F0F4F8' }} />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  Лидов не найдено. Импорт через Google Places (скоро) или добавьте вручную.
                </td>
              </tr>
            ) : (
              items.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#1E293B' : '#F7F9FB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                      {lead.companyName}
                    </div>
                    {lead.ownerName && (
                      <div className="text-[11px] mt-0.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                        {lead.ownerName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    <span className="mr-1.5">{COUNTRY_FLAGS[lead.country] ?? ''}</span>
                    {lead.city}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    {lead.email && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 shrink-0" />
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline truncate max-w-[200px]"
                        >
                          {lead.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {!lead.email && !lead.phone && !lead.website && '—'}
                  </td>
                  <td className="px-4 py-3">{statusBadge(lead.status, isDark)}</td>
                  <td className="px-4 py-3 text-right text-[12px] tabular-nums" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {lead._count.emails}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    {lead.repliedAt
                      ? <span style={{ color: '#10B981', fontWeight: 600 }}>отв. {formatDate(lead.repliedAt)}</span>
                      : lead.contactedAt
                        ? formatDate(lead.contactedAt)
                        : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STEP_HELP: Record<string, string> = {
  discovery: 'Подтянуть новые компании из Google Places по списку городов',
  enrichment: 'Спарсить email с сайтов NEW лидов',
  outreach: 'Сгенерировать и отправить письма (с ramp-up капом)',
  inbox: 'Прочитать почту, отметить ответы и пинговать в Telegram',
  report: 'Дневной отчёт в Telegram',
};

function Stat({ label, value, isDark, accent }: { label: string; value: number | string; isDark: boolean; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider opacity-60 mb-1">{label}</div>
      <div className="text-[22px] font-bold tabular-nums" style={{ color: accent ? '#10B981' : (isDark ? '#E2E8F0' : '#263238') }}>
        {value}
      </div>
    </div>
  );
}

function Th({ children, isDark, align = 'left' }: { children: React.ReactNode; isDark: boolean; align?: 'left' | 'right' }) {
  return (
    <th
      className={`px-4 py-3 text-${align} text-[11px] font-bold uppercase tracking-wider`}
      style={{ color: isDark ? '#718096' : '#90A4AE' }}
    >
      {children}
    </th>
  );
}

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}
