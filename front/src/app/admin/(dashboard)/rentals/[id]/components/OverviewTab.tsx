'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    User,
    Car,
    Calendar,
    CreditCard,
    FileText,
    AlertTriangle,
    Clock,
    Plus,
} from 'lucide-react';
import type { Rental } from './rental-detail-types';
import { fmtDate, fmtDateTime, fmtMoney } from './rental-detail-helpers';

export function OverviewTab({ rental }: { rental: Rental }) {
    const { t } = useAdminLocale();
    return (
        <div className="space-y-6">
            {/* Client card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    {t('rentalDetail.client')}
                </div>
                <div className="mt-3">
                    <Link
                        href={`/admin/clients/${rental.client.id}`}
                        className="text-base font-semibold text-foreground hover:underline"
                    >
                        {rental.client.firstName} {rental.client.lastName}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{rental.client.phone}</p>
                    {rental.client.email && (
                        <p className="text-sm text-muted-foreground">{rental.client.email}</p>
                    )}
                </div>
            </div>

            {/* Car card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {t('rentalDetail.car')}
                </div>
                <div className="mt-3">
                    <p className="text-base font-semibold text-foreground">
                        {rental.car.brand} {rental.car.model}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{rental.car.plateNumber}</p>
                </div>
            </div>

            {/* Dates card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {t('rentalDetail.datesAndMileage')}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.pickup')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.pickupDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnPlanned')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.returnDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnActual')}</p>
                        <p className="text-sm font-medium text-foreground">{fmtDate(rental.actualReturnDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.pickupOdometer')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.pickupOdometer != null ? `${rental.pickupOdometer.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.returnOdometerLabel')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.returnOdometer != null ? `${rental.returnOdometer.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('rentalDetail.allowedMileage')}</p>
                        <p className="text-sm font-medium text-foreground">
                            {rental.allowedMileage != null ? `${rental.allowedMileage.toLocaleString()} км` : '—'}
                        </p>
                    </div>
                </div>
                {rental.pickupLocation && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">{t('rentalDetail.pickupLocation')}</p>
                            <p className="text-sm font-medium text-foreground">{rental.pickupLocation}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{t('rentalDetail.returnLocation')}</p>
                            <p className="text-sm font-medium text-foreground">{rental.returnLocation || '—'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Deposit card */}
            <div className="ios-card">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    {t('rentalDetail.deposit')}
                </div>
                <div className="mt-3 flex items-center gap-4">
                    <p className="text-base font-semibold text-foreground">
                        {rental.depositAmount != null
                            ? fmtMoney(rental.depositAmount, rental.depositCurrency || undefined)
                            : '—'}
                    </p>
                    <span
                        className={cn(
                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                            rental.depositReturned
                                ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
                        )}
                    >
                        {rental.depositReturned ? t('rentalDetail.depositReturned') : t('rentalDetail.depositNotReturned')}
                    </span>
                </div>
            </div>

            {/* Add-ons */}
            {rental.rentalAddOns.length > 0 && (
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Plus className="h-4 w-4" />
                        {t('rentalDetail.addOns')}
                    </div>
                    <div className="mt-3 ios-table-wrap">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.service')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.cost')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.rentalAddOns.map((ra) => (
                                    <tr key={ra.id} className="border-b border-border last:border-b-0">
                                        <td className="px-4 py-2 text-foreground">{ra.addOn.name}</td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {fmtMoney(ra.addOn.priceMinor, ra.addOn.currency)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Extensions */}
            {rental.rentalExtensions.length > 0 && (
                <div className="ios-card">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t('rentalDetail.extensions')}
                    </div>
                    <div className="mt-3 ios-table-wrap">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.oldDate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.newDate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.extraDays')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.dailyRate')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.totalLabel')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('rentalDetail.reason')}</th>
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t('common.date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.rentalExtensions.map((ext) => (
                                    <tr key={ext.id} className="border-b border-border last:border-b-0">
                                        <td className="px-4 py-2 text-muted-foreground">{fmtDate(ext.oldReturnDate)}</td>
                                        <td className="px-4 py-2 text-foreground">{fmtDate(ext.newReturnDate)}</td>
                                        <td className="px-4 py-2 text-foreground">{ext.extraDays}</td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {fmtMoney(ext.dailyRateMinor, ext.currency)}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-foreground">
                                            {fmtMoney(ext.totalMinor, ext.currency)}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground max-w-[200px] truncate">
                                            {ext.reason || '—'}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                                            {fmtDateTime(ext.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Price snapshot */}
            {rental.priceSnapshot && (() => {
                const snap = rental.priceSnapshot as Record<string, unknown>;
                const PRICE_LABELS: Record<string, string> = {
                    dailyRate: t('rentalDetail.priceDailyRate'),
                    dailyRateMinor: t('rentalDetail.priceDailyRate'),
                    totalDays: t('rentalDetail.priceTotalDays'),
                    baseAmount: t('rentalDetail.priceBaseAmount'),
                    baseRentalCost: t('rentalDetail.priceRental'),
                    rentalTotal: t('rentalDetail.priceRental'),
                    insuranceCost: t('rentalDetail.priceInsurance'),
                    addOnsTotal: t('rentalDetail.priceAddOns'),
                    extrasCost: t('rentalDetail.priceAddOns'),
                    deliveryFee: t('rentalDetail.priceDelivery'),
                    discount: t('rentalDetail.priceDiscount'),
                    depositAmount: t('rentalDetail.priceDeposit'),
                    total: t('rentalDetail.totalLabel'),
                    totalCost: t('rentalDetail.totalLabel'),
                    grandTotal: t('rentalDetail.totalLabel'),
                    ratePlanName: t('rentalDetail.priceRatePlan'),
                    coverageName: t('rentalDetail.priceCoverage'),
                    coveragePackageName: t('rentalDetail.priceCoverage'),
                    depositPercent: t('rentalDetail.priceDepositPercent'),
                    name: t('rentalDetail.priceRatePlan'),
                };
                // Hide timestamps, internal IDs already rendered elsewhere (carId,
                // ratePlanId, coveragePackageId), containers rendered by their own
                // UI (add-ons list, currency label), and depositPercent — the
                // coverage package name already embeds the % ("Покриття 100%").
                const SKIP_KEYS = new Set([
                    'approvedAt', 'pickupDate', 'returnDate', 'createdAt', 'updatedAt',
                    'carId', 'ratePlanId', 'coveragePackageId', 'currency', 'addOns',
                    'depositPercent',
                ]);
                // Monetary fields stored as minor units (cents). pricingService
                // returns all money in minor; legacy websiteSnapshots used `dailyRate`
                // as main units — keep that one in PLAIN_NUMBER_KEYS.
                const MINOR_MONEY_KEYS = new Set([
                    'grandTotal', 'rentalTotal', 'addOnsTotal', 'deliveryFee',
                    'depositAmount', 'dailyRateMinor', 'baseRentalCost',
                    'insuranceCost', 'extrasCost', 'total', 'totalCost', 'totalMinor',
                    'baseAmount',
                ]);
                const PERCENT_KEYS = new Set(['depositPercent']);
                const PLAIN_NUMBER_KEYS = new Set(['totalDays', 'dailyRate']);
                const TOTAL_KEYS = new Set(['total', 'totalCost', 'grandTotal']);

                const entries = Object.entries(snap)
                    .filter(([k, v]) => !SKIP_KEYS.has(k) && !Array.isArray(v));
                if (entries.length === 0) return null;

                const totalEntry = entries.find(([k]) => TOTAL_KEYS.has(k));
                const otherEntries = entries.filter(([k]) => !TOTAL_KEYS.has(k));

                const currency = (snap.currency as string) || 'USD';
                const formatVal = (key: string, val: unknown): string => {
                    if (val == null) return '—';
                    if (PERCENT_KEYS.has(key)) return `${val}%`;
                    if (PLAIN_NUMBER_KEYS.has(key)) return String(val);
                    if (typeof val === 'string') return val;
                    if (typeof val === 'number') {
                        if (MINOR_MONEY_KEYS.has(key)) {
                            return `${(val / 100).toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${currency}`;
                        }
                        return `${val.toLocaleString('uk-UA')} ${currency}`;
                    }
                    return String(val);
                };

                return (
                    <div className="ios-card">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                            <FileText className="h-4 w-4" />
                            {t('rentalDetail.cost')}
                        </div>
                        <div className="space-y-2">
                            {otherEntries.map(([key, value]) => {
                                const label = PRICE_LABELS[key]
                                    || key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
                                return (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="font-medium text-card-foreground">
                                            {formatVal(key, value)}
                                        </span>
                                    </div>
                                );
                            })}
                            {totalEntry && (
                                <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
                                    <span className="font-semibold text-foreground">{t('rentalDetail.totalLabel')}</span>
                                    <span className="font-bold text-foreground text-base">
                                        {formatVal('total', totalEntry[1])}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Notes */}
            {rental.notes && (
                <div className="ios-card">
                    <p className="text-sm font-medium text-muted-foreground">{t('common.notes')}</p>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{rental.notes}</p>
                </div>
            )}

            {/* Client cancellation request */}
            {(rental as any).cancellationRequestedAt && (
                <div className="rounded-2xl bg-[#FF9500]/10 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#FF9500]">
                        <AlertTriangle className="h-4 w-4" />
                        Клієнт запросив скасування оренди
                    </div>
                    <p className="mt-1 text-sm text-[#FF9500]/80">
                        {new Date((rental as any).cancellationRequestedAt).toLocaleString('uk-UA')}
                    </p>
                    {(rental as any).cancellationRequestReason && (
                        <p className="mt-2 text-sm text-foreground">{(rental as any).cancellationRequestReason}</p>
                    )}
                </div>
            )}

            {/* Cancel reason */}
            {rental.cancelReason && (
                <div className="rounded-2xl bg-[#FF3B30]/10 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#FF3B30]">
                        <AlertTriangle className="h-4 w-4" />
                        {t('rentalDetail.cancelReasonLabel')}
                    </div>
                    <p className="mt-2 text-sm text-[#FF3B30]">{rental.cancelReason}</p>
                </div>
            )}
        </div>
    );
}
