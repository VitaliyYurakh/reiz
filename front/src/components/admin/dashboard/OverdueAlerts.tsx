'use client';

import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import type { OverdueData } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface OverdueAlertsProps {
  data: OverdueData | null;
}

export function OverdueAlerts({ data }: OverdueAlertsProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const count = data?.count ?? 0;
  const items = data?.items ?? [];

  return (
    <div className="ios-card !py-3 flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-card-foreground">Просроченные аренды</p>
        {count > 0 && (
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2',
              color: isDark ? '#FCA5A5' : '#B91C1C',
            }}
          >
            {count}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-4 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4' }}
          >
            <CheckCircle2 className="h-6 w-6" style={{ color: isDark ? '#4ADE80' : '#16A34A' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: isDark ? '#4ADE80' : '#15803D' }}>Нет просроченных</p>
          <p className="text-xs text-muted-foreground">Все аренды в порядке</p>
        </div>
      ) : (
        <div className="flex-1 space-y-2">
          {items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(254,226,226,0.5)' }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : '#FEE2E2' }}
              >
                <AlertTriangle className="h-4 w-4" style={{ color: isDark ? '#FCA5A5' : '#DC2626' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">
                  {item.car.brand} {item.car.model}
                  {item.car.plateNumber && (
                    <span className="ml-1 text-muted-foreground">{item.car.plateNumber}</span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.client.firstName} {item.client.lastName}
                </p>
              </div>
              <div
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1"
                style={{
                  backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : '#FEE2E2',
                }}
              >
                <Clock className="h-3 w-3" style={{ color: isDark ? '#FCA5A5' : '#B91C1C' }} />
                <span className="text-xs font-bold" style={{ color: isDark ? '#FCA5A5' : '#B91C1C' }}>{item.overdueDays} дн.</span>
              </div>
            </div>
          ))}
          {count > 5 && (
            <a
              href="/admin/rentals"
              className="block pt-2 text-center text-xs font-medium text-primary hover:underline"
            >
              Показать все ({count})
            </a>
          )}
        </div>
      )}
    </div>
  );
}
