'use client';

import { useState } from 'react';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export function ExtendModal({
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
