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
  { gradient: string; dot: string; labelKey: string; shadow: string }
> = {
  rental: {
    gradient: 'linear-gradient(135deg, #01B574 0%, #01A266 100%)',
    dot: '#01B574',
    labelKey: 'calendar.typeRental',
    shadow: '0 2px 8px rgba(1, 181, 116, 0.35)',
  },
  reservation: {
    gradient: 'linear-gradient(135deg, #3965FF 0%, #4318FF 100%)',
    dot: '#4318FF',
    labelKey: 'calendar.typeReservation',
    shadow: '0 2px 8px rgba(67, 24, 255, 0.35)',
  },
  service: {
    gradient: 'linear-gradient(135deg, #FFB547 0%, #FF9F0A 100%)',
    dot: '#FFB547',
    labelKey: 'calendar.typeService',
    shadow: '0 2px 8px rgba(255, 181, 71, 0.35)',
  },
};

export function getStatusMap(H: ThemeTokens): Record<string, { labelKey: string; color: string; bg: string }> {
  return {
    confirmed: { labelKey: 'calendar.statusConfirmed', color: H.blue, bg: H.blueBg },
    picked_up: { labelKey: 'calendar.statusPickedUp', color: H.green, bg: H.greenBg },
    cancelled: { labelKey: 'calendar.statusCancelled', color: H.red, bg: H.redBg },
    no_show: { labelKey: 'calendar.statusNoShow', color: H.orange, bg: H.orangeBg },
    active: { labelKey: 'calendar.statusActive', color: H.green, bg: H.greenBg },
    completed: { labelKey: 'calendar.statusCompleted', color: H.gray, bg: H.bg },
  };
}

export const PERIOD_OPTIONS = [
  { v: 14, labelKey: 'calendar.period2w' },
  { v: 28, labelKey: 'calendar.period4w' },
  { v: 42, labelKey: 'calendar.period6w' },
  { v: 60, labelKey: 'calendar.period2m' },
] as const;

/* ═══════════════ Helpers ═══════════════ */
export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY_MS);
}

const LOCALE_MAP: Record<string, string> = {
  uk: 'uk-UA',
  ru: 'ru-RU',
  en: 'en-GB',
  ro: 'ro-RO',
  pl: 'pl-PL',
};

export function mapLocale(locale: string): string {
  return LOCALE_MAP[locale] || locale;
}

export function fmtWeekday(d: Date, locale = 'uk') {
  return d
    .toLocaleDateString(mapLocale(locale), { weekday: 'short' })
    .replace('.', '')
    .toUpperCase();
}

export function fmtMonth(d: Date, locale = 'uk') {
  return d.toLocaleDateString(mapLocale(locale), { month: 'long', year: 'numeric' });
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
