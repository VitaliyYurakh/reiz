'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { getRevenue, type RevenueData } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';

type Period = '7d' | '30d' | '90d';

function getDateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

function formatMoney(minor: number) {
  return `${(minor / 100).toLocaleString('uk-UA')} грн`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <p className="mb-1 text-xs text-muted-foreground">
        {new Date(label).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
      </p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-sm font-medium text-foreground">
          <span className="text-muted-foreground">{entry.name}:</span>{' '}
          {formatMoney(entry.value)}
        </p>
      ))}
    </div>
  );
}

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };

export function RevenueChart() {
  const { theme } = useAdminTheme();
  const { t } = useAdminLocale();
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<Period>('30d');
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const range = getDateRange(PERIOD_DAYS[p]);
      const result = await getRevenue(range.from, range.to);
      setData(result);
    } catch (err) {
      console.error('Revenue fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const periodLabels: Record<Period, string> = {
    '7d': t('dashboard.period7d'),
    '30d': t('dashboard.period30d'),
    '90d': t('dashboard.period90d'),
  };

  const incomeColor = isDark ? '#34D399' : '#059669'; // emerald-400 / emerald-600
  const expenseColor = isDark ? '#FB7185' : '#E11D48'; // rose-400 / rose-600
  const gridColor = isDark ? '#2D3748' : '#E5E5EA';
  const mutedColor = isDark ? '#718096' : '#8E8E93';

  return (
    <div className="ios-card flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{t('dashboard.revenueTitle')}</p>
        <div className="ios-segmented">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`ios-segment ${period === p ? 'ios-segment-active' : ''}`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {data && !loading && (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">{t('dashboard.incomeLabel')}:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatMoney(data.totalIncome)}
            </span>
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-rose-500" />
            <span className="text-muted-foreground">{t('dashboard.expenseLabel')}:</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
              {formatMoney(data.totalExpense)}
            </span>
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-foreground" />
            <span className="text-muted-foreground">{t('dashboard.netLabel')}:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatMoney(data.net)}
            </span>
          </span>
        </div>
      )}

      <div className="mt-3 h-[230px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        ) : !data || data.daily.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Download className="h-5 w-5" />
            <p className="text-sm">{t('dashboard.noDataForPeriod')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={incomeColor} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={incomeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: mutedColor }}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
                }
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: mutedColor }}
                tickFormatter={(v) => `${(v / 100).toLocaleString('uk-UA')}₴`}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke={incomeColor}
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name={t('dashboard.incomeLabel')}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke={expenseColor}
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="4 4"
                name={t('dashboard.expenseLabel')}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
