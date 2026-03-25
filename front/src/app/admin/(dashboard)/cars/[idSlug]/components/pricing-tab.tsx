'use client';

import React from 'react';
import { DollarSign, Shield, Sparkles, Tag } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { CarCountingRule, RentalTariff, Segment } from '@/types/cars';
import { HCard, HSaveButton, HInput, HTariffField } from './ui-primitives';

const COVERAGE_LABELS: Record<number, string> = {
  0: 'Без покриття',
  50: '50% покриття',
  100: '100% покриття',
};

interface PricingTabProps {
  tariffs: RentalTariff[];
  deposit: number;
  setDeposit: (val: number) => void;
  segmentInfo: Segment | null;
  saving: string | null;
  onUpdateLocalTariff: (min: number, max: number, val: string) => void;
  onSaveTariffs: () => void;
  currentDiscount: number | null;
  onChangeDiscount: (val: string) => void;
  isNew: boolean;
  onToggleNew: () => void;
  countingRules: CarCountingRule[];
  setCountingRules: (rules: CarCountingRule[]) => void;
  onSaveCoverage: () => void;
}

export function PricingTab({
  tariffs,
  deposit,
  setDeposit,
  segmentInfo,
  saving,
  onUpdateLocalTariff,
  onSaveTariffs,
  currentDiscount,
  onChangeDiscount,
  isNew,
  onToggleNew,
  countingRules,
  setCountingRules,
  onSaveCoverage,
}: PricingTabProps) {
  const { H } = useAdminTheme();

  const updateRule = (index: number, field: 'priceFixed' | 'priceFixed30' | 'pricePercent' | 'depositPercent', value: string) => {
    const next = [...countingRules];
    if (field === 'priceFixed' || field === 'priceFixed30') {
      next[index] = { ...next[index], [field]: value === '' ? null : Number(value) };
    } else {
      next[index] = { ...next[index], [field]: Number(value) || 0 };
    }
    setCountingRules(next);
  };

  return (
    <div className="space-y-5">
      <HCard
        title="Стоимость аренды"
        subtitle="USD / сутки"
        icon={DollarSign}
        footer={<HSaveButton onClick={onSaveTariffs} saved={saving === 'tariffs'} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <HTariffField label="1–2 дня" min={1} max={2} tariffs={tariffs} onChange={onUpdateLocalTariff} />
          <HTariffField label="3–7 дней" min={3} max={7} tariffs={tariffs} onChange={onUpdateLocalTariff} />
          <HTariffField label="8–29 дней" min={8} max={29} tariffs={tariffs} onChange={onUpdateLocalTariff} />
          <HTariffField label="30+ дней" min={30} max={0} tariffs={tariffs} onChange={onUpdateLocalTariff} />
          <HInput
            label="Залог (USD)"
            value={String(deposit)}
            onChange={(v) => setDeposit(Number(v))}
            type="number"
            placeholder="0"
          />
          <HInput
            label="Перепробег ($/км)"
            value={String(segmentInfo?.overmileagePrice || '')}
            onChange={() => {}}
            disabled
          />
        </div>
      </HCard>

      <HCard
        title="Покриття (страховка)"
        subtitle="Надбавка за день та зниження застави"
        icon={Shield}
        footer={<HSaveButton onClick={onSaveCoverage} saved={saving === 'coverage'} />}
      >
        <div className="space-y-4">
          {countingRules
            .sort((a, b) => a.depositPercent - b.depositPercent)
            .map((rule, idx) => {
              const label = COVERAGE_LABELS[rule.depositPercent] ?? `${rule.depositPercent}%`;
              const isBase = rule.depositPercent === 0;
              return (
                <div key={rule.id ?? idx} style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: H.bg,
                }}>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: H.navy,
                    marginBottom: 12,
                  }}>
                    {label}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <HInput
                      label="Надбавка (USD/день)"
                      value={rule.priceFixed != null ? String(rule.priceFixed) : ''}
                      onChange={(v) => updateRule(idx, 'priceFixed', v)}
                      type="number"
                      placeholder={isBase ? '0' : 'Ціна'}
                      disabled={isBase}
                    />
                    <HInput
                      label="29+ днів (USD/міс)"
                      value={rule.priceFixed30 != null ? String(rule.priceFixed30) : ''}
                      onChange={(v) => updateRule(idx, 'priceFixed30', v)}
                      type="number"
                      placeholder={isBase ? '0' : 'Ціна'}
                      disabled={isBase}
                    />
                    <HInput
                      label="Надбавка (%)"
                      value={String(rule.pricePercent)}
                      onChange={(v) => updateRule(idx, 'pricePercent', v)}
                      type="number"
                      placeholder="0"
                      disabled={isBase}
                    />
                    <HInput
                      label="Зниження застави (%)"
                      value={String(rule.depositPercent)}
                      onChange={(v) => updateRule(idx, 'depositPercent', v)}
                      type="number"
                      placeholder="0"
                      disabled={isBase}
                    />
                  </div>
                  {!isBase && (rule.priceFixed != null || rule.priceFixed30 != null) && (
                    <p style={{ fontSize: 11, color: H.gray, marginTop: 8 }}>
                      {rule.priceFixed != null && `1–29 днів: +${rule.priceFixed} USD/день`}
                      {rule.priceFixed != null && rule.priceFixed30 != null && ' · '}
                      {rule.priceFixed30 != null && `29+ днів: ${rule.priceFixed30} USD/міс`}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </HCard>

      <HCard title="Скидки и атрибуты" icon={Tag}>
        <div className="space-y-6">
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Скидка
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onChangeDiscount('none')}
                style={{
                  borderRadius: 49,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: currentDiscount === null || currentDiscount === 0
                    ? H.navy
                    : H.bg,
                  color: currentDiscount === null || currentDiscount === 0
                    ? H.white
                    : H.gray,
                }}
              >
                Без скидки
              </button>
              {[5, 10, 15, 20, 25, 30, 35].map((val) => {
                const isActive = currentDiscount === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChangeDiscount(`-${val}`)}
                    style={{
                      borderRadius: 49,
                      padding: '8px 18px',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: isActive
                        ? 'linear-gradient(135deg, #FFB547 0%, #FF9100 100%)'
                        : H.bg,
                      color: isActive ? H.white : '#FF9100',
                      boxShadow: isActive ? '0 4px 12px rgba(255, 145, 0, 0.25)' : 'none',
                    }}
                  >
                    -{val}%
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Метки
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onToggleNew}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 49,
                  padding: '10px 22px',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: isNew
                    ? `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`
                    : H.bg,
                  color: isNew ? H.white : H.purple,
                  boxShadow: isNew ? '0 4px 12px rgba(67, 24, 255, 0.25)' : 'none',
                }}
              >
                <Sparkles style={{ width: 15, height: 15 }} /> NEW
              </button>
            </div>
          </div>
        </div>
      </HCard>
    </div>
  );
}
