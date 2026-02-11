'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme, type ThemeTokens } from '@/context/AdminThemeContext';
import { useRouter } from 'next/navigation';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Car,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldCheck,
  Activity,
  FileText,
} from 'lucide-react';

/* ── Types ── */

interface DashboardData {
  activeRentals: number;
  confirmedReservations: number;
  newRequestsThisMonth: number;
  totalClients: number;
  revenueThisMonthMinor: number;
  revenueLastMonthMinor: number;
  completedRentalsThisMonth: number;
  overdueRentals: number;
  totalCarsAvailable: number;
  totalCars: number;
  fleetUtilizationPercent: number;
}

interface OverdueClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}
interface OverdueCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}
interface OverdueRental {
  id: number;
  status: string;
  returnDate: string;
  overdueDays: number;
  client: OverdueClient;
  car: OverdueCar;
}

interface DailyRevenue {
  date: string;
  income: number;
  expense: number;
  net: number;
}
interface RevenueData {
  totalIncome: number;
  totalExpense: number;
  net: number;
  daily: DailyRevenue[];
}

interface FleetCar {
  carId: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  rentedDays: number;
  totalDays: number;
  utilizationPercent: number;
}
interface FleetData {
  totalDaysInPeriod: number;
  averageUtilizationPercent: number;
  cars: FleetCar[];
}

/* ── Helpers ── */

function formatMoney(minor: number) {
  return `${(minor / 100).toLocaleString('uk-UA')} грн`;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

function getDefaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

function getDefaultTo() {
  return new Date().toISOString().slice(0, 10);
}

function downloadCSV(
  filename: string,
  headers: string[],
  rows: string[][],
) {
  const BOM = '\uFEFF';
  const csv =
    BOM + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getUtilColor(pct: number, H: ThemeTokens) {
  if (pct > 70) return H.green;
  if (pct > 40) return H.orange;
  return H.red;
}

/* ── KPI Card ── */

const KPI_ICONS: Record<string, typeof Activity> = {
  activeRentals: Car,
  confirmedReservations: CheckCircle2,
  newRequests: FileText,
  overdue: AlertTriangle,
  revenue: Wallet,
  completed: ShieldCheck,
  clients: Users,
  fleet: Activity,
};

const KPI_COLORS: Record<
  string,
  { icon: string; bg: string }
> = {
  activeRentals: { icon: '#4318FF', bg: 'rgba(67,24,255,0.08)' },
  confirmedReservations: { icon: '#01B574', bg: 'rgba(1,181,116,0.08)' },
  newRequests: { icon: '#868CFF', bg: 'rgba(134,140,255,0.08)' },
  overdue: { icon: '#EE5D50', bg: 'rgba(238,93,80,0.08)' },
  revenue: { icon: '#01B574', bg: 'rgba(1,181,116,0.08)' },
  completed: { icon: '#4318FF', bg: 'rgba(67,24,255,0.08)' },
  clients: { icon: '#FFB547', bg: 'rgba(255,181,71,0.08)' },
  fleet: { icon: '#868CFF', bg: 'rgba(134,140,255,0.08)' },
};

function KPICard({
  title,
  value,
  subtitle,
  iconKey,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  iconKey: string;
}) {
  const { H } = useAdminTheme();
  const Icon = KPI_ICONS[iconKey] || Activity;
  const colors = KPI_COLORS[iconKey] || KPI_COLORS.fleet;

  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: H.shadow,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = H.shadowMd;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = H.shadow;
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 22, height: 22, color: colors.icon }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: H.gray,
            margin: 0,
            fontFamily: H.font,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: H.navy,
            margin: '2px 0 0',
            fontFamily: H.font,
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: H.gray,
              margin: '4px 0 0',
              fontFamily: H.font,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Date Input ── */

function HDateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { H } = useAdminTheme();
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 38,
        borderRadius: 12,
        border: 'none',
        background: H.bg,
        padding: '0 14px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        cursor: 'pointer',
      }}
    />
  );
}

/* ── CSV Button ── */

function CSVButton({ onClick }: { onClick: () => void }) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 38,
        borderRadius: 12,
        border: 'none',
        padding: '0 16px',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: H.font,
        background: H.bg,
        color: H.purple,
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#E9EDF7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = H.bg;
      }}
    >
      <Download style={{ width: 14, height: 14 }} />
      CSV
    </button>
  );
}

/* ── Section Card ── */

