'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useRouter } from 'next/navigation';
import { SectionCard } from './SectionCard';
import { CSVButton } from './CSVButton';
import { fmtDate, downloadCSV } from './helpers';
import type { OverdueRental } from './types';

export function OverdueSection({
  loading,
  overdue,
}: {
  loading: boolean;
  overdue: { count: number; items: OverdueRental[] } | null;
}) {
  const { H } = useAdminTheme();
  const { t } = useAdminLocale();
  const router = useRouter();

  return (
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
            {loading ? (
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
  );
}
