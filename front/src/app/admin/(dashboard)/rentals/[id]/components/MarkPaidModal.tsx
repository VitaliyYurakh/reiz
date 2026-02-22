'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X } from 'lucide-react';
import type { Fine, Account } from './rental-detail-types';
import { fmtMoney } from './rental-detail-helpers';

export function MarkPaidModal({
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
