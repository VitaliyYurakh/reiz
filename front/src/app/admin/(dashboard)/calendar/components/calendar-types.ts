import type { ThemeTokens } from '@/context/AdminThemeContext';

/* ═══════════════ Types ═══════════════ */
export interface Interval {
  type: 'reservation' | 'rental' | 'service';
  id: number;
  startDate: string;
  endDate: string | null;
  status?: string;
  label: string;
  clientName?: string;
}

export interface CarRow {
  car: {
    id: number;
    name: string;
    plateNumber: string | null;
    isAvailable: boolean;
  };
  intervals: Interval[];
}

export interface CalendarData {
  cars: CarRow[];
  from: string;
  to: string;
}

/* ═══════════════ Constants ═══════════════ */
export const DAY_MS = 86_400_000;
export const CELL_W = 48;
export const ROW_H = 56;
export const CAR_COL_W = 230;
export const SUMMARY_H = 30;

export const TYPE_STYLES: Record<
  string,
  { gradient: string; dot: string; label: string; shadow: string }
> = {
  rental: {
    gradient: 'linear-gradient(135deg, #01B574 0%, #01A266 100%)',
    dot: '#01B574',
    label: 'Аренда',
    shadow: '0 2px 8px rgba(1, 181, 116, 0.35)',
  },
  reservation: {
    gradient: 'linear-gradient(135deg, #3965FF 0%, #4318FF 100%)',
    dot: '#4318FF',
    label: 'Бронь',
    shadow: '0 2px 8px rgba(67, 24, 255, 0.35)',
  },
  service: {
    gradient: 'linear-gradient(135deg, #FFB547 0%, #FF9F0A 100%)',
    dot: '#FFB547',
    label: 'Сервис',
    shadow: '0 2px 8px rgba(255, 181, 71, 0.35)',
  },
};

export function getStatusMap(H: ThemeTokens): Record<string, { label: string; color: string; bg: string }> {
  return {
    confirmed: { label: 'Подтверждено', color: H.blue, bg: H.blueBg },
    picked_up: { label: 'Выдано', color: H.green, bg: H.greenBg },
    cancelled: { label: 'Отменено', color: H.red, bg: H.redBg },
    no_show: { label: 'Не явился', color: H.orange, bg: H.orangeBg },
    active: { label: 'Активна', color: H.green, bg: H.greenBg },
    completed: { label: 'Завершена', color: H.gray, bg: H.bg },
  };
}

export const PERIOD_OPTIONS = [
  { v: 14, l: '2 недели' },
  { v: 28, l: '4 недели' },
  { v: 42, l: '6 недель' },
  { v: 60, l: '2 месяца' },
] as const;

/* ═══════════════ Helpers ═══════════════ */
export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY_MS);
}

export function fmtWeekday(d: Date) {
  return d
    .toLocaleDateString('ru', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase();
}

export function fmtMonth(d: Date) {
  return d.toLocaleDateString('ru', { month: 'long', year: 'numeric' });
}

export function isWeekend(d: Date) {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

export function isToday(d: Date) {
  const t = startOfDay(new Date());
  return d.getTime() === t.getTime();
}

export function intervalCols(
  interval: Interval,
  rangeStart: Date,
  totalDays: number,
) {
  const s = startOfDay(new Date(interval.startDate));
  const e = interval.endDate
    ? startOfDay(new Date(interval.endDate))
    : addDays(s, 1);

  const colStart = Math.max(
    0,
    Math.round((s.getTime() - rangeStart.getTime()) / DAY_MS),
  );
  const colEnd = Math.min(
    totalDays,
    Math.round((e.getTime() - rangeStart.getTime()) / DAY_MS),
  );
  const span = colEnd - colStart;

  if (span <= 0) return null;
  return { col: colStart, span };
}

export { fmtDateLong as fmtDate, fmtMoney } from '@/app/admin/lib/format';

export function calcCarUtilization(
  intervals: Interval[],
  rangeStart: Date,
  totalDays: number,
): number {
  const used = new Set<number>();
  for (const interval of intervals) {
    const s = startOfDay(new Date(interval.startDate));
    const e = interval.endDate
      ? startOfDay(new Date(interval.endDate))
      : addDays(s, 1);
    const colStart = Math.max(
      0,
      Math.round((s.getTime() - rangeStart.getTime()) / DAY_MS),
    );
    const colEnd = Math.min(
      totalDays,
      Math.round((e.getTime() - rangeStart.getTime()) / DAY_MS),
    );
    for (let i = colStart; i < colEnd; i++) used.add(i);
  }
  return totalDays > 0 ? Math.round((used.size / totalDays) * 100) : 0;
}

export function hasConflict(intervals: Interval[], current: Interval): boolean {
  const cs = new Date(current.startDate).getTime();
  const ce = current.endDate
    ? new Date(current.endDate).getTime()
    : cs + DAY_MS;
  for (const other of intervals) {
    if (other.id === current.id && other.type === current.type) continue;
    const os = new Date(other.startDate).getTime();
    const oe = other.endDate
      ? new Date(other.endDate).getTime()
      : os + DAY_MS;
    if (cs < oe && ce > os) return true;
  }
  return false;
}

export function utilColor(pct: number, H: ThemeTokens): string {
  if (pct >= 70) return H.red;
  if (pct >= 40) return H.orange;
  return H.green;
}