function SectionCard({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string;
  icon: typeof Activity;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        boxShadow: H.shadow,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '20px 24px',
          borderBottom: `1px solid ${H.grayLight}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, rgba(134,140,255,0.15), rgba(67,24,255,0.15))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon style={{ width: 18, height: 18, color: H.purple }} />
          </div>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: H.navy,
              margin: 0,
              fontFamily: H.font,
            }}
          >
            {title}
          </h2>
        </div>
        {right && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {right}
          </div>
        )}
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

/* ── Utilization Progress Bar ── */

function UtilBar({
  percent,
  height = 8,
}: {
  percent: number;
  height?: number;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        flex: 1,
        height,
        borderRadius: height / 2,
        background: H.bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: height / 2,
          background: `linear-gradient(90deg, ${getUtilColor(percent, H)}88, ${getUtilColor(percent, H)})`,
          width: `${Math.min(percent, 100)}%`,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════════════════ */

export default function ReportsPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();
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

  const maxRevenue = revenue
    ? Math.max(
        ...revenue.daily.map((d) => Math.max(d.income, d.expense)),
        1,
      )
    : 1;

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

      {/* ═══ KPI Cards ═══ */}
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
        {loadingDashboard ? (
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

      {/* ═══ Revenue ═══ */}
      <div style={{ marginBottom: 24 }}>
        <SectionCard
          title={t('reports.revenueTitle')}
          icon={Wallet}
          right={
            <>
              <HDateInput
                value={revenueFrom}
                onChange={setRevenueFrom}
              />
              <span
                style={{
                  fontSize: 13,
                  color: H.gray,
                  fontWeight: 600,
                }}
              >
                —
              </span>
              <HDateInput
                value={revenueTo}
                onChange={setRevenueTo}
              />
              {revenue && revenue.daily.length > 0 && (
                <CSVButton
                  onClick={() =>
                    downloadCSV(
                      `revenue_${revenueFrom}_${revenueTo}.csv`,
                      [t('reports.csvDate'), t('reports.csvCurrency'), t('reports.csvIncome'), t('reports.csvExpense'), t('reports.csvNet')],
                      revenue.daily.map((d) => [
                        d.date,
                        'UAH',
                        (d.income / 100).toFixed(2),
                        (d.expense / 100).toFixed(2),
                        (d.net / 100).toFixed(2),
                      ]),
                    )
                  }
                />
              )}
            </>
          }
        >
          {loadingRevenue ? (
            <div
              style={{
                height: 200,
                borderRadius: 16,
                background: H.bg,
                animation: 'pulse 1.5s infinite',
              }}
            />
          ) : !revenue ? (
            <p style={{ fontSize: 14, color: H.gray }}>
              {t('reports.loadError')}
            </p>
          ) : (
            <>
              {/* Summary cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    background: H.greenBg,
                    borderRadius: 16,
                    padding: '16px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <TrendingUp
                      style={{
                        width: 14,
                        height: 14,
                        color: H.green,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: H.green,
                      }}
                    >
                      {t('reports.incomeLabel')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#05603A',
                      margin: 0,
                    }}
                  >
                    {formatMoney(revenue.totalIncome)}
                  </p>
                </div>
                <div
                  style={{
                    background: H.redBg,
                    borderRadius: 16,
                    padding: '16px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <TrendingDown
                      style={{
                        width: 14,
                        height: 14,
                        color: H.red,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: H.red,
                      }}
                    >
                      {t('reports.expenseLabel')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#9B1C1C',
                      margin: 0,
                    }}
                  >
                    {formatMoney(revenue.totalExpense)}
                  </p>
                </div>
                <div
                  style={{
                    background: H.bg,
                    borderRadius: 16,
                    padding: '16px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <BarChart3
                      style={{
                        width: 14,
                        height: 14,
                        color: H.purple,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: H.purple,
                      }}
                    >
                      {t('reports.netProfitLabel')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color:
                        revenue.net >= 0 ? '#05603A' : '#9B1C1C',
                      margin: 0,
                    }}
                  >
                    {formatMoney(revenue.net)}
                  </p>
                </div>
              </div>

              {/* Bar chart */}
              {revenue.daily.length > 0 ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 2,
                      minHeight: 200,
                      overflowX: 'auto',
                      paddingBottom: 30,
                    }}
                  >
                    {revenue.daily.map((d) => (
                      <div
                        key={d.date}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          minWidth: 24,
                          position: 'relative',
                        }}
                        className="group"
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            width: '100%',
                            gap: 1,
                            height: 180,
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              borderRadius: '4px 4px 0 0',
                              background: `linear-gradient(180deg, ${H.green}cc, ${H.green})`,
                              height: `${(d.income / maxRevenue) * 100}%`,
                              minHeight: d.income > 0 ? 2 : 0,
                              transition: 'height 0.4s ease',
                            }}
                            title={`${t('reports.incomeLabel')}: ${formatMoney(d.income)}`}
                          />
                          <div
                            style={{
                              width: '100%',
                              borderRadius: '4px 4px 0 0',
                              background: `linear-gradient(180deg, ${H.red}cc, ${H.red})`,
                              height: `${(d.expense / maxRevenue) * 100}%`,
                              minHeight: d.expense > 0 ? 2 : 0,
                              transition: 'height 0.4s ease',
                            }}
                            title={`${t('reports.expenseLabel')}: ${formatMoney(d.expense)}`}
                          />
                        </div>
                        <span
                          style={{
                            marginTop: 4,
                            fontSize: 10,
                            color: H.gray,
                            transform: 'rotate(-45deg)',
                            transformOrigin: 'top left',
                            whiteSpace: 'nowrap',
                            fontWeight: 500,
                          }}
                        >
                          {d.date.slice(5)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Legend */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: H.gray,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: H.green,
                        }}
                      />
                      {t('reports.incomeLabel')}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: H.gray,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: H.red,
                        }}
                      />
                      {t('reports.expenseLabel')}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 160,
                    background: H.bg,
                    borderRadius: 16,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: H.gray,
                      fontWeight: 500,
                    }}
                  >
                    {t('reports.noDataForPeriod')}
                  </p>
                </div>
              )}
            </>
          )}
        </SectionCard>
      </div>

      {/* ═══ Fleet Utilization ═══ */}
      <div style={{ marginBottom: 24 }}>
        <SectionCard
          title={t('reports.fleetTitle')}
          icon={Activity}
          right={
            <>
              <HDateInput
                value={fleetFrom}
                onChange={setFleetFrom}
              />
              <span
                style={{
                  fontSize: 13,
                  color: H.gray,
                  fontWeight: 600,
                }}
              >
                —
              </span>
              <HDateInput
                value={fleetTo}
                onChange={setFleetTo}
              />
              {fleet && fleet.cars.length > 0 && (
                <CSVButton
                  onClick={() =>
                    downloadCSV(
                      `fleet_${fleetFrom}_${fleetTo}.csv`,
                      [
                        t('reports.csvCar'),
                        t('reports.csvPlate'),
                        t('reports.csvRentedDays'),
                        t('reports.csvTotalDays'),
                        t('reports.csvUtilization'),
                      ],
                      fleet.cars.map((c) => [
                        `${c.brand} ${c.model}`,
                        c.plateNumber || '',
                        String(c.rentedDays),
                        String(c.totalDays),
                        String(c.utilizationPercent),
                      ]),
                    )
                  }
                />
              )}
            </>
          }
        >
          {loadingFleet ? (
            <div
              style={{
                height: 120,
                borderRadius: 16,
                background: H.bg,
                animation: 'pulse 1.5s infinite',
              }}
            />
          ) : !fleet ? (
            <p style={{ fontSize: 14, color: H.gray }}>
              {t('reports.loadError')}
            </p>
          ) : (
            <>
              {/* Average progress */}
              <div
                style={{
                  background: H.bg,
                  borderRadius: 16,
                  padding: '16px 20px',
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: H.gray,
                    margin: '0 0 10px',
                  }}
                >
                  {t('reports.avgUtilization', { days: String(fleet.totalDaysInPeriod) })}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <UtilBar
                    percent={fleet.averageUtilizationPercent}
                    height={12}
                  />
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: H.navy,
                      minWidth: 50,
                      textAlign: 'right',
                    }}
                  >
                    {fleet.averageUtilizationPercent}%
                  </span>
                </div>
              </div>

              {/* Fleet table */}
              <div
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${H.grayLight}`,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 13,
                    fontFamily: H.font,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${H.grayLight}`,
                        background: H.bg,
                      }}
                    >
                      {[t('reports.thCar'), t('reports.thPlate'), t('reports.thRentedDays'), t('reports.thUtilization')].map(
                        (h, i) => (
                          <th
                            key={i}
                            style={{
                              padding: '12px 20px',
                              textAlign: 'left',
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              color: H.gray,
                              ...(i === 3
                                ? { width: '35%' }
                                : {}),
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {fleet.cars.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: H.gray,
                            fontSize: 14,
                          }}
                        >
                          {t('reports.noCars')}
                        </td>
                      </tr>
                    ) : (
                      fleet.cars.map((c) => (
                        <tr
                          key={c.carId}
                          style={{
                            borderBottom: `1px solid ${H.grayLight}`,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              H.bg;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              'transparent';
                          }}
                        >
                          <td
                            style={{
                              padding: '14px 20px',
                              fontWeight: 600,
                              color: H.navy,
                            }}
                          >
                            {c.brand && c.model
                              ? `${c.brand} ${c.model}`
                              : '—'}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            {c.plateNumber ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: H.gray,
                                  background: H.bg,
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  fontFamily: 'monospace',
                                }}
                              >
                                {c.plateNumber}
                              </span>
                            ) : (
                              <span style={{ color: H.gray }}>
                                —
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: '14px 20px',
                              color: H.navy,
                              fontWeight: 600,
                            }}
                          >
                            {c.rentedDays} / {c.totalDays}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                              }}
                            >
                              <UtilBar
                                percent={c.utilizationPercent}
                              />
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: getUtilColor(
                                    c.utilizationPercent, H,
                                  ),
                                  minWidth: 38,
                                  textAlign: 'right',
                                }}
                              >
                                {c.utilizationPercent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* ═══ Overdue Rentals ═══ */}
      <SectionCard
        title={t('reports.overdueTitle')}
        icon={AlertTriangle}
        right={
          <>
            {overdue && overdue.items.length > 0 && (
              <CSVButton
                onClick={() =>
                  downloadCSV(
                    `overdue_${new Date().toISOString().slice(0, 10)}.csv`,
                    [
                      t('reports.csvId'),
                      t('reports.csvClient'),
                      t('reports.csvPhone'),
                      t('reports.csvCar'),
                      t('reports.csvPlate'),
                      t('reports.csvReturnDate'),
                      t('reports.csvOverdueDays'),
                    ],
                    overdue.items.map((r) => [
                      String(r.id),
                      r.client
                        ? `${r.client.firstName} ${r.client.lastName}`
                        : '',
                      r.client?.phone || '',
                      r.car
                        ? `${r.car.brand} ${r.car.model}`
                        : '',
                      r.car?.plateNumber || '',
                      fmtDate(r.returnDate),
                      String(r.overdueDays),
                    ]),
                  )
                }
              />
            )}
            {overdue && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 14px',
                  borderRadius: 49,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    overdue.count > 0 ? H.redBg : H.greenBg,
                  color: overdue.count > 0 ? H.red : H.green,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      overdue.count > 0 ? H.red : H.green,
                  }}
                />
                {overdue.count > 0
                  ? t('reports.overdueCount', { count: String(overdue.count) })
                  : t('reports.noOverdue')}
              </span>
            )}
          </>
        }
      >
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${H.grayLight}`,
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              fontFamily: H.font,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${H.grayLight}`,
                  background: H.bg,
                }}
              >
                {[
                  t('reports.thId'),
                  t('reports.thClient'),
                  t('reports.thPhone'),
                  t('reports.thCar'),
                  t('reports.thReturnDate'),
                  t('reports.thOverdueDays'),
                  t('reports.thStatus'),
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: H.gray,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingOverdue ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `1px solid ${H.grayLight}`,
                    }}
                  >
                    <td colSpan={7} style={{ padding: '14px 20px' }}>
                      <div
                        style={{
                          height: 14,
                          borderRadius: 8,
                          background: H.bg,
                          animation: 'pulse 1.5s infinite',
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : !overdue || overdue.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: H.greenBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle2
                          style={{
                            width: 20,
                            height: 20,
                            color: H.green,
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: H.gray,
                          margin: 0,
                        }}
                      >
                        {t('reports.noOverdueRentals')}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                overdue.items.map((r) => {
                  const client = r.client
                    ? `${r.client.firstName} ${r.client.lastName}`
                    : '—';
                  const car = r.car
                    ? `${r.car.brand} ${r.car.model}`
                    : '—';
                  return (
                    <tr
                      key={r.id}
                      onClick={() =>
                        router.push(`/admin/rentals/${r.id}`)
                      }
                      style={{
                        borderBottom: `1px solid ${H.grayLight}`,
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = H.bg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'transparent';
                      }}
                    >
                      <td
                        style={{
                          padding: '14px 20px',
                          fontWeight: 700,
                          color: H.gray,
                          fontSize: 12,
                        }}
                      >
                        {r.id}
                      </td>
                      <td
                        style={{
                          padding: '14px 20px',
                          fontWeight: 600,
                          color: H.navy,
                        }}
                      >
                        {client}
                      </td>
                      <td
                        style={{
                          padding: '14px 20px',
                          color: H.gray,
                        }}
                      >
                        {r.client?.phone || '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: H.navy,
                          }}
                        >
                          {car}
                        </div>
                        {r.car?.plateNumber && (
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: 2,
                              fontSize: 11,
                              fontWeight: 600,
                              color: H.gray,
                              background: H.bg,
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontFamily: 'monospace',
                            }}
                          >
                            {r.car.plateNumber}
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '14px 20px',
                          color: H.gray,
                          fontWeight: 500,
                        }}
                      >
                        {fmtDate(r.returnDate)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 12px',
                            borderRadius: 49,
                            fontSize: 12,
                            fontWeight: 700,
                            background:
                              r.overdueDays > 3
                                ? H.redBg
                                : H.orangeBg,
                            color:
                              r.overdueDays > 3
                                ? H.red
                                : '#C87800',
                          }}
                        >
                          <Clock
                            style={{
                              width: 12,
                              height: 12,
                            }}
                          />
                          {r.overdueDays} {t('reports.daysSuffix')}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 20px',
                          color: H.gray,
                          fontWeight: 500,
                        }}
                      >
                        {r.status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

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
