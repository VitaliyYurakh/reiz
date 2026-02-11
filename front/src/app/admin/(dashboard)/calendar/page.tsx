'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminTheme, type ThemeTokens } from '@/context/AdminThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Car,
  X,
  User,
  MapPin,
  Clock,
  FileText,
  Shield,
  DollarSign,
  Wrench,
  ExternalLink,
  Phone,
  Mail,
  Hash,
  Gauge,
  Search,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Check,
  ScanSearch,
} from 'lucide-react';

/* ═══════════════ Types ═══════════════ */
interface Interval {
  type: 'reservation' | 'rental' | 'service';
  id: number;
  startDate: string;
  endDate: string | null;
  status?: string;
  label: string;
  clientName?: string;
}

interface CarRow {
  car: {
    id: number;
    name: string;
    plateNumber: string | null;
    isAvailable: boolean;
  };
  intervals: Interval[];
}

interface CalendarData {
  cars: CarRow[];
  from: string;
  to: string;
}

/* ═══════════════ Constants ═══════════════ */
const DAY_MS = 86_400_000;
const CELL_W = 48;
const ROW_H = 56;
const CAR_COL_W = 230;
const SUMMARY_H = 30;

const TYPE_STYLES: Record<
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

function getStatusMap(H: ThemeTokens): Record<string, { label: string; color: string; bg: string }> {
  return {
    confirmed: { label: 'Подтверждено', color: H.blue, bg: H.blueBg },
    picked_up: { label: 'Выдано', color: H.green, bg: H.greenBg },
    cancelled: { label: 'Отменено', color: H.red, bg: H.redBg },
    no_show: { label: 'Не явился', color: H.orange, bg: H.orangeBg },
    active: { label: 'Активна', color: H.green, bg: H.greenBg },
    completed: { label: 'Завершена', color: H.gray, bg: H.bg },
  };
}

const PERIOD_OPTIONS = [
  { v: 14, l: '2 недели' },
  { v: 28, l: '4 недели' },
  { v: 42, l: '6 недель' },
  { v: 60, l: '2 месяца' },
] as const;

/* ═══════════════ Helpers ═══════════════ */
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY_MS);
}

