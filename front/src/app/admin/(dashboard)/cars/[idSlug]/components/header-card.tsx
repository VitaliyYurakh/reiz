'use client';

import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { Car, Segment } from '@/types/cars';

interface HeaderCardProps {
  car: Car;
  segmentInfo: Segment | null;
  displayName: string;
  isAvailable: boolean;
  onToggleAvailable: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export function HeaderCard({
  car,
  segmentInfo,
  displayName,
  isAvailable,
  onToggleAvailable,
  onOpenSettings,
  onBack,
}: HeaderCardProps) {
  const { H } = useAdminTheme();

  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        boxShadow: H.shadow,
        padding: '24px 32px',
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: H.bg,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: H.navy,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.background = H.grayLight); }}
            onMouseLeave={(e) => { (e.currentTarget.style.background = H.bg); }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
          </button>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: H.navyDark,
                lineHeight: '32px',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {displayName}
            </h1>
            <div className="mt-1.5 flex items-center gap-2.5">
              {car.plateNumber && (
                <span
                  style={{
                    display: 'inline-block',
                    background: H.bg,
                    borderRadius: 8,
                    padding: '3px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: H.navy,
                    letterSpacing: '0.05em',
                  }}
                >
                  {car.plateNumber}
                </span>
              )}
              {car.yearOfManufacture && (
                <span style={{ fontSize: 13, fontWeight: 500, color: H.gray }}>
                  {car.yearOfManufacture} г.
                </span>
              )}
              {segmentInfo && (
                <span
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, rgba(134,140,255,0.12) 0%, rgba(67,24,255,0.12) 100%)',
                    borderRadius: 49,
                    padding: '3px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: H.purple,
                  }}
                >
                  {segmentInfo.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleAvailable}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 49,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: isAvailable ? H.greenBg : H.redBg,
              color: isAvailable ? H.green : H.red,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isAvailable ? H.green : H.red,
              }}
            />
            {isAvailable ? 'Доступно' : 'Недоступно'}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 49,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.boxShadow = '0 6px 20px rgba(67, 24, 255, 0.35)'); }}
            onMouseLeave={(e) => { (e.currentTarget.style.boxShadow = '0 4px 12px rgba(67, 24, 255, 0.25)'); }}
          >
            <Settings style={{ width: 15, height: 15 }} />
            Редактировать
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// InfoGrid
// ═══════════════════════════════════════════════════

interface InfoGridProps {
  car: Car;
  segmentInfo: Segment | null;
}

export function InfoGrid({ car, segmentInfo }: InfoGridProps) {
  const { H } = useAdminTheme();

  const items = [
    { label: 'Марка', value: car.brand },
    { label: 'Модель', value: car.model },
    { label: 'Номер', value: car.plateNumber },
    { label: 'VIN', value: car.VIN },
    { label: 'Год', value: car.yearOfManufacture },
    { label: 'Цвет', value: car.color },
    { label: 'Сегмент', value: segmentInfo?.name },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: H.white,
            borderRadius: 16,
            padding: '14px 16px',
            boxShadow: H.shadow,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            {item.label}
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: H.navy, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.value || '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
