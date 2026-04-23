'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  getDashboard,
  getOverdueRentals,
  type DashboardData,
  type OverdueData,
} from '@/lib/api/admin';
import { RevenueChart, FleetUtilizationChart, DashboardSkeleton } from '@/components/admin/dashboard';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { fmtMoneyUAH as formatMoney } from '@/app/admin/lib/format';

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function DashboardPage() {
  const { t, locale } = useAdminLocale();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [overdue, setOverdue] = useState<OverdueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getDashboard(), getOverdueRentals()])
      .then(([dashRes, overdueRes]) => {
        if (dashRes.status === 'fulfilled') setDashboard(dashRes.value);
        if (overdueRes.status === 'fulfilled') setOverdue(overdueRes.value);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!dashboard) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-foreground">{t('dashboard.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('dashboard.errorLoading')}</p>
      </div>
    );
  }

  const trend = calcTrend(dashboard.revenueThisMonthMinor, dashboard.revenueLastMonthMinor);
  const overdueCount = overdue?.count ?? 0;
  const overdueItems = overdue?.items ?? [];
  const localeTag =
    locale === 'en' ? 'en-US' :
    locale === 'pl' ? 'pl-PL' :
    locale === 'ro' ? 'ro-RO' :
    locale === 'ru' ? 'ru-RU' :
    'uk-UA';
  const fmtShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString(localeTag, {day: 'numeric', month: 'short'});

  return (
    <div className="space-y-3">
      {/* ── KPI strip: 4 uniform tight cards ────────────── */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Kpi label={t('dashboard.monthRevenue')} value={formatMoney(dashboard.revenueThisMonthMinor)} trend={trend} />
        <Kpi label={t('dashboard.activeRentals')} value={dashboard.activeRentals} />
        <Kpi label={t('dashboard.fleetLoad')} value={`${dashboard.fleetUtilizationPercent}%`} />
        <Kpi label={t('dashboard.overdue')} value={overdueCount} tone={overdueCount > 0 ? 'warning' : 'default'} />
      </div>

      {/* ── Chart + overdue side-by-side ────────────────── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <RevenueChart />

        <div className="ios-card flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t('dashboard.overdueTitle')}</p>
            {overdueCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                {overdueCount}
              </span>
            )}
          </div>

          {overdueCount === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">{t('dashboard.noOverdue')}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t('dashboard.allRentalsOk')}</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border/50">
              {overdueItems.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/rentals/${item.id}`}
                    style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 8, rowGap: 4, padding: '12px 4px', borderRadius: 6}}
                    className="transition-colors hover:bg-background/70"
                  >
                    <span
                      className="text-sm font-medium text-foreground"
                      style={{minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                    >
                      {item.car.brand} {item.car.model}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                      +{item.overdueDays} дн.
                    </span>

                    <span
                      className="text-xs text-muted-foreground"
                      style={{minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                    >
                      {item.client.firstName} {item.client.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {fmtShortDate(item.returnDate)}
                    </span>
                  </Link>
                </li>
              ))}
              {overdueCount > 5 && (
                <li className="pt-1">
                  <Link
                    href="/admin/rentals"
                    className="block text-center text-xs font-medium text-primary hover:underline"
                  >
                    {t('dashboard.showAll', { count: String(overdueCount) })}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* ── Fleet utilization — full width ────────────── */}
      <FleetUtilizationChart />

      {/* ── Month summary — single compact line ───────── */}
      <div className="ios-card !py-3">
        <div className="flex flex-wrap items-center justify-around gap-x-6 gap-y-2 text-sm">
          <SummaryItem label={t('dashboard.confirmedReservations')} value={dashboard.confirmedReservations} />
          <SummaryItem label={t('dashboard.requestsThisMonth')} value={dashboard.newRequestsThisMonth} />
          <SummaryItem label={t('dashboard.completedRentals')} value={dashboard.completedRentalsThisMonth} />
          <SummaryItem label={t('dashboard.totalClients')} value={dashboard.totalClients} />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Single-row KPI card: fixed height, label on line 1,
// value (+ optional trend) on line 2. No hints, no wraps.
// ──────────────────────────────────────────────────────
function Kpi({
  label,
  value,
  trend,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  trend?: number;
  tone?: 'default' | 'warning';
}) {
  const valueTone = tone === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground';
  return (
    <div className="ios-card !py-3">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className={`text-xl font-semibold leading-none tabular-nums ${valueTone}`}>{value}</p>
        {trend !== undefined && trend !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
