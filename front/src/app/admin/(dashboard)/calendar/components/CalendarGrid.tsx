'use client';

import React, { useMemo } from 'react';
import {
  Loader2,
  CalendarDays,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import type { Interval, CarRow } from './calendar-types';
import {
  CELL_W,
  ROW_H,
  CAR_COL_W,
  SUMMARY_H,
  MONTH_BAND_H,
  DAY_HEAD_H,
  TYPE_STYLES,
  DAY_MS,
  fmtWeekday,
  isWeekend,
  isToday,
  intervalCols,
  calcCarUtilization,
  hasConflict,
  utilColor,
  startOfDay,
} from './calendar-types';

const HEADER_H = MONTH_BAND_H + DAY_HEAD_H + SUMMARY_H;

interface BarPos {
  col: number;
  span: number;
  lane: number;
  totalLanes: number;
  clipL: boolean;
  clipR: boolean;
}

function assignLanes(intervals: Interval[], rangeStart: Date, days: number) {
  const items: { iv: Interval; pos: BarPos }[] = [];
  for (const iv of intervals) {
    const cols = intervalCols(iv, rangeStart, days);
    if (!cols) continue;
    const startMs = startOfDay(new Date(iv.startDate)).getTime();
    const endMs = iv.endDate
      ? new Date(iv.endDate).getTime()
      : startMs + DAY_MS;
    const rangeStartMs = rangeStart.getTime();
    const rangeEndMs = rangeStartMs + days * DAY_MS;
    items.push({
      iv,
      pos: {
        col: cols.col,
        span: cols.span,
        lane: 0,
        totalLanes: 1,
        clipL: startMs < rangeStartMs,
        clipR: endMs > rangeEndMs,
      },
    });
  }
  items.sort((a, b) => a.pos.col - b.pos.col);
  const laneEnds: number[] = [];
  for (const item of items) {
    let lane = laneEnds.findIndex((end) => end <= item.pos.col);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = item.pos.col + item.pos.span;
    item.pos.lane = lane;
  }
  const total = Math.max(1, laneEnds.length);
  for (const item of items) item.pos.totalLanes = total;
  return items;
}

// Reference design renders the car row without a thumbnail — just
// name + plate + category + donut. Keep the helper as a no-op so the
// grid markup doesn't have to care.
function CarThumb(_props: { name: string; H: ThemeTokens }) {
  return null;
}

function LoadDonut({ pct, H }: { pct: number; H: ThemeTokens }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  const tone = pct >= 80 ? 'hot' : pct >= 50 ? 'warm' : '';
  return (
    <div className={`cal-car-load ${tone}`} title={`${pct}%`}>
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle
          className="track"
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3.5"
        />
        <circle
          className="bar"
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={`${off}`}
        />
      </svg>
      <span className="pct">{pct}</span>
    </div>
  );
}

export function CalendarGrid({
  H,
  loading,
  fetchError,
  data,
  filteredCars,
  scrollRef,
  days,
  gridW,
  rangeStart,
  dateColumns,
  monthGroups,
  daySummary,
  totalCarsCount,
  fleetSummary,
  nowLineInfo,
  todayFlash,
  checkRange,
  availabilityMap,
  visibleTypes,
  carSearch,
  onFetchData,
  onBarHover,
  onBarLeave,
  onBarClick,
  onCellClick,
  onCarClick,
}: {
  H: ThemeTokens;
  loading: boolean;
  fetchError: boolean;
  data: any;
  filteredCars: CarRow[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  days: number;
  gridW: number;
  rangeStart: Date;
  dateColumns: Date[];
  monthGroups: { label: string; span: number }[];
  daySummary: number[];
  totalCarsCount: number;
  fleetSummary: { avgLoad: number; freeNow: number; totalActive: number };
  nowLineInfo: { left: number; timeStr: string; todayCol: number } | null;
  todayFlash: boolean;
  checkRange: { start: number; end: number } | null;
  availabilityMap: Map<number, boolean> | null;
  visibleTypes: Set<string>;
  carSearch: string;
  onFetchData: () => void;
  onBarHover: (e: React.MouseEvent, interval: Interval) => void;
  onBarLeave: () => void;
  onBarClick: (interval: Interval) => void;
  onCellClick?: (carId: number, day: Date) => void;
  onCarClick?: (carId: number) => void;
}) {
  const { locale, t } = useAdminLocale();

  const fleetTone =
    fleetSummary.avgLoad >= 80
      ? 'hot'
      : fleetSummary.avgLoad >= 50
        ? 'warm'
        : '';

  /* Pre-compute lane assignments for each car so the row height can adapt */
  const carBarMap = useMemo(() => {
    const map = new Map<
      number,
      { items: { iv: Interval; pos: BarPos }[]; rowH: number }
    >();
    for (const row of filteredCars) {
      const filtered = row.intervals.filter((iv) =>
        visibleTypes.has(iv.type),
      );
      const items = assignLanes(filtered, rangeStart, days);
      const total = items.length
        ? Math.max(1, ...items.map((i) => i.pos.totalLanes))
        : 1;
      const rowH = total > 1 ? Math.max(ROW_H, 28 * total + 16) : ROW_H;
      map.set(row.car.id, { items, rowH });
    }
    return map;
  }, [filteredCars, visibleTypes, rangeStart, days]);

  if (fetchError && !data) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 256,
          gap: 12,
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
        }}
      >
        <AlertTriangle style={{ width: 32, height: 32, color: H.orange }} />
        <p style={{ fontSize: 13, color: H.gray, fontFamily: H.font, margin: 0 }}>
          {t('calendar.loadError')}
        </p>
        <button
          type="button"
          onClick={onFetchData}
          className="cal-btn-primary"
          style={{ fontSize: 12, padding: '8px 20px' }}
        >
          {t('calendar.retry')}
        </button>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 256,
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
        }}
      >
        <Loader2
          style={{ width: 32, height: 32, color: H.purple }}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="cal-grid-wrap">
      <div style={{ width: CAR_COL_W + gridW, position: 'relative' }}>
          {/* ── Sticky header (month band + day cells + occupancy) ── */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 20,
              display: 'flex',
              background: H.white,
            }}
          >
            {/* Fleet summary panel (sticky left) */}
            <div
              className="cal-fleet-head"
              style={{
                position: 'sticky',
                left: 0,
                zIndex: 30,
                width: CAR_COL_W,
                minWidth: CAR_COL_W,
                height: HEADER_H,
              }}
            >
              <div className="h-month">
                <CalendarDays />
                <span className="park-label">
                  {t('calendar.fleetTitle')}
                </span>
                <span className="park-count">{filteredCars.length}</span>
              </div>
              <div className="h-summary">
                <div className="sum-item">
                  <div className="sum-val">
                    {fleetSummary.avgLoad}
                    <span className="suf">%</span>
                  </div>
                  <div className="sum-key">{t('calendar.avgLoad')}</div>
                  <div className="sum-bar">
                    <div
                      className={`sum-bar-fill ${fleetTone}`}
                      style={{ width: `${fleetSummary.avgLoad}%` }}
                    />
                  </div>
                </div>
                <div className="sum-divider" />
                <div className="sum-item">
                  <div className="sum-val">
                    {fleetSummary.freeNow}
                    <span className="suf">/{fleetSummary.totalActive}</span>
                  </div>
                  <div className="sum-key">{t('calendar.freeNow')}</div>
                </div>
              </div>
            </div>

            {/* Right side: month band, day heads, occupancy band */}
            <div style={{ width: gridW, position: 'relative' }}>
              <div
                className="cal-month-band"
                style={{ width: gridW, height: MONTH_BAND_H }}
              >
                {(() => {
                  let acc = 0;
                  return monthGroups.map((g, i) => {
                    const left = acc * CELL_W;
                    const w = g.span * CELL_W;
                    acc += g.span;
                    return (
                      <React.Fragment key={i}>
                        <div
                          className={`cal-month-label ${i % 2 ? 'alt' : ''}`}
                          style={{ left, width: w }}
                        >
                          {g.label}
                        </div>
                        {i > 0 && (
                          <div
                            className="cal-month-divider"
                            style={{ left }}
                          />
                        )}
                      </React.Fragment>
                    );
                  });
                })()}

                {/* Now-time badge */}
                {nowLineInfo && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: nowLineInfo.left,
                      transform: 'translateX(-50%)',
                      zIndex: 5,
                    }}
                  >
                    <span className="cal-now-badge">
                      {nowLineInfo.timeStr}
                    </span>
                  </div>
                )}
              </div>

              {/* Day heads */}
              <div
                style={{
                  display: 'flex',
                  height: DAY_HEAD_H,
                  background: H.bg,
                  borderBottom: `1px solid ${H.grayLight}`,
                }}
              >
                {dateColumns.map((d, i) => {
                  const td = isToday(d);
                  const we = isWeekend(d);
                  const isMon = d.getDay() === 1;
                  const isFirst = d.getDate() === 1;
                  return (
                    <div
                      key={i}
                      className={[
                        'cal-day-head',
                        we ? 'weekend' : '',
                        td ? 'today' : '',
                        isMon ? 'week-start' : '',
                        isFirst ? 'month-start' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ width: CELL_W }}
                    >
                      <span className="dow">{fmtWeekday(d, locale)}</span>
                      <span
                        className="num"
                        style={{
                          animation:
                            td && todayFlash
                              ? 'todayPulse 0.6s ease'
                              : 'none',
                        }}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Occupancy band */}
              <div
                style={{
                  display: 'flex',
                  height: SUMMARY_H,
                  background: H.white,
                  borderBottom: `1px solid ${H.grayLight}`,
                }}
              >
                {dateColumns.map((d, i) => {
                  const count = daySummary[i] || 0;
                  const td = isToday(d);
                  const we = isWeekend(d);
                  const pct =
                    totalCarsCount > 0
                      ? Math.round((count / totalCarsCount) * 100)
                      : 0;
                  const tone = pct >= 80 ? 'hot' : pct >= 50 ? 'warm' : '';
                  return (
                    <div
                      key={i}
                      className={`cal-occ-cell ${we ? 'weekend' : ''} ${td ? 'today' : ''}`}
                      style={{ width: CELL_W }}
                    >
                      <span className="occ-label">
                        {count}/{totalCarsCount}
                      </span>
                      <div className="cal-occ-bar">
                        <div
                          className={`cal-occ-bar-fill ${tone}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Data rows ── */}
          {filteredCars.length === 0 ? (
            <div className="cal-empty">
              {carSearch.trim()
                ? t('calendar.carNotFound')
                : t('calendar.noCars')}
            </div>
          ) : (
            filteredCars.map((row) => {
              const util = calcCarUtilization(
                row.intervals,
                rangeStart,
                days,
              );
              const isAvail = availabilityMap?.get(row.car.id);
              const hasAvailCheck = availabilityMap != null;
              const cellHeight =
                carBarMap.get(row.car.id)?.rowH ?? ROW_H;
              const items = carBarMap.get(row.car.id)?.items ?? [];

              return (
                <div
                  key={row.car.id}
                  style={{ display: 'flex', height: cellHeight }}
                >
                  {/* Car cell — sticky left */}
                  <div
                    className="cal-car-cell"
                    style={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 10,
                      width: CAR_COL_W,
                      minWidth: CAR_COL_W,
                      height: cellHeight,
                      background:
                        hasAvailCheck && isAvail === true
                          ? `${H.green}10`
                          : hasAvailCheck && isAvail === false
                            ? `${H.red}10`
                            : H.white,
                      borderLeft: hasAvailCheck
                        ? `3px solid ${isAvail ? H.green : H.red}`
                        : '3px solid transparent',
                    }}
                    onClick={() => onCarClick?.(row.car.id)}
                  >
                    <CarThumb name={row.car.name} H={H} />
                    <div className="cal-car-info">
                      <div className="cal-car-name">{row.car.name}</div>
                      <div className="cal-car-meta">
                        {row.car.plateNumber && (
                          <span className="plate">{row.car.plateNumber}</span>
                        )}
                        {row.car.plateNumber && row.car.category && (
                          <span className="dot" />
                        )}
                        {row.car.category && <span>{row.car.category}</span>}
                      </div>
                    </div>
                    <LoadDonut pct={util} H={H} />
                  </div>

                  {/* Calendar cells + bars */}
                  <div
                    style={{
                      position: 'relative',
                      width: gridW,
                      height: cellHeight,
                      borderBottom: `1px solid ${H.grayLight}40`,
                    }}
                  >
                    {/* Day cells */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                      {dateColumns.map((d, i) => {
                        const td = isToday(d);
                        const we = isWeekend(d);
                        const inRange =
                          checkRange &&
                          i >= checkRange.start &&
                          i < checkRange.end;
                        const isMon = d.getDay() === 1;
                        const isFirst = d.getDate() === 1;
                        const availClass =
                          inRange && hasAvailCheck
                            ? isAvail
                              ? 'avail-match'
                              : 'avail-miss'
                            : '';
                        return (
                          <div
                            key={i}
                            data-day={d.getDate()}
                            className={[
                              'cal-cell',
                              we ? 'weekend' : '',
                              td ? 'today' : '',
                              isMon ? 'week-start' : '',
                              isFirst ? 'month-start' : '',
                              availClass,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            style={{ width: CELL_W }}
                            onClick={() => onCellClick?.(row.car.id, d)}
                          />
                        );
                      })}
                    </div>

                    {/* Now-line */}
                    {nowLineInfo && (
                      <div
                        className="cal-now-line"
                        style={{ left: nowLineInfo.left }}
                      />
                    )}

                    {/* Bars */}
                    {items.map(({ iv, pos }) => {
                      const ts = TYPE_STYLES[iv.type] ?? TYPE_STYLES.rental;
                      const conflict = hasConflict(
                        row.intervals.filter((x) => visibleTypes.has(x.type)),
                        iv,
                      );
                      const compact = pos.totalLanes > 1;
                      const barH = compact ? 28 : 36;
                      const top = 10 + pos.lane * (barH + 4);
                      const left = pos.col * CELL_W + 2;
                      const width = pos.span * CELL_W - 4;
                      const status = iv.status ?? '';
                      const cancelled =
                        status === 'cancelled' || status === 'no_show';
                      return (
                        <div
                          key={`${iv.type}-${iv.id}`}
                          className={[
                            'cal-bar',
                            iv.type,
                            status,
                            conflict ? 'has-conflict' : '',
                            pos.clipL ? 'clip-l' : '',
                            pos.clipR ? 'clip-r' : '',
                            compact ? 'compact' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{
                            left,
                            width,
                            top,
                            height: barH,
                            background: cancelled ? undefined : ts.gradient,
                            boxShadow: conflict ? undefined : ts.shadow,
                          }}
                          onMouseEnter={(e) => onBarHover(e, iv)}
                          onMouseLeave={onBarLeave}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBarLeave();
                            onBarClick(iv);
                          }}
                        >
                          {pos.clipL && (
                            <span className="clip-arrow left" aria-hidden="true">
                              <ChevronRight />
                            </span>
                          )}
                          <span className="status-dot" />
                          <span className="bar-name">
                            {iv.clientName || iv.label}
                          </span>
                          {!compact && (
                            <span className="bar-when">
                              {String(
                                new Date(iv.startDate).getDate(),
                              ).padStart(2, '0')}
                              .
                              {String(
                                new Date(iv.startDate).getMonth() + 1,
                              ).padStart(2, '0')}
                              {' – '}
                              {iv.endDate
                                ? `${String(new Date(iv.endDate).getDate()).padStart(2, '0')}.${String(new Date(iv.endDate).getMonth() + 1).padStart(2, '0')}`
                                : '...'}
                            </span>
                          )}
                          {pos.clipR && (
                            <span className="clip-arrow" aria-hidden="true">
                              <ChevronRight />
                            </span>
                          )}
                          {conflict && (
                            <div className="cal-conflict" title="!">
                              <AlertTriangle />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
    </div>
  );
}
