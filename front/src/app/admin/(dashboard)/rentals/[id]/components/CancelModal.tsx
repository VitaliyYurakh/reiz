'use client';

import { useState } from 'react';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export function CancelModal({
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
