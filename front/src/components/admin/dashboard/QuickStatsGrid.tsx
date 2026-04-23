'use client';

import { CalendarCheck, FileText, CheckCircle, Users, type LucideIcon } from 'lucide-react';
import type { DashboardData } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';

interface QuickStatsGridProps {
  data: DashboardData;
}

const statKeys: Array<{
  key: keyof DashboardData;
  titleKey: string;
  icon: LucideIcon;
}> = [
  { key: 'confirmedReservations', titleKey: 'dashboard.confirmedReservations', icon: CalendarCheck },
  { key: 'newRequestsThisMonth', titleKey: 'dashboard.requestsThisMonth', icon: FileText },
  { key: 'completedRentalsThisMonth', titleKey: 'dashboard.completedRentals', icon: CheckCircle },
  { key: 'totalClients', titleKey: 'dashboard.totalClients', icon: Users },
];

export function QuickStatsGrid({ data }: QuickStatsGridProps) {
  const { t } = useAdminLocale();

  return (
    <div className="ios-card">
      <p className="text-sm font-semibold text-foreground">{t('dashboard.statsTitle')}</p>
      <div className="mt-4 divide-y divide-border/50">
        {statKeys.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key as string} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{t(s.titleKey)}</span>
              </div>
              <span className="text-lg font-semibold text-foreground tabular-nums">
                {data[s.key] as number}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
