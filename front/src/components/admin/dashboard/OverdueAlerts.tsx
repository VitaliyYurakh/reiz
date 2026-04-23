'use client';

import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { OverdueData } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';

interface OverdueAlertsProps {
  data: OverdueData | null;
}

export function OverdueAlerts({ data }: OverdueAlertsProps) {
  const { t } = useAdminLocale();
  const count = data?.count ?? 0;
  const items = data?.items ?? [];

  return (
    <div className="ios-card flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{t('dashboard.overdueTitle')}</p>
        {count > 0 && (
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground tabular-nums">
            {count}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-1.5 py-6 text-center">
          <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{t('dashboard.noOverdue')}</p>
          <p className="text-xs text-muted-foreground">{t('dashboard.allRentalsOk')}</p>
        </div>
      ) : (
        <div className="mt-3 flex-1 divide-y divide-border/50">
          {items.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.car.brand} {item.car.model}
                    {item.car.plateNumber && (
                      <span className="ml-1.5 text-muted-foreground">{item.car.plateNumber}</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.client.firstName} {item.client.lastName}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                {t('dashboard.overdueDays', { days: String(item.overdueDays) })}
              </span>
            </div>
          ))}
          {count > 5 && (
            <a
              href="/admin/rentals"
              className="block pt-3 text-center text-xs font-medium text-primary hover:underline"
            >
              {t('dashboard.showAll', { count: String(count) })}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
