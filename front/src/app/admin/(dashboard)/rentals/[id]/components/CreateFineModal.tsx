'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X } from 'lucide-react';
import { FINE_TYPE_KEYS } from './rental-detail-constants';

export function CreateFineModal({
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
