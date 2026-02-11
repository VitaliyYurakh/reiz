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
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">
        {new Date(label).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
      </p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatMoney(entry.value)}
        </p>
      ))}
    </div>
  );
}

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };

export function RevenueChart() {
  const { theme } = useAdminTheme();
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

  return (
    <div className="ios-card !py-3 flex flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-card-foreground">Доход</p>
        <div className="flex items-center gap-2">
          <div className="ios-segmented">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`ios-segment ${period === p ? 'ios-segment-active' : ''}`}
              >
                {p === '7d' ? '7 дн' : p === '30d' ? '30 дн' : '90 дн'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary pills */}
      {data && !loading && (
        <div className="mb-2 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#EFF6FF', color: isDark ? '#60A5FA' : '#1D4ED8' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
            Доход: {formatMoney(data.totalIncome)}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', color: isDark ? '#FCA5A5' : '#B91C1C' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            Расходы: {formatMoney(data.totalExpense)}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4', color: isDark ? '#4ADE80' : '#15803D' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            Чистыми: {formatMoney(data.net)}
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="h-[230px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : !data || data.daily.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Download className="h-8 w-8" />
            <p className="text-sm">Нет данных за этот период</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2D3748' : '#E5E5EA'} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: isDark ? '#718096' : '#8E8E93' }}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
                }
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: isDark ? '#718096' : '#8E8E93' }}
                tickFormatter={(v) => `${(v / 100).toLocaleString('uk-UA')}₴`}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#007AFF"
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name="Доход"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FF3B30"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="4 4"
                name="Расходы"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
