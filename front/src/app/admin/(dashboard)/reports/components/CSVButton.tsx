'use client';

import { Download } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export function CSVButton({ onClick }: { onClick: () => void }) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 38,
        borderRadius: 12,
        border: 'none',
        padding: '0 16px',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: H.font,
        background: H.bg,
        color: H.purple,
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#E9EDF7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = H.bg;
      }}
    >
      <Download style={{ width: 14, height: 14 }} />
      CSV
    </button>
  );
}
