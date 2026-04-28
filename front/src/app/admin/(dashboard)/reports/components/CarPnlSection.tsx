'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Car } from 'lucide-react';
import { getDefaultFrom, getDefaultTo } from './helpers';
import { HDateInput } from './HDateInput';

interface PnlRow {
  carId: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  partner: { id: number; name: string } | null;
  incomeMinor: number;
  refundMinor: number;
  serviceCostMinor: number;
  accidentCostMinor: number;
  accidentRecoveryMinor: number;
  profitMinor: number;
}

interface PnlData {
  rows: PnlRow[];
  totals: PnlRow extends infer R ? Omit<PnlRow, 'carId' | 'brand' | 'model' | 'plateNumber' | 'partner'> : never;
}

const fmtMoney = (minor: number) => `${(minor / 100).toFixed(2)}`;

export function CarPnlSection() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const [from, setFrom] = useState(getDefaultFrom);
  const [to, setTo] = useState(getDefaultTo);
  const [data, setData] = useState<PnlData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApiClient.get(`/report/car-pnl?from=${from}&to=${to}`);
      setData(res.data);
    } catch (err) { logError(err); } finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: H.purpleLight + '22', color: H.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: H.navyDark, margin: 0 }}>{t('carPnl.title')}</h3>
            <div style={{ fontSize: 12, color: H.gray }}>{t('carPnl.subtitle')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <HDateInput value={from} onChange={setFrom} />
          <HDateInput value={to} onChange={setTo} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>...</div>
      ) : !data || data.rows.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('carPnl.noData')}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: H.bg }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: H.gray, fontWeight: 600 }}>{t('carPnl.car')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.income')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.refund')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.serviceCost')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.accidentCost')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.accidentRecovery')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: H.gray, fontWeight: 600 }}>{t('carPnl.profit')}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.carId} style={{ borderTop: `1px solid ${H.grayLight}` }}>
                  <td style={{ padding: '10px 12px', color: H.navyDark }}>
                    {r.brand} {r.model}
                    <span style={{ color: H.gray, marginLeft: 6, fontFamily: 'ui-monospace, monospace' }}>{r.plateNumber}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: H.green }}>{fmtMoney(r.incomeMinor)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: H.gray }}>{r.refundMinor ? fmtMoney(r.refundMinor) : '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: H.gray }}>{r.serviceCostMinor ? fmtMoney(r.serviceCostMinor) : '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: H.gray }}>{r.accidentCostMinor ? fmtMoney(r.accidentCostMinor) : '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: H.gray }}>{r.accidentRecoveryMinor ? fmtMoney(r.accidentRecoveryMinor) : '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: r.profitMinor >= 0 ? H.green : H.red, fontWeight: 600 }}>{fmtMoney(r.profitMinor)}</td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${H.gray}`, background: H.bg }}>
                <td style={{ padding: '12px', color: H.navyDark, fontWeight: 700 }}>{t('carPnl.totals')}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: H.green, fontWeight: 700 }}>{fmtMoney((data.totals as any).incomeMinor)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: H.gray, fontWeight: 700 }}>{fmtMoney((data.totals as any).refundMinor)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: H.gray, fontWeight: 700 }}>{fmtMoney((data.totals as any).serviceCostMinor)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: H.gray, fontWeight: 700 }}>{fmtMoney((data.totals as any).accidentCostMinor)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: H.gray, fontWeight: 700 }}>{fmtMoney((data.totals as any).accidentRecoveryMinor)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: (data.totals as any).profitMinor >= 0 ? H.green : H.red, fontWeight: 700 }}>{fmtMoney((data.totals as any).profitMinor)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
