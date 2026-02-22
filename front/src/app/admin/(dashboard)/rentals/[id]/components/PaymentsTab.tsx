'use client';

import { cn } from '@/lib/cn';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    ArrowDownLeft,
    ArrowUpRight,
} from 'lucide-react';
import type { Transaction } from './rental-detail-types';
import { fmtMoney, fmtDateTime } from './rental-detail-helpers';

export function PaymentsTab({ transactions }: { transactions: Transaction[] }) {
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
