'use client';

import React from 'react';
import { ClipboardList, DollarSign, Globe, Shield, Sparkles, Tag } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { CarCountingRule, RentalTariff, Segment } from '@/types/cars';
import { HCard, HSaveButton, HInput, HTariffField } from './ui-primitives';

const COVERAGE_LABELS: Record<number, string> = {
  0: 'Без покриття',
  50: '50% покриття',
  100: '100% покриття',
};

interface RentalConditionsState {
  freeDeliveryThreshold: number;
  cancellationHours: number;
  paymentMethods: string;
  minRentalDays: number;
  dailyMileageLimit: number;
  overmileagePrice: number;
  driverAge: number;
  driverExperience: number;
  fuelPolicy: string;
  weeklyMileageLimit: number;
  monthlyMileageLimit: number;
  unlimitedMileage: boolean;
  maxRentalDays: number;
  allowCrossBorder: boolean;
  crossBorderFee: number;
  crossBorderDailyFee: number;
  allowedCountries: string;
  lateReturnGraceMin: number;
  lateReturnFeePerHour: number;
  youngerDriverAge: number;
  youngerDriverSurcharge: number;
  petAllowed: boolean;
  cleaningFee: number;
}

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
  rentalConditions: RentalConditionsState;
  setRentalConditions: (val: RentalConditionsState) => void;
  onSaveRentalConditions: () => void;
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
  rentalConditions,
  setRentalConditions,
  onSaveRentalConditions,
}: PricingTabProps) {
  const { H } = useAdminTheme();

  const updateRule = (index: number, field: 'priceFixed' | 'priceFixed30' | 'pricePercent' | 'depositPercent' | 'depositFixed', value: string) => {
    const next = [...countingRules];
    if (field === 'priceFixed' || field === 'priceFixed30' || field === 'depositFixed') {
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
            value={String(rentalConditions.overmileagePrice)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, overmileagePrice: Number(v) || 0 })}
            type="number"
            placeholder={String(segmentInfo?.overmileagePrice || '0')}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                    <HInput
                      label="Застава (USD)"
                      value={rule.depositFixed != null ? String(rule.depositFixed) : ''}
                      onChange={(v) => updateRule(idx, 'depositFixed', v)}
                      type="number"
                      placeholder="Авто"
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

      <HCard
        title="Умови оренди"
        subtitle="Дані для сторінки авто"
        icon={ClipboardList}
        footer={<HSaveButton onClick={onSaveRentalConditions} saved={saving === 'rentalConditions'} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <HInput
            label="Безкоштовна доставка від (USD)"
            value={String(rentalConditions.freeDeliveryThreshold)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, freeDeliveryThreshold: Number(v) || 0 })}
            type="number"
            placeholder="351"
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Скасування
            </label>
            <select
              value={String(rentalConditions.cancellationHours)}
              onChange={(e) => setRentalConditions({ ...rentalConditions, cancellationHours: Number(e.target.value) })}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 16,
                border: 'none',
                backgroundColor: H.bg,
                padding: '0 16px',
                paddingRight: 36,
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
                transition: 'box-shadow 0.15s',
              }}
            >
              <option value="24">Безкоштовно за 24 год до подачі</option>
              <option value="48">Безкоштовно за 48 год до подачі</option>
              <option value="0">Безкоштовно</option>
            </select>
          </div>
          <HInput
            label="Способи оплати"
            value={rentalConditions.paymentMethods}
            onChange={(v) => setRentalConditions({ ...rentalConditions, paymentMethods: v })}
            placeholder="Готівка, банківська картка, онлайн"
          />
          <HInput
            label="Мін. термін оренди (діб)"
            value={String(rentalConditions.minRentalDays)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, minRentalDays: Number(v) || 1 })}
            type="number"
            placeholder="1"
          />
          <HInput
            label="Ліміт пробігу/добу (км)"
            value={String(rentalConditions.dailyMileageLimit)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, dailyMileageLimit: Number(v) || 0 })}
            type="number"
            placeholder="300"
          />
          <HInput
            label="Мін. вік водія (років)"
            value={String(rentalConditions.driverAge)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, driverAge: Number(v) || 21 })}
            type="number"
            placeholder="21"
          />
          <HInput
            label="Мін. стаж водіння (років)"
            value={String(rentalConditions.driverExperience)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, driverExperience: Number(v) || 2 })}
            type="number"
            placeholder="2"
          />
        </div>
      </HCard>

      <HCard
        title="Додаткові умови"
        subtitle="Паливо, пробіг, кордон, затримка"
        icon={Globe}
        footer={<HSaveButton onClick={onSaveRentalConditions} saved={saving === 'rentalConditions'} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Паливна політика
            </label>
            <select
              value={rentalConditions.fuelPolicy}
              onChange={(e) => setRentalConditions({ ...rentalConditions, fuelPolicy: e.target.value })}
              style={{
                width: '100%', height: 44, borderRadius: 16, border: 'none',
                backgroundColor: H.bg, padding: '0 16px', paddingRight: 36, fontSize: 14,
                fontWeight: 500, color: H.navy, fontFamily: H.font, outline: 'none',
                appearance: 'none', cursor: 'pointer',
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23A3AED0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="full_to_full">Повний → Повний</option>
              <option value="same_level">Такий же рівень</option>
              <option value="prepaid">Передоплачене паливо</option>
              <option value="included">Паливо включене</option>
            </select>
          </div>
          <HInput
            label="Пробіг/тиждень (км)"
            value={String(rentalConditions.weeklyMileageLimit)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, weeklyMileageLimit: Number(v) || 0 })}
            type="number"
            placeholder="1400"
          />
          <HInput
            label="Пробіг/місяць (км)"
            value={String(rentalConditions.monthlyMileageLimit)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, monthlyMileageLimit: Number(v) || 0 })}
            type="number"
            placeholder="4500"
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Безлімітний пробіг
            </label>
            <button
              type="button"
              onClick={() => setRentalConditions({ ...rentalConditions, unlimitedMileage: !rentalConditions.unlimitedMileage })}
              style={{
                borderRadius: 49, padding: '10px 22px', fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: rentalConditions.unlimitedMileage ? H.navy : H.bg,
                color: rentalConditions.unlimitedMileage ? H.white : H.gray,
              }}
            >
              {rentalConditions.unlimitedMileage ? '✓ Безлім' : 'Ні'}
            </button>
          </div>
          <HInput
            label="Макс. термін оренди (днів)"
            value={String(rentalConditions.maxRentalDays)}
            onChange={(v) => setRentalConditions({ ...rentalConditions, maxRentalDays: Number(v) || 0 })}
            type="number"
            placeholder="0 = без обмежень"
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Виїзд за кордон
            </label>
            <button
              type="button"
              onClick={() => setRentalConditions({ ...rentalConditions, allowCrossBorder: !rentalConditions.allowCrossBorder })}
              style={{
                borderRadius: 49, padding: '10px 22px', fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: rentalConditions.allowCrossBorder ? H.navy : H.bg,
                color: rentalConditions.allowCrossBorder ? H.white : H.gray,
              }}
            >
              {rentalConditions.allowCrossBorder ? '✓ Дозволено' : 'Заборонено'}
            </button>
          </div>
          {rentalConditions.allowCrossBorder && (
            <>
              <div>
                <HInput
                  label="Плата за виїзд (USD)"
                  value={String(rentalConditions.crossBorderFee)}
                  onChange={(v) => setRentalConditions({ ...rentalConditions, crossBorderFee: Number(v) || 0 })}
                  type="number"
                  placeholder="0"
                />
                <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = не відображається на сайті</p>
              </div>
              <div>
                <HInput
                  label="Плата за день за кордоном (USD)"
                  value={String(rentalConditions.crossBorderDailyFee)}
                  onChange={(v) => setRentalConditions({ ...rentalConditions, crossBorderDailyFee: Number(v) || 0 })}
                  type="number"
                  placeholder="0"
                />
                <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = не відображається на сайті</p>
              </div>
              <HInput
                label="Дозволені країни (через кому)"
                value={rentalConditions.allowedCountries}
                onChange={(v) => setRentalConditions({ ...rentalConditions, allowedCountries: v })}
                placeholder="Польща, Румунія, Молдова"
              />
            </>
          )}
          <div>
            <HInput
              label="Grace period (хв)"
              value={String(rentalConditions.lateReturnGraceMin)}
              onChange={(v) => setRentalConditions({ ...rentalConditions, lateReturnGraceMin: Number(v) || 0 })}
              type="number"
              placeholder="60"
            />
            <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = секція не відображається</p>
          </div>
          <div>
            <HInput
              label="Штраф за затримку (USD/год)"
              value={String(rentalConditions.lateReturnFeePerHour)}
              onChange={(v) => setRentalConditions({ ...rentalConditions, lateReturnFeePerHour: Number(v) || 0 })}
              type="number"
              placeholder="0"
            />
            <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = не відображається на сайті</p>
          </div>
          <div>
            <HInput
              label="Вік молодого водія (до)"
              value={String(rentalConditions.youngerDriverAge)}
              onChange={(v) => setRentalConditions({ ...rentalConditions, youngerDriverAge: Number(v) || 0 })}
              type="number"
              placeholder="25"
            />
            <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = секція не відображається</p>
          </div>
          <div>
            <HInput
              label="Доплата молодий водій (USD/день)"
              value={String(rentalConditions.youngerDriverSurcharge)}
              onChange={(v) => setRentalConditions({ ...rentalConditions, youngerDriverSurcharge: Number(v) || 0 })}
              type="number"
              placeholder="0"
            />
            <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = не відображається на сайті</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Тварини
            </label>
            <button
              type="button"
              onClick={() => setRentalConditions({ ...rentalConditions, petAllowed: !rentalConditions.petAllowed })}
              style={{
                borderRadius: 49, padding: '10px 22px', fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: rentalConditions.petAllowed ? '#16a34a' : H.bg,
                color: rentalConditions.petAllowed ? H.white : H.gray,
              }}
            >
              {rentalConditions.petAllowed ? '✓ Дозволено' : 'Заборонено'}
            </button>
          </div>
          <div>
            <HInput
              label="Штраф за прибирання (USD)"
              value={String(rentalConditions.cleaningFee)}
              onChange={(v) => setRentalConditions({ ...rentalConditions, cleaningFee: Number(v) || 0 })}
              type="number"
              placeholder="0"
            />
            <p style={{ fontSize: 11, color: H.gray, marginTop: 4 }}>0 = не відображається на сайті</p>
          </div>
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
