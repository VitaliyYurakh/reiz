'use client';

import type { ThemeTokens } from '@/context/AdminThemeContext';
import type { Interval } from './calendar-types';
import { TYPE_STYLES } from './calendar-types';
import { StatusBadge } from './StatusBadge';

export function CalendarTooltip({
  tooltip,
  H,
}: {
  tooltip: { x: number; y: number; interval: Interval };
  H: ThemeTokens;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 50,
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        background: H.white,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(43, 54, 116, 0.18)',
        fontFamily: H.font,
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background:
              TYPE_STYLES[tooltip.interval.type]?.dot ?? H.gray,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: H.navy,
          }}
        >
          {TYPE_STYLES[tooltip.interval.type]?.label ??
            tooltip.interval.type}{' '}
          #{tooltip.interval.id}
        </span>
      </div>
      {tooltip.interval.clientName && (
        <p
          style={{
            fontSize: 12,
            color: H.navy,
            margin: '0 0 2px',
            fontWeight: 500,
          }}
        >
          {tooltip.interval.clientName}
        </p>
      )}
      <p
        style={{
          fontSize: 11,
          color: H.gray,
          margin: '0 0 2px',
        }}
      >
        {new Date(tooltip.interval.startDate).toLocaleDateString('ru')}
        {' — '}
        {tooltip.interval.endDate
          ? new Date(tooltip.interval.endDate).toLocaleDateString(
              'ru',
            )
          : '...'}
      </p>
      {tooltip.interval.status && (
        <div style={{ marginTop: 4 }}>
          <StatusBadge status={tooltip.interval.status} H={H} />
        </div>
      )}
      <p
        style={{
          fontSize: 10,
          color: `${H.gray}80`,
          margin: '8px 0 0',
          fontStyle: 'italic',
        }}
      >
        Нажмите для подробностей
      </p>
    </div>
  );
}
