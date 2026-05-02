'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import type { Interval, CalendarData } from './components/calendar-types';
import {
  DAY_MS,
  CELL_W,
  startOfDay,
  addDays,
  fmtMonth,
  intervalCols,
} from './components/calendar-types';
import { CalendarStyles } from './components/CalendarStyles';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarLegend } from './components/CalendarLegend';
import { CalendarTooltip } from './components/CalendarTooltip';
import { IntervalDetailModal } from './components/IntervalDetailModal';

export default function CalendarPage() {
  const router = useRouter();
  const { H } = useAdminTheme();
  const { locale } = useAdminLocale();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [nowTime, setNowTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    return addDays(d, diff);
  });

  const [days, setDays] = useState(28);
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    interval: Interval;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [todayFlash, setTodayFlash] = useState(false);

  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(
    null,
  );
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [carSearch, setCarSearch] = useState('');
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(
    () => new Set(['rental', 'reservation', 'service']),
  );

  const [availCheck, setAvailCheck] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  function toggleType(type: string) {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  const filteredCars = useMemo(() => {
    if (!data?.cars) return [];
    if (!carSearch.trim()) return data.cars;
    const q = carSearch.trim().toLowerCase();
    return data.cars.filter(
      (row) =>
        row.car.name.toLowerCase().includes(q) ||
        (row.car.plateNumber &&
          row.car.plateNumber.toLowerCase().includes(q)),
    );
  }, [data?.cars, carSearch]);

  const daySummary = useMemo(() => {
    if (!filteredCars.length) return [];
    const counts: number[] = new Array(days).fill(0);
    for (const row of filteredCars) {
      const usedDays = new Set<number>();
      for (const interval of row.intervals) {
        if (!visibleTypes.has(interval.type)) continue;
        const pos = intervalCols(interval, rangeStart, days);
        if (!pos) continue;
        for (let i = pos.col; i < pos.col + pos.span; i++) usedDays.add(i);
      }
      for (const d of usedDays) {
        if (d >= 0 && d < days) counts[d]++;
      }
    }
    return counts;
  }, [filteredCars, visibleTypes, rangeStart, days]);

  const totalCarsCount = filteredCars.length;

  /* Fleet summary — avg load over visible window + free now */
  const fleetSummary = useMemo(() => {
    const totalActive = filteredCars.length;
    if (!totalActive) return { avgLoad: 0, freeNow: 0, totalActive: 0 };

    const startMs = rangeStart.getTime();
    const totalMs = days * DAY_MS;
    let sumPct = 0;

    for (const row of filteredCars) {
      let busyMs = 0;
      for (const iv of row.intervals) {
        if (!visibleTypes.has(iv.type)) continue;
        if (iv.status === 'cancelled' || iv.status === 'no_show') continue;
        const ivS = startOfDay(new Date(iv.startDate)).getTime();
        const ivE = iv.endDate
          ? new Date(iv.endDate).getTime()
          : ivS + DAY_MS;
        const f = Math.max(ivS, startMs);
        const t = Math.min(ivE, startMs + totalMs);
        if (t > f) busyMs += t - f;
      }
      sumPct += (busyMs / totalMs) * 100;
    }

    const nowMs = nowTime.getTime();
    let busyNow = 0;
    for (const row of filteredCars) {
      const isBusy = row.intervals.some((iv) => {
        if (!visibleTypes.has(iv.type)) return false;
        if (iv.status === 'cancelled' || iv.status === 'no_show') return false;
        const ivS = new Date(iv.startDate).getTime();
        const ivE = iv.endDate
          ? new Date(iv.endDate).getTime()
          : ivS + DAY_MS;
        return ivS <= nowMs && ivE >= nowMs;
      });
      if (isBusy) busyNow++;
    }

    return {
      avgLoad: Math.round(sumPct / totalActive),
      freeNow: totalActive - busyNow,
      totalActive,
    };
  }, [filteredCars, visibleTypes, rangeStart, days, nowTime]);

  /* Type counts for filter chips */
  const typeCounts = useMemo(() => {
    const out: Record<string, number> = {
      rental: 0,
      reservation: 0,
      service: 0,
    };
    if (!data?.cars) return out;
    for (const row of data.cars) {
      for (const iv of row.intervals) {
        if (iv.status === 'cancelled' || iv.status === 'no_show') continue;
        if (out[iv.type] != null) out[iv.type]++;
      }
    }
    return out;
  }, [data?.cars]);

  const availabilityMap = useMemo(() => {
    if (!availCheck || !checkIn || !checkOut || !filteredCars.length)
      return null;
    const ci = startOfDay(new Date(checkIn)).getTime();
    const co = startOfDay(new Date(checkOut)).getTime();
    if (ci >= co) return null;

    const map = new Map<number, boolean>();
    for (const row of filteredCars) {
      let available = true;
      for (const interval of row.intervals) {
        const s = startOfDay(new Date(interval.startDate)).getTime();
        const e = interval.endDate
          ? startOfDay(new Date(interval.endDate)).getTime()
          : s + DAY_MS;
        if (ci < e && co > s) {
          available = false;
          break;
        }
      }
      map.set(row.car.id, available);
    }
    return map;
  }, [availCheck, checkIn, checkOut, filteredCars]);

  const availCount = useMemo(() => {
    if (!availabilityMap) return null;
    let free = 0;
    availabilityMap.forEach((v) => {
      if (v) free++;
    });
    return { available: free, total: availabilityMap.size };
  }, [availabilityMap]);

  const checkRange = useMemo(() => {
    if (!availCheck || !checkIn || !checkOut) return null;
    const ci = startOfDay(new Date(checkIn));
    const co = startOfDay(new Date(checkOut));
    if (ci >= co) return null;
    const colStart = Math.round(
      (ci.getTime() - rangeStart.getTime()) / DAY_MS,
    );
    const colEnd = Math.round((co.getTime() - rangeStart.getTime()) / DAY_MS);
    return { start: colStart, end: colEnd };
  }, [availCheck, checkIn, checkOut, rangeStart]);

  const scrollToToday = useCallback(() => {
    if (!scrollRef.current) return;
    const todayCol = Math.round(
      (today.getTime() - rangeStart.getTime()) / DAY_MS,
    );
    if (todayCol >= 0 && todayCol < days) {
      scrollRef.current.scrollTo({
        left: Math.max(0, todayCol * CELL_W - 200),
        behavior: 'smooth',
      });
    }
    setTodayFlash(true);
    setTimeout(() => setTodayFlash(false), 1200);
  }, [today, rangeStart, days]);

  const rangeEnd = useMemo(
    () => addDays(rangeStart, days),
    [rangeStart, days],
  );

  const dateColumns = useMemo(() => {
    const cols: Date[] = [];
    for (let i = 0; i < days; i++) {
      cols.push(addDays(rangeStart, i));
    }
    return cols;
  }, [rangeStart, days]);

  const nowLineInfo = useMemo(() => {
    const todayCol = Math.round(
      (today.getTime() - rangeStart.getTime()) / DAY_MS,
    );
    if (todayCol < 0 || todayCol >= days) return null;
    const h = nowTime.getHours();
    const m = nowTime.getMinutes();
    const fraction = (h * 60 + m) / (24 * 60);
    const left = todayCol * CELL_W + fraction * CELL_W;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return { left, timeStr, todayCol };
  }, [today, rangeStart, days, nowTime]);

  const monthGroups = useMemo(() => {
    const groups: { label: string; span: number }[] = [];
    let prev = '';
    for (const d of dateColumns) {
      const label = fmtMonth(d, locale);
      if (label === prev) {
        groups[groups.length - 1].span++;
      } else {
        groups.push({ label, span: 1 });
        prev = label;
      }
    }
    return groups;
  }, [dateColumns, locale]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const from = rangeStart.toISOString().slice(0, 10);
      const to = rangeEnd.toISOString().slice(0, 10);
      const res = await adminApiClient.get(`/calendar?from=${from}&to=${to}`);
      setData(res.data);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const todayCol = Math.round(
      (today.getTime() - rangeStart.getTime()) / DAY_MS,
    );
    if (todayCol >= 0 && todayCol < days) {
      scrollRef.current.scrollLeft = Math.max(0, todayCol * CELL_W - 200);
    }
  }, [data, rangeStart, today, days]);

  function navigate(dir: -1 | 1) {
    setRangeStart((prev) => addDays(prev, dir * days));
  }

  function goToday() {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayOfThisWeek = addDays(d, diff);

    if (mondayOfThisWeek.getTime() === rangeStart.getTime()) {
      scrollToToday();
    } else {
      setRangeStart(mondayOfThisWeek);
      setTodayFlash(true);
      setTimeout(() => setTodayFlash(false), 1200);
    }
  }

  function handleBarHover(e: React.MouseEvent, interval: Interval) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      interval,
    });
  }

  async function handleBarClick(interval: Interval) {
    setTooltip(null);
    setSelectedInterval(interval);
    setDetailData(null);
    setDetailLoading(true);

    try {
      if (interval.type === 'reservation') {
        const res = await adminApiClient.get(`/reservation/${interval.id}`);
        setDetailData(res.data.reservation);
      } else if (interval.type === 'rental') {
        const res = await adminApiClient.get(`/rental/${interval.id}`);
        setDetailData(res.data.rental);
      } else if (interval.type === 'service') {
        const res = await adminApiClient.get(
          `/service-event/${interval.id}`,
        );
        setDetailData(
          res.data.serviceEvent || {
            type: interval.label,
            startDate: interval.startDate,
            endDate: interval.endDate,
          },
        );
      }
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  }

  const gridW = days * CELL_W;
  const rangeLabel = `${rangeStart.toLocaleDateString('ru', { day: 'numeric', month: 'short' })} — ${addDays(rangeStart, days - 1).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div
      className="cal-page"
      style={{ maxWidth: '100%', overflow: 'hidden', fontFamily: H.font }}
    >
      <CalendarStyles H={H} />

      <CalendarHeader
        H={H}
        rangeLabel={rangeLabel}
        fleetCount={filteredCars.length}
        carSearch={carSearch}
        onCarSearchChange={setCarSearch}
        days={days}
        onDaysChange={setDays}
        onNavigate={navigate}
        onGoToday={goToday}
        onRefresh={() => fetchData()}
        loading={loading}
        visibleTypes={visibleTypes}
        typeCounts={typeCounts}
        onToggleType={toggleType}
        availCheck={availCheck}
        onToggleAvailCheck={() => {
          setAvailCheck((p) => !p);
          if (availCheck) {
            setCheckIn('');
            setCheckOut('');
          }
        }}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        availCount={availCount}
      />

      <div className="cal-surface">
        <CalendarGrid
          H={H}
          loading={loading}
          fetchError={fetchError}
          data={data}
          filteredCars={filteredCars}
          scrollRef={scrollRef}
          days={days}
          gridW={gridW}
          rangeStart={rangeStart}
          dateColumns={dateColumns}
          monthGroups={monthGroups}
          daySummary={daySummary}
          totalCarsCount={totalCarsCount}
          fleetSummary={fleetSummary}
          nowLineInfo={nowLineInfo}
          todayFlash={todayFlash}
          checkRange={checkRange}
          availabilityMap={availabilityMap}
          visibleTypes={visibleTypes}
          carSearch={carSearch}
          onFetchData={fetchData}
          onBarHover={handleBarHover}
          onBarLeave={() => setTooltip(null)}
          onBarClick={handleBarClick}
          onCarClick={(carId) => router.push(`/admin/cars/${carId}`)}
        />
        <CalendarLegend H={H} />
      </div>

      {tooltip && !selectedInterval && (
        <CalendarTooltip tooltip={tooltip} H={H} />
      )}

      {selectedInterval && (
        <IntervalDetailModal
          interval={selectedInterval}
          detail={detailData}
          loading={detailLoading}
          onClose={() => {
            setSelectedInterval(null);
            setDetailData(null);
          }}
          onNavigate={(path) => {
            setSelectedInterval(null);
            router.push(path);
          }}
          H={H}
        />
      )}
    </div>
  );
}
