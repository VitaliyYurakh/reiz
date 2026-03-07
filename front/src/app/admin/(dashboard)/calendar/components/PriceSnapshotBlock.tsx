'use client';

import { DollarSign } from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export function PriceSnapshotBlock({ ps, H }: { ps: any; H: ThemeTokens }) {
  const { t } = useAdminLocale();
  const days = ps.totalDays;
  const rental = ps.baseAmount ?? ps.baseRentalCost;
  const insurance = ps.insuranceCost;
  const extras = ps.addOnsTotal ?? ps.extrasCost;
  const delivery = ps.deliveryFee;
  const disc = ps.discount;
  const deposit = ps.depositAmount;
  const total = ps.total ?? ps.totalCost;
  const hasPriceData =
    days != null || rental != null || total != null || deposit != null;
  if (!hasPriceData) return null;
  const cur = ps.currency || 'USD';

  const Line = ({
    label,
    value,
    bold,
    green,
    border,
  }: {
    label: string;
    value: string;
    bold?: boolean;
    green?: boolean;
    border?: boolean;
  }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderTop: border ? `1px solid ${H.grayLight}` : undefined,
        marginTop: border ? 4 : 0,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: bold ? H.navy : H.gray,
          fontFamily: H.font,
          fontWeight: bold ? 700 : 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: H.font,
          fontWeight: bold ? 700 : 600,
          color: green ? H.green : H.navy,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          fontSize: 11,
          color: H.gray,
          fontFamily: H.font,
          fontWeight: 500,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <DollarSign style={{ width: 12, height: 12 }} /> {t('calendar.priceTitle')}
      </div>
      <div
        style={{
          borderRadius: 12,
          background: H.bg,
          padding: 14,
        }}
      >
        {(ps.ratePlanName ?? ps.name) != null && (
          <Line
            label={t('calendar.ratePlanName')}
            value={String(ps.ratePlanName ?? ps.name)}
          />
        )}
        {ps.dailyRate != null && (
          <Line label={t('calendar.dailyRate')} value={`${ps.dailyRate} ${cur}`} />
        )}
        {days != null && <Line label={t('calendar.totalDays')} value={String(days)} />}
        {rental != null && (
          <Line label={t('calendar.rental')} value={`${rental} ${cur}`} />
        )}
        {insurance != null && Number(insurance) > 0 && (
          <Line label={t('calendar.insuranceCost')} value={`${insurance} ${cur}`} />
        )}
        {extras != null && Number(extras) > 0 && (
          <Line label={t('calendar.extrasCost')} value={`${extras} ${cur}`} />
        )}
        {delivery != null && Number(delivery) > 0 && (
          <Line label={t('calendar.deliveryCost')} value={`${delivery} ${cur}`} />
        )}
        {disc != null && Number(disc) > 0 && (
          <Line label={t('calendar.discount')} value={`-${disc} ${cur}`} green />
        )}
        {deposit != null && (
          <Line label={t('calendar.depositAmount')} value={`${deposit} ${cur}`} />
        )}
        {total != null && (
          <Line label={t('calendar.totalCost')} value={`${total} ${cur}`} bold border />
        )}
      </div>
    </div>
  );
}
