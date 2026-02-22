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
          padding: '20px 24px',
          boxShadow: H.shadow,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
            }}
          >
            <BarChart3 style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: H.navy,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {t('reports.pageTitle')}
            </h1>
            <p
              style={{
                fontSize: 13,
                color: H.gray,
                margin: 0,
                marginTop: 2,
              }}
            >
              {t('reports.pageSubtitle')}
            </p>
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
