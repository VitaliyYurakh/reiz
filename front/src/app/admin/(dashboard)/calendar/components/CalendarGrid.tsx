'use client';

import React from 'react';
import {
  Loader2,
  Car,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import type { Interval, CarRow } from './calendar-types';
import {
  CELL_W,
  ROW_H,
  CAR_COL_W,
  SUMMARY_H,
  TYPE_STYLES,
  fmtWeekday,
  isWeekend,
  isToday,
  intervalCols,
  calcCarUtilization,
  hasConflict,
  utilColor,
} from './calendar-types';

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
}) {
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
        <AlertTriangle
          style={{ width: 32, height: 32, color: H.orange }}
        />
        <p
          style={{
            fontSize: 13,
            color: H.gray,
            fontFamily: H.font,
            margin: 0,
          }}
        >
          Не удалось загрузить данные календаря
        </p>
        <button
          type="button"
          onClick={onFetchData}
          className="cal-btn-primary"
          style={{ fontSize: 12, padding: '8px 20px' }}
        >
          Повторить
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
    <div
      ref={scrollRef}
      style={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 260px)',
        background: H.white,
        borderRadius: 20,
        boxShadow: H.shadow,
      }}
    >
      <div style={{ width: CAR_COL_W + gridW }}>
        {/* ── Sticky header ── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            display: 'flex',
          }}
        >
          {/* Car column header */}
          <div
            style={{
              position: 'sticky',
              left: 0,
              zIndex: 30,
              width: CAR_COL_W,
              minWidth: CAR_COL_W,
              height: 68 + SUMMARY_H,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background: H.bg,
              borderRight: `1px solid ${H.grayLight}`,
              borderBottom: `1px solid ${H.grayLight}`,
              padding: '0 16px 0 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                fontWeight: 700,
                color: H.gray,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                paddingBottom: 8,
              }}
            >
              <Car style={{ width: 12, height: 12 }} />
              Автомобиль
            </div>
            {/* Summary label */}
            <div
              style={{
                height: SUMMARY_H,
                display: 'flex',
                alignItems: 'center',
                fontSize: 10,
                fontWeight: 600,
                color: H.gray,
                borderTop: `1px solid ${H.grayLight}`,
              }}
            >
              Занято
            </div>
          </div>

          {/* Date headers + summary */}
          <div style={{ width: gridW, position: 'relative' }}>
            {/* Month row */}
            <div
              style={{
                display: 'flex',
                height: 26,
                background: H.bg,
                borderBottom: `1px solid ${H.grayLight}40`,
              }}
            >
              {monthGroups.map((g, i) => (
                <div
                  key={i}
                  style={{
                    width: g.span * CELL_W,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: H.navy,
                    textTransform: 'capitalize',
                    fontFamily: H.font,
                  }}
                >
                  {g.label}
                </div>
              ))}
            </div>

            {/* Day row */}
            <div
              style={{
                display: 'flex',
                height: 42,
                background: H.bg,
                borderBottom: `1px solid ${H.grayLight}`,
              }}
            >
              {dateColumns.map((d, i) => {
                const td = isToday(d);
                const we = isWeekend(d);
                const inRange =
                  checkRange &&
                  i >= checkRange.start &&
                  i < checkRange.end;
                return (
                  <div
                    key={i}
                    style={{
                      width: CELL_W,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      background: inRange
                        ? `${H.purple}10`
                        : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        lineHeight: 1,
                        color: inRange
                          ? H.purple
                          : we
                            ? `${H.red}99`
                            : `${H.gray}99`,
                        fontFamily: H.font,
                      }}
                    >
                      {fmtWeekday(d)}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        width: 24,
                        height: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1,
                        fontFamily: H.font,
                        color: td
                          ? H.white
                          : inRange
                            ? H.purple
                            : we
                              ? H.red
                              : H.navy,
                        background: td
                          ? `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`
                          : 'transparent',
                        boxShadow: td
                          ? '0 2px 8px rgba(67, 24, 255, 0.3)'
                          : 'none',
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

            {/* Summary row */}
            <div
              style={{
                display: 'flex',
                height: SUMMARY_H,
                background: `${H.bg}CC`,
                borderBottom: `1px solid ${H.grayLight}`,
              }}
            >
              {dateColumns.map((d, i) => {
                const count = daySummary[i] || 0;
                const ratio =
                  totalCarsCount > 0 ? count / totalCarsCount : 0;
                const color =
                  ratio >= 0.8
                    ? H.red
                    : ratio >= 0.5
                      ? H.orange
                      : count > 0
                        ? H.green
                        : `${H.gray}60`;
                return (
                  <div
                    key={i}
                    style={{
                      width: CELL_W,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: H.font,
                      color,
                    }}
                  >
                    {count > 0 ? `${count}/${totalCarsCount}` : '·'}
                  </div>
                );
              })}
            </div>

            {/* Dynamic now-line in header */}
            {nowLineInfo && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: nowLineInfo.left,
                  width: 2,
                  zIndex: 15,
                  pointerEvents: 'none',
                  background: H.red,
                  borderRadius: 1,
                  opacity: 0.7,
                }}
              >
                {/* Time badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: H.red,
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: H.font,
                    padding: '2px 5px',
                    borderRadius: 4,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {nowLineInfo.timeStr}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Data rows ── */}
        {filteredCars.map((row, rowIdx) => {
          const util = calcCarUtilization(
            row.intervals,
            rangeStart,
            days,
          );
          const uColor = utilColor(util, H);
          const isAvail = availabilityMap?.get(row.car.id);
          const hasAvailCheck = availabilityMap != null;

          return (
            <div
              key={row.car.id}
              style={{
                display: 'flex',
                height: ROW_H,
                background:
                  hasAvailCheck
                    ? isAvail
                      ? `${H.green}06`
                      : `${H.red}06`
                    : rowIdx % 2 === 0
                      ? H.white
                      : `${H.bg}60`,
              }}
            >
              {/* Car name — sticky left */}
              <div
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  width: CAR_COL_W,
                  minWidth: CAR_COL_W,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 16px',
                  borderRight: `1px solid ${H.grayLight}`,
                  borderBottom: `1px solid ${H.grayLight}40`,
                  borderLeft: hasAvailCheck
                    ? `3px solid ${isAvail ? H.green : H.red}`
                    : '3px solid transparent',
                  background:
                    hasAvailCheck
                      ? isAvail
                        ? `${H.green}06`
                        : `${H.red}06`
                      : rowIdx % 2 === 0
                        ? H.white
                        : `${H.bg}60`,
                }}
              >
                {/* Availability dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    flexShrink: 0,
                    background: row.car.isAvailable
                      ? H.green
                      : H.red,
                    boxShadow: row.car.isAvailable
                      ? `0 0 6px ${H.green}50`
                      : `0 0 6px ${H.red}50`,
                  }}
                  title={
                    row.car.isAvailable ? 'Доступен' : 'Недоступен'
                  }
                />

                {/* Name & plate */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: H.navy,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: H.font,
                    }}
                  >
                    {row.car.name}
                  </div>
                  {row.car.plateNumber && (
                    <div
                      style={{
                        fontSize: 10,
                        color: H.gray,
                        lineHeight: 1.2,
                        fontFamily: 'monospace',
                        fontWeight: 500,
                      }}
                    >
                      {row.car.plateNumber}
                    </div>
                  )}
                </div>

                {/* Utilization / Availability badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  {hasAvailCheck ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        background: isAvail ? H.greenBg : H.redBg,
                      }}
                    >
                      {isAvail ? (
                        <Check
                          style={{
                            width: 13,
                            height: 13,
                            color: H.green,
                          }}
                        />
                      ) : (
                        <X
                          style={{
                            width: 13,
                            height: 13,
                            color: H.red,
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: uColor,
                          fontFamily: H.font,
                        }}
                      >
                        {util}%
                      </span>
                      <div
                        style={{
                          width: 32,
                          height: 3,
                          borderRadius: 2,
                          background: `${H.grayLight}80`,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${util}%`,
                            height: '100%',
                            borderRadius: 2,
                            background: uColor,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar cells */}
              <div
                style={{
                  position: 'relative',
                  width: gridW,
                  height: ROW_H,
                  borderBottom: `1px solid ${H.grayLight}40`,
                }}
              >
                {/* Day cell backgrounds */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                  }}
                >
                  {dateColumns.map((d, i) => {
                    const we = isWeekend(d);
                    const td = isToday(d);
                    const inRange =
                      checkRange &&
                      i >= checkRange.start &&
                      i < checkRange.end;
                    return (
                      <div
                        key={i}
                        style={{
                          width: CELL_W,
                          borderRight: `1px solid ${H.grayLight}30`,
                          background: inRange
                            ? `${H.purple}12`
                            : we
                              ? `${H.grayLight}20`
                              : td
                                ? todayFlash
                                  ? `${H.purple}12`
                                  : `${H.purple}06`
                                : 'transparent',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Dynamic now-line */}
                {nowLineInfo && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      zIndex: 5,
                      width: 2,
                      background: H.red,
                      borderRadius: 1,
                      opacity: 0.6,
                      transition: 'left 60s linear',
                      left: nowLineInfo.left,
                    }}
                  >
                    {/* Dot at top */}
                    <div
                      className="now-line-dot"
                      style={{
                        position: 'absolute',
                        top: -3,
                        left: -3,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: H.red,
                      }}
                    />
                  </div>
                )}

                {/* Interval bars */}
                {row.intervals
                  .filter((iv) => visibleTypes.has(iv.type))
                  .map((interval) => {
                    const pos = intervalCols(
                      interval,
                      rangeStart,
                      days,
                    );
                    if (!pos) return null;
                    const ts =
                      TYPE_STYLES[interval.type] ?? TYPE_STYLES.rental;
                    const barW = pos.span * CELL_W - 6;
                    const conflict = hasConflict(
                      row.intervals.filter((iv) =>
                        visibleTypes.has(iv.type),
                      ),
                      interval,
                    );

                    return (
                      <div
                        key={`${interval.type}-${interval.id}`}
                        className={`cal-bar${conflict ? ' cal-bar-conflict' : ''}`}
                        style={{
                          left: pos.col * CELL_W + 3,
                          width: barW,
                          top: (ROW_H - 30) / 2,
                          height: 30,
                          background: ts.gradient,
                          boxShadow: conflict ? undefined : ts.shadow,
                          borderRadius: 8,
                        }}
                        onMouseEnter={(e) =>
                          onBarHover(e, interval)
                        }
                        onMouseLeave={onBarLeave}
                        onClick={() => onBarClick(interval)}
                      >
                        {barW > 60 && (
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {interval.clientName || interval.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filteredCars.length === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 160,
              fontSize: 13,
              color: H.gray,
              fontFamily: H.font,
            }}
          >
            {carSearch.trim()
              ? 'Автомобиль не найден'
              : 'Нет автомобилей'}
          </div>
        )}
      </div>
    </div>
  );
}
