'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { BASE_URL } from '@/config/environment';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Car,
  MessageSquare,
  Plane,
  CheckCircle2,
  XCircle,
  PlayCircle,
  ExternalLink,
  Loader2,
  UserCheck,
  Globe,
  Shield,
  Receipt,
  Package,
  Phone,
  Mail,
  Clock,
  Hash,
  ArrowRight,
  CircleDot,
  MapPin,
  FileText,
} from 'lucide-react';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme, type ThemeTokens } from '@/context/AdminThemeContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RentalRequestClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

interface CarPhoto {
  id: number;
  url: string;
  alt: string | null;
  type: string;
}

interface RentalRequestCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  previewUrl: string | null;
  carPhoto: CarPhoto[];
  rentalTariff: unknown[];
  segment: unknown[];
}

interface AddOn {
  id: number;
  name: string;
}

interface ReservationAddOn {
  id: number;
  addOn: AddOn;
}

interface Reservation {
  id: number;
  status: string;
  reservationAddOns: ReservationAddOn[];
}

interface RentalRequestFull {
  id: number;
  source: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  pickupLocation: string | null;
  returnLocation: string | null;
  pickupDate: string | null;
  returnDate: string | null;
  flightNumber: string | null;
  comment: string | null;
  websiteSnapshot: Record<string, unknown> | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  client: RentalRequestClient | null;
  car: RentalRequestCar | null;
  bookingRequest: unknown | null;
  reservation: Reservation | null;
  assignedTo: { id: number; email: string } | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDateShort(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('uk', {
    day: 'numeric',
    month: 'short',
  });
}

function fmtDateTime(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString('uk', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toInputDate(d: string | null): string {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

function fmtMoney(val: number | undefined | null) {
  if (val == null) return '—';
  return `$${val.toLocaleString('uk')}`;
}

function daysBetween(a: string | null, b: string | null): number | null {
  if (!a || !b) return null;
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  const days = Math.ceil(ms / 86_400_000) + 1;
  return days > 0 ? days : 0;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function WebsiteSnapshotCard({ snapshot, t, H, isDark }: { snapshot: Record<string, unknown>; t: (key: string, params?: Record<string, string | number>) => string; H: ThemeTokens; isDark: boolean }) {
  const carDetails = snapshot.carDetails as { brand?: string; model?: string; year?: number } | undefined;
  const totalDays = snapshot.totalDays as number | undefined;
  const selectedPlan = snapshot.selectedPlan as {
    id?: number; pricePercent?: number; depositPercent?: number;
  } | undefined;
  const priceBreakdown = snapshot.priceBreakdown as {
    baseRentalCost?: number; extrasCost?: number; insuranceCost?: number;
    depositAmount?: number; totalCost?: number;
  } | undefined;
  const selectedExtras = snapshot.selectedExtras as Array<{
    id?: string; price?: number; cost?: number; isPerDay?: boolean; quantity?: number;
  }> | undefined;

  const PLAN_LABELS: Record<number, string> = useMemo(() => ({
    1: t('requestDetail.packageBasic'),
    2: t('requestDetail.packageStandard'),
    3: t('requestDetail.packagePremium'),
  }), [t]);

  const EXTRA_LABELS: Record<string, string> = useMemo(() => ({
    borderCrossing: t('requestDetail.addonBorderCross'),
    childSeat: t('requestDetail.addonChildSeat'),
    driverService: t('requestDetail.addonDriver'),
    gps: t('requestDetail.addonGPS'),
    wifi: t('requestDetail.addonWiFi'),
    snowChains: t('requestDetail.addonChains'),
    additionalDriver: t('requestDetail.addonExtraDriver'),
    insurance: t('requestDetail.addonInsurance'),
  }), [t]);

  return (
    <div className="space-y-4">
      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2">
        {carDetails && (
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: H.bg }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.car')}</p>
            <p className="mt-0.5 text-[13px] font-bold" style={{ color: H.navy }}>
              {carDetails.brand} {carDetails.model}
            </p>
            {carDetails.year && (
              <p className="text-[11px]" style={{ color: H.gray }}>{carDetails.year}</p>
            )}
          </div>
        )}
        {totalDays != null && (
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: isDark ? H.blueBg : '#E3F2FD' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? H.blue : '#1565C0' }}>{t('requestDetail.daysCount')}</p>
            <p className="mt-0.5 text-xl font-bold" style={{ color: isDark ? H.blue : '#1565C0' }}>{totalDays}</p>
          </div>
        )}
        {selectedPlan && (
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: isDark ? '#2D2047' : '#EDE7F6' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? H.purple : '#7C4DFF' }}>{t('requestDetail.package')}</p>
            <p className="mt-0.5 text-[13px] font-bold" style={{ color: isDark ? H.purpleLight : '#5E35B1' }}>
              {PLAN_LABELS[selectedPlan.id ?? 0] || `#${selectedPlan.id}`}
            </p>
            {selectedPlan.depositPercent != null && (
              <p className="text-[11px]" style={{ color: isDark ? H.purple : '#7C4DFF' }}>{t('requestDetail.deposit')} {selectedPlan.depositPercent}%</p>
            )}
          </div>
        )}
      </div>

      {/* Price receipt */}
      {priceBreakdown && (
        <div className="rounded-xl p-4" style={{ backgroundColor: isDark ? H.bg : '#FAFBFC', border: `1px solid ${H.grayLight}` }}>
          <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: H.gray }}>
            <Receipt className="h-3.5 w-3.5" />
            {t('requestDetail.costCalc')}
          </h3>
          <div className="space-y-2">
            {priceBreakdown.baseRentalCost != null && (
              <div className="flex justify-between text-[13px]">
                <span style={{ color: H.gray }}>{t('requestDetail.rental')}</span>
                <span className="font-semibold" style={{ color: H.navy }}>{fmtMoney(priceBreakdown.baseRentalCost)}</span>
              </div>
            )}
            {priceBreakdown.insuranceCost != null && priceBreakdown.insuranceCost > 0 && (
              <div className="flex justify-between text-[13px]">
                <span style={{ color: H.gray }}>{t('requestDetail.insurance')}</span>
                <span className="font-semibold" style={{ color: H.navy }}>{fmtMoney(priceBreakdown.insuranceCost)}</span>
              </div>
            )}
            {priceBreakdown.extrasCost != null && priceBreakdown.extrasCost > 0 && (
              <div className="flex justify-between text-[13px]">
                <span style={{ color: H.gray }}>{t('requestDetail.addOns')}</span>
                <span className="font-semibold" style={{ color: H.navy }}>{fmtMoney(priceBreakdown.extrasCost)}</span>
              </div>
            )}

            <div className="my-2" style={{ borderTop: `1px dashed ${H.grayLight}` }} />

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold" style={{ color: H.navy }}>{t('requestDetail.totalPrice')}</span>
              <span className="text-[17px] font-bold" style={{ color: H.navy }}>{fmtMoney(priceBreakdown.totalCost)}</span>
            </div>

            {priceBreakdown.depositAmount != null && priceBreakdown.depositAmount > 0 && (
              <div className="flex items-center justify-between rounded-lg px-3 py-1.5 -mx-1" style={{ backgroundColor: isDark ? H.orangeBg : '#FFF3E0' }}>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: isDark ? H.orange : '#E65100' }}>
                  <Shield className="h-3.5 w-3.5" />
                  {t('requestDetail.deposit')}
                </span>
                <span className="text-[13px] font-bold" style={{ color: isDark ? H.orange : '#E65100' }}>{fmtMoney(priceBreakdown.depositAmount)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Extras */}
      {selectedExtras && selectedExtras.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: H.gray }}>
            <Package className="h-3.5 w-3.5" />
            {t('requestDetail.addOns')}
          </h3>
          <div className="space-y-1.5">
            {selectedExtras.map((ext, i) => (
              <div key={ext.id ?? i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: H.bg }}>
                <div>
                  <span className="text-[13px]" style={{ color: H.navy }}>
                    {EXTRA_LABELS[ext.id ?? ''] || ext.id}
                  </span>
                  {ext.isPerDay && ext.quantity ? (
                    <span className="ml-1.5 text-[11px]" style={{ color: H.gray }}>
                      {fmtMoney(ext.price)} x {ext.quantity} {t('common.days')}
                    </span>
                  ) : ext.quantity && ext.quantity > 1 ? (
                    <span className="ml-1.5 text-[11px]" style={{ color: H.gray }}>
                      x{ext.quantity}
                    </span>
                  ) : null}
                </div>
                <span className="text-[13px] font-semibold" style={{ color: H.navy }}>{fmtMoney(ext.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';
  const id = params.id as string;

  const [request, setRequest] = useState<RentalRequestFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [approveClientId, setApproveClientId] = useState('');
  const [approveCarId, setApproveCarId] = useState('');
  const [approvePickupDate, setApprovePickupDate] = useState('');
  const [approveReturnDate, setApproveReturnDate] = useState('');
  const [approvePickupLocation, setApprovePickupLocation] = useState('');
  const [approveReturnLocation, setApproveReturnLocation] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [approveError, setApproveError] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = useMemo(() => ({
    new: { label: t('requests.mapNew'), bg: isDark ? '#2D2047' : '#EDE7F6', text: isDark ? H.purpleLight : '#5E35B1', dot: isDark ? H.purple : '#7C4DFF' },
    in_review: { label: t('requests.mapProcessing'), bg: isDark ? H.orangeBg : '#FFF3E0', text: isDark ? H.orange : '#E65100', dot: isDark ? '#F6AD55' : '#FF9100' },
    approved: { label: t('requests.mapApproved'), bg: isDark ? H.greenBg : '#E8F5E9', text: isDark ? H.green : '#2E7D32', dot: isDark ? '#48BB78' : '#4CAF50' },
    rejected: { label: t('requests.mapRejected'), bg: isDark ? H.redBg : '#FFEBEE', text: isDark ? H.red : '#C62828', dot: isDark ? '#FC8181' : '#EF5350' },
    cancelled: { label: t('requests.mapCancelled'), bg: isDark ? H.grayLight : '#ECEFF1', text: isDark ? H.gray : '#546E7A', dot: H.gray },
  }), [t, isDark, H]);

  const SOURCE_CONFIG: Record<string, { label: string; bg: string; text: string }> = useMemo(() => ({
    website: { label: t('requests.sourceWebsite'), bg: isDark ? H.blueBg : '#E3F2FD', text: isDark ? H.blue : '#1565C0' },
    phone: { label: t('requests.sourcePhone'), bg: isDark ? H.greenBg : '#E8F5E9', text: isDark ? H.green : '#2E7D32' },
    telegram: { label: t('requests.sourceTelegram'), bg: isDark ? H.blueBg : '#E3F2FD', text: isDark ? H.blue : '#0288D1' },
    instagram: { label: t('requests.sourceInstagram'), bg: isDark ? H.redBg : '#FCE4EC', text: isDark ? H.red : '#C2185B' },
    walk_in: { label: t('requests.sourceWalkIn'), bg: isDark ? H.orangeBg : '#FFF3E0', text: isDark ? H.orange : '#E65100' },
  }), [t, isDark, H]);

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApiClient.get(`/rental-request/${id}`);
      const data: RentalRequestFull = res.data.rentalRequest;
      setRequest(data);
      setApproveClientId(data.client?.id?.toString() ?? '');
      setApproveCarId(data.car?.id?.toString() ?? '');
      setApprovePickupDate(toInputDate(data.pickupDate));
      setApproveReturnDate(toInputDate(data.returnDate));
      setApprovePickupLocation(data.pickupLocation ?? '');
      setApproveReturnLocation(data.returnLocation ?? '');
    } catch (err: unknown) {
      console.error(err);
      setError(t('common.errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleTakeInReview = async () => {
    setActionLoading(true);
    try {
      await adminApiClient.patch(`/rental-request/${id}`, { status: 'in_review' });
      await fetchRequest();
    } catch (err) {
      console.error(err);
      alert(t('requestDetail.statusChangeFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setApproveError(null);
    if (!approveCarId || !approvePickupDate || !approveReturnDate) {
      setApproveError(t('requestDetail.fillRequired'));
      return;
    }
    setActionLoading(true);
    try {
      const body: Record<string, unknown> = {
        carId: Number(approveCarId),
        pickupDate: new Date(approvePickupDate).toISOString(),
        returnDate: new Date(approveReturnDate).toISOString(),
        pickupLocation: approvePickupLocation,
        returnLocation: approveReturnLocation,
      };
      if (approveClientId) {
        body.clientId = Number(approveClientId);
      }
      await adminApiClient.post(`/rental-request/${id}/approve`, body);
      router.push('/admin/requests');
    } catch (err: any) {
      console.error(err);
      setApproveError(err?.response?.data?.msg || t('requestDetail.approveError'));
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setRejectError(null);
    if (!rejectReason.trim()) {
      setRejectError(t('requestDetail.rejectReasonRequired'));
      return;
    }
    setActionLoading(true);
    try {
      await adminApiClient.post(`/rental-request/${id}/reject`, {
        reason: rejectReason.trim(),
      });
      router.push('/admin/requests');
    } catch (err) {
      console.error(err);
      setRejectError(t('requestDetail.rejectError'));
      setActionLoading(false);
    }
  };

  /* ---- Loading ---- */
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="rounded-2xl px-8 py-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-xl" style={{ backgroundColor: H.bg }} />
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded" style={{ backgroundColor: H.bg }} />
              <div className="h-3 w-32 animate-pulse rounded" style={{ backgroundColor: H.bg }} />
            </div>
          </div>
        </div>
        {/* Card skeleton */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
          <div className="flex gap-6">
            <div className="h-44 w-72 animate-pulse rounded-xl" style={{ backgroundColor: H.bg }} />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-40 animate-pulse rounded" style={{ backgroundColor: H.bg }} />
              <div className="h-4 w-24 animate-pulse rounded" style={{ backgroundColor: H.bg }} />
              <div className="h-16 w-full animate-pulse rounded-xl" style={{ backgroundColor: H.bg }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: isDark ? H.redBg : '#FFEBEE' }}>
          <XCircle className="h-8 w-8" style={{ color: isDark ? H.red : '#EF5350' }} />
        </div>
        <p className="mt-4 text-[15px] font-semibold" style={{ color: H.navy }}>{error ?? t('common.errorOccurred')}</p>
        <Link
          href="/admin/requests"
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:opacity-80"
          style={{ color: isDark ? H.purple : '#7C4DFF' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('requestDetail.backToList')}
        </Link>
      </div>
    );
  }

  /* ---- Derived data ---- */
  const st = STATUS_MAP[request.status] ?? {
    label: request.status, bg: isDark ? H.grayLight : '#ECEFF1', text: isDark ? H.gray : '#546E7A', dot: H.gray,
  };

  const src = SOURCE_CONFIG[request.source] ?? { label: request.source, bg: H.bg, text: H.gray };

  const contactName =
    request.client
      ? `${request.client.firstName} ${request.client.lastName}`
      : [request.firstName, request.lastName].filter(Boolean).join(' ') || '—';

  const contactPhone = request.client?.phone ?? request.phone ?? '—';
  const contactEmail = request.client?.email ?? request.email ?? '—';

  const carPreview =
    request.car?.previewUrl
      ? `${BASE_URL}static/${request.car.previewUrl}`
      : request.car?.carPhoto?.find((p) => p.type === 'PC')?.url
        ? `${BASE_URL}static/${request.car.carPhoto.find((p) => p.type === 'PC')!.url}`
        : null;

  const canAct = request.status === 'new' || request.status === 'in_review';
  const rentalDays = daysBetween(request.pickupDate, request.returnDate);

  /* ---- Render ---- */
  return (
    <div className="space-y-5">
      {/* ══════════ PAGE HEADER ══════════ */}
      <div className="rounded-2xl px-8 py-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/requests" className="ios-icon-btn">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: `linear-gradient(to bottom right, ${isDark ? H.purple : '#7C4DFF'}, ${isDark ? '#6B3FE7' : '#651FFF'})`, boxShadow: isDark ? '0 4px 12px rgba(124,92,255,0.4)' : '0 4px 12px rgba(124,77,255,0.3)' }}
            >
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-bold" style={{ color: H.navy }}>{t('requestDetail.title', { id: request.id })}</h1>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
                  style={{ backgroundColor: st.bg, color: st.text }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
                  {st.label}
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: src.bg, color: src.text }}
                >
                  <Globe className="h-3 w-3" />
                  {src.label}
                </span>
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: H.gray }}>
                {fmtDateTime(request.createdAt)}
                {request.assignedTo && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {request.assignedTo.email}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {canAct && (
            <div className="flex items-center gap-2.5">
              {request.status === 'new' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleTakeInReview}
                  className="ios-btn ios-btn-warning text-[13px]"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                  {t('requestDetail.toWork')}
                </button>
              )}
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => { setShowApproveForm((v) => !v); setShowRejectForm(false); }}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: showApproveForm
                    ? isDark ? 'linear-gradient(to right, #276749, #1C5631)' : 'linear-gradient(to right, #2E7D32, #1B5E20)'
                    : isDark ? 'linear-gradient(to right, #48BB78, #38A169)' : 'linear-gradient(to right, #66BB6A, #43A047)',
                  boxShadow: isDark ? '0 2px 8px rgba(72,187,120,0.3)' : '0 2px 8px rgba(76,175,80,0.3)',
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {t('requestDetail.approve')}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => { setShowRejectForm((v) => !v); setShowApproveForm(false); }}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: showRejectForm
                    ? isDark ? 'linear-gradient(to right, #9B2C2C, #822727)' : 'linear-gradient(to right, #C62828, #B71C1C)'
                    : isDark ? 'linear-gradient(to right, #FC8181, #F56565)' : 'linear-gradient(to right, #EF5350, #E53935)',
                  boxShadow: isDark ? '0 2px 8px rgba(252,129,129,0.3)' : '0 2px 8px rgba(239,83,80,0.3)',
                }}
              >
                <XCircle className="h-4 w-4" />
                {t('requestDetail.reject')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ STATUS BANNERS ══════════ */}
      {request.status === 'rejected' && request.rejectionReason && (
        <div
          className="flex items-start gap-3 rounded-2xl px-6 py-4"
          style={{ backgroundColor: isDark ? H.redBg : '#FFEBEE', border: `1px solid ${isDark ? '#5C2B2B' : '#FFCDD2'}` }}
        >
          <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: isDark ? H.red : '#EF5350' }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: isDark ? H.red : '#C62828' }}>{t('requestDetail.rejectReason')}</p>
            <p className="mt-1 text-[13px]" style={{ color: isDark ? '#FEB2B2' : '#D32F2F' }}>{request.rejectionReason}</p>
          </div>
        </div>
      )}

      {request.status === 'approved' && request.reservation && (
        <div
          className="flex items-center gap-3 rounded-2xl px-6 py-4"
          style={{ backgroundColor: isDark ? H.greenBg : '#E8F5E9', border: `1px solid ${isDark ? '#2D5A3F' : '#C8E6C9'}` }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: isDark ? H.green : '#4CAF50' }} />
          <p className="text-[13px]" style={{ color: isDark ? '#81C784' : '#2E7D32' }}>
            {t('requestDetail.reservationCreated')}{' '}
            <Link
              href={`/admin/reservations/${request.reservation.id}`}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 transition-colors hover:opacity-80"
            >
              #{request.reservation.id}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      )}

      {/* ══════════ ACTION FORMS ══════════ */}
      {showApproveForm && (
        <form
          onSubmit={handleApprove}
          className="rounded-2xl p-6"
          style={{ backgroundColor: H.white, boxShadow: H.shadow }}
        >
          <h3 className="flex items-center gap-2.5 text-[15px] font-bold" style={{ color: H.navy }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: isDark ? H.greenBg : '#E8F5E9' }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: isDark ? H.green : '#4CAF50' }} />
            </div>
            {t('requestDetail.confirmApproval')}
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.clientIdLabel')}</span>
              <input
                type="number"
                value={approveClientId}
                onChange={(e) => setApproveClientId(e.target.value)}
                placeholder={t('requestDetail.autoCreateClient')}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.carIdLabel')}</span>
              <input
                type="number"
                required
                value={approveCarId}
                onChange={(e) => setApproveCarId(e.target.value)}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.pickupDateLabel')}</span>
              <input
                type="date"
                required
                value={approvePickupDate}
                onChange={(e) => setApprovePickupDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.returnDateLabel')}</span>
              <input
                type="date"
                required
                value={approveReturnDate}
                onChange={(e) => setApproveReturnDate(e.target.value)}
                min={approvePickupDate || new Date().toISOString().slice(0, 10)}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.pickupLocationLabel')}</span>
              <input
                type="text"
                value={approvePickupLocation}
                onChange={(e) => setApprovePickupLocation(e.target.value)}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.returnLocationLabel')}</span>
              <input
                type="text"
                value={approveReturnLocation}
                onChange={(e) => setApproveReturnLocation(e.target.value)}
                className="mt-1.5 block w-full ios-input text-[13px]"
              />
            </label>
          </div>

          {approveError && (
            <div className="mt-4 ios-alert-destructive">
              {approveError}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: isDark ? 'linear-gradient(to right, #48BB78, #38A169)' : 'linear-gradient(to right, #66BB6A, #43A047)',
                boxShadow: isDark ? '0 2px 8px rgba(72,187,120,0.25)' : '0 2px 8px rgba(76,175,80,0.25)',
              }}
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('requestDetail.confirm')}
            </button>
            <button
              type="button"
              onClick={() => { setShowApproveForm(false); setApproveError(null); }}
              className="ios-btn ios-btn-secondary text-[13px]"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {showRejectForm && (
        <form
          onSubmit={handleReject}
          className="rounded-2xl p-6"
          style={{ backgroundColor: H.white, boxShadow: H.shadow }}
        >
          <h3 className="flex items-center gap-2.5 text-[15px] font-bold" style={{ color: H.navy }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: isDark ? H.redBg : '#FFEBEE' }}>
              <XCircle className="h-4 w-4" style={{ color: isDark ? H.red : '#EF5350' }} />
            </div>
            {t('requestDetail.confirmRejection')}
          </h3>
          <label className="mt-4 block">
            <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.rejectReason')}</span>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('requestDetail.rejectPlaceholder')}
              className="mt-1.5 block w-full ios-textarea text-[13px]"
            />
          </label>
          {rejectError && (
            <div className="mt-4 ios-alert-destructive">
              {rejectError}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="ios-btn ios-btn-destructive text-[13px]"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('requestDetail.confirmReject')}
            </button>
            <button
              type="button"
              onClick={() => { setShowRejectForm(false); setRejectError(null); }}
              className="ios-btn ios-btn-secondary text-[13px]"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ══════════ HERO: CAR + DATE RANGE ══════════ */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
        <div className="flex flex-col sm:flex-row">
          {/* Car image / placeholder */}
          <div className="relative sm:w-80 shrink-0">
            {carPreview ? (
              <img
                src={carPreview}
                alt={request.car ? `${request.car.brand} ${request.car.model}` : ''}
                className="h-full w-full object-cover sm:absolute sm:inset-0"
                style={{ aspectRatio: '16/10' }}
              />
            ) : (
              <div
                className="flex h-full min-h-[180px] items-center justify-center"
                style={{ background: isDark ? `linear-gradient(135deg, ${H.bg} 0%, ${H.grayLight} 100%)` : 'linear-gradient(135deg, #F0F4F8 0%, #E3E8ED 100%)' }}
              >
                <Car className="h-16 w-16" style={{ color: isDark ? H.gray : '#B0BEC5' }} />
              </div>
            )}
          </div>

          {/* Right: summary info */}
          <div className="flex-1 p-6">
            {/* Car name + plate */}
            {request.car ? (
              <div className="mb-5">
                <h2 className="text-[17px] font-bold" style={{ color: H.navy }}>
                  {request.car.brand} {request.car.model}
                </h2>
                <span
                  className="mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-mono font-medium"
                  style={{ backgroundColor: H.bg, color: H.gray }}
                >
                  {request.car.plateNumber}
                </span>
              </div>
            ) : (
              <div className="mb-5">
                <h2 className="text-[17px] font-bold" style={{ color: H.navy }}>{t('common.notSpecified')}</h2>
              </div>
            )}

            {/* Date range visual */}
            <div className="flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}` }}>
              <div className="flex-1 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.pickup')}</p>
                <p className="mt-1 text-[14px] font-bold" style={{ color: H.navy }}>{fmtDateShort(request.pickupDate)}</p>
                {request.pickupLocation && (
                  <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] truncate" style={{ color: H.gray }}>
                    <MapPin className="h-3 w-3 shrink-0" style={{ color: H.gray }} />
                    {request.pickupLocation}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-px w-8" style={{ backgroundColor: H.grayLight }} />
                {rentalDays != null ? (
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold text-white"
                    style={{ background: `linear-gradient(to right, ${isDark ? H.purple : '#7C4DFF'}, ${isDark ? '#6B3FE7' : '#651FFF'})` }}
                  >
                    {rentalDays} {t('common.days')}
                  </span>
                ) : (
                  <ArrowRight className="h-4 w-4" style={{ color: isDark ? H.gray : '#B0BEC5' }} />
                )}
                <div className="h-px w-8" style={{ backgroundColor: H.grayLight }} />
              </div>
              <div className="flex-1 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('requestDetail.return_')}</p>
                <p className="mt-1 text-[14px] font-bold" style={{ color: H.navy }}>{fmtDateShort(request.returnDate)}</p>
                {request.returnLocation && (
                  <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] truncate" style={{ color: H.gray }}>
                    <MapPin className="h-3 w-3 shrink-0" style={{ color: H.gray }} />
                    {request.returnLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Flight number */}
            {request.flightNumber && (
              <div className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: H.gray }}>
                <Plane className="h-3.5 w-3.5" style={{ color: H.gray }} />
                <span>{t('requestDetail.flight')} <span className="font-semibold" style={{ color: H.navy }}>{request.flightNumber}</span></span>
              </div>
            )}

            {/* Meta chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium"
                style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}`, color: H.gray }}
              >
                <UserCheck className="h-3 w-3" style={{ color: H.gray }} />
                {request.assignedTo ? request.assignedTo.email : t('common.notAssigned')}
              </span>
              {request.client && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium"
                  style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}`, color: H.gray }}
                >
                  <Hash className="h-3 w-3" style={{ color: H.gray }} />
                  {t('requestDetail.client')} #{request.client.id}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ MAIN CONTENT: 2 COLUMNS ══════════ */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Left column (3/5) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Contact card */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${isDark ? H.purple : '#7C4DFF'}, ${isDark ? '#6B3FE7' : '#651FFF'})`, boxShadow: isDark ? '0 3px 10px rgba(124,92,255,0.3)' : '0 3px 10px rgba(124,77,255,0.25)' }}
              >
                {getInitials(contactName)}
              </div>
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: H.navy }}>{contactName}</h2>
                <p className="text-[12px]" style={{ color: H.gray }}>{t('requestDetail.contactPerson')}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}` }}>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: isDark ? H.blueBg : '#E3F2FD' }}
                >
                  <Phone className="h-4 w-4" style={{ color: isDark ? H.blue : '#1565C0' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('common.phone')}</p>
                  <p className="text-[13px] font-semibold truncate" style={{ color: H.navy }}>{contactPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}` }}>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: isDark ? '#2D2047' : '#EDE7F6' }}
                >
                  <Mail className="h-4 w-4" style={{ color: isDark ? H.purple : '#7C4DFF' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: H.gray }}>{t('common.email')}</p>
                  <p className="text-[13px] font-semibold truncate" style={{ color: H.navy }}>{contactEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          {request.comment && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
              <h2 className="flex items-center gap-2.5 text-[13px] font-bold mb-3" style={{ color: H.navy }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: H.bg }}>
                  <MessageSquare className="h-3.5 w-3.5" style={{ color: H.gray }} />
                </div>
                {t('requestDetail.commentSection')}
              </h2>
              <div className="rounded-xl p-4" style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}` }}>
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed" style={{ color: H.navy }}>
                  {request.comment}
                </p>
              </div>
            </div>
          )}

          {/* Reservation add-ons */}
          {request.reservation?.reservationAddOns && request.reservation.reservationAddOns.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
              <h2 className="flex items-center gap-2.5 text-[13px] font-bold mb-3" style={{ color: H.navy }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: H.bg }}>
                  <Package className="h-3.5 w-3.5" style={{ color: H.gray }} />
                </div>
                {t('requestDetail.addOnsSection')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {request.reservation.reservationAddOns.map((ra) => (
                  <span
                    key={ra.id}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
                    style={{ backgroundColor: H.bg, border: `1px solid ${H.grayLight}`, color: H.navy }}
                  >
                    <CircleDot className="h-3 w-3" style={{ color: isDark ? H.purple : '#7C4DFF' }} />
                    {ra.addOn.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column (2/5) — Pricing / Snapshot */}
        <div className="lg:col-span-2 space-y-5">
          {request.websiteSnapshot && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: H.white, boxShadow: H.shadow }}>
              <h2 className="flex items-center gap-2.5 text-[13px] font-bold mb-4" style={{ color: H.navy }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: H.bg }}>
                  <Globe className="h-3.5 w-3.5" style={{ color: H.gray }} />
                </div>
                {t('requestDetail.websiteData')}
              </h2>
              <WebsiteSnapshotCard snapshot={request.websiteSnapshot} t={t} H={H} isDark={isDark} />
            </div>
          )}
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div className="flex items-center justify-between pt-2 pb-4 text-[12px]" style={{ color: isDark ? H.gray : '#B0BEC5' }}>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t('common.created')} {fmtDateTime(request.createdAt)}
        </span>
        <span>
          {t('common.updated')} {fmtDateTime(request.updatedAt)}
        </span>
      </div>
    </div>
  );
}
