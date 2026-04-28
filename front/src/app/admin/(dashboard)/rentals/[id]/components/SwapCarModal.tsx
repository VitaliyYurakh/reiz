'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';

interface CarOption {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    isBlocked?: boolean;
}

export function SwapCarModal({
    currentCarId,
    onClose,
    onSubmit,
    loading,
}: {
    currentCarId: number;
    onClose: () => void;
    onSubmit: (data: { toCarId: number; fromOdometer?: number; toOdometer?: number; reason?: string; notes?: string }) => void;
    loading: boolean;
}) {
    const { t } = useAdminLocale();
    const [cars, setCars] = useState<CarOption[]>([]);
    const [toCarId, setToCarId] = useState<number | ''>('');
    const [fromOdometer, setFromOdometer] = useState('');
    const [toOdometer, setToOdometer] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await adminApiClient.get('/car');
                const all: CarOption[] = res.data.cars || res.data.items || [];
                // Don't list the current car or any blocked car as a swap target.
                setCars(all.filter((c) => c.id !== currentCarId && !c.isBlocked));
            } catch (err) { logError(err); }
        })();
    }, [currentCarId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!toCarId) return;
        onSubmit({
            toCarId: Number(toCarId),
            fromOdometer: fromOdometer ? Number(fromOdometer) : undefined,
            toOdometer: toOdometer ? Number(toOdometer) : undefined,
            reason: reason || undefined,
            notes: notes || undefined,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-foreground">{t('carSwap.title')}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('carSwap.selectNewCar')}</label>
                        <select
                            value={toCarId}
                            onChange={(e) => setToCarId(e.target.value ? Number(e.target.value) : '')}
                            required
                            className="mt-1 w-full ios-input text-sm"
                        >
                            <option value="">—</option>
                            {cars.map((c) => (
                                <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plateNumber})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('carSwap.fromOdometer')}</label>
                            <input
                                type="number"
                                min={0}
                                value={fromOdometer}
                                onChange={(e) => setFromOdometer(e.target.value)}
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('carSwap.toOdometer')}</label>
                            <input
                                type="number"
                                min={0}
                                value={toOdometer}
                                onChange={(e) => setToOdometer(e.target.value)}
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('carSwap.reason')}</label>
                        <input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={t('common.optional')}
                            className="mt-1 w-full ios-input text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.notes')}</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-secondary text-sm">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" disabled={loading || !toCarId} className="ios-btn ios-btn-primary text-sm">
                            {loading ? t('common.saving') : t('carSwap.confirm')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
