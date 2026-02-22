'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { Car, Segment } from '@/types/cars';
import { HModalOverlay, HModalField } from './ui-primitives';

interface SettingsModalProps {
  car: Car;
  segments: Segment[];
  segmentInfo: Segment | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SettingsModal({ car, segments, segmentInfo, onClose, onSubmit }: SettingsModalProps) {
  const { H } = useAdminTheme();

  return (
    <HModalOverlay onClose={onClose}>
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 20,
          background: H.white,
          padding: 32,
          boxShadow: H.shadowMd,
          fontFamily: H.font,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: H.navyDark, margin: 0 }}>Основные данные</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: 'none',
              background: H.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: H.gray,
              transition: 'all 0.15s',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="space-y-4">
          <HModalField label="Марка" name="brand" defaultValue={car.brand || ''} />
          <HModalField label="Модель" name="model" defaultValue={car.model || ''} />
          <HModalField label="Номер" name="plateNumber" defaultValue={car.plateNumber || ''} />
          <HModalField label="VIN" name="VIN" defaultValue={car.VIN || ''} />
          <HModalField label="Год выпуска" name="yearOfManufacture" defaultValue={String(car.yearOfManufacture || '')} />
          <HModalField label="Цвет" name="color" defaultValue={car.color || ''} />
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Сегмент
            </label>
            <select
              name="segmentId"
              defaultValue={segmentInfo?.id || ''}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 16,
                border: 'none',
                background: H.bg,
                padding: '0 16px',
                fontSize: 14,
                fontWeight: 500,
                color: H.navy,
                fontFamily: H.font,
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23A3AED0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end" style={{ marginTop: 28 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              borderRadius: 49,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              background: H.bg,
              color: H.navy,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            style={{
              borderRadius: 49,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
              transition: 'all 0.15s',
            }}
          >
            Сохранить
          </button>
        </div>
      </form>
    </HModalOverlay>
  );
}
