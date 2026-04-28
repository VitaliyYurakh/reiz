'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { logError } from '@/lib/log';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    Clock,
    Receipt,
    Repeat,
} from 'lucide-react';

import type { Rental, TabKey } from './components/rental-detail-types';
import { TAB_KEYS, TAB_ICONS } from './components/rental-detail-constants';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CompleteModal } from './components/CompleteModal';
import { ExtendModal } from './components/ExtendModal';
import { CancelModal } from './components/CancelModal';
import { SwapCarModal } from './components/SwapCarModal';
import { OverviewTab } from './components/OverviewTab';
import { InspectionsTab } from './components/InspectionsTab';
import { FinesTab } from './components/FinesTab';
import { PaymentsTab } from './components/PaymentsTab';
import { DocumentsTab } from './components/DocumentsTab';

export default function RentalDetailPage() {
    const params = useParams();
    const { t } = useAdminLocale();
    const { theme, H } = useAdminTheme();
    const isDark = theme === 'dark';
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
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRental = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminApiClient.get(`/rental/${id}`);
            setRental(res.data.rental);
        } catch (err: unknown) {
            logError(err);
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
            logError(err);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRental();
    }, [id, fetchRental]);

    /* ── Actions ── */

    const handleComplete = async (data: { returnOdometer?: number; notes?: string; actualReturnDate: string }) => {
        setActionLoading(true);
        try {
            await adminApiClient.post(`/rental/${id}/complete`, data);
            setShowCompleteModal(false);
            await fetchRental();
        } catch (err) {
            toastError(err, t('rentalDetail.completeError'));
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
            toastError(err, t('rentalDetail.extendError'));
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
            toastError(err, t('rentalDetail.cancelError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleSwap = async (data: { toCarId: number; fromOdometer?: number; toOdometer?: number; reason?: string; notes?: string }) => {
        setActionLoading(true);
        try {
            await adminApiClient.post(`/rental/${id}/swap-car`, data);
            setShowSwapModal(false);
            await fetchRental();
        } catch (err) {
            toastError(err, t('common.errorOccurred'));
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

    const stLabel = STATUS_LABEL[rental.status] || rental.status;
    const isActive = rental.status === 'active';

    const iconBoxColor =
        rental.status === 'active' ? 'h-icon-box-green'
            : rental.status === 'completed' ? 'h-icon-box-cyan'
                : rental.status === 'cancelled' ? 'h-icon-box-gray'
                    : 'h-icon-box-cyan';

    const statusBadgeBg =
        rental.status === 'active' ? '#4CAF50'
            : rental.status === 'completed' ? '#42A5F5'
                : rental.status === 'cancelled' ? '#90A4AE'
                    : '#4CAF50';

    return (
        <div>
            {/* -- Page header (matches list page style) -- */}
            <div
                className="mb-6 rounded-[20px] px-7 py-5"
                style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3.5">
                        <Link
                            href="/admin/rentals"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
                            style={{ backgroundColor: isDark ? '#1E293B' : '#F7F9FB' }}
                            aria-label={t('rentalDetail.backToList') || 'Back'}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className={`h-icon-box ${iconBoxColor}`}>
                            <Receipt size={24} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="h-title">
                                    {t('rentalDetail.title', { id: String(rental.id) })}
                                </h1>
                                <span
                                    className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold text-white"
                                    style={{ backgroundColor: statusBadgeBg }}
                                >
                                    {stLabel}
                                </span>
                            </div>
                            {rental.contractNumber && (
                                <span className="h-subtitle font-mono">{rental.contractNumber}</span>
                            )}
                        </div>
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
                                onClick={() => setShowSwapModal(true)}
                                className="ios-btn ios-btn-secondary text-sm"
                            >
                                <Repeat className="h-4 w-4" />
                                {t('carSwap.swapNow')}
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

                {/* Tabs inside the header card */}
                <div className="h-tabs mt-5">
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
            </div>

            {/* Tab content */}
            <div>
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
            {showSwapModal && (
                <SwapCarModal
                    currentCarId={rental.car.id}
                    onClose={() => setShowSwapModal(false)}
                    onSubmit={handleSwap}
                    loading={actionLoading}
                />
            )}
        </div>
    );
}
