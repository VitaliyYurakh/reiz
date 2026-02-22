'use client';

import {
  Car,
  Users,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  Activity,
  FileText,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

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

export function KPICard({
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
