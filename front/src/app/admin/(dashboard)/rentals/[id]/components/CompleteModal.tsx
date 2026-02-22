'use client';

import { useState } from 'react';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export function CompleteModal({
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
