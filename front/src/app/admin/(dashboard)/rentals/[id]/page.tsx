'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BASE_URL } from '@/config/environment';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    ArrowLeft,
    Car,
    User,
    Calendar,
    CreditCard,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Plus,
    ArrowDownLeft,
    ArrowUpRight,
    Camera,
    X,
    Trash2,
    Banknote,
    ImagePlus,
    Eye,
    ClipboardCheck,
} from 'lucide-react';

/* ───────────────────────── Types ───────────────────────── */

interface RentalClient {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
}

interface CarPhoto {
    id: number;
    url: string;
    type: string;
    alt: string | null;
}

interface RentalTariff {
    id: number;
    minDays: number;
    maxDays: number;
    dailyPrice: number;
    deposit: number;
}

interface CarSegment {
    id: number;
    name: string;
}

interface RentalCar {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    previewUrl: string | null;
    carPhoto: CarPhoto[];
    rentalTariff: RentalTariff[];
    segment: CarSegment[];
}

interface AddOn {
    id: number;
    name: string;
    priceMinor: number;
    currency: string;
}

interface RentalAddOn {
    id: number;
    addOn: AddOn;
}

interface ReservationAddOn {
    id: number;
    addOn: AddOn;
}

interface CoveragePackage {
    id: number;
    name: string;
    depositPercent: number;
}

interface Reservation {
    id: number;
    reservationAddOns: ReservationAddOn[];
    coveragePackage: CoveragePackage | null;
}

interface RentalExtension {
    id: number;
    oldReturnDate: string;
    newReturnDate: string;
    extraDays: number;
    dailyRateMinor: number;
    currency: string;
    totalMinor: number;
    reason: string | null;
    createdAt: string;
}

interface InspectionPhoto {
    id: number;
    url: string;
}

interface Inspection {
    id: number;
    type: 'PICKUP' | 'RETURN';
    odometer: number | null;
    fuelLevel: number | null;
    cleanlinessOk: boolean;
    checklist: Record<string, unknown> | null;
    damages: Record<string, unknown>[] | null;
    notes: string | null;
    completedAt: string | null;
    photos: InspectionPhoto[];
}

interface Fine {
    id: number;
    type: string;
    description: string | null;
    amountMinor: number;
    currency: string;
    isPaid: boolean;
    createdAt: string;
}

interface Transaction {
    id: number;
    type: string;
    direction: string;
    amountMinor: number;
    currency: string;
    createdAt: string;
}

interface RentalDocument {
    id: number;
    type: string;
    fileName: string;
    fileUrl: string;
    generatedAt: string | null;
}

interface Rental {
    id: number;
    status: string;
    contractNumber: string;
    pickupDate: string;
    returnDate: string;
    actualReturnDate: string | null;
    pickupLocation: string | null;
    returnLocation: string | null;
    pickupOdometer: number | null;
    returnOdometer: number | null;
    allowedMileage: number | null;
    depositAmount: number | null;
    depositCurrency: string | null;
    depositReturned: boolean;
    cancelReason: string | null;
    notes: string | null;
    priceSnapshot: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    client: RentalClient;
    car: RentalCar;
    reservation: Reservation | null;
    rentalAddOns: RentalAddOn[];
    rentalExtensions: RentalExtension[];
    inspections: Inspection[];
    fines: Fine[];
    transactions: Transaction[];
    documents: RentalDocument[];
}

interface Account {
    id: number;
    name: string;
    type: string;
    currency: string;
    isActive: boolean;
}

/* ───────────────────────── Constants ───────────────────────── */

const STATUS_CLASS_MAP: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
};

const INSPECTION_TYPE_CLASS: Record<string, string> = {
    PICKUP: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    RETURN: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
};

const FINE_TYPE_CLASS: Record<string, string> = {
    OVERMILEAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
    DAMAGE: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    LATE_RETURN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
    FUEL: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    CLEANING: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300',
    TRAFFIC: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
};

const FINE_TYPE_KEYS = ['OVERMILEAGE', 'DAMAGE', 'LATE_RETURN', 'FUEL', 'CLEANING', 'TRAFFIC', 'OTHER'];

type TabKey = 'overview' | 'inspections' | 'fines' | 'payments' | 'documents';

const TAB_KEYS: TabKey[] = ['overview', 'inspections', 'fines', 'payments', 'documents'];

const TAB_ICONS: Record<TabKey, typeof Eye> = {
    overview: Eye,
    inspections: ClipboardCheck,
    fines: AlertTriangle,
    payments: Banknote,
    documents: FileText,
};

/* ───────────────────────── Helpers ───────────────────────── */

function fmtDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function fmtDateTime(d: string | null) {
    if (!d) return '—';
    const dt = new Date(d);
    return `${dt.toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${dt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}`;
}

function fmtMoney(minor: number, currency?: string) {
    const f = (minor / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2 });
    return currency ? `${f} ${currency}` : f;
}

/* ───────────────────────── Rental Action Modals ───────────────────────── */

