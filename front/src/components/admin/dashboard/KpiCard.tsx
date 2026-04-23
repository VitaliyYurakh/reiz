'use client';

import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  // kept for API-compat with existing callers; ignored in new design
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
  accent?: 'default' | 'warning';
}

export function KpiCard({ title, value, icon: Icon, trend, accent = 'default' }: KpiCardProps) {
  const valueTone =
    accent === 'warning'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-foreground';

  return (
    <div className="ios-card !py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <p className={`mt-2 text-2xl font-semibold leading-tight ${valueTone}`}>
        {value}
      </p>
      {trend && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trend.value > 0 ? (
            <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
              <TrendingUp className="h-3 w-3" />+{trend.value}%
            </span>
          ) : trend.value < 0 ? (
            <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
              <TrendingDown className="h-3 w-3" />
              {trend.value}%
            </span>
          ) : null}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
