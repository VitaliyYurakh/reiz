'use client';

import { useAdminTheme } from '@/context/AdminThemeContext';
import { getUtilColor } from './helpers';

export function UtilBar({
  percent,
  height = 8,
}: {
  percent: number;
  height?: number;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        flex: 1,
        height,
        borderRadius: height / 2,
        background: H.bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: height / 2,
          background: `linear-gradient(90deg, ${getUtilColor(percent, H)}88, ${getUtilColor(percent, H)})`,
          width: `${Math.min(percent, 100)}%`,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}
