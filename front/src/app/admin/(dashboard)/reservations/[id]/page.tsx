'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Car, User, Calendar, Package,
    ArrowDownLeft, ArrowUpRight,
    KeyRound, XCircle, UserX, Loader2, Gauge, StickyNote,
    Edit, Save, X, Calculator, Plus, Minus, Trash2, RotateCcw,
} from 'lucide-react';
import { BASE_URL } from '@/config/environment';
import { IosSelect } from '@/components/admin/ios-select';
import { useAdminLocale } from '@/context/AdminLocaleContext';

/* ── Types ── */

interface ReservationClient {
    id: number; firstName: string; lastName: string; middleName: string | null;
    phone: string; email: string | null; city: string | null;
}

interface CarPhoto { id: number; url: string; alt: string | null; type: string }
interface RentalTariff { id: number; minDays: number; maxDays: number; dailyPrice: number; deposit: number }
interface Segment { id: number; name: string }

interface ReservationCar {
    id: number; brand: string; model: string; plateNumber: string;
    previewUrl: string | null; carPhoto: CarPhoto[]; rentalTariff: RentalTariff[]; segment: Segment[];
}

interface CoveragePackage { id: number; name: string; depositPercent: number }
interface AddOnInfo { id: number; name: string; pricingMode: string }

interface ReservationAddOn {
    id: number; addOnId: number; quantity: number; unitPriceMinor: number;
    currency: string; totalMinor: number; addOn: AddOnInfo;
}

interface Transaction {
    id: number; type: string; direction: string; amountMinor: number;
    currency: string; description: string | null; createdAt: string;
}

interface Rental { id: number; contractNumber: string }
interface RentalRequest { id: number }

interface Reservation {
    id: number; status: string;
    pickupDate: string; returnDate: string;
    pickupLocation: string; returnLocation: string;
    coveragePackageId: number | null;
    deliveryFee: number | null; deliveryCurrency: string | null;
    cancelReason: string | null; cancelledAt: string | null;
    noShowAt: string | null; priceSnapshot: Record<string, unknown> | null;
    createdAt: string; updatedAt: string;
    client: ReservationClient; car: ReservationCar;
    coveragePackage: CoveragePackage | null;
    reservationAddOns: ReservationAddOn[];
    rental: Rental | null; transactions: Transaction[];
    rentalRequest: RentalRequest | null;
}

interface AvailableAddOn {
    id: number; name: string; pricingMode: string;
    unitPriceMinor: number; currency: string; qtyEditable: boolean;
}

interface CoverageOption { id: number; name: string; depositPercent: number }

interface PriceResult {
    totalDays: number; ratePlanName: string | null; dailyRateMinor: number; currency: string;
    rentalTotal: number; depositPercent: number; depositAmount: number;
    addOns: Array<{ addOnId: number; name: string; quantity: number; totalMinor: number; currency: string }>;
    addOnsTotal: number; deliveryFee: number; grandTotal: number;
}

/* ── Helpers ── */

function fmtDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function fmtDateTime(d: string | null) {
    if (!d) return '—';
    const dt = new Date(d);
    return `${dt.toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${dt.toLocaleTimeString('uk', { hour: '2-digit', minute: '2-digit' })}`;
}

function fmtMoney(minor: number, currency?: string) {
    const f = (minor / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2 });
    return currency ? `${f} ${currency}` : f;
}

