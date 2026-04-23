'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { Car, Segment } from '@/types/cars';
import { HModalOverlay, HModalField } from './ui-primitives';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';

interface PartnerOption {
  id: number;
  fullName: string;
  companyName: string | null;
}

interface SettingsModalProps {
  car: Car & { partnerId?: number | null };
  segments: Segment[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SettingsModal({ car, segments, onClose, onSubmit }: SettingsModalProps) {
  const { H } = useAdminTheme();
  const [partners, setPartners] = useState<PartnerOption[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiClient.get('/partner?isActive=true');
        setPartners(res.data.items);
      } catch (err) {
        logError(err);
      }
    })();
  }, []);

  return (
    <HModalOverlay onClose={onClose}>
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          borderRadius: 20,
          background: H.white,
          padding: 24,
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
          {/* 2-column grid — fields fit on ~3 rows instead of 6 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <HModalField label="Марка" name="brand" defaultValue={car.brand || ''} />
            <HModalField label="Модель" name="model" defaultValue={car.model || ''} />
            <HModalField label="Номер" name="plateNumber" defaultValue={car.plateNumber || ''} />
            <HModalField label="VIN" name="VIN" defaultValue={car.VIN || ''} />
            <HModalField label="Год выпуска" name="yearOfManufacture" defaultValue={String(car.yearOfManufacture || '')} />
            <HModalField label="Цвет" name="color" defaultValue={car.color || ''} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Партнер (власник авто)
            </label>
            <select
              name="partnerId"
              defaultValue={car.partnerId ? String(car.partnerId) : ''}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 16,
                background: H.bg,
                border: 'none',
                fontSize: 14,
                fontFamily: H.font,
                color: H.navy,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">— Reiz (власне авто) —</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName || p.fullName}
                </option>
              ))}
            </select>
            <p style={{ fontSize: 11, color: H.gray, marginTop: 6 }}>
              Якщо авто належить партнеру — звіт по комісії автоматично потрапить у його статемент.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Сегменти
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              background: H.bg,
              borderRadius: 16,
              padding: '12px 16px',
            }}>
              {segments.map((s) => {
                const isActive = car.segment?.some((cs) => cs.id === s.id);
                return (
                  <label
                    key={s.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 49,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontFamily: H.font,
                      color: H.navy,
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="segmentIds"
                      value={s.id}
                      defaultChecked={isActive}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: H.navy,
                        cursor: 'pointer',
                      }}
                    />
                    {s.name}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end" style={{ marginTop: 28 }}>
          <button
            type="button"
            onClick={onClose}
            className="h-btn h-btn-cancel"
            style={{ borderRadius: 49 }}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="h-btn h-btn-primary"
            style={{ borderRadius: 49 }}
          >
            Сохранить
          </button>
        </div>
      </form>
    </HModalOverlay>
  );
}
