'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { BarChart3 } from 'lucide-react';
import { getDefaultFrom, getDefaultTo } from './components/helpers';
import type { DashboardData, OverdueRental, RevenueData, FleetData } from './components/types';
import { KPISection } from './components/KPISection';
import { RevenueSection } from './components/RevenueSection';
import { FleetSection } from './components/FleetSection';
import { OverdueSection } from './components/OverdueSection';

export default function ReportsPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [overdue, setOverdue] = useState<{
    count: number;
    items: OverdueRental[];
  } | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingOverdue, setLoadingOverdue] = useState(true);

  const [revenueFrom, setRevenueFrom] = useState(getDefaultFrom);
  const [revenueTo, setRevenueTo] = useState(getDefaultTo);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  const [fleetFrom, setFleetFrom] = useState(getDefaultFrom);
  const [fleetTo, setFleetTo] = useState(getDefaultTo);
  const [fleet, setFleet] = useState<FleetData | null>(null);
  const [loadingFleet, setLoadingFleet] = useState(true);

  useEffect(() => {
    adminApiClient
      .get('/report/dashboard')
      .then((r) => setDashboard(r.data))
      .catch(console.error)
      .finally(() => setLoadingDashboard(false));
    adminApiClient
      .get('/report/overdue')
      .then((r) => setOverdue(r.data))
      .catch(console.error)
      .finally(() => setLoadingOverdue(false));
  }, []);

  const fetchRevenue = useCallback(async () => {
    setLoadingRevenue(true);
    try {
      const res = await adminApiClient.get(
        `/report/revenue?from=${revenueFrom}&to=${revenueTo}`,
      );
      setRevenue(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRevenue(false);
    }
  }, [revenueFrom, revenueTo]);

  const fetchFleet = useCallback(async () => {
    setLoadingFleet(true);
    try {
      const res = await adminApiClient.get(
        `/report/fleet-utilization?from=${fleetFrom}&to=${fleetTo}`,
      );
      setFleet(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFleet(false);
    }
  }, [fleetFrom, fleetTo]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);
  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  return (
    <div style={{ fontFamily: H.font }}>
      {/* Header */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          padding: '20px 28px',
          boxShadow: H.shadow,
          marginBottom: 24,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="h-icon-box h-icon-box-purple">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="h-title">{t('reports.pageTitle')}</h1>
            <span className="h-subtitle">{t('reports.pageSubtitle')}</span>
          </div>
        </div>
      </div>

      <KPISection loading={loadingDashboard} dashboard={dashboard} />

      <RevenueSection
        revenueFrom={revenueFrom}
        setRevenueFrom={setRevenueFrom}
        revenueTo={revenueTo}
        setRevenueTo={setRevenueTo}
        loading={loadingRevenue}
        revenue={revenue}
      />

      <FleetSection
        fleetFrom={fleetFrom}
        setFleetFrom={setFleetFrom}
        fleetTo={fleetTo}
        setFleetTo={setFleetTo}
        loading={loadingFleet}
        fleet={fleet}
      />

      <OverdueSection loading={loadingOverdue} overdue={overdue} />

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
