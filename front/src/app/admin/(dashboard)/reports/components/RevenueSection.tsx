'use client';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { SectionCard } from './SectionCard';
import { HDateInput } from './HDateInput';
import { CSVButton } from './CSVButton';
import { formatMoney, downloadCSV } from './helpers';
import type { RevenueData } from './types';

export function RevenueSection({
  revenueFrom,
  setRevenueFrom,
  revenueTo,
  setRevenueTo,
  loading,
  revenue,
}: {
  revenueFrom: string;
  setRevenueFrom: (v: string) => void;
  revenueTo: string;
  setRevenueTo: (v: string) => void;
  loading: boolean;
  revenue: RevenueData | null;
}) {
  const { H } = useAdminTheme();
  const { t } = useAdminLocale();

  const maxRevenue = revenue
    ? Math.max(
        ...revenue.daily.map((d) => Math.max(d.income, d.expense)),
        1,
      )
    : 1;

  return (
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
        {loading ? (
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
  );
}
