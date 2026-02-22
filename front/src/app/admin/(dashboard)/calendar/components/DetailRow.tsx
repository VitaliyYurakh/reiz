'use client';

import type { ThemeTokens } from '@/context/AdminThemeContext';

export function DetailRow({
  icon: Icon,
  label,
  children,
  H,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
  H: ThemeTokens;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: H.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 15, height: 15, color: H.purple }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: H.gray,
            fontFamily: H.font,
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            color: H.navy,
            fontFamily: H.font,
            fontWeight: 600,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
