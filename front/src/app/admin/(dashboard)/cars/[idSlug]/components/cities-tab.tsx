'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Save, Truck } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { HCard, HSaveButton } from './ui-primitives';
import {
  getCities,
  getCarCityAvailability,
  updateCarCityAvailability,
} from '@/lib/api/admin';

interface CityRow {
  cityId: number;
  slug: string;
  nameUk: string;
  enabled: boolean;
  deliveryFee: number;
  minRentalDays: number;
}

interface CitiesTabProps {
  carId: number;
  saving: string | null;
  onSaved: (section: string) => void;
}

export function CitiesTab({ carId, saving, onSaved }: CitiesTabProps) {
  const { H } = useAdminTheme();
  const [rows, setRows] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCities();
  }, [carId]);

  const loadCities = async () => {
    try {
      const [citiesRes, availability] = await Promise.all([
        getCities({ limit: 100 }),
        getCarCityAvailability(carId),
      ]);

      const availMap = new Map(
        availability.map((a) => [a.cityId, a])
      );

      const cityRows: CityRow[] = citiesRes.cities
        .filter((c) => c.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.nameUk.localeCompare(b.nameUk, 'uk'))
        .map((city) => {
          const av = availMap.get(city.id);
          return {
            cityId: city.id,
            slug: city.slug,
            nameUk: city.nameUk,
            enabled: av ? av.isActive : false,
            deliveryFee: av?.deliveryFee ?? 0,
            minRentalDays: av?.minRentalDays ?? 1,
          };
        });

      setRows(cityRows);
    } catch (e) {
      console.error('Failed to load cities:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCity = (cityId: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.cityId === cityId ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const updateField = (cityId: number, field: 'deliveryFee' | 'minRentalDays', value: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.cityId === cityId ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSave = async () => {
    try {
      const data = rows.map((r) => ({
        cityId: r.cityId,
        deliveryFee: r.deliveryFee,
        minRentalDays: r.minRentalDays,
        isActive: r.enabled,
      }));
      await updateCarCityAvailability(carId, data);
      onSaved('cities');
    } catch (e) {
      alert('Помилка збереження: ' + e);
    }
  };

  const enabledCount = rows.filter((r) => r.enabled).length;

  if (loading) {
    return (
      <div
        style={{
          height: 200,
          borderRadius: 20,
          background: H.white,
          boxShadow: H.shadow,
        }}
        className="animate-pulse"
      />
    );
  }

  return (
    <HCard
      title="Доступність по містах"
      subtitle={`${enabledCount} з ${rows.length} міст увімкнено`}
      icon={MapPin}
      footer={
        <HSaveButton
          onClick={handleSave}
          saved={saving === 'cities'}
        />
      }
    >
      <div className="space-y-2">
        {/* Header */}
        <div
          className="grid items-center gap-3 px-3 py-2"
          style={{
            gridTemplateColumns: '40px 1fr 140px 140px',
            fontSize: 12,
            fontWeight: 700,
            color: H.gray,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <div />
          <div>Мiсто</div>
          <div>Доставка ($)</div>
          <div>Мiн. днiв</div>
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div
            key={row.cityId}
            className="grid items-center gap-3 px-3"
            style={{
              gridTemplateColumns: '40px 1fr 140px 140px',
              padding: '10px 12px',
              borderRadius: 12,
              background: row.enabled ? `${H.purple}08` : 'transparent',
              border: `1px solid ${row.enabled ? `${H.purple}20` : H.grayLight}`,
              transition: 'all 0.2s ease',
            }}
          >
            {/* Toggle */}
            <button
              onClick={() => toggleCity(row.cityId)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `2px solid ${row.enabled ? H.purple : H.grayLight}`,
                background: row.enabled ? H.purple : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {row.enabled && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* City Name */}
            <div
              style={{
                fontSize: 14,
                fontWeight: row.enabled ? 600 : 500,
                color: row.enabled ? H.navyDark : H.gray,
              }}
            >
              {row.nameUk}
            </div>

            {/* Delivery Fee */}
            {row.enabled ? (
              <div className="flex items-center gap-1">
                <Truck style={{ width: 14, height: 14, color: H.gray, flexShrink: 0 }} />
                <input
                  type="number"
                  min={0}
                  value={row.deliveryFee}
                  onChange={(e) => updateField(row.cityId, 'deliveryFee', Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${H.grayLight}`,
                    fontSize: 13,
                    fontFamily: H.font,
                    color: H.navyDark,
                    background: H.white,
                    outline: 'none',
                  }}
                />
              </div>
            ) : (
              <div style={{ color: H.grayLight, fontSize: 13 }}>--</div>
            )}

            {/* Min Rental Days */}
            {row.enabled ? (
              <input
                type="number"
                min={1}
                value={row.minRentalDays}
                onChange={(e) => updateField(row.cityId, 'minRentalDays', Math.max(1, Number(e.target.value) || 1))}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: `1px solid ${H.grayLight}`,
                  fontSize: 13,
                  fontFamily: H.font,
                  color: H.navyDark,
                  background: H.white,
                  outline: 'none',
                }}
              />
            ) : (
              <div style={{ color: H.grayLight, fontSize: 13 }}>--</div>
            )}
          </div>
        ))}
      </div>
    </HCard>
  );
}
