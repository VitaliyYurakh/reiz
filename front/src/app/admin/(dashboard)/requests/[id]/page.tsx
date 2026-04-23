'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { logError } from '@/lib/log';
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
  Globe,
  Shield,
  Package,
  Phone,
  Mail,
} from 'lucide-react';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { EntitySearch } from '@/components/admin/EntitySearch';
import { PartnerBadge } from '@/components/admin/PartnerBadge';

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
  partner?: { id: number; fullName: string; companyName: string | null } | null;
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
  return new Date(d).toLocaleDateString('uk', { day: 'numeric', month: 'short' });
}

function fmtDateTime(d: string | null) {
  if (!d) return '—';
  const date = new Date(d);
  const datePart = date
    .toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/\s*р\.?\s*$/, '');
  const timePart = date.toLocaleTimeString('uk', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
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
  const start = new Date(a);
  const end = new Date(b);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const calendarDays = Math.round((endDay.getTime() - startDay.getTime()) / 86_400_000);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = end.getHours() * 60 + end.getMinutes();
  const overtime = endMin - startMin > 120 ? 1 : 0;
  return Math.max(calendarDays + overtime, 1);
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  WebsiteSnapshotCard                                                */
/* ------------------------------------------------------------------ */

function WebsiteSnapshotCard({ snapshot, t }: {
  snapshot: Record<string, unknown>;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
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
    <div className="space-y-5">
      {/* Summary: car + key metrics */}
      {(carDetails || totalDays != null || selectedPlan?.depositPercent != null) && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          {carDetails && (
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {t('requestDetail.car')}
              </p>
              <p className="mt-1 truncate text-base font-semibold text-foreground">
                {carDetails.brand} {carDetails.model}
                {carDetails.year && (
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground tabular-nums">
                    {carDetails.year}
                  </span>
                )}
              </p>
            </div>
          )}
          <div className="flex gap-4">
            {totalDays != null && (
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t('common.days')}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                  {totalDays}
                </p>
              </div>
            )}
            {selectedPlan?.depositPercent != null && (
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t('requestDetail.coverage')}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                  {selectedPlan.depositPercent}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price breakdown block */}
      {priceBreakdown && (
        <div className="rounded-xl bg-muted/40 p-4">
          <div className="space-y-2">
            {priceBreakdown.baseRentalCost != null && (
              <Row label={t('requestDetail.rental')} value={fmtMoney(priceBreakdown.baseRentalCost)} />
            )}
            {priceBreakdown.insuranceCost != null && priceBreakdown.insuranceCost > 0 && (
              <Row label={t('requestDetail.insurance')} value={fmtMoney(priceBreakdown.insuranceCost)} />
            )}
            {priceBreakdown.extrasCost != null && priceBreakdown.extrasCost > 0 && (
              <Row label={t('requestDetail.addOns')} value={fmtMoney(priceBreakdown.extrasCost)} />
            )}
          </div>

          {priceBreakdown.totalCost != null && (
            <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="text-sm font-semibold text-foreground">
                {t('requestDetail.totalPrice')}
              </span>
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {fmtMoney(priceBreakdown.totalCost)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Deposit — visually separated */}
      {priceBreakdown?.depositAmount != null && priceBreakdown.depositAmount > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            {t('requestDetail.deposit')}
          </span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {fmtMoney(priceBreakdown.depositAmount)}
          </span>
        </div>
      )}

      {/* Extras */}
      {selectedExtras && selectedExtras.length > 0 && (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {t('requestDetail.addOns')}
          </p>
          <ul className="mt-2 divide-y divide-border/50">
            {selectedExtras.map((ext, i) => (
              <li
                key={ext.id ?? i}
                className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0"
              >
                <span className="min-w-0 truncate text-foreground">
                  {EXTRA_LABELS[ext.id ?? ''] || ext.id}
                  {ext.isPerDay && ext.quantity ? (
                    <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
                      {fmtMoney(ext.price)} × {ext.quantity}
                    </span>
                  ) : ext.quantity && ext.quantity > 1 ? (
                    <span className="ml-1.5 text-xs text-muted-foreground">×{ext.quantity}</span>
                  ) : null}
                </span>
                <span className="shrink-0 font-semibold text-foreground tabular-nums">
                  {fmtMoney(ext.cost)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useAdminLocale();
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

  // Status + source labels only — palette is unified (amber for warning, default for rest).
  const STATUS_LABEL: Record<string, string> = useMemo(() => ({
    new: t('requests.mapNew'),
    in_review: t('requests.mapProcessing'),
    approved: t('requests.mapApproved'),
    rejected: t('requests.mapRejected'),
    cancelled: t('requests.mapCancelled'),
  }), [t]);

  const SOURCE_LABEL: Record<string, string> = useMemo(() => ({
    website: t('requests.sourceWebsite'),
    phone: t('requests.sourcePhone'),
    telegram: t('requests.sourceTelegram'),
    instagram: t('requests.sourceInstagram'),
    walk_in: t('requests.sourceWalkIn'),
  }), [t]);

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
      logError(err);
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
      toastError(err, t('requestDetail.statusChangeFailed'));
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
      if (approveClientId) body.clientId = Number(approveClientId);
      await adminApiClient.post(`/rental-request/${id}/approve`, body);
      router.push('/admin/requests?status=new');
    } catch (err: any) {
      logError(err);
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
      router.push('/admin/requests?status=new');
    } catch (err) {
      logError(err);
      setRejectError(t('requestDetail.rejectError'));
      setActionLoading(false);
    }
  };

  /* ---- Loading ---- */
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="ios-card !py-4">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="ios-card">
          <div className="h-44 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <XCircle className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">{error ?? t('common.errorOccurred')}</p>
        <Link
          href="/admin/requests"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('requestDetail.backToList')}
        </Link>
      </div>
    );
  }

  /* ---- Derived ---- */
  const statusLabel = STATUS_LABEL[request.status] ?? request.status;
  const sourceLabel = SOURCE_LABEL[request.source] ?? request.source;

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

  const statusBadge =
    request.status === 'approved'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
      : request.status === 'in_review'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
        : request.status === 'rejected'
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
          : request.status === 'cancelled'
            ? 'bg-muted text-muted-foreground'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400';

  /* ---- Render ---- */
  return (
    <div className="space-y-3">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="ios-card !py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/requests"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-border"
              aria-label={t('requestDetail.backToList')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                <h1 className="text-xl font-semibold leading-tight text-foreground">
                  {t('requestDetail.title', { id: request.id })}
                </h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {sourceLabel}
                <span className="mx-1.5 opacity-50">·</span>
                {fmtDateTime(request.createdAt)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {canAct && (
            <div className="flex flex-wrap items-center gap-2">
              {request.status === 'new' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleTakeInReview}
                  className="ios-btn ios-btn-warning text-xs"
                >
                  {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                  {t('requestDetail.toWork')}
                </button>
              )}
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => { setShowApproveForm((v) => !v); setShowRejectForm(false); }}
                className="ios-btn ios-btn-success text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('requestDetail.approve')}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => { setShowRejectForm((v) => !v); setShowApproveForm(false); }}
                className="ios-btn ios-btn-destructive text-xs"
              >
                <XCircle className="h-3.5 w-3.5" />
                {t('requestDetail.reject')}
              </button>
            </div>
          )}
        </div>

        {/* Inline status notes — integrated into header, no separate card */}
        {request.status === 'rejected' && request.rejectionReason && (
          <div className="mt-3 border-t border-border/50 pt-3 text-sm">
            <span className="text-muted-foreground">{t('requestDetail.rejectionNote')}: </span>
            <span className="text-foreground">{request.rejectionReason}</span>
          </div>
        )}
        {request.status === 'approved' && request.reservation && (
          <div className="mt-3 border-t border-border/50 pt-3 text-sm">
            <span className="text-muted-foreground">{t('requestDetail.reservationCreated')} </span>
            <Link
              href={`/admin/reservations/${request.reservation.id}`}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              #{request.reservation.id}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>


      {/* ── Approve form ───────────────────────────────────── */}
      {showApproveForm && (
        <form onSubmit={handleApprove} className="ios-card">
          <h3 className="text-sm font-semibold text-foreground">{t('requestDetail.confirmApproval')}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t('requestDetail.clientIdLabel')} hint={t('requestDetail.clientIdHint')}>
              <div style={{ marginTop: 6 }}>
                <EntitySearch
                  entity="client"
                  value={approveClientId}
                  onChange={setApproveClientId}
                  placeholder={t('requestDetail.autoCreateClient')}
                />
              </div>
            </Field>
            <Field label={t('requestDetail.carIdLabel')}>
              <div style={{ marginTop: 6 }}>
                <EntitySearch
                  entity="car"
                  value={approveCarId}
                  onChange={setApproveCarId}
                  required
                  placeholder="— Оберіть авто —"
                />
              </div>
            </Field>
            <Field label={t('requestDetail.pickupDateLabel')}>
              <input
                type="date"
                required
                value={approvePickupDate}
                onChange={(e) => setApprovePickupDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="ios-input text-sm"
                style={{ display: 'block', width: '100%', marginTop: 6 }}
              />
            </Field>
            <Field label={t('requestDetail.returnDateLabel')}>
              <input
                type="date"
                required
                value={approveReturnDate}
                onChange={(e) => setApproveReturnDate(e.target.value)}
                min={approvePickupDate || new Date().toISOString().slice(0, 10)}
                className="ios-input text-sm"
                style={{ display: 'block', width: '100%', marginTop: 6 }}
              />
            </Field>
            <Field label={t('requestDetail.pickupLocationLabel')}>
              <input
                type="text"
                value={approvePickupLocation}
                onChange={(e) => setApprovePickupLocation(e.target.value)}
                className="ios-input text-sm"
                style={{ display: 'block', width: '100%', marginTop: 6 }}
              />
            </Field>
            <Field label={t('requestDetail.returnLocationLabel')}>
              <input
                type="text"
                value={approveReturnLocation}
                onChange={(e) => setApproveReturnLocation(e.target.value)}
                className="ios-input text-sm"
                style={{ display: 'block', width: '100%', marginTop: 6 }}
              />
            </Field>
          </div>
          {approveError && <div className="mt-4 ios-alert-destructive">{approveError}</div>}
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={actionLoading} className="ios-btn ios-btn-success text-xs">
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {t('requestDetail.confirm')}
            </button>
            <button
              type="button"
              onClick={() => { setShowApproveForm(false); setApproveError(null); }}
              className="ios-btn ios-btn-secondary text-xs"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ── Reject form ────────────────────────────────────── */}
      {showRejectForm && (
        <form onSubmit={handleReject} className="ios-card">
          <h3 className="text-sm font-semibold text-foreground">{t('requestDetail.confirmRejection')}</h3>
          <div className="mt-4">
            <label htmlFor="reject-reason" className="text-xs font-medium text-muted-foreground">
              {t('requestDetail.rejectReason')}
            </label>
            <textarea
              id="reject-reason"
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('requestDetail.rejectPlaceholder')}
              className="ios-textarea text-sm"
              style={{ display: 'block', width: '100%', marginTop: 6 }}
            />
          </div>
          {rejectError && <div className="mt-4 ios-alert-destructive">{rejectError}</div>}
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={actionLoading} className="ios-btn ios-btn-destructive text-xs">
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {t('requestDetail.confirmReject')}
            </button>
            <button
              type="button"
              onClick={() => { setShowRejectForm(false); setRejectError(null); }}
              className="ios-btn ios-btn-secondary text-xs"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ── Car + Contact (side by side) ──────────────────── */}
      <div className="grid gap-3 lg:grid-cols-2">
      <div className="ios-card">
        <div className="flex h-20 items-start gap-4">
          {carPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={carPreview}
              alt={request.car ? `${request.car.brand} ${request.car.model}` : ''}
              className="h-20 w-32 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted">
              <Car className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {request.car ? `${request.car.brand} ${request.car.model}` : t('common.notSpecified')}
            </p>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              {request.car?.plateNumber && (
                <span className="text-xs text-muted-foreground">{request.car.plateNumber}</span>
              )}
              <PartnerBadge partner={request.car?.partner} />
            </div>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-border/50 text-sm">
          <div className="flex min-h-[48px] items-center justify-between gap-4 py-3 first:pt-0">
            <dt className="text-muted-foreground">{t('requestDetail.pickup')}</dt>
            <dd className="whitespace-nowrap text-right">
              <span className="font-medium text-foreground tabular-nums">
                {fmtDateShort(request.pickupDate)}
              </span>
              {request.pickupLocation && (
                <span className="ml-2 text-xs text-muted-foreground">
                  · {request.pickupLocation}
                </span>
              )}
            </dd>
          </div>
          <div className="flex min-h-[48px] items-center justify-between gap-4 py-3">
            <dt className="text-muted-foreground">{t('requestDetail.return_')}</dt>
            <dd className="whitespace-nowrap text-right">
              <span className="font-medium text-foreground tabular-nums">
                {fmtDateShort(request.returnDate)}
              </span>
              {request.returnLocation && (
                <span className="ml-2 text-xs text-muted-foreground">
                  · {request.returnLocation}
                </span>
              )}
            </dd>
          </div>
          {rentalDays != null && (
            <div className="flex min-h-[48px] items-center justify-between gap-4 py-3">
              <dt className="text-muted-foreground">{t('common.daysLabel')}</dt>
              <dd className="font-medium text-foreground tabular-nums">{rentalDays}</dd>
            </div>
          )}
          {request.flightNumber && (
            <div className="flex min-h-[48px] items-center justify-between gap-4 py-3 last:pb-0">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Plane className="h-3.5 w-3.5" /> {t('requestDetail.flight')}
              </dt>
              <dd className="font-medium text-foreground">{request.flightNumber}</dd>
            </div>
          )}
        </dl>
      </div>

        {/* Contact — mirrors car card: [icon+name] on top, <dl> below */}
        <div className="ios-card">
          <div className="flex h-20 items-start gap-4">
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted text-base font-semibold text-foreground">
              {getInitials(contactName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{contactName}</p>
              {request.client && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t('requestDetail.client')} #{request.client.id}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-4 divide-y divide-border/50 text-sm">
            <div className="flex min-h-[48px] items-center justify-between gap-3 py-3 first:pt-0">
              <dt className="inline-flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> {t('common.phone')}
              </dt>
              <dd className="truncate font-medium text-foreground">
                {contactPhone && contactPhone !== '—' ? (
                  <a href={`tel:${contactPhone}`} className="hover:text-primary hover:underline">
                    {contactPhone}
                  </a>
                ) : '—'}
              </dd>
            </div>
            <div className="flex min-h-[48px] items-center justify-between gap-3 py-3">
              <dt className="inline-flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {t('common.email')}
              </dt>
              <dd className="truncate font-medium text-foreground">{contactEmail}</dd>
            </div>
            <div className="flex min-h-[48px] items-center justify-between gap-3 py-3 last:pb-0">
              <dt className="text-muted-foreground">{t('common.assigned')}</dt>
              <dd className="truncate font-medium text-foreground">
                {request.assignedTo ? request.assignedTo.email : t('common.notAssigned')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── Comment / Add-ons / Website snapshot ─────────── */}
      {(request.comment || (request.reservation?.reservationAddOns && request.reservation.reservationAddOns.length > 0) || request.websiteSnapshot) && (
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-3">
            {request.comment && (
              <div className="ios-card">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  {t('requestDetail.commentSection')}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {request.comment}
                </p>
              </div>
            )}
            {request.reservation?.reservationAddOns && request.reservation.reservationAddOns.length > 0 && (
              <div className="ios-card">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  {t('requestDetail.addOnsSection')}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {request.reservation.reservationAddOns.map((ra) => (
                    <li key={ra.id}>
                      <span className="text-foreground">{ra.addOn.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {request.websiteSnapshot && (
            <div className="ios-card">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t('requestDetail.websiteData')}
              </p>
              <div className="mt-4">
                <WebsiteSnapshotCard snapshot={request.websiteSnapshot} t={t} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
        <span>
          {t('common.created')} {fmtDateTime(request.createdAt)}
        </span>
        <span>
          {t('common.updated')} {fmtDateTime(request.updatedAt)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper components                                                  */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
