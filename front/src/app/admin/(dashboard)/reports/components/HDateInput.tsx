'use client';

import { useAdminTheme } from '@/context/AdminThemeContext';

export function HDateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { H } = useAdminTheme();
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 38,
        borderRadius: 12,
        border: 'none',
        background: H.bg,
        padding: '0 14px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        cursor: 'pointer',
      }}
    />
  );
}
