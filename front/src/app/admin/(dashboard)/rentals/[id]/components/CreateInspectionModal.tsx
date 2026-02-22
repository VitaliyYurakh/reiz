'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/cn';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X } from 'lucide-react';

export function CreateInspectionModal({
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