function fmtWeekday(d: Date) {
  return d
    .toLocaleDateString('ru', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase();
}

function fmtMonth(d: Date) {
  return d.toLocaleDateString('ru', { month: 'long', year: 'numeric' });
}

function isWeekend(d: Date) {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

function isToday(d: Date) {
  const t = startOfDay(new Date());
  return d.getTime() === t.getTime();
}

function intervalCols(
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

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtMoney(
  amountMinor: number | null | undefined,
  currency?: string,
) {
  if (amountMinor == null) return '—';
  const amount = amountMinor / 100;
  return `${amount.toLocaleString('ru')} ${currency || 'UAH'}`;
}

function calcCarUtilization(
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

function hasConflict(intervals: Interval[], current: Interval): boolean {
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

function utilColor(pct: number, H: ThemeTokens): string {
  if (pct >= 70) return H.red;
  if (pct >= 40) return H.orange;
  return H.green;
}

/* ═══════════════ StatusBadge ═══════════════ */
function StatusBadge({ status, H }: { status?: string; H: ThemeTokens }) {
  if (!status) return null;
  const STATUS_MAP = getStatusMap(H);
  const s = STATUS_MAP[status] ?? { label: status, color: H.gray, bg: H.bg };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: H.font,
        color: s.color,
        background: s.bg,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: s.color,
        }}
      />
      {s.label}
    </span>
  );
}

/* ═══════════════ DetailRow ═══════════════ */
function DetailRow({
  icon: Icon,
  label,
  children,
  H,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
  H: ThemeTokens;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: H.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 15, height: 15, color: H.purple }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: H.gray,
            fontFamily: H.font,
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            color: H.navy,
            fontFamily: H.font,
            fontWeight: 600,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PriceSnapshotBlock ═══════════════ */
function PriceSnapshotBlock({ ps, H }: { ps: any; H: ThemeTokens }) {
  const days = ps.totalDays;
  const rental = ps.baseAmount ?? ps.baseRentalCost;
  const insurance = ps.insuranceCost;
  const extras = ps.addOnsTotal ?? ps.extrasCost;
  const delivery = ps.deliveryFee;
  const disc = ps.discount;
  const deposit = ps.depositAmount;
  const total = ps.total ?? ps.totalCost;
  const hasPriceData =
    days != null || rental != null || total != null || deposit != null;
  if (!hasPriceData) return null;
  const cur = ps.currency || 'USD';

  const Line = ({
    label,
    value,
    bold,
    green,
    border,
  }: {
    label: string;
    value: string;
    bold?: boolean;
    green?: boolean;
    border?: boolean;
  }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderTop: border ? `1px solid ${H.grayLight}` : undefined,
        marginTop: border ? 4 : 0,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: bold ? H.navy : H.gray,
          fontFamily: H.font,
          fontWeight: bold ? 700 : 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: H.font,
          fontWeight: bold ? 700 : 600,
          color: green ? H.green : H.navy,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          fontSize: 11,
          color: H.gray,
          fontFamily: H.font,
          fontWeight: 500,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <DollarSign style={{ width: 12, height: 12 }} /> Стоимость
      </div>
      <div
        style={{
          borderRadius: 12,
          background: H.bg,
          padding: 14,
        }}
      >
        {(ps.ratePlanName ?? ps.name) != null && (
          <Line
            label="Тарифный план"
            value={String(ps.ratePlanName ?? ps.name)}
          />
        )}
        {ps.dailyRate != null && (
          <Line label="Тариф / сутки" value={`${ps.dailyRate} ${cur}`} />
        )}
        {days != null && <Line label="Кол-во дней" value={String(days)} />}
        {rental != null && (
          <Line label="Аренда" value={`${rental} ${cur}`} />
        )}
        {insurance != null && Number(insurance) > 0 && (
          <Line label="Страховка" value={`${insurance} ${cur}`} />
        )}
        {extras != null && Number(extras) > 0 && (
          <Line label="Доп. услуги" value={`${extras} ${cur}`} />
        )}
        {delivery != null && Number(delivery) > 0 && (
          <Line label="Доставка" value={`${delivery} ${cur}`} />
        )}
        {disc != null && Number(disc) > 0 && (
          <Line label="Скидка" value={`-${disc} ${cur}`} green />
        )}
        {deposit != null && (
          <Line label="Залог" value={`${deposit} ${cur}`} />
        )}
        {total != null && (
          <Line label="Итого" value={`${total} ${cur}`} bold border />
        )}
      </div>
    </div>
  );
}

/* ═══════════════ IntervalDetailModal ═══════════════ */
function IntervalDetailModal({
  interval,
  detail,
  loading,
  onClose,
  onNavigate,
  H,
}: {
  interval: Interval;
  detail: any;
  loading: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  H: ThemeTokens;
}) {
  const style = TYPE_STYLES[interval.type] ?? TYPE_STYLES.rental;
  const navPath =
    interval.type === 'reservation'
      ? `/admin/reservations/${interval.id}`
      : interval.type === 'rental'
        ? `/admin/rentals/${interval.id}`
        : `/admin/service`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(43, 54, 116, 0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="cal-modal"
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 20,
          background: H.white,
          boxShadow: '0 20px 60px rgba(43, 54, 116, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: style.gradient,
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                fontFamily: H.font,
              }}
            >
              {style.label} #{interval.id}
            </span>
            {interval.status && <StatusBadge status={interval.status} H={H} />}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')
            }
          >
            <X style={{ width: 16, height: 16, color: '#fff' }} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '12px 24px',
            maxHeight: '55vh',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 0',
              }}
            >
              <Loader2
                style={{ width: 24, height: 24, color: H.purple }}
                className="animate-spin"
              />
            </div>
          ) : detail ? (
            <div>
              {/* Client */}
              {detail.client && (
                <>
                  <DetailRow icon={User} label="Клиент" H={H}>
                    {detail.client.firstName} {detail.client.lastName}
                  </DetailRow>
                  {detail.client.phone && (
                    <DetailRow icon={Phone} label="Телефон" H={H}>
                      <a
                        href={`tel:${detail.client.phone}`}
                        style={{ color: H.blue, textDecoration: 'none' }}
                      >
                        {detail.client.phone}
                      </a>
                    </DetailRow>
                  )}
                  {detail.client.email && (
                    <DetailRow icon={Mail} label="Email" H={H}>
                      {detail.client.email}
                    </DetailRow>
                  )}
                </>
              )}

              {/* Car */}
              {detail.car && (
                <DetailRow icon={Car} label="Автомобиль" H={H}>
                  {detail.car.brand} {detail.car.model}
                  {detail.car.plateNumber && (
                    <span
                      style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 8,
                        background: H.bg,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: H.navy,
                      }}
                    >
                      {detail.car.plateNumber}
                    </span>
                  )}
                </DetailRow>
              )}

              {/* Dates */}
              <DetailRow icon={Clock} label="Период" H={H}>
                {fmtDate(detail.pickupDate || detail.startDate)} —{' '}
                {fmtDate(detail.returnDate || detail.endDate)}
              </DetailRow>

              {/* Locations */}
              {detail.pickupLocation && (
                <DetailRow icon={MapPin} label="Выдача" H={H}>
                  {detail.pickupLocation}
                </DetailRow>
              )}
              {detail.returnLocation && (
                <DetailRow icon={MapPin} label="Возврат" H={H}>
                  {detail.returnLocation}
                </DetailRow>
              )}

              {/* Contract */}
              {detail.contractNumber && (
                <DetailRow icon={FileText} label="Номер договора" H={H}>
                  {detail.contractNumber}
                </DetailRow>
              )}

              {/* Odometer */}
              {detail.pickupOdometer && (
                <DetailRow icon={Gauge} label="Пробег (выдача)" H={H}>
                  {detail.pickupOdometer.toLocaleString()} км
                </DetailRow>
              )}
              {detail.returnOdometer && (
                <DetailRow icon={Gauge} label="Пробег (возврат)" H={H}>
                  {detail.returnOdometer.toLocaleString()} км
                </DetailRow>
              )}

              {/* Coverage */}
              {detail.coveragePackage && (
                <DetailRow icon={Shield} label="Страховка" H={H}>
                  {detail.coveragePackage.name}
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 11,
                      color: H.gray,
                    }}
                  >
                    (залог {detail.coveragePackage.depositPercent}%)
                  </span>
                </DetailRow>
              )}

              {/* Deposit */}
              {detail.depositAmount > 0 && (
                <DetailRow icon={DollarSign} label="Залог" H={H}>
                  {fmtMoney(detail.depositAmount, detail.depositCurrency)}
                  {detail.depositReturned && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        color: H.green,
                        fontWeight: 600,
                      }}
                    >
                      Возвращён
                    </span>
                  )}
                </DetailRow>
              )}

              {/* Add-ons */}
              {(detail.reservationAddOns?.length > 0 ||
                detail.rentalAddOns?.length > 0) && (
                <div style={{ padding: '8px 0' }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: H.gray,
                      fontFamily: H.font,
                      fontWeight: 500,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Hash style={{ width: 12, height: 12 }} /> Доп. услуги
                  </div>
                  {(
                    detail.reservationAddOns ||
                    detail.rentalAddOns ||
                    []
                  ).map((a: any) => (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        padding: '3px 0',
                        fontFamily: H.font,
                      }}
                    >
                      <span style={{ color: H.navy }}>
                        {a.addOn?.name || 'Услуга'} &times; {a.quantity}
                      </span>
                      <span style={{ fontWeight: 600, color: H.navy }}>
                        {fmtMoney(a.totalMinor, a.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service-specific fields */}
              {interval.type === 'service' && (
                <>
                  {detail.type && (
                    <DetailRow icon={Wrench} label="Тип" H={H}>
                      {detail.type}
                    </DetailRow>
                  )}
                  {detail.description && (
                    <DetailRow icon={FileText} label="Описание" H={H}>
                      {detail.description}
                    </DetailRow>
                  )}
                  {detail.vendor && (
                    <DetailRow icon={User} label="Подрядчик" H={H}>
                      {detail.vendor}
                    </DetailRow>
                  )}
                  {detail.costMinor != null && detail.costMinor > 0 && (
                    <DetailRow icon={DollarSign} label="Стоимость" H={H}>
                      {fmtMoney(detail.costMinor, detail.currency)}
                    </DetailRow>
                  )}
                  {detail.odometer && (
                    <DetailRow icon={Gauge} label="Пробег" H={H}>
                      {detail.odometer.toLocaleString()} км
                    </DetailRow>
                  )}
                  {detail.notes && (
                    <DetailRow icon={FileText} label="Заметки" H={H}>
                      {detail.notes}
                    </DetailRow>
                  )}
                </>
              )}

              {/* Price snapshot */}
              {detail.priceSnapshot && (
                <PriceSnapshotBlock ps={detail.priceSnapshot} H={H} />
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                fontSize: 13,
                color: H.gray,
                fontFamily: H.font,
              }}
            >
              Не удалось загрузить данные
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderTop: `1px solid ${H.grayLight}`,
            background: H.bg,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="cal-btn-secondary"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={() => onNavigate(navPath)}
            className="cal-btn-primary"
          >
            <ExternalLink style={{ width: 14, height: 14 }} />
            Открыть
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CalendarPage
   ═══════════════════════════════════════════════════════════ */
export default function CalendarPage() {
  const router = useRouter();
  const { H } = useAdminTheme();
  const today = useMemo(() => startOfDay(new Date()), []);

  /* Dynamic "now" line — updates every 60 seconds */
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

  /* Availability check */
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

  /* summary row: occupied car count per day (filtered by visible types) */
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

  /* Availability map: carId → boolean (available for checked dates) */
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

  /* Check-in/check-out column range for overlay */
  const checkRange = useMemo(() => {
    if (!availCheck || !checkIn || !checkOut) return null;
    const ci = startOfDay(new Date(checkIn));
    const co = startOfDay(new Date(checkOut));
    if (ci >= co) return null;
    const colStart = Math.round(
      (ci.getTime() - rangeStart.getTime()) / DAY_MS,
    );
    const colEnd = Math.round(
      (co.getTime() - rangeStart.getTime()) / DAY_MS,
    );
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

  /* Dynamic now-line pixel offset from left edge of grid */
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
      const label = fmtMonth(d);
      if (label === prev) {
        groups[groups.length - 1].span++;
      } else {
        groups.push({ label, span: 1 });
        prev = label;
      }
    }
    return groups;
  }, [dateColumns]);

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
        const res = await adminApiClient.get(
          `/reservation/${interval.id}`,
        );
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

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden', fontFamily: H.font }}>
      {/* ── injected styles ── */}
      <style>{`
        .cal-bar {
          position: absolute;
          display: flex;
          align-items: center;
          border-radius: 8px;
          padding: 0 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
          color: #fff;
          font-family: ${H.font};
          user-select: none;
        }
        .cal-bar:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }
        .cal-bar-conflict {
          animation: conflictPulse 2s ease-in-out infinite;
        }
        @keyframes conflictPulse {
          0%, 100% { box-shadow: 0 0 0 2px ${H.red}; }
          50% { box-shadow: 0 0 0 2px ${H.red}, 0 0 10px rgba(238, 93, 80, 0.4); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cal-modal {
          animation: modalIn 0.2s ease-out;
        }
        .cal-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 24px;
          border-radius: 49px;
          border: none;
          background: linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: ${H.font};
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(67, 24, 255, 0.3);
          transition: all 0.2s;
        }
        .cal-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(67, 24, 255, 0.4);
        }
        .cal-btn-secondary {
          padding: 10px 24px;
          border-radius: 49px;
          border: none;
          background: ${H.white};
          color: ${H.gray};
          font-size: 13px;
          font-weight: 700;
          font-family: ${H.font};
          cursor: pointer;
          box-shadow: ${H.shadowMd};
          transition: all 0.2s;
        }
        .cal-btn-secondary:hover {
          color: ${H.navy};
          transform: translateY(-1px);
        }
        .cal-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 49px;
          border: none;
          background: transparent;
          color: ${H.gray};
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cal-nav-btn:hover {
          background: ${H.bg};
          color: ${H.navy};
        }
        @keyframes todayPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes nowDotPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${H.red}60; }
          50% { box-shadow: 0 0 0 4px ${H.red}20; }
        }
        .now-line-dot {
          animation: nowDotPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          Header Card
          ══════════════════════════════════════════ */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 16,
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarDays
                  style={{ width: 18, height: 18, color: '#fff' }}
                />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: H.navy,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Календарь
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: H.gray,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {rangeLabel}
                </p>
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
              onChange={(e) => setCarSearch(e.target.value)}
              placeholder="Поиск авто…"
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
              onChange={(e) => setDays(Number(e.target.value))}
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
                  {opt.l}
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
              onClick={() => navigate(-1)}
              className="cal-nav-btn"
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <button
              type="button"
              onClick={goToday}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 32,
                padding: '0 16px',
                borderRadius: 49,
                border: 'none',
                background: H.navy,
                color: H.white,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: H.font,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(43, 54, 116, 0.25)',
              }}
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="cal-nav-btn"
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchData()}
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
                onClick={() => toggleType(key)}
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
                {ts.label}
              </button>
            );
          })}

          {/* Availability check toggle */}
          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => {
                setAvailCheck((p) => !p);
                if (availCheck) {
                  setCheckIn('');
                  setCheckOut('');
                }
              }}
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
              Проверить доступность
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
              Выдача
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
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
              Возврат
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
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
                дн.
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
                  {availCount.available} из {availCount.total} доступно
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          Calendar Grid
          ══════════════════════════════════════════ */}
      {fetchError && !data ? (
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
            onClick={fetchData}
            className="cal-btn-primary"
            style={{ fontSize: 12, padding: '8px 20px' }}
          >
            Повторить
          </button>
        </div>
      ) : loading && !data ? (
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
      ) : (
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
                              handleBarHover(e, interval)
                            }
                            onMouseLeave={() => setTooltip(null)}
                            onClick={() => handleBarClick(interval)}
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
      )}

      {/* ══════════════════════════════════════════
          Legend
          ══════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 20,
          paddingTop: 14,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: H.font,
          color: H.gray,
        }}
      >
        {Object.entries(TYPE_STYLES).map(([key, ts]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 20,
                height: 8,
                borderRadius: 4,
                background: ts.gradient,
              }}
            />
            <span>{ts.label}</span>
          </div>
        ))}
        <div style={{ width: 1, height: 14, background: H.grayLight }} />
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: H.green,
              boxShadow: `0 0 4px ${H.green}50`,
            }}
          />
          <span>Доступен</span>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: H.red,
              boxShadow: `0 0 4px ${H.red}50`,
            }}
          />
          <span>Недоступен</span>
        </div>
        <div style={{ width: 1, height: 14, background: H.grayLight }} />
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <AlertTriangle style={{ width: 12, height: 12, color: H.red }} />
          <span>Конфликт</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Tooltip
          ══════════════════════════════════════════ */}
      {tooltip && !selectedInterval && (
        <div
          style={{
            position: 'fixed',
            zIndex: 50,
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            background: H.white,
            borderRadius: 12,
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(43, 54, 116, 0.18)',
            fontFamily: H.font,
            minWidth: 160,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background:
                  TYPE_STYLES[tooltip.interval.type]?.dot ?? H.gray,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: H.navy,
              }}
            >
              {TYPE_STYLES[tooltip.interval.type]?.label ??
                tooltip.interval.type}{' '}
              #{tooltip.interval.id}
            </span>
          </div>
          {tooltip.interval.clientName && (
            <p
              style={{
                fontSize: 12,
                color: H.navy,
                margin: '0 0 2px',
                fontWeight: 500,
              }}
            >
              {tooltip.interval.clientName}
            </p>
          )}
          <p
            style={{
              fontSize: 11,
              color: H.gray,
              margin: '0 0 2px',
            }}
          >
            {new Date(tooltip.interval.startDate).toLocaleDateString('ru')}
            {' — '}
            {tooltip.interval.endDate
              ? new Date(tooltip.interval.endDate).toLocaleDateString(
                  'ru',
                )
              : '...'}
          </p>
          {tooltip.interval.status && (
            <div style={{ marginTop: 4 }}>
              <StatusBadge status={tooltip.interval.status} H={H} />
            </div>
          )}
          <p
            style={{
              fontSize: 10,
              color: `${H.gray}80`,
              margin: '8px 0 0',
              fontStyle: 'italic',
            }}
          >
            Нажмите для подробностей
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Detail Modal
          ══════════════════════════════════════════ */}
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
