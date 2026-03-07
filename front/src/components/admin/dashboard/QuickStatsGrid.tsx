'use client';

import { CalendarCheck, FileText, CheckCircle, Users } from 'lucide-react';
import type { DashboardData } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';

interface QuickStatsGridProps {
  data: DashboardData;
}

const statKeys = [
  {
    key: 'confirmedReservations' as const,
    titleKey: 'dashboard.confirmedReservations',
    icon: CalendarCheck,
    lightColor: '#2563EB', darkColor: '#60A5FA',
    lightBg: '#EFF6FF', darkBg: 'rgba(59,130,246,0.15)',
  },
  {
    key: 'newRequestsThisMonth' as const,
    titleKey: 'dashboard.requestsThisMonth',
    icon: FileText,
    lightColor: '#EA580C', darkColor: '#FB923C',
    lightBg: '#FFF7ED', darkBg: 'rgba(234,88,12,0.15)',
  },
  {
    key: 'completedRentalsThisMonth' as const,
    titleKey: 'dashboard.completedRentals',
    icon: CheckCircle,
    lightColor: '#16A34A', darkColor: '#4ADE80',
    lightBg: '#F0FDF4', darkBg: 'rgba(34,197,94,0.15)',
  },
  {
    key: 'totalClients' as const,
    titleKey: 'dashboard.totalClients',
    icon: Users,
    lightColor: '#9333EA', darkColor: '#C084FC',
    lightBg: '#FAF5FF', darkBg: 'rgba(168,85,247,0.15)',
  },
] as const;

export function QuickStatsGrid({ data }: QuickStatsGridProps) {
  const { theme } = useAdminTheme();
  const { t } = useAdminLocale();
  const isDark = theme === 'dark';

  return (
    <div className="ios-card !py-3">
      <p className="mb-2 text-sm font-semibold text-card-foreground">{t('dashboard.statsTitle')}</p>
      <div className="grid grid-cols-2 gap-2">
        {statKeys.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="flex items-center gap-2.5 rounded-xl bg-background p-2.5"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: isDark ? s.darkBg : s.lightBg }}
              >
                <Icon className="h-4 w-4" style={{ color: isDark ? s.darkColor : s.lightColor }} />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-card-foreground">{data[s.key]}</p>
                <p className="text-[11px] text-muted-foreground">{t(s.titleKey)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
