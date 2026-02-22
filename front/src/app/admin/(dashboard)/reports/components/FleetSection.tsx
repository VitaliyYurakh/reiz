'use client';

import { Activity } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { SectionCard } from './SectionCard';
import { HDateInput } from './HDateInput';
import { CSVButton } from './CSVButton';
import { UtilBar } from './UtilBar';
import { downloadCSV, getUtilColor } from './helpers';
import type { FleetData } from './types';

export function FleetSection({
  fleetFrom,
  setFleetFrom,
  fleetTo,
  setFleetTo,
  loading,
  fleet,
}: {
  fleetFrom: string;
  setFleetFrom: (v: string) => void;
  fleetTo: string;
  setFleetTo: (v: string) => void;
  loading: boolean;
  fleet: FleetData | null;
}) {
  const { H } = useAdminTheme();
  const { t } = useAdminLocale();

  return (
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
        {loading ? (
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
  );
}
