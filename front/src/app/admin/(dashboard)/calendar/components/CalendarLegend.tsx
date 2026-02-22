'use client';

import { AlertTriangle } from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { TYPE_STYLES } from './calendar-types';

export function CalendarLegend({ H }: { H: ThemeTokens }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 20,
        paddingTop: 14,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: H.font,
        color: H.gray,
      }}
    >
      {Object.entries(TYPE_STYLES).map(([key, ts]) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 20,
              height: 8,
              borderRadius: 4,
              background: ts.gradient,
            }}
          />
          <span>{ts.label}</span>
        </div>
      ))}
      <div style={{ width: 1, height: 14, background: H.grayLight }} />
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: H.green,
            boxShadow: `0 0 4px ${H.green}50`,
          }}
        />
        <span>Доступен</span>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: H.red,
            boxShadow: `0 0 4px ${H.red}50`,
          }}
        />
        <span>Недоступен</span>
      </div>
      <div style={{ width: 1, height: 14, background: H.grayLight }} />
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <AlertTriangle style={{ width: 12, height: 12, color: H.red }} />
        <span>Конфликт</span>
      </div>
    </div>
  );
}
