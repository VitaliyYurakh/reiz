'use client';

import type React from 'react';
import type { Activity } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export function SectionCard({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string;
  icon: typeof Activity;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        boxShadow: H.shadow,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '20px 24px',
          borderBottom: `1px solid ${H.grayLight}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, rgba(134,140,255,0.15), rgba(67,24,255,0.15))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon style={{ width: 18, height: 18, color: H.purple }} />
          </div>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: H.navy,
              margin: 0,
              fontFamily: H.font,
            }}
          >
            {title}
          </h2>
        </div>
        {right && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {right}
          </div>
        )}
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}
