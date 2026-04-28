'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Car as CarIcon,
  Check,
  DollarSign,
  Key,
  Phone,
  TriangleAlert,
  X,
} from 'lucide-react';

/* ───────────── Quick-action SVGs (1:1 from reference design) ───────────── */
const QaPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const QaBookmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3h12v18l-6-4-6 4V3z" />
  </svg>
);
const QaUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 20c.5-3.5 3.5-5.5 7-5.5s6.5 2 7 5.5" />
    <circle cx="17" cy="7" r="2.5" />
    <path d="M16 13.5c2.5 0 5 1.3 6 4" />
  </svg>
);
const QaTransfer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 4l-4 4 4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
  </svg>
);
const QaChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
  </svg>
);
import {
  adminApiClient,
  getAccountBalances,
  getAccounts,
  getDashboard,
  getFleetUtilization,
  getOverdueRentals,
  getRevenue,
  type Account,
  type AccountBalance,
  type DashboardData,
  type FleetUtilizationData,
  type OverdueData,
  type RevenueData,
} from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { fmtMoneyUAH } from '@/app/admin/lib/format';
import './dashboard.css';

type Period = '7d' | '30d' | '90d';
const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };

interface RecentRequest {
  id: number;
  status: string;
  firstName: string | null;
  lastName: string | null;
  client: { id: number; firstName: string; lastName: string } | null;
  car: { id: number; brand: string; model: string } | null;
  pickupDate: string | null;
  returnDate: string | null;
  createdAt: string;
}

interface ScheduleItem {
  id: number;
  type: 'pickup' | 'return';
  time: string;
  date: Date;
  carBrand: string | null;
  carModel: string | null;
  carPlate: string | null;
  clientName: string;
  source: 'rental' | 'reservation';
}

interface CalendarApiCar {
  id: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  intervals: Array<{
    type: 'reservation' | 'rental' | 'service';
    id: number;
    startDate: string;
    endDate: string | null;
    label: string;
    clientName?: string;
  }>;
}

function formatLocaleDate(localeTag: string, d: Date | string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(d).toLocaleDateString(localeTag, opts);
}

