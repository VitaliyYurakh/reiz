'use client';

import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { KPICard } from './KPICard';
import { formatMoney } from './helpers';
import type { DashboardData } from './types';

export function KPISection({
  loading,
  dashboard,
}: {
  loading: boolean;
  dashboard: DashboardData | null;
}) {
  const { H } = useAdminTheme();
  const { t } = useAdminLocale();

  return (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: H.navy,
          margin: '0 0 16px',
        }}
      >
        {t('reports.kpiTitle')}
      </h2>
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 90,
                borderRadius: 20,
                background: H.bg,
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : !dashboard ? (
        <p style={{ fontSize: 14, color: H.gray }}>
          {t('reports.loadError')}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <KPICard
            title={t('reports.kpiActiveRentals')}
            value={dashboard.activeRentals}
            iconKey="activeRentals"
          />
          <KPICard
            title={t('reports.kpiConfirmedRes')}
            value={dashboard.confirmedReservations}
            iconKey="confirmedReservations"
          />
          <KPICard
            title={t('reports.kpiMonthRequests')}
            value={dashboard.newRequestsThisMonth}
            iconKey="newRequests"
          />
          <KPICard
            title={t('reports.kpiOverdue')}
            value={dashboard.overdueRentals}
            iconKey="overdue"
            subtitle={
              dashboard.overdueRentals > 0
                ? t('reports.kpiNeedAttention')
                : undefined
            }
          />
          <KPICard
            title={t('reports.kpiMonthRevenue')}
            value={formatMoney(dashboard.revenueThisMonthMinor)}
            iconKey="revenue"
            subtitle={t('reports.kpiPrevMonth', { amount: formatMoney(dashboard.revenueLastMonthMinor) })}
          />
          <KPICard
            title={t('reports.kpiCompletedRentals')}
            value={dashboard.completedRentalsThisMonth}
            iconKey="completed"
            subtitle={t('reports.kpiThisMonth')}
          />
          <KPICard
            title={t('reports.kpiClients')}
            value={dashboard.totalClients}
            iconKey="clients"
          />
          <KPICard
            title={t('reports.kpiFleetLoad')}
            value={`${dashboard.fleetUtilizationPercent}%`}
            iconKey="fleet"
            subtitle={t('reports.kpiAvailableOf', { available: String(dashboard.totalCarsAvailable), total: String(dashboard.totalCars) })}
          />
        </div>
      )}
    </div>
  );
}