function toLocalDatetime(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ── Component ── */

export default function ReservationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useAdminLocale();
    const id = params.id as string;

    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Action states
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Pickup form
    const [showPickupForm, setShowPickupForm] = useState(false);
    const [pickupOdometer, setPickupOdometer] = useState('');
    const [contractNumber, setContractNumber] = useState('');

    // Cancel form
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // No-show confirm
    const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);

    // Edit mode
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        pickupDate: '', returnDate: '', pickupLocation: '', returnLocation: '',
        coveragePackageId: '', deliveryFee: '0', deliveryCurrency: 'UAH',
    });

    // Reference data
    const [packages, setPackages] = useState<CoverageOption[]>([]);
    const [availableAddOns, setAvailableAddOns] = useState<AvailableAddOn[]>([]);

    // Add-on UI
    const [addOnToAdd, setAddOnToAdd] = useState('');
    const [addOnQty, setAddOnQty] = useState(1);
    const [addingAddOn, setAddingAddOn] = useState(false);

    // Price
    const [price, setPrice] = useState<PriceResult | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);

    const PRICING_MODE_LABEL: Record<string, string> = {
        PER_DAY: t('reservationDetail.perDay'), ONE_TIME: t('reservationDetail.oneTime'), MANUAL_QTY: t('reservationDetail.perUnit'),
    };

    const STATUS_MAP: Record<string, { label: string; class: string }> = {
        confirmed: { label: t('reservations.mapConfirmed'), class: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300' },
        picked_up: { label: t('reservations.mapIssued'), class: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300' },
        cancelled: { label: t('reservations.mapCancelled'), class: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300' },
        no_show: { label: t('reservations.mapNoShow'), class: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300' },
    };

    /* ── Fetch ── */

    const fetchReservation = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminApiClient.get(`/reservation/${id}`);
            const r: Reservation = res.data.reservation;
            setReservation(r);
            setForm({
                pickupDate: toLocalDatetime(r.pickupDate),
                returnDate: toLocalDatetime(r.returnDate),
                pickupLocation: r.pickupLocation || '',
                returnLocation: r.returnLocation || '',
                coveragePackageId: r.coveragePackageId ? String(r.coveragePackageId) : '',
                deliveryFee: String(r.deliveryFee || 0),
                deliveryCurrency: r.deliveryCurrency || 'UAH',
            });
        } catch (err: any) {
            setError(err?.response?.status === 404 ? t('reservationDetail.notFound') : t('reservationDetail.loadError'));
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => { if (id) fetchReservation(); }, [id, fetchReservation]);

    useEffect(() => {
        adminApiClient.get('/pricing/coverage-package').then(r => setPackages(r.data.coveragePackages)).catch(() => {});
        adminApiClient.get('/pricing/add-on').then(r => setAvailableAddOns(r.data.addOns)).catch(() => {});
    }, []);

    /* ── Price calculation ── */

    const recalcPrice = useCallback(async () => {
        if (!reservation) return;
        const pd = editing ? form.pickupDate : toLocalDatetime(reservation.pickupDate);
        const rd = editing ? form.returnDate : toLocalDatetime(reservation.returnDate);
        if (!pd || !rd || new Date(rd) <= new Date(pd)) return;
        setPriceLoading(true);
        try {
            const body: Record<string, unknown> = { carId: reservation.car.id, startDate: pd, endDate: rd };
            const cpId = editing ? form.coveragePackageId : (reservation.coveragePackageId ? String(reservation.coveragePackageId) : '');
            if (cpId) body.coveragePackageId = parseInt(cpId);
            const fee = editing ? parseInt(form.deliveryFee) : (reservation.deliveryFee || 0);
            if (fee) body.deliveryFee = fee;
            if (reservation.reservationAddOns.length > 0) {
                body.addOns = reservation.reservationAddOns.map(a => ({ addOnId: a.addOnId, qty: a.quantity }));
            }
            const res = await adminApiClient.post('/pricing/calculate', body);
            setPrice(res.data);
        } catch { /* silent */ } finally { setPriceLoading(false); }
    }, [reservation, editing, form]);

    useEffect(() => {
        if (reservation) { const t = setTimeout(recalcPrice, 300); return () => clearTimeout(t); }
    }, [reservation, form.pickupDate, form.returnDate, form.coveragePackageId, form.deliveryFee, recalcPrice]);

    /* ── Handlers ── */

    const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

    const handlePickupDateChange = (val: string) => {
        set('pickupDate', val);
        if (form.returnDate && new Date(form.returnDate) <= new Date(val)) set('returnDate', '');
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        setError(null);
        try {
            const body: Record<string, unknown> = {
                pickupDate: form.pickupDate, returnDate: form.returnDate,
                pickupLocation: form.pickupLocation, returnLocation: form.returnLocation,
                deliveryFee: parseInt(form.deliveryFee) || 0,
                deliveryCurrency: form.deliveryCurrency,
                coveragePackageId: form.coveragePackageId ? parseInt(form.coveragePackageId) : null,
            };
            if (price) body.priceSnapshot = price;
            await adminApiClient.patch(`/reservation/${id}`, body);
            setEditing(false);
            await fetchReservation();
        } catch (err: any) {
            setError(err?.response?.data?.msg || t('reservationDetail.saveError'));
        } finally { setSaving(false); }
    };

    const handleAddAddOn = async () => {
        if (!addOnToAdd) return;
        const ao = availableAddOns.find(a => a.id === parseInt(addOnToAdd));
        if (!ao) return;
        setAddingAddOn(true);
        try {
            await adminApiClient.post(`/reservation/${id}/add-on`, {
                addOnId: ao.id, quantity: addOnQty,
                unitPriceMinor: ao.unitPriceMinor, currency: ao.currency,
            });
            setAddOnToAdd('');
            setAddOnQty(1);
            await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.addServiceError'));
        } finally { setAddingAddOn(false); }
    };

    const handleRemoveAddOn = async (recordId: number) => {
        try {
            await adminApiClient.delete(`/reservation/${id}/add-on/${recordId}`);
            await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.removeServiceError'));
        }
    };

    const handlePickup = async () => {
        setActionLoading(true); setActionError(null);
        try {
            const body: Record<string, unknown> = {};
            if (pickupOdometer) body.pickupOdometer = Number(pickupOdometer);
            if (contractNumber) body.contractNumber = contractNumber;
            const res = await adminApiClient.post(`/reservation/${id}/pickup`, body);
            setShowPickupForm(false);
            if (res.data.warnings?.length) alert(t('reservationDetail.warnings') + '\n' + res.data.warnings.join('\n'));
            if (res.data.rental?.id) router.push(`/admin/rentals/${res.data.rental.id}`);
            else await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.issueError'));
        } finally { setActionLoading(false); }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) { setActionError(t('reservationDetail.cancelReason')); return; }
        setActionLoading(true); setActionError(null);
        try {
            await adminApiClient.post(`/reservation/${id}/cancel`, { reason: cancelReason.trim() });
            setShowCancelForm(false); setCancelReason('');
            await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.cancelError'));
        } finally { setActionLoading(false); }
    };

    const handleNoShow = async () => {
        setActionLoading(true); setActionError(null);
        try {
            await adminApiClient.post(`/reservation/${id}/no-show`);
            setShowNoShowConfirm(false); await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.noShowError'));
        } finally { setActionLoading(false); }
    };

    const handleReactivate = async () => {
        if (!confirm(t('reservationDetail.restore') + '?')) return;
        setActionLoading(true);
        try {
            await adminApiClient.post(`/reservation/${id}/reactivate`);
            await fetchReservation();
        } catch (err: any) {
            setActionError(err?.response?.data?.msg || t('reservationDetail.restoreError'));
        } finally { setActionLoading(false); }
    };

    /* ── Loading skeleton ── */

    if (loading) {
        return (
            <div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                    <div className="h-7 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (error && !reservation) {
        return (
            <div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/reservations" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">{t('reservations.title')}</h1>
                </div>
                <div className="mt-8 ios-card text-center py-12">
                    <p className="text-muted-foreground">{error}</p>
                    <Link href="/admin/reservations" className="mt-4 inline-block ios-btn ios-btn-primary text-sm">{t('common.back')}</Link>
                </div>
            </div>
        );
    }

    if (!reservation) return null;

    const r = reservation;
    const st = STATUS_MAP[r.status] || { label: r.status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300' };
    const isConfirmed = r.status === 'confirmed';
    const pickupDay = new Date(new Date(r.pickupDate).toDateString());
    const todayDay = new Date(new Date().toDateString());
    const canPickup = isConfirmed && todayDay >= pickupDay;
    const pickupTooEarly = isConfirmed && todayDay < pickupDay;
    const clientName = [r.client?.lastName, r.client?.firstName, r.client?.middleName].filter(Boolean).join(' ') || '—';
    const carName = r.car ? `${r.car.brand} ${r.car.model}` : '—';
    const carThumb = r.car?.previewUrl
        ? `${BASE_URL}static/${r.car.previewUrl}`
        : r.car?.carPhoto?.find(p => p.type === 'PC')?.url
            ? `${BASE_URL}static/${r.car.carPhoto.find(p => p.type === 'PC')!.url}`
            : null;

    const addedIds = new Set(r.reservationAddOns.map(a => a.addOnId));
    const addableAddOns = availableAddOns.filter(a => !addedIds.has(a.id));

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/reservations" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">{t('reservationDetail.title', { id: r.id })}</h1>
                    <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', st.class)}>{st.label}</span>
                </div>
                {isConfirmed && !editing && (
                    <button type="button" onClick={() => setEditing(true)} className="ios-btn ios-btn-primary text-sm">
                        <Edit className="h-4 w-4" /> {t('reservationDetail.edit')}
                    </button>
                )}
                {editing && (
                    <div className="flex gap-2">
                        <button type="button" onClick={() => { setEditing(false); fetchReservation(); }} className="ios-btn ios-btn-ghost text-sm">
                            <X className="h-4 w-4" /> {t('common.cancel')}
                        </button>
                        <button type="button" onClick={handleSaveEdit} disabled={saving} className="ios-btn ios-btn-primary text-sm">
                            <Save className="h-4 w-4" /> {saving ? t('common.saving') : t('reservationDetail.save')}
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="mt-4 ios-alert-destructive">{error}</div>}
            {actionError && <div className="mt-4 ios-alert-destructive">{actionError}</div>}

            {/* ── Rental link ── */}
            {r.rental && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
                    <Link href={`/admin/rentals/${r.rental.id}`} className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
                        {t('reservationDetail.goToRental')}{r.rental.id} {r.rental.contractNumber ? `(${r.rental.contractNumber})` : ''}
                    </Link>
                </div>
            )}

            {/* ── Cancel / No-show info ── */}
            {r.cancelReason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{t('reservationDetail.cancelReasonLabel')}</p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">{r.cancelReason}</p>
                    {r.cancelledAt && <p className="mt-1 text-xs text-red-500 dark:text-red-400/70">{t('reservations.mapCancelled')}: {fmtDateTime(r.cancelledAt)}</p>}
                </div>
            )}
            {r.noShowAt && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{t('reservations.mapNoShow')}</p>
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400/70">{t('reservationDetail.recordedAt')} {fmtDateTime(r.noShowAt)}</p>
                </div>
            )}

            {/* ── Cards grid ── */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Client */}
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <User className="h-4 w-4" /><span>{t('reservationDetail.sectionClient')}</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                        <p className="text-base font-semibold text-foreground">
                            <Link href={`/admin/clients/${r.client.id}`} className="hover:underline">{clientName}</Link>
                        </p>
                        {r.client.phone && <p className="text-sm text-muted-foreground">{r.client.phone}</p>}
                        {r.client.email && <p className="text-sm text-muted-foreground">{r.client.email}</p>}
                    </div>
                </div>

                {/* Car */}
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Car className="h-4 w-4" /><span>{t('reservationDetail.sectionCar')}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                        {carThumb && <img src={carThumb} alt={carName} className="h-16 w-24 rounded-md object-cover" />}
                        <div>
                            <p className="text-base font-semibold text-foreground">{carName}</p>
                            {r.car?.plateNumber && <p className="text-sm text-muted-foreground">{r.car.plateNumber}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Dates & Location (editable) ── */}
            <div className="mt-4 ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" /><span>{t('reservationDetail.sectionDates')}</span>
                </div>
                {editing ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('reservationDetail.pickup')}</label>
                            <input type="datetime-local" value={form.pickupDate}
                                onChange={e => handlePickupDateChange(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full ios-input text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('reservationDetail.return_')}</label>
                            <input type="datetime-local" value={form.returnDate}
                                onChange={e => set('returnDate', e.target.value)}
                                min={form.pickupDate || new Date().toISOString().slice(0, 16)}
                                className="w-full ios-input text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('newReservation.pickupLocation')}</label>
                            <input value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)}
                                className="w-full ios-input text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('newReservation.returnLocation')}</label>
                            <input value={form.returnLocation} onChange={e => set('returnLocation', e.target.value)}
                                className="w-full ios-input text-sm" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('reservationDetail.pickup')}:</span>
                            <span className="font-medium">{fmtDateTime(r.pickupDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('reservationDetail.return_')}:</span>
                            <span className="font-medium">{fmtDateTime(r.returnDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('reservationDetail.route')}</span>
                            <span className="font-medium">{[r.pickupLocation, r.returnLocation].filter(Boolean).join(' → ') || '—'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Coverage & delivery (editable) ── */}
            <div className="mt-4 ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                    <Package className="h-4 w-4" /><span>{t('reservationDetail.sectionCoverage')}</span>
                </div>
                {editing ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1">{t('reservationDetail.coverageLabel')}</label>
                            <IosSelect value={form.coveragePackageId} onChange={v => set('coveragePackageId', v)}
                                options={[{ value: '', label: `— ${t('reservationDetail.noCoverage')} —` }, ...packages.map(p => ({ value: String(p.id), label: `${p.name} (${t('reservationDetail.deposit')} ${p.depositPercent}%)` }))]}
                                placeholder={`— ${t('reservationDetail.noCoverage')} —`} className="w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('reservationDetail.deliveryCost')}</label>
                            <input type="number" value={form.deliveryFee} onChange={e => set('deliveryFee', e.target.value)} className="w-full ios-input text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('reservationDetail.deliveryCurrency')}</label>
                            <IosSelect value={form.deliveryCurrency} onChange={v => set('deliveryCurrency', v)}
                                options={[{ value: 'UAH', label: 'UAH' }, { value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }]}
                                className="w-full text-sm" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('reservationDetail.coveragePackage')}</span>
                            <span className="font-medium">{r.coveragePackage ? `${r.coveragePackage.name} (${t('reservationDetail.deposit')} ${r.coveragePackage.depositPercent}%)` : '—'}</span>
                        </div>
                        {r.deliveryFee != null && r.deliveryFee > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('reservationDetail.delivery')}</span>
                                <span className="font-medium">{fmtMoney(r.deliveryFee, r.deliveryCurrency || undefined)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Add-ons (with add/remove for confirmed) ── */}
            <div className="mt-4 ios-card">
                <h2 className="text-sm font-semibold text-foreground mb-3">{t('reservationDetail.sectionAddOns')}</h2>
                {r.reservationAddOns.length > 0 ? (
                    <div className="divide-y divide-border mb-4">
                        {r.reservationAddOns.map(ra => (
                            <div key={ra.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[13px] font-medium text-foreground truncate">{ra.addOn?.name || '—'}</span>
                                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                        {fmtMoney(ra.unitPriceMinor, ra.currency)} {PRICING_MODE_LABEL[ra.addOn?.pricingMode] || ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <span className="text-[13px] font-semibold whitespace-nowrap">{fmtMoney(ra.totalMinor, ra.currency)}</span>
                                    {isConfirmed && (
                                        <button type="button" onClick={() => handleRemoveAddOn(ra.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[13px] text-muted-foreground mb-4">{t('reservationDetail.noAddOns')}</p>
                )}

                {isConfirmed && addableAddOns.length > 0 && (() => {
                    const selectedAddOn = addOnToAdd ? addableAddOns.find(a => a.id === parseInt(addOnToAdd)) : null;
                    const showQty = selectedAddOn && (selectedAddOn.pricingMode === 'MANUAL_QTY' || selectedAddOn.qtyEditable);
                    return (
                        <div className="flex items-end gap-3 border-t border-border pt-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-muted-foreground mb-1">{t('reservationDetail.addService')}</label>
                                <IosSelect value={addOnToAdd} onChange={(v) => { setAddOnToAdd(v); setAddOnQty(1); }}
                                    options={[{ value: '', label: t('reservationDetail.selectService') }, ...addableAddOns.map(a => ({
                                        value: String(a.id),
                                        label: `${a.name} — ${fmtMoney(a.unitPriceMinor, a.currency)} ${PRICING_MODE_LABEL[a.pricingMode] || ''}`,
                                    }))]}
                                    placeholder={t('reservationDetail.selectService')} className="w-full text-sm" />
                            </div>
                            {showQty && (
                                <div className="w-24">
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">{t('reservationDetail.quantity')}</label>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => setAddOnQty(Math.max(1, addOnQty - 1))}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-sm font-medium w-6 text-center">{addOnQty}</span>
                                        <button type="button" onClick={() => setAddOnQty(addOnQty + 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button type="button" onClick={handleAddAddOn} disabled={addingAddOn || !addOnToAdd}
                                className="ios-btn ios-btn-primary text-sm">
                                <Plus className="h-4 w-4" /> {addingAddOn ? '...' : t('common.add')}
                            </button>
                        </div>
                    );
                })()}
            </div>

            {/* ── Price ── */}
            <div className="mt-4 ios-card">
                <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{t('reservationDetail.sectionCost')}</h2>
                    {priceLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                {(price || r.priceSnapshot) ? (() => {
                    const p = price || r.priceSnapshot as any;
                    if (!p.totalDays && !p.grandTotal) return <p className="text-sm text-muted-foreground">{t('reservationDetail.sectionCost')}</p>;
                    return (
                        <div className="space-y-2.5 text-sm">
                            {p.ratePlanName && <div className="flex justify-between"><span className="text-muted-foreground">{t('reservationDetail.tariff')}</span><span className="font-medium">{p.ratePlanName}</span></div>}
                            {p.totalDays && <div className="flex justify-between"><span className="text-muted-foreground">{t('reservationDetail.daysCount')}</span><span className="font-medium">{p.totalDays}</span></div>}
                            {p.dailyRateMinor != null && <div className="flex justify-between"><span className="text-muted-foreground">{t('reservationDetail.pricePerDay')}</span><span className="font-medium">{fmtMoney(p.dailyRateMinor, p.currency)}</span></div>}
                            {p.rentalTotal != null && <div className="flex justify-between"><span className="text-muted-foreground">{t('reservationDetail.rentalCost')}</span><span className="font-medium">{fmtMoney(p.rentalTotal, p.currency)}</span></div>}
                            {p.addOns?.length > 0 && p.addOns.map((a: any, i: number) => (
                                <div key={i} className="flex justify-between">
                                    <span className="text-muted-foreground">{a.name} (x{a.quantity})</span>
                                    <span className="font-medium">{fmtMoney(a.totalMinor, a.currency)}</span>
                                </div>
                            ))}
                            {p.deliveryFee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t('reservationDetail.delivery')}</span><span className="font-medium">{fmtMoney(p.deliveryFee, p.currency)}</span></div>}
                            {p.grandTotal != null && (
                                <div className="border-t border-border pt-2.5 flex justify-between">
                                    <span className="font-semibold text-foreground">{t('reservationDetail.totalCost')}</span>
                                    <span className="font-bold text-lg text-foreground">{fmtMoney(p.grandTotal, p.currency)}</span>
                                </div>
                            )}
                            {p.depositAmount > 0 && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{t('reservationDetail.deposit')} ({p.depositPercent}%)</span>
                                    <span>{fmtMoney(p.depositAmount, p.currency)}</span>
                                </div>
                            )}
                            {p.dailyRateMinor === 0 && <p className="text-amber-600 text-xs">{t('newReservation.noTariff')}</p>}
                        </div>
                    );
                })() : (
                    <p className="text-sm text-muted-foreground">{t('newReservation.selectCarAndDates')}</p>
                )}
            </div>

            {/* ── Transactions ── */}
            {r.transactions && r.transactions.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-sm font-semibold text-foreground mb-3">{t('reservationDetail.sectionTransactions')}</h2>
                    <div className="ios-table-wrap">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('reservationDetail.thId')}</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('reservationDetail.thType')}</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('reservationDetail.thAmount')}</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('reservationDetail.thDescription')}</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('reservationDetail.thDate')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {r.transactions.map(tx => {
                                    const isIn = tx.direction === 'IN';
                                    return (
                                        <tr key={tx.id} className="border-b border-border hover:bg-muted/30">
                                            <td className="px-4 py-2.5 font-medium">{tx.id}</td>
                                            <td className="px-4 py-2.5 text-muted-foreground">{tx.type}</td>
                                            <td className="px-4 py-2.5">
                                                <span className={cn('font-medium', isIn ? 'text-green-700' : 'text-red-700')}>
                                                    {isIn ? '+' : '-'}{fmtMoney(tx.amountMinor, tx.currency)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-muted-foreground truncate max-w-[200px]">{tx.description || '—'}</td>
                                            <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{fmtDateTime(tx.createdAt)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Meta info ── */}
            <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
                <span>{t('reservationDetail.createdAt')} {fmtDateTime(r.createdAt)}</span>
                <span>{t('reservationDetail.updatedAt')} {fmtDateTime(r.updatedAt)}</span>
                {r.rentalRequest && <span>{t('reservationDetail.fromRequest')}{r.rentalRequest.id}</span>}
            </div>

            {/* ── Actions ── */}
            {isConfirmed && !editing && (
                <div className="mt-8 space-y-5">
                    {pickupTooEarly && (
                        <div className="flex items-center gap-3 rounded-2xl bg-[#FF9500]/10 px-5 py-3.5 text-sm font-medium text-[#FF9500]">
                            <Calendar className="h-4 w-4 shrink-0" />
                            {t('reservationDetail.issueAvailableFrom', { date: fmtDate(r.pickupDate) })} {t('reservationDetail.issueTooEarly')}
                        </div>
                    )}

                    {!showPickupForm && !showCancelForm && !showNoShowConfirm && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button type="button"
                                onClick={() => { setShowPickupForm(true); setShowCancelForm(false); setShowNoShowConfirm(false); setActionError(null); }}
                                className="group flex items-center gap-3 ios-card px-5 py-4 text-left transition-all hover:bg-muted/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={actionLoading || !canPickup}
                                title={pickupTooEarly ? t('reservationDetail.issueAvailableFrom', { date: fmtDate(r.pickupDate) }) : undefined}>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#34C759]/15 text-[#34C759]">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <div><p className="text-sm font-semibold text-foreground">{t('reservationDetail.issueCar')}</p>
                                    <p className="text-xs text-muted-foreground">{t('reservationDetail.issueDescription')}</p></div>
                            </button>
                            <button type="button"
                                onClick={() => { setShowCancelForm(true); setShowPickupForm(false); setShowNoShowConfirm(false); setActionError(null); }}
                                className="group flex items-center gap-3 ios-card px-5 py-4 text-left transition-all hover:bg-muted/30 active:scale-[0.98] disabled:opacity-40"
                                disabled={actionLoading}>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/15 text-[#FF3B30]">
                                    <XCircle className="h-5 w-5" />
                                </div>
                                <div><p className="text-sm font-semibold text-foreground">{t('reservationDetail.cancelRes')}</p>
                                    <p className="text-xs text-muted-foreground">{t('reservationDetail.cancelDescription')}</p></div>
                            </button>
                            <button type="button"
                                onClick={() => { setShowNoShowConfirm(true); setShowPickupForm(false); setShowCancelForm(false); setActionError(null); }}
                                className="group flex items-center gap-3 ios-card px-5 py-4 text-left transition-all hover:bg-muted/30 active:scale-[0.98] disabled:opacity-40"
                                disabled={actionLoading}>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF9500]/15 text-[#FF9500]">
                                    <UserX className="h-5 w-5" />
                                </div>
                                <div><p className="text-sm font-semibold text-foreground">{t('reservationDetail.noShow')}</p>
                                    <p className="text-xs text-muted-foreground">{t('reservationDetail.noShowDescription')}</p></div>
                            </button>
                        </div>
                    )}

                    {/* Pickup inline form */}
                    {showPickupForm && (
                        <div className="ios-card">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34C759]/15 text-[#34C759]">
                                    <KeyRound className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{t('reservationDetail.issueFormTitle')}</h3>
                            </div>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><Gauge className="h-3.5 w-3.5" /> {t('reservationDetail.mileage')}</span>
                                    <input type="number" value={pickupOdometer} onChange={e => setPickupOdometer(e.target.value)} placeholder={t('reservationDetail.optional')} className="mt-1.5 block w-full ios-input text-sm" />
                                </label>
                                <label className="block">
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><StickyNote className="h-3.5 w-3.5" /> {t('reservationDetail.contractNumber')}</span>
                                    <input value={contractNumber} onChange={e => setContractNumber(e.target.value)} placeholder={t('reservationDetail.optional')} className="mt-1.5 block w-full ios-input text-sm" />
                                </label>
                            </div>
                            <div className="mt-5 flex gap-3">
                                <button type="button" onClick={handlePickup} disabled={actionLoading} className="ios-btn ios-btn-primary text-sm">
                                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />} {t('reservationDetail.confirmIssue')}
                                </button>
                                <button type="button" onClick={() => { setShowPickupForm(false); setActionError(null); }} disabled={actionLoading}
                                    className="ios-btn ios-btn-ghost text-sm">{t('common.cancel')}</button>
                            </div>
                        </div>
                    )}

                    {/* Cancel form */}
                    {showCancelForm && (
                        <div className="ios-card">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF3B30]/15 text-[#FF3B30]">
                                    <XCircle className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{t('reservationDetail.cancelFormTitle')}</h3>
                            </div>
                            <label className="mt-5 block">
                                <span className="text-sm font-medium text-muted-foreground">{t('reservationDetail.cancelReason')} <span className="text-[#FF3B30]">*</span></span>
                                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder={t('reservationDetail.cancelPlaceholder')} rows={3} className="mt-1.5 block w-full ios-input text-sm resize-none" />
                            </label>
                            <div className="mt-5 flex gap-3">
                                <button type="button" onClick={handleCancel} disabled={actionLoading} className="ios-btn ios-btn-destructive text-sm">
                                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />} {t('reservationDetail.confirmCancel')}
                                </button>
                                <button type="button" onClick={() => { setShowCancelForm(false); setActionError(null); }} disabled={actionLoading}
                                    className="ios-btn ios-btn-ghost text-sm">{t('common.back')}</button>
                            </div>
                        </div>
                    )}

                    {/* No-show confirm */}
                    {showNoShowConfirm && (
                        <div className="ios-card">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9500]/15 text-[#FF9500]">
                                    <UserX className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{t('reservationDetail.noShowFormTitle')}</h3>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{t('reservationDetail.noShowDescription')}</p>
                            <div className="mt-5 flex gap-3">
                                <button type="button" onClick={handleNoShow} disabled={actionLoading} className="ios-btn ios-btn-destructive text-sm">
                                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />} {t('reservationDetail.confirmNoShow')}
                                </button>
                                <button type="button" onClick={() => { setShowNoShowConfirm(false); setActionError(null); }} disabled={actionLoading}
                                    className="ios-btn ios-btn-ghost text-sm">{t('common.back')}</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Reactivate for cancelled / no_show ── */}
            {(r.status === 'cancelled' || r.status === 'no_show') && (
                <div className="mt-8">
                    <button type="button" onClick={handleReactivate} disabled={actionLoading}
                        className="ios-btn ios-btn-primary text-sm">
                        <RotateCcw className="h-4 w-4" /> {t('reservationDetail.restore')}
                    </button>
                </div>
            )}
        </div>
    );
}
