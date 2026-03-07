'use client';

import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { getStatusMap } from './calendar-types';

export function StatusBadge({ status, H }: { status?: string; H: ThemeTokens }) {
  const { t } = useAdminLocale();
  if (!status) return null;
  const STATUS_MAP = getStatusMap(H);
  const s = STATUS_MAP[status] ?? { labelKey: status, color: H.gray, bg: H.bg };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: H.font,
        color: s.color,
        background: s.bg,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: s.color,
        }}
      />
      {t(s.labelKey)}
    </span>
  );
}
