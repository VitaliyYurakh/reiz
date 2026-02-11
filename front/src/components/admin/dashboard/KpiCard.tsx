'use client';

import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

const ICON_BG_MAP: Record<string, { light: string; dark: string }> = {
  'bg-blue-50': { light: '#EFF6FF', dark: 'rgba(59,130,246,0.15)' },
  'bg-green-50': { light: '#F0FDF4', dark: 'rgba(34,197,94,0.15)' },
  'bg-purple-50': { light: '#FAF5FF', dark: 'rgba(168,85,247,0.15)' },
  'bg-red-50': { light: '#FEF2F2', dark: 'rgba(239,68,68,0.15)' },
};

const ICON_COLOR_MAP: Record<string, { light: string; dark: string }> = {
  'text-blue-600': { light: '#2563EB', dark: '#60A5FA' },
  'text-green-600': { light: '#16A34A', dark: '#4ADE80' },
  'text-purple-600': { light: '#9333EA', dark: '#C084FC' },
  'text-red-600': { light: '#DC2626', dark: '#FCA5A5' },
};

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function KpiCard({ title, value, icon: Icon, iconColor, iconBg, trend }: KpiCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const bgEntry = ICON_BG_MAP[iconBg];
  const colorEntry = ICON_COLOR_MAP[iconColor];
  const resolvedBg = bgEntry ? (isDark ? bgEntry.dark : bgEntry.light) : undefined;
  const resolvedColor = colorEntry ? (isDark ? colorEntry.dark : colorEntry.light) : undefined;

  return (
    <div className="ios-card flex items-start gap-3 !py-3 transition-shadow duration-150 hover:shadow-md">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${!bgEntry ? iconBg : ''}`}
        style={bgEntry ? { backgroundColor: resolvedBg } : undefined}
      >
        <Icon
          className={`h-5 w-5 ${!colorEntry ? iconColor : ''}`}
          style={colorEntry ? { color: resolvedColor } : undefined}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-xl font-bold leading-tight text-card-foreground">{value}</p>
        {trend && (
          <div className="mt-1 flex items-center gap-1">
            {trend.value > 0 ? (
              <span
                className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4',
                  color: isDark ? '#4ADE80' : '#15803D',
                }}
              >
                <TrendingUp className="h-3 w-3" />
                +{trend.value}%
              </span>
            ) : trend.value < 0 ? (
              <span
                className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2',
                  color: isDark ? '#FCA5A5' : '#B91C1C',
                }}
              >
                <TrendingDown className="h-3 w-3" />
                {trend.value}%
              </span>
            ) : (
              <span
                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: isDark ? 'rgba(156,163,175,0.15)' : '#F3F4F6',
                  color: isDark ? '#9CA3AF' : '#6B7280',
                }}
              >
                0%
              </span>
            )}
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
