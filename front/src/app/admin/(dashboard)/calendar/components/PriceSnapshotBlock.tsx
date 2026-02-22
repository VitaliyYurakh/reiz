'use client';

import { DollarSign } from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';

export function PriceSnapshotBlock({ ps, H }: { ps: any; H: ThemeTokens }) {
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
        <DollarSign style={{ width: 12, height: 12 }} /> Стоимость
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
            label="Тарифный план"
            value={String(ps.ratePlanName ?? ps.name)}
          />
        )}
        {ps.dailyRate != null && (
          <Line label="Тариф / сутки" value={`${ps.dailyRate} ${cur}`} />
        )}
        {days != null && <Line label="Кол-во дней" value={String(days)} />}
        {rental != null && (
          <Line label="Аренда" value={`${rental} ${cur}`} />
        )}
        {insurance != null && Number(insurance) > 0 && (
          <Line label="Страховка" value={`${insurance} ${cur}`} />
        )}
        {extras != null && Number(extras) > 0 && (
          <Line label="Доп. услуги" value={`${extras} ${cur}`} />
        )}
        {delivery != null && Number(delivery) > 0 && (
          <Line label="Доставка" value={`${delivery} ${cur}`} />
        )}
        {disc != null && Number(disc) > 0 && (
          <Line label="Скидка" value={`-${disc} ${cur}`} green />
        )}
        {deposit != null && (
          <Line label="Залог" value={`${deposit} ${cur}`} />
        )}
        {total != null && (
          <Line label="Итого" value={`${total} ${cur}`} bold border />
        )}
      </div>
    </div>
  );
}
