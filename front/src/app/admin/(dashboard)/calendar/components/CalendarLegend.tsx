'use client';

import { AlertTriangle } from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { TYPE_STYLES } from './calendar-types';

export function CalendarLegend({ H }: { H: ThemeTokens }) {
  const { t } = useAdminLocale();
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
          <span>{t(ts.labelKey)}</span>
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
        <span>{t('calendar.available')}</span>
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
        <span>{t('calendar.unavailable')}</span>
      </div>
      <div style={{ width: 1, height: 14, background: H.grayLight }} />
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <AlertTriangle style={{ width: 12, height: 12, color: H.red }} />
        <span>{t('calendar.conflict')}</span>
      </div>
    </div>
  );
}