function CompleteModal({
    onClose,
    onSubmit,
    loading,
}: {
    onClose: () => void;
    onSubmit: (data: { returnOdometer?: number; notes?: string }) => void;
    loading: boolean;
}) {
    const { t } = useAdminLocale();
    const [returnOdometer, setReturnOdometer] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            returnOdometer: returnOdometer ? Number(returnOdometer) : undefined,
            notes: notes || undefined,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.completeTitle')}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                            {t('rentalDetail.returnOdometer')}
                        </label>
                        <input
                            type="number"
                            value={returnOdometer}
                            onChange={(e) => setReturnOdometer(e.target.value)}
                            placeholder={t('rentalDetail.optional')}
                            className="mt-1 w-full ios-input text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.notes')}</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={t('rentalDetail.optional')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" disabled={loading} className="ios-btn ios-btn-primary text-sm">
                            {loading ? t('common.saving') : t('rentalDetail.complete')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ExtendModal({
    onClose,
    onSubmit,
    loading,
}: {
    onClose: () => void;
    onSubmit: (data: { newReturnDate: string; reason?: string }) => void;
    loading: boolean;
}) {
    const { t } = useAdminLocale();
    const [newReturnDate, setNewReturnDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReturnDate) return;
        onSubmit({ newReturnDate, reason: reason || undefined });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.extendTitle')}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                            {t('rentalDetail.newReturnDate')}
                        </label>
                        <input
                            type="date"
                            value={newReturnDate}
                            onChange={(e) => setNewReturnDate(e.target.value)}
                            required
                            min={new Date().toISOString().slice(0, 10)}
                            className="mt-1 w-full ios-input text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('rentalDetail.reason')}</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            placeholder={t('rentalDetail.optional')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !newReturnDate}
                            className="ios-btn ios-btn-warning text-sm"
                        >
                            {loading ? t('common.saving') : t('rentalDetail.extend')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CancelModal({
    onClose,
    onSubmit,
    loading,
}: {
    onClose: () => void;
    onSubmit: (data: { reason: string }) => void;
    loading: boolean;
}) {
    const { t } = useAdminLocale();
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onSubmit({ reason: reason.trim() });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.cancelTitle')}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                            {t('rentalDetail.cancelReasonLabel')}
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            required
                            placeholder={t('rentalDetail.cancelReasonPlaceholder')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !reason.trim()}
                            className="ios-btn ios-btn-destructive text-sm"
                        >
                            {loading ? t('common.saving') : t('rentalDetail.cancelRental')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ───────────────────────── Inspection Modals ───────────────────────── */

function CreateInspectionModal({
    rentalId,
    onClose,
    onCreated,
}: {
    rentalId: number;
    onClose: () => void;
    onCreated: () => void;
}) {
    const { t } = useAdminLocale();
    const [type, setType] = useState<'PICKUP' | 'RETURN'>('PICKUP');
    const [odometer, setOdometer] = useState('');
    const [fuelLevel, setFuelLevel] = useState('');
    const [cleanlinessOk, setCleanlinessOk] = useState(true);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminApiClient.post(`/rental/${rentalId}/inspection`, {
                type,
                odometer: odometer ? Number(odometer) : undefined,
                fuelLevel: fuelLevel ? Number(fuelLevel) : undefined,
                cleanlinessOk,
                notes: notes || undefined,
            });
            onCreated();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.inspectionCreateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.newInspection')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('rentalDetail.inspectionType')}</label>
                        <div className="mt-1.5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('PICKUP')}
                                className={cn(
                                    'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                                    type === 'PICKUP'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300'
                                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                )}
                            >
                                {t('rentalDetail.inspectionPickup')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('RETURN')}
                                className={cn(
                                    'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                                    type === 'RETURN'
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300'
                                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                )}
                            >
                                {t('rentalDetail.inspectionReturn')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('rentalDetail.odometerKm')}</label>
                            <input
                                type="number"
                                value={odometer}
                                onChange={(e) => setOdometer(e.target.value)}
                                placeholder="0"
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('rentalDetail.fuelPercent')}</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={fuelLevel}
                                onChange={(e) => setFuelLevel(e.target.value)}
                                placeholder="0–100"
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-muted-foreground">{t('rentalDetail.cleanliness')}</label>
                        <button
                            type="button"
                            onClick={() => setCleanlinessOk(!cleanlinessOk)}
                            className={cn(
                                'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors',
                                cleanlinessOk ? 'bg-green-500' : 'bg-muted',
                            )}
                        >
                            <span
                                className={cn(
                                    'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                                    cleanlinessOk ? 'translate-x-6' : 'translate-x-1',
                                )}
                            />
                        </button>
                        <span className="text-sm text-foreground">{cleanlinessOk ? 'OK' : t('rentalDetail.dirty')}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.notes')}</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={t('rentalDetail.damagesPlaceholder')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" disabled={loading} className="ios-btn ios-btn-primary text-sm">
                            {loading ? t('rentalDetail.creating') : t('rentalDetail.createInspection')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UploadPhotoModal({
    rentalId,
    inspectionId,
    onClose,
    onUploaded,
}: {
    rentalId: number;
    inspectionId: number;
    onClose: () => void;
    onUploaded: () => void;
}) {
    const { t } = useAdminLocale();
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        let done = 0;
        try {
            for (const file of files) {
                const fd = new FormData();
                fd.append('car', file);
                await adminApiClient.post(
                    `/rental/${rentalId}/inspection/${inspectionId}/photo`,
                    fd,
                    { headers: { 'Content-Type': 'multipart/form-data' } },
                );
                done++;
                setProgress(Math.round((done / files.length) * 100));
            }
            onUploaded();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.photoUploadError'));
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.uploadPhoto')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-primary/[0.02]">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">{t('rentalDetail.dropPhotos')}</span>
                        <span className="mt-1 text-xs text-muted-foreground/60">JPG, PNG, WebP</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                                <span className="truncate text-sm text-foreground">{f.name}</span>
                                <button type="button" onClick={() => removeFile(i)} className="ml-2 text-muted-foreground hover:text-red-500">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-secondary">
                            <div
                                className="h-2 rounded-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-center text-xs text-muted-foreground">{progress}%</p>
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        className="ios-btn ios-btn-primary text-sm"
                    >
                        {loading ? t('rentalDetail.uploading') : `${t('rentalDetail.upload')} (${files.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────── Fine Modals ───────────────────────── */

function CreateFineModal({
    rentalId,
    onClose,
    onCreated,
}: {
    rentalId: number;
    onClose: () => void;
    onCreated: () => void;
}) {
    const { t } = useAdminLocale();
    const [type, setType] = useState('DAMAGE');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('UAH');
    const [loading, setLoading] = useState(false);

    const FINE_TYPE_LABEL: Record<string, string> = {
        OVERMILEAGE: t('rentalDetail.fineOvermileage'),
        DAMAGE: t('rentalDetail.fineDamage'),
        LATE_RETURN: t('rentalDetail.fineLateReturn'),
        FUEL: t('rentalDetail.fineFuel'),
        CLEANING: t('rentalDetail.fineCleaning'),
        TRAFFIC: t('rentalDetail.fineTraffic'),
        OTHER: t('rentalDetail.fineOther'),
    };

    const FINE_TYPES = FINE_TYPE_KEYS.map((val) => ({
        value: val,
        label: FINE_TYPE_LABEL[val] || val,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !amount) return;
        setLoading(true);
        try {
            await adminApiClient.post(`/rental/${rentalId}/fine`, {
                type,
                description: description.trim(),
                amountMinor: Math.round(Number(amount) * 100),
                currency,
            });
            onCreated();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.fineCreateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.newFine')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.type')}</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 w-full ios-select text-sm"
                        >
                            {FINE_TYPES.map((ft) => (
                                <option key={ft.value} value={ft.value}>{ft.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            required
                            placeholder={t('rentalDetail.fineDescPlaceholder')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('common.amount')}</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="0.00"
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('common.currency')}</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1 w-full ios-select text-sm"
                            >
                                <option value="UAH">UAH</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !description.trim() || !amount}
                            className="ios-btn ios-btn-destructive text-sm"
                        >
                            {loading ? t('rentalDetail.creating') : t('rentalDetail.createFine')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function MarkPaidModal({
    rentalId,
    fine,
    onClose,
    onPaid,
}: {
    rentalId: number;
    fine: Fine;
    onClose: () => void;
    onPaid: () => void;
}) {
    const { t } = useAdminLocale();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountId, setAccountId] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    useEffect(() => {
        adminApiClient.get('/account')
            .then((res) => {
                const active = (res.data.accounts || []).filter((a: Account) => a.isActive);
                setAccounts(active);
                if (active.length > 0) setAccountId(String(active[0].id));
            })
            .catch(console.error)
            .finally(() => setLoadingAccounts(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountId) return;
        setLoading(true);
        try {
            await adminApiClient.post(`/rental/${rentalId}/fine/${fine.id}/pay`, {
                accountId: Number(accountId),
                amountMinor: fine.amountMinor,
                currency: fine.currency,
                fxRate: 1.0,
                amountUahMinor: fine.amountMinor,
            });
            onPaid();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.finePayError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.payFine')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('common.type')}</span>
                        <span className="font-medium text-foreground">
                            {({
                                OVERMILEAGE: t('rentalDetail.fineOvermileage'),
                                DAMAGE: t('rentalDetail.fineDamage'),
                                LATE_RETURN: t('rentalDetail.fineLateReturn'),
                                FUEL: t('rentalDetail.fineFuel'),
                                CLEANING: t('rentalDetail.fineCleaning'),
                                TRAFFIC: t('rentalDetail.fineTraffic'),
                                OTHER: t('rentalDetail.fineOther'),
                            } as Record<string, string>)[fine.type] || fine.type}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('common.amount')}</span>
                        <span className="font-bold text-foreground">{fmtMoney(fine.amountMinor, fine.currency)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('rentalDetail.account')}</label>
                        {loadingAccounts ? (
                            <div className="mt-1 h-11 animate-pulse rounded-[10px] bg-muted" />
                        ) : (
                            <select
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                required
                                className="mt-1 w-full ios-select text-sm"
                            >
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.currency})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !accountId || loadingAccounts}
                            className="ios-btn ios-btn-primary text-sm"
                        >
                            {loading ? t('rentalDetail.paying') : t('rentalDetail.confirmPayment')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ───────────────────────── Tab Content Components ───────────────────────── */

function OverviewTab({ rental }: { rental: Rental }) {
    const { t } = useAdminLocale();
    return (
        <div className="space-y-6">
            {/* Client card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    {t('rentalDetail.client')}
                </div>
                <div className="mt-3">
                    <Link
                        href={`/admin/clients/${rental.client.id}`}
                        className="text-base font-semibold text-foreground hover:underline"
                    >
                        {rental.client.firstName} {rental.client.lastName}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{rental.client.phone}</p>
                    {rental.client.email && (
                        <p className="text-sm text-muted-foreground">{rental.client.email}</p>
                    )}
                </div>
            </div>

            {/* Car card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {t('rentalDetail.car')}
                </div>
                <div className="mt-3">
                    <p className="text-base font-semibold text-foreground">
                        {rental.car.brand} {rental.car.model}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{rental.car.plateNumber}</p>
                </div>
            </div>

            {/* Dates card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {t('rentalDetail.datesAndMileage')}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.pickup')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.pickupDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnPlanned')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.returnDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnActual')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.actualReturnDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.pickupOdometer')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.pickupOdometer != null ? `${rental.pickupOdometer.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnOdometerLabel')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.returnOdometer != null ? `${rental.returnOdometer.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.allowedMileage')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.allowedMileage != null ? `${rental.allowedMileage.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                </div>
                {rental.pickupLocation && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">{t('rentalDetail.pickupLocation')}</p>
                            <p className="text-sm font-medium text-foreground">{rental.pickupLocation}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{t('rentalDetail.returnLocation')}</p>
                            <p className="text-sm font-medium text-foreground">{rental.returnLocation || '—'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Deposit card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    {t('rentalDetail.deposit')}
                </div>
                <div className="mt-3 flex items-center gap-4">
                    <p className="text-base font-semibold text-foreground">
                        {rental.depositAmount != null
                            ? fmtMoney(rental.depositAmount, rental.depositCurrency || undefined)
                            : '—'}
                    </p>
                    <span
                        className={cn(
                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                            rental.depositReturned
                                ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
                        )}
                    >
                        {rental.depositReturned ? t('rentalDetail.depositReturned') : t('rentalDetail.depositNotReturned')}
                    </span>
                </div>
            </div>

            {/* Add-ons */}
            {rental.rentalAddOns.length > 0 && (
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Plus className="h-4 w-4" />
                        {t('rentalDetail.addOns')}
                    </div>
                    <div className="mt-3 ios-table-wrap">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.service')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.cost')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.rentalAddOns.map((ra) => (
                                    <tr key={ra.id} className="border-b border-border last:border-b-0">
                                        <td className="px-4 py-2 text-foreground">{ra.addOn.name}</td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {fmtMoney(ra.addOn.priceMinor, ra.addOn.currency)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Extensions */}
            {rental.rentalExtensions.length > 0 && (
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t('rentalDetail.extensions')}
                    </div>
                    <div className="mt-3 ios-table-wrap">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.oldDate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.newDate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.extraDays')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.dailyRate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.totalLabel')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.reason')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('common.date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.rentalExtensions.map((ext) => (
                                    <tr key={ext.id} className="border-b border-border last:border-b-0">
                                        <td className="px-4 py-2 text-muted-foreground">{fmtDate(ext.oldReturnDate)}</td>
                                        <td className="px-4 py-2 text-foreground">{fmtDate(ext.newReturnDate)}</td>
                                        <td className="px-4 py-2 text-foreground">{ext.extraDays}</td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {fmtMoney(ext.dailyRateMinor, ext.currency)}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-foreground">
                                            {fmtMoney(ext.totalMinor, ext.currency)}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground max-w-[200px] truncate">
                                            {ext.reason || '—'}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                                            {fmtDateTime(ext.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Price snapshot */}
            {rental.priceSnapshot && (() => {
                const snap = rental.priceSnapshot as Record<string, unknown>;
                const PRICE_LABELS: Record<string, string> = {
                    dailyRate: t('rentalDetail.priceDailyRate'),
                    totalDays: t('rentalDetail.priceTotalDays'),
                    baseAmount: t('rentalDetail.priceBaseAmount'),
                    baseRentalCost: t('rentalDetail.priceRental'),
                    insuranceCost: t('rentalDetail.priceInsurance'),
                    addOnsTotal: t('rentalDetail.priceAddOns'),
                    extrasCost: t('rentalDetail.priceAddOns'),
                    deliveryFee: t('rentalDetail.priceDelivery'),
                    discount: t('rentalDetail.priceDiscount'),
                    depositAmount: t('rentalDetail.priceDeposit'),
                    total: t('rentalDetail.totalLabel'),
                    totalCost: t('rentalDetail.totalLabel'),
                    currency: t('common.currency'),
                    ratePlanName: t('rentalDetail.priceRatePlan'),
                    coverageName: t('rentalDetail.priceCoverage'),
                    depositPercent: t('rentalDetail.priceDepositPercent'),
                    name: t('rentalDetail.priceRatePlan'),
                };
                const SKIP_KEYS = new Set(['approvedAt', 'pickupDate', 'returnDate', 'createdAt', 'updatedAt']);
                const TOTAL_KEYS = new Set(['total', 'totalCost']);
                const entries = Object.entries(snap).filter(([k]) => !SKIP_KEYS.has(k));
                if (entries.length === 0) return null;

                const totalEntry = entries.find(([k]) => TOTAL_KEYS.has(k));
                const otherEntries = entries.filter(([k]) => !TOTAL_KEYS.has(k));

                const formatVal = (key: string, val: unknown): string => {
                    if (val == null) return '—';
                    if (key === 'currency') return String(val);
                    if (key === 'depositPercent') return `${val}%`;
                    if (key === 'totalDays') return String(val);
                    if (typeof val === 'number') {
                        const cur = (snap.currency as string) || 'USD';
                        return `${val.toLocaleString('ru')} ${cur}`;
                    }
                    if (typeof val === 'string' && !isNaN(Number(val))) {
                        const cur = (snap.currency as string) || 'USD';
                        return `${Number(val).toLocaleString('ru')} ${cur}`;
                    }
                    return String(val);
                };

                return (
                    <div className="ios-card">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                            <FileText className="h-4 w-4" />
                            {t('rentalDetail.cost')}
                        </div>
                        <div className="space-y-2">
                            {otherEntries.map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{PRICE_LABELS[key] || key}</span>
                                    <span className="font-medium text-card-foreground">
                                        {formatVal(key, value)}
                                    </span>
                                </div>
                            ))}
                            {totalEntry && (
                                <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
                                    <span className="font-semibold text-foreground">{t('rentalDetail.totalLabel')}</span>
                                    <span className="font-bold text-foreground text-base">
                                        {formatVal('total', totalEntry[1])}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Notes */}
            {rental.notes && (
                <div className="ios-card">
                    <p className="text-sm font-medium text-muted-foreground">{t('common.notes')}</p>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{rental.notes}</p>
                </div>
            )}

            {/* Cancel reason */}
            {rental.cancelReason && (
                <div className="rounded-2xl bg-[#FF3B30]/10 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#FF3B30]">
                        <AlertTriangle className="h-4 w-4" />
                        {t('rentalDetail.cancelReasonLabel')}
                    </div>
                    <p className="mt-2 text-sm text-[#FF3B30]">{rental.cancelReason}</p>
                </div>
            )}
        </div>
    );
}

function InspectionsTab({
    rentalId,
    inspections,
    onRefresh,
}: {
    rentalId: number;
    inspections: Inspection[];
    onRefresh: () => void;
}) {
    const { t } = useAdminLocale();
    const [showCreate, setShowCreate] = useState(false);
    const [uploadTarget, setUploadTarget] = useState<number | null>(null);
    const [completing, setCompleting] = useState<number | null>(null);
    const [deletingPhoto, setDeletingPhoto] = useState<number | null>(null);

    const INSPECTION_TYPE_LABEL: Record<string, string> = {
        PICKUP: t('rentalDetail.inspectionPickup'),
        RETURN: t('rentalDetail.inspectionReturn'),
    };

    const handleComplete = async (inspId: number) => {
        setCompleting(inspId);
        try {
            await adminApiClient.post(`/rental/${rentalId}/inspection/${inspId}/complete`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.inspectionCompleteError'));
        } finally {
            setCompleting(null);
        }
    };

    const handleDeletePhoto = async (inspId: number, photoId: number) => {
        if (!confirm(t('rentalDetail.confirmDeletePhoto'))) return;
        setDeletingPhoto(photoId);
        try {
            await adminApiClient.delete(`/rental/${rentalId}/inspection/${inspId}/photo/${photoId}`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.photoDeleteError'));
        } finally {
            setDeletingPhoto(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Create button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="ios-btn ios-btn-primary text-sm"
                >
                    <Camera className="h-4 w-4" />
                    {t('rentalDetail.newInspection')}
                </button>
            </div>

            {inspections.length === 0 ? (
                <div className="ios-card p-8 text-center text-muted-foreground">
                    {t('rentalDetail.noInspections')}
                </div>
            ) : (
                inspections.map((insp) => {
                    const typeClass = INSPECTION_TYPE_CLASS[insp.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300';
                    const typeLabel = INSPECTION_TYPE_LABEL[insp.type] || insp.type;
                    const damagesCount = Array.isArray(insp.damages) ? insp.damages.length : 0;
                    const isCompleted = !!insp.completedAt;

                    return (
                        <div key={insp.id} className="ios-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            typeClass,
                                        )}
                                    >
                                        {typeLabel}
                                    </span>
                                    {isCompleted ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                                            <CheckCircle className="h-3 w-3" />
                                            {t('rentalDetail.inspCompleted')}
                                        </span>
                                    ) : (
                                        <span className="inline-block rounded-full bg-yellow-100 dark:bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                                            {t('rentalDetail.inspInProgress')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isCompleted && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setUploadTarget(insp.id)}
                                                className="ios-btn ios-btn-secondary text-xs !h-8 !px-3"
                                            >
                                                <ImagePlus className="h-3.5 w-3.5" />
                                                {t('rentalDetail.photo')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleComplete(insp.id)}
                                                disabled={completing === insp.id}
                                                className="ios-btn ios-btn-primary text-xs !h-8 !px-3"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                {completing === insp.id ? '...' : t('rentalDetail.complete')}
                                            </button>
                                        </>
                                    )}
                                    {isCompleted && (
                                        <span className="text-sm text-muted-foreground">
                                            {fmtDateTime(insp.completedAt)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.odometer')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {insp.odometer != null ? `${insp.odometer.toLocaleString()} км` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.fuelLevel')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {insp.fuelLevel != null ? `${insp.fuelLevel}%` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.cleanliness')}</p>
                                    <p className="text-sm font-medium">
                                        {insp.cleanlinessOk ? (
                                            <span className="text-green-700">OK</span>
                                        ) : (
                                            <span className="text-red-700">{t('common.no')}</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.damages')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {damagesCount > 0 ? (
                                            <span className="text-red-700">{damagesCount}</span>
                                        ) : (
                                            <span className="text-green-700">{t('common.no')}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {insp.notes && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted-foreground">{t('common.notes')}</p>
                                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{insp.notes}</p>
                                </div>
                            )}

                            {insp.photos.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.photo')} ({insp.photos.length})</p>
                                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                                        {insp.photos.map((photo) => (
                                            <div key={photo.id} className="group relative">
                                                <a
                                                    href={`${BASE_URL}static/${photo.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block overflow-hidden rounded-md border border-border"
                                                >
                                                    <img
                                                        src={`${BASE_URL}static/${photo.url}`}
                                                        alt="Inspection photo"
                                                        className="aspect-square w-full object-cover"
                                                    />
                                                </a>
                                                {!isCompleted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePhoto(insp.id, photo.id)}
                                                        disabled={deletingPhoto === photo.id}
                                                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setUploadTarget(insp.id)}
                                        className="ios-btn ios-btn-secondary text-xs !h-8 !px-3"
                                    >
                                        <ImagePlus className="h-3.5 w-3.5" />
                                        {t('rentalDetail.addPhoto')}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {showCreate && (
                <CreateInspectionModal
                    rentalId={rentalId}
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        onRefresh();
                    }}
                />
            )}
            {uploadTarget !== null && (
                <UploadPhotoModal
                    rentalId={rentalId}
                    inspectionId={uploadTarget}
                    onClose={() => setUploadTarget(null)}
                    onUploaded={() => {
                        setUploadTarget(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}

function FinesTab({
    rentalId,
    fines,
    onRefresh,
}: {
    rentalId: number;
    fines: Fine[];
    onRefresh: () => void;
}) {
    const { t } = useAdminLocale();
    const [showCreate, setShowCreate] = useState(false);
    const [payTarget, setPayTarget] = useState<Fine | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const FINE_TYPE_LABEL: Record<string, string> = {
        OVERMILEAGE: t('rentalDetail.fineOvermileage'),
        DAMAGE: t('rentalDetail.fineDamage'),
        LATE_RETURN: t('rentalDetail.fineLateReturn'),
        FUEL: t('rentalDetail.fineFuel'),
        CLEANING: t('rentalDetail.fineCleaning'),
        TRAFFIC: t('rentalDetail.fineTraffic'),
        OTHER: t('rentalDetail.fineOther'),
    };

    const handleDelete = async (fineId: number) => {
        if (!confirm(t('rentalDetail.confirmDeleteFine'))) return;
        setDeleting(fineId);
        try {
            await adminApiClient.delete(`/rental/${rentalId}/fine/${fineId}`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.fineDeleteError'));
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Create button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="ios-btn ios-btn-destructive text-sm"
                >
                    <Plus className="h-4 w-4" />
                    {t('rentalDetail.newFine')}
                </button>
            </div>

            {fines.length === 0 ? (
                <div className="ios-card p-8 text-center text-muted-foreground">
                    {t('rentalDetail.noFines')}
                </div>
            ) : (
                <div className="ios-table-wrap">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.type')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.description')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.amount')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.status')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.date')}</th>
                                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fines.map((fine) => {
                                const typeInfo = {
                                    label: FINE_TYPE_LABEL[fine.type] || fine.type,
                                    class: FINE_TYPE_CLASS[fine.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
                                };
                                return (
                                    <tr key={fine.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-2.5">
                                            <span
                                                className={cn(
                                                    'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    typeInfo.class,
                                                )}
                                            >
                                                {typeInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-foreground max-w-[300px] truncate">
                                            {fine.description || '—'}
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-foreground">
                                            {fmtMoney(fine.amountMinor, fine.currency)}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span
                                                className={cn(
                                                    'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    fine.isPaid
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
                                                )}
                                            >
                                                {fine.isPaid ? t('rentalDetail.paid') : t('rentalDetail.unpaid')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                                            {fmtDate(fine.createdAt)}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center justify-end gap-1">
                                                {!fine.isPaid && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPayTarget(fine)}
                                                        className="ios-btn ios-btn-primary text-xs !h-7 !px-2.5"
                                                    >
                                                        <Banknote className="h-3.5 w-3.5" />
                                                        {t('rentalDetail.payBtn')}
                                                    </button>
                                                )}
                                                {!fine.isPaid && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(fine.id)}
                                                        disabled={deleting === fine.id}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreate && (
                <CreateFineModal
                    rentalId={rentalId}
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        onRefresh();
                    }}
                />
            )}
            {payTarget && (
                <MarkPaidModal
                    rentalId={rentalId}
                    fine={payTarget}
                    onClose={() => setPayTarget(null)}
                    onPaid={() => {
                        setPayTarget(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}

function PaymentsTab({ transactions }: { transactions: Transaction[] }) {
    const { t } = useAdminLocale();
    if (transactions.length === 0) {
        return (
            <div className="ios-card p-8 text-center text-muted-foreground">
                {t('rentalDetail.noPayments')}
            </div>
        );
    }

    return (
        <div className="ios-table-wrap">
            <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                    <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">#</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.type')}</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('rentalDetail.direction')}</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.amount')}</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.currency')}</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.date')}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => {
                        const isIn = tx.direction === 'IN';
                        return (
                            <tr key={tx.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 font-medium text-foreground">{tx.id}</td>
                                <td className="px-4 py-2.5 text-muted-foreground">{tx.type}</td>
                                <td className="px-4 py-2.5">
                                    {isIn ? (
                                        <span className="inline-flex items-center gap-1 text-green-700">
                                            <ArrowDownLeft className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">IN</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700">
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">OUT</span>
                                        </span>
                                    )}
                                </td>
                                <td className={cn('px-4 py-2.5 font-medium', isIn ? 'text-green-700' : 'text-red-700')}>
                                    {isIn ? '+' : '-'}{fmtMoney(tx.amountMinor)}
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground">{tx.currency}</td>
                                <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                                    {fmtDateTime(tx.createdAt)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const DOC_TYPE_KEYS = ['RENTAL_CONTRACT', 'PICKUP_ACT', 'RETURN_ACT', 'INVOICE'];

function DocumentsTab({
    rentalId,
    documents,
    onRefresh,
}: {
    rentalId: number;
    documents: RentalDocument[];
    onRefresh: () => void;
}) {
    const { t } = useAdminLocale();
    const [generating, setGenerating] = useState(false);
    const [genType, setGenType] = useState('RENTAL_CONTRACT');
    const [showGenerate, setShowGenerate] = useState(false);

    const DOC_TYPE_LABEL: Record<string, string> = {
        RENTAL_CONTRACT: t('rentalDetail.docRentalContract'),
        PICKUP_ACT: t('rentalDetail.docPickupAct'),
        RETURN_ACT: t('rentalDetail.docReturnAct'),
        INVOICE: t('rentalDetail.docInvoice'),
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await adminApiClient.post('/document/generate', {
                type: genType,
                rentalId,
            });
            setShowGenerate(false);
            onRefresh();
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.msg || t('rentalDetail.docGenerateError'));
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (docId: number) => {
        if (!confirm(t('rentalDetail.confirmDeleteDoc'))) return;
        try {
            await adminApiClient.delete(`/document/${docId}`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.docDeleteError'));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                    {documents.length} {t('rentalDetail.documentsCount')}
                </span>
                <button
                    type="button"
                    onClick={() => setShowGenerate(!showGenerate)}
                    className="ios-btn ios-btn-primary text-sm"
                >
                    <Plus className="h-4 w-4" />
                    {t('rentalDetail.generate')}
                </button>
            </div>

            {showGenerate && (
                <div className="mb-4 rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">{t('rentalDetail.generateDoc')}</h4>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                {t('rentalDetail.docType')}
                            </label>
                            <select
                                value={genType}
                                onChange={(e) => setGenType(e.target.value)}
                                className="w-full ios-select text-sm"
                            >
                                {DOC_TYPE_KEYS.map((val) => (
                                    <option key={val} value={val}>{DOC_TYPE_LABEL[val] || val}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGenerate(false)}
                                className="ios-btn ios-btn-ghost text-sm"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating}
                                className="ios-btn ios-btn-primary text-sm"
                            >
                                <FileText className="h-4 w-4" />
                                {generating ? t('rentalDetail.generating') : t('common.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {documents.length === 0 ? (
                <div className="ios-card p-8 text-center text-muted-foreground">
                    {t('rentalDetail.noDocs')}
                </div>
            ) : (
                <div className="ios-table-wrap">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.type')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('rentalDetail.file')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('rentalDetail.generatedDate')}</th>
                                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-foreground">
                                        {DOC_TYPE_LABEL[doc.type] || doc.type}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <a
                                            href={`${BASE_URL}static/${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.fileName}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                                        {fmtDateTime(doc.generatedAt)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(doc.id)}
                                            className="ios-btn ios-btn-destructive text-xs"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ───────────────────────── Loading Skeleton ───────────────────────── */

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                ))}
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
        </div>
    );
}

/* ───────────────────────── Main Page ───────────────────────── */

export default function RentalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useAdminLocale();
    const id = params.id as string;

    const STATUS_LABEL: Record<string, string> = {
        active: t('rentals.mapActive'),
        completed: t('rentals.mapCompleted'),
        cancelled: t('rentals.mapCancelled'),
    };

    const INSPECTION_TYPE_LABEL: Record<string, string> = {
        PICKUP: t('rentalDetail.inspectionPickup'),
        RETURN: t('rentalDetail.inspectionReturn'),
    };

    const FINE_TYPE_LABEL: Record<string, string> = {
        OVERMILEAGE: t('rentalDetail.fineOvermileage'),
        DAMAGE: t('rentalDetail.fineDamage'),
        LATE_RETURN: t('rentalDetail.fineLateReturn'),
        FUEL: t('rentalDetail.fineFuel'),
        CLEANING: t('rentalDetail.fineCleaning'),
        TRAFFIC: t('rentalDetail.fineTraffic'),
        OTHER: t('rentalDetail.fineOther'),
    };

    const TAB_LABELS: Record<TabKey, string> = {
        overview: t('rentalDetail.tabOverview'),
        inspections: t('rentalDetail.tabInspections'),
        fines: t('rentalDetail.tabFines'),
        payments: t('rentalDetail.tabPayments'),
        documents: t('rentalDetail.tabDocuments'),
    };

    const DOC_TYPE_LABEL: Record<string, string> = {
        RENTAL_CONTRACT: t('rentalDetail.docRentalContract'),
        PICKUP_ACT: t('rentalDetail.docPickupAct'),
        RETURN_ACT: t('rentalDetail.docReturnAct'),
        INVOICE: t('rentalDetail.docInvoice'),
    };

    const [rental, setRental] = useState<Rental | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    // Action modal states
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRental = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminApiClient.get(`/rental/${id}`);
            setRental(res.data.rental);
        } catch (err: unknown) {
            console.error(err);
            setError(t('rentalDetail.loadError'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    const refreshRental = useCallback(async () => {
        try {
            const res = await adminApiClient.get(`/rental/${id}`);
            setRental(res.data.rental);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRental();
    }, [id, fetchRental]);

    /* ── Actions ── */

    const handleComplete = async (data: { returnOdometer?: number; notes?: string }) => {
        setActionLoading(true);
        try {
            await adminApiClient.post(`/rental/${id}/complete`, data);
            setShowCompleteModal(false);
            await fetchRental();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.completeError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleExtend = async (data: { newReturnDate: string; reason?: string }) => {
        setActionLoading(true);
        try {
            await adminApiClient.post(`/rental/${id}/extend`, data);
            setShowExtendModal(false);
            await fetchRental();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.extendError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async (data: { reason: string }) => {
        setActionLoading(true);
        try {
            await adminApiClient.post(`/rental/${id}/cancel`, data);
            setShowCancelModal(false);
            await fetchRental();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.cancelError'));
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Render ── */

    if (loading) {
        return (
            <div>
                <LoadingSkeleton />
            </div>
        );
    }

    if (error || !rental) {
        return (
            <div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/rentals"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 transition-colors hover:bg-secondary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </div>
                <div className="mt-8 rounded-2xl bg-[#FF3B30]/10 p-8 text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-[#FF3B30]" />
                    <p className="mt-2 text-sm font-medium text-[#FF3B30]">{error || t('rentalDetail.notFound')}</p>
                    <button
                        type="button"
                        onClick={fetchRental}
                        className="mt-4 ios-btn ios-btn-primary text-sm"
                    >
                        {t('rentalDetail.retry')}
                    </button>
                </div>
            </div>
        );
    }

    const stClass = STATUS_CLASS_MAP[rental.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300';
    const stLabel = STATUS_LABEL[rental.status] || rental.status;
    const isActive = rental.status === 'active';

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/rentals"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 transition-colors hover:bg-secondary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {t('rentalDetail.title', { id: String(rental.id) })}
                        </h1>
                        {rental.contractNumber && (
                            <p className="mt-0.5 text-sm font-mono text-muted-foreground">
                                {rental.contractNumber}
                            </p>
                        )}
                    </div>
                    <span
                        className={cn(
                            'inline-block rounded-full px-3 py-1 text-xs font-medium',
                            stClass,
                        )}
                    >
                        {stLabel}
                    </span>
                </div>

                {/* Action buttons */}
                {isActive && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowCompleteModal(true)}
                            className="ios-btn ios-btn-primary text-sm"
                        >
                            <CheckCircle className="h-4 w-4" />
                            {t('rentalDetail.complete')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowExtendModal(true)}
                            className="ios-btn ios-btn-warning text-sm"
                        >
                            <Clock className="h-4 w-4" />
                            {t('rentalDetail.extend')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCancelModal(true)}
                            className="ios-btn ios-btn-destructive text-sm"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            {t('common.cancel')}
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="h-tabs mt-6">
                {TAB_KEYS.map((tabKey) => {
                    const TabIcon = TAB_ICONS[tabKey];
                    const isActiveTab = activeTab === tabKey;
                    const unpaidFines = tabKey === 'fines' ? rental.fines.filter((f) => !f.isPaid).length : 0;
                    return (
                        <button
                            key={tabKey}
                            type="button"
                            onClick={() => setActiveTab(tabKey)}
                            className={`h-tab ${isActiveTab ? 'h-tab-active' : ''}`}
                        >
                            <TabIcon size={16} />
                            {TAB_LABELS[tabKey]}
                            {unpaidFines > 0 && (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                    {unpaidFines}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="mt-6">
                {activeTab === 'overview' && <OverviewTab rental={rental} />}
                {activeTab === 'inspections' && (
                    <InspectionsTab
                        rentalId={rental.id}
                        inspections={rental.inspections}
                        onRefresh={refreshRental}
                    />
                )}
                {activeTab === 'fines' && (
                    <FinesTab
                        rentalId={rental.id}
                        fines={rental.fines}
                        onRefresh={refreshRental}
                    />
                )}
                {activeTab === 'payments' && <PaymentsTab transactions={rental.transactions} />}
                {activeTab === 'documents' && (
                    <DocumentsTab
                        rentalId={rental.id}
                        documents={rental.documents}
                        onRefresh={refreshRental}
                    />
                )}
            </div>

            {/* Modals */}
            {showCompleteModal && (
                <CompleteModal
                    onClose={() => setShowCompleteModal(false)}
                    onSubmit={handleComplete}
                    loading={actionLoading}
                />
            )}
            {showExtendModal && (
                <ExtendModal
                    onClose={() => setShowExtendModal(false)}
                    onSubmit={handleExtend}
                    loading={actionLoading}
                />
            )}
            {showCancelModal && (
                <CancelModal
                    onClose={() => setShowCancelModal(false)}
                    onSubmit={handleCancel}
                    loading={actionLoading}
                />
            )}
        </div>
    );
}
