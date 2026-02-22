'use client';

import { useEffect, useState } from 'react';
import {
  CarFront,
  DollarSign,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import {
  getDashboard,
  getOverdueRentals,
  type DashboardData,
  type OverdueData,
} from '@/lib/api/admin';
import {
  KpiCard,
  RevenueChart,
  FleetUtilizationChart,
  OverdueAlerts,
  QuickStatsGrid,
  DashboardSkeleton,
} from '@/components/admin/dashboard';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { fmtMoneyUAH as formatMoney } from '@/app/admin/lib/format';

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function DashboardPage() {
  const { t } = useAdminLocale();
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('dashboard.errorLoading')}</p>
      </div>
    );
  }

  const revenueTrend = calcTrend(dashboard.revenueThisMonthMinor, dashboard.revenueLastMonthMinor);

  return (
    <div className="space-y-3">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title={t('dashboard.activeRentals')}
          value={dashboard.activeRentals}
          icon={CarFront}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title={t('dashboard.monthRevenue')}
          value={formatMoney(dashboard.revenueThisMonthMinor)}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          trend={{
            value: revenueTrend,
            label: t('dashboard.vsPrevMonth'),
          }}
        />
        <KpiCard
          title={t('dashboard.fleetLoad')}
          value={`${dashboard.fleetUtilizationPercent}%`}
          icon={Gauge}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          trend={{
            value: 0,
            label: `${dashboard.totalCarsAvailable} / ${dashboard.totalCars} ${t('dashboard.available')}`,
          }}
        />
        <KpiCard
          title={t('dashboard.overdue')}
          value={dashboard.overdueRentals}
          icon={AlertTriangle}
          iconColor={dashboard.overdueRentals > 0 ? 'text-red-600' : 'text-green-600'}
          iconBg={dashboard.overdueRentals > 0 ? 'bg-red-50' : 'bg-green-50'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
        <RevenueChart />
        <FleetUtilizationChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
        <QuickStatsGrid data={dashboard} />
        <OverdueAlerts data={overdue} />
      </div>
    </div>
  );
}