function formatTime(d: Date | string): string {
  return new Date(d).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function getGreeting(t: (k: string) => string): string {
  const h = new Date().getHours();
  if (h < 5) return t('dashboard.greetingNight');
  if (h < 12) return t('dashboard.greetingMorning');
  if (h < 18) return t('dashboard.greetingDay');
  return t('dashboard.greetingEvening');
}

function getInitials(first?: string | null, last?: string | null): string {
  const f = (first || '').trim();
  const l = (last || '').trim();
  return ((f[0] || '') + (l[0] || '')).toUpperCase() || '·';
}

function dateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export default function DashboardPage() {
  const { t, locale } = useAdminLocale();
  const { hasPermission } = useAdminAuth();
  const localeTag =
    locale === 'en' ? 'en-US' :
    locale === 'pl' ? 'pl-PL' :
    locale === 'ro' ? 'ro-RO' :
    locale === 'ru' ? 'ru-RU' :
    'uk-UA';

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [overdue, setOverdue] = useState<OverdueData | null>(null);
  const [fleet, setFleet] = useState<FleetUtilizationData | null>(null);
  const [requests, setRequests] = useState<RecentRequest[]>([]);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [calendarCars, setCalendarCars] = useState<CalendarApiCar[]>([]);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [balances, setBalances] = useState<AccountBalance[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const fleetRange = dateRange(30);
      const today = startOfDay(new Date());
      const calendarFrom = today.toISOString().slice(0, 10);
      const calendarTo = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 10);

      const tasks: Array<Promise<void>> = [
        getDashboard().then((d) => { if (!cancelled) setDashboard(d); }).catch(() => {}),
        getOverdueRentals().then((d) => { if (!cancelled) setOverdue(d); }).catch(() => {}),
        getFleetUtilization(fleetRange.from, fleetRange.to).then((d) => { if (!cancelled) setFleet(d); }).catch(() => {}),
        getAccounts().then((d) => { if (!cancelled) setAccounts(d); }).catch(() => { if (!cancelled) setAccounts([]); }),
        getAccountBalances().then((d) => { if (!cancelled) setBalances(d); }).catch(() => { if (!cancelled) setBalances([]); }),
        adminApiClient
          .get('/rental-request', { params: { status: 'new', page: 1, limit: 5 } })
          .then((res) => {
            if (cancelled) return;
            setRequests(res.data.items ?? []);
            setRequestsTotal(res.data.total ?? 0);
          })
          .catch(() => {}),
        adminApiClient
          .get('/calendar', { params: { from: calendarFrom, to: calendarTo } })
          .then((res) => { if (!cancelled) setCalendarCars(res.data.cars ?? res.data ?? []); })
          .catch(() => {}),
      ];
      await Promise.allSettled(tasks);
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const trendPct = useMemo(() => {
    if (!dashboard) return 0;
    const prev = dashboard.revenueLastMonthMinor;
    const cur = dashboard.revenueThisMonthMinor;
    if (prev === 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
  }, [dashboard]);

  // Wallet cards = real account balances from /finance/account/balances.
  // We show up to 4 active accounts, sorted by their UAH-equivalent balance
  // (largest first) so the dashboard highlights the rails with the most cash.
  // Pocket total = sum of UAH-normalized balances across ALL active accounts —
  // this is genuine "cash on hand", NOT the monthly revenue (which has its own
  // KPI card). Historic bug: both used to display revenueThisMonthMinor.
  const walletCards = useMemo(() => {
    if (!accounts || !balances) return null;
    const byId = new Map(balances.map((b) => [b.accountId, b]));
    return accounts
      .filter((a) => a.isActive)
      .map((a) => {
        const b = byId.get(a.id);
        return {
          account: a,
          balance: b?.balance ?? 0,
          balanceUah: b?.balanceUah ?? 0,
        };
      })
      .sort((x, y) => y.balanceUah - x.balanceUah)
      .slice(0, 4);
  }, [accounts, balances]);

  const walletTotalUahMinor = useMemo(() => {
    if (!balances || !accounts) return 0;
    const activeIds = new Set(accounts.filter((a) => a.isActive).map((a) => a.id));
    return balances
      .filter((b) => activeIds.has(b.accountId))
      .reduce((sum, b) => sum + b.balanceUah, 0);
  }, [balances, accounts]);

  const walletChangePct = useMemo(() => {
    // Hero card's "delta" was previously tied to monthly revenue growth —
    // reuse trendPct (revenue this/last month %) as the wallet's trend hint
    // so the visual "↗ +X%" still carries the same business meaning.
    return trendPct;
  }, [trendPct]);

  const scheduleEvents = useMemo(() => {
    const events: ScheduleItem[] = [];
    for (const car of calendarCars ?? []) {
      for (const iv of car.intervals ?? []) {
        if (iv.type === 'service') continue;
        const start = new Date(iv.startDate);
        const end = iv.endDate ? new Date(iv.endDate) : null;
        const clientName = iv.clientName ?? '—';
        events.push({
          id: Number(`${iv.id}1`),
          type: 'pickup',
          time: formatTime(start),
          date: start,
          carBrand: car.brand,
          carModel: car.model,
          carPlate: car.plateNumber,
          clientName,
          source: iv.type,
        });
        if (end) {
          events.push({
            id: Number(`${iv.id}2`),
            type: 'return',
            time: formatTime(end),
            date: end,
            carBrand: car.brand,
            carModel: car.model,
            carPlate: car.plateNumber,
            clientName,
            source: iv.type,
          });
        }
      }
    }
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [calendarCars]);

  return (
    <div className="dh-root">
      <Header t={t} />

      <div className="dh-grid">
        <HeroCard
          t={t}
          cards={walletCards}
          totalUahMinor={walletTotalUahMinor}
          changePct={walletChangePct}
          loading={walletCards == null}
        />

        <ChartCard t={t} localeTag={localeTag} />

        <KpiRow t={t} dashboard={dashboard} trendPct={trendPct} overdueCount={overdue?.count ?? 0} />

        <OverdueCard
          t={t}
          localeTag={localeTag}
          overdue={overdue}
          canSee={hasPermission('rentals')}
        />

        <ScheduleCard t={t} events={scheduleEvents} loading={calendarCars.length === 0} />

        <ApplicationsCard
          t={t}
          requests={requests}
          totalNew={requestsTotal}
          canSee={hasPermission('requests')}
        />

        <FleetCard t={t} fleet={fleet} dashboard={dashboard} />
      </div>
    </div>
  );
}

/* ───────────── Header (greeting + quick actions) ───────────── */

function Header({ t }: { t: (k: string, p?: Record<string, string | number>) => string }) {
  return (
    <div className="dh-header">
      <div className="dh-greeting">
        {getGreeting(t)}, <span className="dh-greeting-name">REIZ</span>
      </div>
      <div className="dh-quick-actions">
        <Link href="/admin/rentals/new" className="dh-qa-btn primary">
          <QaPlus /> {t('dashboard.quickNewRental')}
        </Link>
        <Link href="/admin/reservations/new" className="dh-qa-btn">
          <QaBookmark /> {t('dashboard.quickNewBooking')}
        </Link>
        <Link href="/admin/clients/new" className="dh-qa-btn">
          <QaUsers /> {t('dashboard.quickNewClient')}
        </Link>
        <Link href="/admin/rentals" className="dh-qa-btn">
          <QaTransfer /> {t('dashboard.quickReturn')}
        </Link>
        <Link href="/admin/reports" className="dh-qa-btn">
          <QaChart /> {t('dashboard.quickReport')}
        </Link>
      </div>
    </div>
  );
}

/* ───────────── Hero (top cars stack + balance) ───────────── */

const CURRENCY_SYMBOL: Record<string, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
  ILS: '₪',
};

function formatAccountAmount(amountMinor: number, currency: string): string {
  const value = (amountMinor / 100).toLocaleString('uk-UA', { maximumFractionDigits: 0 });
  const symbol = CURRENCY_SYMBOL[currency] || currency;
  // USD/EUR: symbol before the number; UAH/ILS: after.
  if (currency === 'USD' || currency === 'EUR') return `${symbol} ${value}`;
  return `${value} ${symbol}`;
}

function HeroCard({
  t,
  cards,
  totalUahMinor,
  changePct,
  loading,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  cards: Array<{ account: Account; balance: number; balanceUah: number }> | null;
  totalUahMinor: number;
  changePct: number;
  loading: boolean;
}) {
  const displayCards = cards ?? [];
  // Preserve the 4-card stacked visual even when fewer active accounts exist —
  // pad with hidden placeholders so the SVG pocket above doesn't collapse.
  const cardSlots = Array.from({ length: 4 }, (_, i) => displayCards[i] ?? null);

  return (
    <section className="dh-hero">
      {/* ═══ Wallet: one card per active account, pocket total = sum of UAH-normalized balances ═══ */}
      <div className="dh-wallet">
        <div className="dh-wallet-cards">
          {cardSlots.map((slot, i) => {
            const slotClass = `dh-wcard dh-wcard-${4 - i}`;
            if (!slot) {
              return <div key={`empty-${i}`} className={slotClass} style={{ visibility: 'hidden' }} />;
            }
            return (
              <div key={slot.account.id} className={slotClass}>
                <span className="dh-wcard-name">{slot.account.name}</span>
                <span className="dh-wcard-amount">
                  {formatAccountAmount(slot.balance, slot.account.currency)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pocket — SVG background auto-stretches; content in natural flow determines height */}
        <div className="dh-wallet-pocket">
          <svg className="dh-wallet-pocket-bg" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M 22 0 L 120 0 C 160 0 160 32 200 32 C 240 32 240 0 280 0 L 378 0 C 390 0 400 7 400 16 L 400 160 L 0 160 L 0 16 C 0 7 10 0 22 0 Z"
              fill="var(--dh-surface)"
            />
          </svg>
          <div className="dh-wallet-pocket-content">
            <div className="dh-wallet-top">
              <div className="dh-wallet-count">
                {t('dashboard.walletCountBadge', { n: displayCards.length })}
              </div>
              <Link href="/admin/finance" className="dh-wallet-add" aria-label={t('dashboard.quickNewRental')}>
                <QaPlus />
              </Link>
            </div>
            <div className="dh-wallet-info">
              <div className="dh-wallet-label">
                {t('dashboard.walletBalanceLabel')}
                {changePct !== 0 && (
                  <span className="dh-wallet-delta">
                    {changePct > 0 ? '↗' : '↘'} {changePct > 0 ? '+' : ''}{changePct}%
                  </span>
                )}
              </div>
              <div className="dh-wallet-total">
                {loading
                  ? <span className="dh-skel" style={{ display: 'inline-block', width: 140, height: 22 }} />
                  : fmtMoneyUAH(totalUahMinor)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Chart card (this month vs last) ───────────── */

function ChartCard({ t, localeTag }: { t: (k: string, p?: Record<string, string | number>) => string; localeTag: string }) {
  const [period, setPeriod] = useState<Period>('30d');
  const [data, setData] = useState<RevenueData | null>(null);
  const [prev, setPrev] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const days = PERIOD_DAYS[period];
    const range = dateRange(days);
    // Previous period of equal length, ending day before current "from"
    const prevTo = new Date(range.from);
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - days);
    const prevRange = {
      from: prevFrom.toISOString().slice(0, 10),
      to: prevTo.toISOString().slice(0, 10),
    };
    Promise.all([
      getRevenue(range.from, range.to).catch(() => null),
      getRevenue(prevRange.from, prevRange.to).catch(() => null),
    ]).then(([cur, p]) => {
      if (cancelled) return;
      setData(cur);
      setPrev(p);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [period]);

  const w = 720;
  const h = 200;
  const pad = 16;

  const current = useMemo(() => (data?.daily ?? []).map((x) => x.income), [data]);
  const last = useMemo(() => {
    const arr = (prev?.daily ?? []).map((x) => x.income);
    if (arr.length === current.length) return arr;
    if (arr.length === 0) return current.map(() => 0);
    // Resample to current length so charts align
    const resampled: number[] = [];
    for (let i = 0; i < current.length; i++) {
      const idx = Math.min(arr.length - 1, Math.round((i / Math.max(1, current.length - 1)) * (arr.length - 1)));
      resampled.push(arr[idx]);
    }
    return resampled;
  }, [prev, current]);

  const max = Math.max(1, ...current, ...last) * 1.1;
  const px = (i: number) => pad + (i / Math.max(1, current.length - 1)) * (w - pad * 2);
  const py = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const toPath = (arr: number[]) => {
    if (arr.length === 0) return '';
    let d = `M${px(0)} ${py(arr[0])}`;
    for (let i = 1; i < arr.length; i++) {
      const x0 = px(i - 1);
      const y0 = py(arr[i - 1]);
      const x1 = px(i);
      const y1 = py(arr[i]);
      const cx = (x0 + x1) / 2;
      d += ` C${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };

  const curPath = toPath(current);
  const lastPath = toPath(last);
  const curArea = current.length
    ? `${curPath} L${px(current.length - 1)} ${h - pad} L${px(0)} ${h - pad} Z`
    : '';

  const currentSum = data?.totalIncome ?? 0;
  const lastSum = prev?.totalIncome ?? 0;
  const growth = lastSum === 0 ? (currentSum > 0 ? 100 : 0) : Math.round(((currentSum - lastSum) / lastSum) * 100);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (current.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    const i = Math.max(0, Math.min(current.length - 1, Math.round(((x - pad) / (w - pad * 2)) * (current.length - 1))));
    setHover(i);
  };

  const xLabels = useMemo(() => {
    if (!data?.daily?.length) return [];
    const days = data.daily;
    const positions = [0, Math.floor(days.length * 0.25), Math.floor(days.length * 0.5), Math.floor(days.length * 0.75), days.length - 1];
    return positions.map((i) => formatLocaleDate(localeTag, days[i].date, { day: 'numeric', month: 'short' }));
  }, [data, localeTag]);

  return (
    <section className="dh-card dh-chart-card">
      <div className="dh-chart-head">
        <div>
          <div className="dh-card-title">{t('dashboard.revenueTitle')}</div>
          <div className="dh-chart-legend">
            <span className="dh-chart-legend-item">
              <span className="dh-dot" style={{ background: 'var(--dh-accent)' }} /> {t('dashboard.chartThisMonth')}
            </span>
            <span className="dh-chart-legend-item">
              <span className="dh-dot" style={{ background: 'var(--c-warning)' }} /> {t('dashboard.chartLastMonth')}
            </span>
          </div>
        </div>
        <div className="dh-chart-range">
          {(['7d', '30d', '90d'] as const).map((k) => (
            <button key={k} className={period === k ? 'active' : ''} onClick={() => setPeriod(k)} type="button">
              {t(k === '7d' ? 'dashboard.period7d' : k === '30d' ? 'dashboard.period30d' : 'dashboard.period90d')}
            </button>
          ))}
        </div>
      </div>

      <div className="dh-chart-totals">
        <div className="dh-chart-total current">
          <div className="label">{t('dashboard.chartThisMonth')}</div>
          <div className="value">{loading ? '—' : fmtMoneyUAH(currentSum)}</div>
        </div>
        <div className="dh-chart-total last">
          <div className="label">{t('dashboard.chartLastMonth')}</div>
          <div className="value">{loading ? '—' : fmtMoneyUAH(lastSum)}</div>
        </div>
        <div className="dh-chart-total">
          <div className="label">{t('dashboard.chartGrowth')}</div>
          <div className="value" style={{ color: growth >= 0 ? 'var(--dh-success)' : 'var(--dh-danger)' }}>
            {growth >= 0 ? '+' : ''}{growth}%
          </div>
        </div>
      </div>

      <div className="dh-chart-svg-wrap">
        {current.length > 0 ? (
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block' }}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="dhCurFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--dh-accent)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--dh-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((tt) => (
              <line
                key={tt}
                x1={pad}
                x2={w - pad}
                y1={pad + tt * (h - pad * 2)}
                y2={pad + tt * (h - pad * 2)}
                stroke="var(--dh-bg-subtle)"
                strokeDasharray="2 4"
              />
            ))}
            <path d={curArea} fill="url(#dhCurFill)" />
            <path d={lastPath} fill="none" stroke="var(--c-warning)" strokeWidth={2.5} strokeLinecap="round" />
            <path d={curPath} fill="none" stroke="var(--dh-accent)" strokeWidth={2.5} strokeLinecap="round" />
            {hover !== null && (
              <>
                <line x1={px(hover)} x2={px(hover)} y1={pad} y2={h - pad} stroke="var(--dh-text-dim)" strokeDasharray="3 3" />
                <circle cx={px(hover)} cy={py(last[hover])} r={4} fill="var(--dh-surface)" stroke="var(--c-warning)" strokeWidth={2} />
                <circle cx={px(hover)} cy={py(current[hover])} r={5} fill="var(--dh-surface)" stroke="var(--dh-accent)" strokeWidth={2.5} />
              </>
            )}
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--dh-text-dim)', fontSize: 13 }}>
            {loading ? '…' : t('dashboard.noDataForPeriod')}
          </div>
        )}
        {hover !== null && current.length > 0 && (
          <div
            className="dh-chart-tooltip"
            style={{
              left: `${(px(hover) / w) * 100}%`,
              top: `${(py(Math.max(current[hover], last[hover])) / h) * 100}%`,
            }}
          >
            <div className="tt-col">
              <div className="tt-label">
                <span className="dh-dot" style={{ background: 'var(--dh-accent)' }} />
                {t('dashboard.chartThisMonth')}
              </div>
              <div className="tt-val">{fmtMoneyUAH(current[hover])}</div>
            </div>
            <div className="tt-col">
              <div className="tt-label">
                <span className="dh-dot" style={{ background: 'var(--c-warning)' }} />
                {t('dashboard.chartLastMonth')}
              </div>
              <div className="tt-val">{fmtMoneyUAH(last[hover])}</div>
            </div>
          </div>
        )}
      </div>
      {xLabels.length > 0 && (
        <div className="dh-chart-x-axis">
          {xLabels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </section>
  );
}

/* ───────────── KPI row ───────────── */

function KpiRow({
  t,
  dashboard,
  trendPct,
  overdueCount,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  dashboard: DashboardData | null;
  trendPct: number;
  overdueCount: number;
}) {
  const skel = (w: number) => <span className="dh-skel" style={{ display: 'inline-block', width: w, height: 32 }} />;
  return (
    <div className="dh-kpi-row">
      <div className="dh-kpi">
        <div className="dh-kpi-head">
          <span className="dh-kpi-label">{t('dashboard.monthRevenue')}</span>
          <span className="dh-kpi-icon accent"><DollarSign /></span>
        </div>
        <div className="dh-kpi-value">
          {dashboard ? fmtMoneyUAH(dashboard.revenueThisMonthMinor) : skel(160)}
        </div>
        <div className="dh-kpi-foot">
          {trendPct !== 0 && (
            <span className={`dh-kpi-delta ${trendPct > 0 ? 'up' : 'down'}`}>
              {trendPct > 0 ? <ArrowUpRight /> : <ArrowDownRight />}
              {trendPct > 0 ? '+' : ''}{trendPct}%
            </span>
          )}
          {t('dashboard.kpiVsLastMonth')}
        </div>
      </div>

      <div className="dh-kpi">
        <div className="dh-kpi-head">
          <span className="dh-kpi-label">{t('dashboard.activeRentals')}</span>
          <span className="dh-kpi-icon success"><Key /></span>
        </div>
        <div className="dh-kpi-value">{dashboard ? dashboard.activeRentals : skel(60)}</div>
        <div className="dh-kpi-foot">{t('dashboard.kpiVsYesterday')}</div>
      </div>

      <div className="dh-kpi">
        <div className="dh-kpi-head">
          <span className="dh-kpi-label">{t('dashboard.fleetLoad')}</span>
          <span className="dh-kpi-icon warning"><CarIcon /></span>
        </div>
        <div className="dh-kpi-value">
          {dashboard ? <>{dashboard.fleetUtilizationPercent}<span className="unit">%</span></> : skel(80)}
        </div>
        <div className="dh-kpi-foot">{t('dashboard.kpiPerWeek')}</div>
      </div>

      <div className="dh-kpi">
        <div className="dh-kpi-head">
          <span className="dh-kpi-label">{t('dashboard.overdue')}</span>
          <span className="dh-kpi-icon danger"><TriangleAlert /></span>
        </div>
        <div className="dh-kpi-value">{overdueCount}</div>
        <div className="dh-kpi-foot">{t('dashboard.kpiAttention')}</div>
      </div>
    </div>
  );
}

/* ───────────── Overdue ───────────── */

function OverdueCard({
  t,
  localeTag,
  overdue,
  canSee,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  localeTag: string;
  overdue: OverdueData | null;
  canSee: boolean;
}) {
  const items = overdue?.items ?? [];
  const count = overdue?.count ?? 0;
  return (
    <section className="dh-card dh-overdue-card">
      <div className="dh-card-header">
        <div>
          <div className="dh-card-title">{t('dashboard.overdueTitle')}</div>
          <div className="dh-card-subtitle">{t('dashboard.overdueSubtitle')}</div>
        </div>
        {count > 0 && <span className="dh-badge danger">{count}</span>}
      </div>

      {items.length === 0 ? (
        <div className="dh-empty">{t('dashboard.noOverdue')}</div>
      ) : (
        <>
          <div className="dh-list">
            {items.slice(0, 3).map((it) => (
              <Link key={it.id} href={canSee ? `/admin/rentals/${it.id}` : '#'} className="dh-list-item">
                <div className="dh-list-avatar" style={{ background: 'var(--dh-danger-soft)', color: 'var(--dh-danger)' }}>
                  <CarIcon />
                </div>
                <div className="dh-list-main">
                  <div className="dh-list-title">
                    {it.car.brand ?? '—'} {it.car.model ?? ''}
                  </div>
                  <div className="dh-list-sub">
                    <span>{it.client.firstName} {it.client.lastName}</span>
                    <span className="dh-list-sub-dot" />
                    <span>{formatLocaleDate(localeTag, it.returnDate, { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <div className="dh-list-end">
                  <span className="dh-badge danger">+{t('dashboard.overdueDays', { days: it.overdueDays })}</span>
                  {it.client.phone && <div className="dh-list-end-sub">{it.client.phone}</div>}
                </div>
              </Link>
            ))}
          </div>
          {count > 3 && (
            <Link href="/admin/rentals" className="dh-qa-btn" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              <Phone /> {t('dashboard.overdueContactAll')}
            </Link>
          )}
        </>
      )}
    </section>
  );
}

/* ───────────── Schedule ───────────── */

function ScheduleCard({
  t,
  events,
  loading,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  events: ScheduleItem[];
  loading: boolean;
}) {
  const [tab, setTab] = useState<'today' | 'tomorrow'>('today');
  const today = startOfDay(new Date());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const target = tab === 'today' ? today : tomorrow;
  const data = events.filter((e) => isSameLocalDay(e.date, target));

  return (
    <section className="dh-card dh-schedule-card">
      <div className="dh-card-header">
        <div>
          <div className="dh-card-title">{t('dashboard.scheduleTitle')}</div>
          <div className="dh-card-subtitle">{t('dashboard.scheduleEvents', { n: data.length })}</div>
        </div>
        <div className="dh-schedule-tabs">
          <button type="button" className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>
            {t('dashboard.scheduleToday')}
          </button>
          <button type="button" className={tab === 'tomorrow' ? 'active' : ''} onClick={() => setTab('tomorrow')}>
            {t('dashboard.scheduleTomorrow')}
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="dh-empty">{loading ? '…' : t('dashboard.scheduleEmpty')}</div>
      ) : (
        <div className="dh-schedule-table">
          <div className="dh-schedule-row dh-schedule-head">
            <div>{t('dashboard.scheduleColTime')}</div>
            <div>{t('dashboard.scheduleColType')}</div>
            <div>{t('dashboard.scheduleColCar')}</div>
            <div>{t('dashboard.scheduleColClient')}</div>
            <div className="dh-schedule-end">{t('dashboard.scheduleColLocation')}</div>
          </div>
          {data.slice(0, 6).map((r) => (
            <div key={r.id} className="dh-schedule-row">
              <div className="dh-schedule-time">{r.time}</div>
              <div>
                <span className={`dh-badge ${r.type === 'pickup' ? 'accent' : 'success'}`}>
                  {r.type === 'pickup' ? t('dashboard.schedulePickup') : t('dashboard.scheduleReturn')}
                </span>
              </div>
              <div className="dh-schedule-car">
                <span>{r.carBrand ?? '—'} {r.carModel ?? ''}</span>
                {r.carPlate && <span className="dh-schedule-car-plate">{r.carPlate}</span>}
              </div>
              <div className="dh-schedule-client">{r.clientName}</div>
              <div className="dh-schedule-client dh-schedule-end">
                {r.source === 'rental' ? t('nav.rentals') : t('nav.reservations')}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────── Applications ───────────── */

function ApplicationsCard({
  t,
  requests,
  totalNew,
  canSee,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  requests: RecentRequest[];
  totalNew: number;
  canSee: boolean;
}) {
  return (
    <section className="dh-card dh-applications-card">
      <div className="dh-card-header">
        <div>
          <div className="dh-card-title">{t('dashboard.applicationsTitle')}</div>
          <div className="dh-card-subtitle">{t('dashboard.applicationsSubtitle', { n: totalNew })}</div>
        </div>
        {canSee && (
          <Link href="/admin/requests" className="dh-card-link">
            {t('dashboard.applicationsViewAll')} <ArrowRight />
          </Link>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="dh-empty">{t('dashboard.applicationsEmpty')}</div>
      ) : (
        requests.map((r, idx) => {
          const first = r.client?.firstName ?? r.firstName ?? '';
          const last = r.client?.lastName ?? r.lastName ?? '';
          const name = `${first} ${last}`.trim() || `#${r.id}`;
          const subParts: string[] = [];
          if (r.car) subParts.push(`${r.car.brand} ${r.car.model}`);
          if (r.pickupDate && r.returnDate) {
            subParts.push(t('dashboard.overdueDays', { days: daysBetween(new Date(r.pickupDate), new Date(r.returnDate)) }));
          }
          return (
            <div key={r.id} className="dh-app-row">
              <div className="dh-app-avatar">{getInitials(first, last)}</div>
              <div className="dh-app-main">
                <div className="dh-app-top">
                  <span className="dh-app-name">{name}</span>
                  {idx === 0 && <span className="dh-badge accent">{t('dashboard.applicationsBadgeNew')}</span>}
                </div>
                <div className="dh-app-sub">{subParts.join(' · ') || '—'}</div>
              </div>
              {canSee && (
                <div className="dh-app-actions">
                  <Link href={`/admin/requests/${r.id}`} className="dh-app-btn accept" title={t('dashboard.applicationsAccept')}>
                    <Check />
                  </Link>
                  <Link href={`/admin/requests/${r.id}`} className="dh-app-btn reject" title={t('dashboard.applicationsReject')}>
                    <X />
                  </Link>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  );
}

/* ───────────── Fleet ───────────── */

function FleetCard({
  t,
  fleet,
  dashboard,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  fleet: FleetUtilizationData | null;
  dashboard: DashboardData | null;
}) {
  const items = useMemo(() => {
    const cars = fleet?.cars ?? [];
    return cars
      .slice()
      .sort((a, b) => b.utilizationPercent - a.utilizationPercent)
      .slice(0, 5);
  }, [fleet]);

  const pct = dashboard?.fleetUtilizationPercent ?? fleet?.averageUtilizationPercent ?? 0;
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  const totalCars = dashboard?.totalCars ?? items.length;
  const rented = Math.max(0, totalCars - (dashboard?.totalCarsAvailable ?? 0));

  return (
    <section className="dh-card dh-fleet-card">
      <div className="dh-card-header">
        <div>
          <div className="dh-card-title">{t('dashboard.fleetTitle')}</div>
          <div className="dh-card-subtitle">{t('dashboard.fleetByCategory')}</div>
        </div>
      </div>

      <div className="dh-fleet-ring-row">
        <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--dh-bg-subtle)" strokeWidth="12" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="var(--dh-accent)"
            strokeWidth="12"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dasharray 400ms' }}
          />
        </svg>
        <div className="dh-fleet-summary">
          <div className="dh-fleet-percent">
            {pct}<span className="unit">%</span>
          </div>
          <div className="dh-fleet-label">{t('dashboard.fleetTotalLoad')}</div>
          <div className="dh-fleet-meta">
            {t('dashboard.fleetCarsRented', { rented, total: totalCars })}
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="dh-fleet-list">
          {items.map((it) => (
            <div key={it.carId} className="dh-fleet-item">
              <div className="dh-fleet-item-name">{it.brand ?? ''} {it.model ?? ''}</div>
              <div className="dh-fleet-item-bar">
                <div className="dh-fleet-item-bar-fill" style={{ width: `${it.utilizationPercent}%` }} />
              </div>
              <div className="dh-fleet-item-pct">{it.utilizationPercent}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dh-empty">{t('dashboard.fleetEmpty')}</div>
      )}
    </section>
  );
}
