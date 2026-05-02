'use client';

import { AlertTriangle } from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { TYPE_STYLES } from './calendar-types';

export function CalendarLegend({ H }: { H: ThemeTokens }) {
  const { t } = useAdminLocale();
  return (
    <div className="cal-legend">
      {Object.entries(TYPE_STYLES).map(([key, ts]) => (
        <span key={key} className="cal-legend-item">
          <span className="swatch" style={{ background: ts.gradient }} />
          {t(ts.labelKey)}
        </span>
      ))}
      <div className="cal-legend-divider" />
      <span className="cal-legend-item">
        <span className="swatch cancelled" />
        {t('calendar.statusCancelled')} / {t('calendar.statusNoShow')}
      </span>
      <div className="cal-legend-divider" />
      <span className="cal-legend-item">
        <span className="swatch now" />
        {t('calendar.now')}
      </span>
      <div className="cal-legend-divider" />
      <span className="cal-legend-item" style={{ color: H.red }}>
        <AlertTriangle style={{ width: 12, height: 12 }} />
        {t('calendar.conflict')}
      </span>
    </div>
  );
}
