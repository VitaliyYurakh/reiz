'use client';

import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  CalendarDays,
  ChevronDown,
  Check,
  ScanSearch,
} from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { TYPE_STYLES, PERIOD_OPTIONS, DAY_MS } from './calendar-types';

export function CalendarHeader({
  H,
  rangeLabel,
  carSearch,
  onCarSearchChange,
  days,
  onDaysChange,
  onNavigate,
  onGoToday,
  onRefresh,
  loading,
  visibleTypes,
  onToggleType,
  availCheck,
  onToggleAvailCheck,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  availCount,
}: {
  H: ThemeTokens;
  rangeLabel: string;
  carSearch: string;
  onCarSearchChange: (v: string) => void;
  days: number;
  onDaysChange: (v: number) => void;
  onNavigate: (dir: -1 | 1) => void;
  onGoToday: () => void;
  onRefresh: () => void;
  loading: boolean;
  visibleTypes: Set<string>;
  onToggleType: (type: string) => void;
  availCheck: boolean;
  onToggleAvailCheck: () => void;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  availCount: { available: number; total: number } | null;
}) {
  const { t } = useAdminLocale();
  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        padding: '20px 28px',
        marginBottom: 24,
        boxShadow: H.shadow,
      }}
    >
      {/* Row 1: Title + Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Title */}
        <div style={{ marginRight: 'auto' }}>
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-purple">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="h-title">{t('calendar.title')}</h1>
              <span className="h-subtitle">{rangeLabel}</span>
            </div>
          </div>
        </div>

        {/* Car search */}
        <div style={{ position: 'relative' }}>
          <Search
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
              color: H.gray,
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={carSearch}
            onChange={(e) => onCarSearchChange(e.target.value)}
            placeholder={t('calendar.searchCar')}
            style={{
              height: 40,
              width: 180,
              paddingLeft: 38,
              paddingRight: 14,
              borderRadius: 49,
              border: 'none',
              background: H.white,
              boxShadow: H.shadowMd,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: H.font,
              color: H.navy,
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onFocus={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 0 2px ${H.purpleLight}50, ${H.shadowMd}`)
            }
            onBlur={(e) => (e.currentTarget.style.boxShadow = H.shadowMd)}
          />
        </div>

        {/* Period selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={String(days)}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            style={{
              height: 40,
              padding: '0 36px 0 16px',
              borderRadius: 49,
              border: 'none',
              background: H.white,
              boxShadow: H.shadowMd,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: H.font,
              color: H.navy,
              cursor: 'pointer',
              appearance: 'none',
              outline: 'none',
            }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
          <ChevronDown
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
              color: H.gray,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Navigation group */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            background: H.white,
            borderRadius: 49,
            padding: 4,
            boxShadow: H.shadowMd,
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="cal-nav-btn"
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <button
            type="button"
            onClick={onGoToday}
            className="h-btn h-btn-primary h-btn-sm"
            style={{ borderRadius: 49, height: 32 }}
          >
            {t('calendar.today')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="cal-nav-btn"
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          style={{
            width: 40,
            height: 40,
            borderRadius: 49,
            border: 'none',
            background: H.white,
            boxShadow: H.shadowMd,
            color: H.gray,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = H.purple;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = H.gray;
          }}
        >
          <RefreshCw
            style={{ width: 15, height: 15 }}
            className={loading ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {/* Row 2: Type filter pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${H.grayLight}40`,
        }}
      >
        {Object.entries(TYPE_STYLES).map(([key, ts]) => {
          const active = visibleTypes.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleType(key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 18px',
                borderRadius: 49,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: H.font,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: active ? ts.gradient : H.white,
                color: active ? '#fff' : H.gray,
                boxShadow: active ? ts.shadow : H.shadowMd,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: active ? 'rgba(255,255,255,0.6)' : H.grayLight,
                  transition: 'background 0.2s',
                }}
              />
              {t(ts.labelKey)}
            </button>
          );
        })}

        {/* Availability check toggle */}
        <div style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={onToggleAvailCheck}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 18px',
              borderRadius: 49,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: H.font,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: availCheck
                ? `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`
                : H.white,
              color: availCheck ? '#fff' : H.navy,
              boxShadow: availCheck
                ? '0 4px 12px rgba(67, 24, 255, 0.3)'
                : H.shadowMd,
            }}
          >
            <ScanSearch style={{ width: 14, height: 14 }} />
            {t('calendar.checkAvailability')}
          </button>
        </div>
      </div>

      {/* Row 3: Availability date range (conditional) */}
      {availCheck && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 14,
            padding: '14px 20px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${H.purple}06 0%, ${H.purpleLight}06 100%)`,
            border: `1px solid ${H.purple}18`,
          }}
        >
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: H.gray,
              fontFamily: H.font,
            }}
          >
            {t('calendar.pickup')}
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 49,
              border: 'none',
              background: H.white,
              boxShadow: H.shadowMd,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: H.font,
              color: H.navy,
              outline: 'none',
            }}
          />
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: H.gray,
              fontFamily: H.font,
            }}
          >
            {t('calendar.return_')}
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 49,
              border: 'none',
              background: H.white,
              boxShadow: H.shadowMd,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: H.font,
              color: H.navy,
              outline: 'none',
            }}
          />

          {checkIn && checkOut && new Date(checkIn) < new Date(checkOut) && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: H.gray,
                fontFamily: H.font,
                marginLeft: 4,
              }}
            >
              {Math.round(
                (new Date(checkOut).getTime() -
                  new Date(checkIn).getTime()) /
                  DAY_MS,
              )}{' '}
              {t('common.days')}
            </div>
          )}

          {availCount && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 49,
                  background: H.greenBg,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: H.font,
                  color: H.green,
                }}
              >
                <Check style={{ width: 14, height: 14 }} />
                {t('calendar.availableOf', { available: String(availCount.available), total: String(availCount.total) })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
