'use client';

import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  CalendarDays,
  Check,
  X,
  ChevronsLeftRight,
} from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { TYPE_STYLES, PERIOD_OPTIONS, DAY_MS } from './calendar-types';

export function CalendarHeader({
  H,
  rangeLabel,
  fleetCount,
  carSearch,
  onCarSearchChange,
  days,
  onDaysChange,
  onNavigate,
  onGoToday,
  onRefresh,
  loading,
  visibleTypes,
  typeCounts,
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
  fleetCount: number;
  carSearch: string;
  onCarSearchChange: (v: string) => void;
  days: number;
  onDaysChange: (v: number) => void;
  onNavigate: (dir: -1 | 1) => void;
  onGoToday: () => void;
  onRefresh: () => void;
  loading: boolean;
  visibleTypes: Set<string>;
  typeCounts: Record<string, number>;
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
  const activeTypeCount = visibleTypes.size;
  const totalTypes = Object.keys(TYPE_STYLES).length;

  return (
    <>
      {/* Row 1: Title + main controls */}
      <div className="cal-toolbar">
        <div className="cal-title">
          <div className="cal-title-icon">
            <CalendarDays />
          </div>
          <div className="cal-title-text">
            <h1>{t('calendar.titleFull')}</h1>
            <div className="sub">
              {rangeLabel} · {t('calendar.fleetSize', { count: String(fleetCount) })}
            </div>
          </div>
        </div>

        <div className="cal-toolbar-spacer" />

        <label className="cal-pill" aria-label={t('calendar.searchCar')}>
          <Search />
          <input
            type="text"
            value={carSearch}
            onChange={(e) => onCarSearchChange(e.target.value)}
            placeholder={t('calendar.searchCar')}
          />
        </label>

        <div className="cal-pill cal-select">
          <ChevronsLeftRight />
          <select
            value={String(days)}
            onChange={(e) => onDaysChange(Number(e.target.value))}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="cal-datenav">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            aria-label="prev"
          >
            <ChevronLeft />
          </button>
          <button type="button" className="today" onClick={onGoToday}>
            {t('calendar.today')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            aria-label="next"
          >
            <ChevronRight />
          </button>
        </div>

        <button
          type="button"
          className="cal-icon-btn"
          onClick={onRefresh}
          disabled={loading}
          aria-label="refresh"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Row 2: Filter chips + availability toggle */}
      <div className="cal-toolbar" style={{ padding: '12px 22px' }}>
        <div className="cal-filters">
          {Object.entries(TYPE_STYLES).map(([key, ts]) => {
            const active = visibleTypes.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleType(key)}
                className={`cal-chip cal-chip-${key} ${active ? 'active' : 'muted'}`}
              >
                <span className="swatch" style={{ background: ts.dot }} />
                {t(ts.labelKey)}
                <span className="count">{typeCounts[key] ?? 0}</span>
              </button>
            );
          })}

          <div className="cal-filter-divider" />
          <span style={{ fontSize: 12, color: H.gray, fontWeight: 500 }}>
            {t('calendar.shownTypes', {
              shown: String(activeTypeCount),
              total: String(totalTypes),
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleAvailCheck}
          className={`cal-availability-btn ${availCheck ? 'active' : ''}`}
        >
          {availCheck ? <X /> : <Check />}
          {availCheck
            ? t('calendar.hideAvailability')
            : t('calendar.checkAvailability')}
        </button>
      </div>

      {/* Row 3: Availability date inputs */}
      {availCheck && (
        <div className="cal-availability-bar">
          <span className="label">{t('calendar.availabilityWindow')}</span>
          <div className="field">
            <label htmlFor="cal-check-in">{t('calendar.pickup')}</label>
            <input
              id="cal-check-in"
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="cal-check-out">{t('calendar.return_')}</label>
            <input
              id="cal-check-out"
              type="date"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
            />
          </div>

          {checkIn && checkOut && new Date(checkIn) < new Date(checkOut) && (
            <span style={{ fontSize: 12, color: H.gray, fontWeight: 600 }}>
              {Math.round(
                (new Date(checkOut).getTime() -
                  new Date(checkIn).getTime()) /
                  DAY_MS,
              )}{' '}
              {t('common.days')}
            </span>
          )}

          {availCount && (
            <div className="result">
              <Check style={{ width: 16, height: 16, color: H.green }} />
              {t('calendar.availableOf', {
                available: String(availCount.available),
                total: String(availCount.total),
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
