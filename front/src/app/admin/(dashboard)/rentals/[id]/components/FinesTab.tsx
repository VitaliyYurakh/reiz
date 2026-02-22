'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/cn';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    Plus,
    Trash2,
    Banknote,
} from 'lucide-react';
import type { Fine } from './rental-detail-types';
import { FINE_TYPE_CLASS } from './rental-detail-constants';
import { fmtDate, fmtMoney } from './rental-detail-helpers';
import { CreateFineModal } from './CreateFineModal';
import { MarkPaidModal } from './MarkPaidModal';

export function FinesTab({
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
