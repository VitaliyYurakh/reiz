'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { BASE_URL } from '@/config/environment';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    Car,
    Calendar,
    CreditCard,
    FileText,
    AlertTriangle,
    Clock,
    Plus,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Rental } from './rental-detail-types';
import { fmtDate, fmtDateTime, fmtMoney } from './rental-detail-helpers';
import { PartnerBadge } from '@/components/admin/PartnerBadge';

function getInitials(first: string, last: string) {
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

function SectionHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
    return (
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            {label}
        </div>
    );
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex min-h-[36px] items-center justify-between gap-3 py-1.5">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="truncate text-right text-sm font-medium text-foreground tabular-nums">
                {value}
            </dd>
        </div>
    );
}

function fmtKm(v: number | null | undefined) {
    return v != null ? `${v.toLocaleString('uk-UA')} км` : '—';
}

export function OverviewTab({ rental }: { rental: Rental }) {
    const { t } = useAdminLocale();

    const carPreview = rental.car.previewUrl
        ? `${BASE_URL}static/${rental.car.previewUrl}`
        : rental.car.carPhoto?.find((p) => p.type === 'PC')?.url
            ? `${BASE_URL}static/${rental.car.carPhoto.find((p) => p.type === 'PC')!.url}`
            : null;

    return (
        <div className="space-y-4">
            {/* ── Client + Car ──────────────────────────────────── */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Client */}
                <div className="ios-card">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6a7bff] to-[#5867e8] text-base font-semibold text-white shadow-sm">
                            {getInitials(rental.client.firstName, rental.client.lastName)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('rentalDetail.client')}
                            </p>
                            <Link
                                href={`/admin/clients/${rental.client.id}`}
                                className="group mt-0.5 inline-flex items-center gap-1 text-base font-semibold text-foreground hover:text-primary"
                            >
                                <span className="truncate">
                                    {rental.client.firstName} {rental.client.lastName}
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        </div>
                    </div>
                    <dl className="mt-4 divide-y divide-border/40 text-sm">
                        <div className="flex min-h-[36px] items-center justify-between gap-3 py-2 first:pt-0">
                            <dt className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                {t('common.phone')}
                            </dt>
                            <dd className="truncate font-medium text-foreground">
                                <a href={`tel:${rental.client.phone}`} className="hover:text-primary hover:underline">
                                    {rental.client.phone}
                                </a>
                            </dd>
                        </div>
                        <div className="flex min-h-[36px] items-center justify-between gap-3 py-2 last:pb-0">
                            <dt className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                {t('common.email')}
                            </dt>
                            <dd className="truncate font-medium text-foreground">
                                {rental.client.email || '—'}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Car */}
                <div className="ios-card">
                    <div className="flex items-center gap-4">
                        {carPreview ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={carPreview}
                                alt={`${rental.car.brand} ${rental.car.model}`}
                                className="h-14 w-20 shrink-0 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Car className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('rentalDetail.car')}
                            </p>
                            <p className="mt-0.5 truncate text-base font-semibold text-foreground">
                                {rental.car.brand} {rental.car.model}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-foreground">
                                    {rental.car.plateNumber}
                                </span>
                                <PartnerBadge partner={rental.car.partner} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Dates & Mileage ───────────────────────────────── */}
            <div className="ios-card">
                <SectionHeader icon={Calendar} label={t('rentalDetail.datesAndMileage')} />
                <div className="mt-3 grid gap-x-8 gap-y-1 md:grid-cols-2">
                    {/* Dates column */}
                    <dl className="divide-y divide-border/40">
                        <DataRow label={t('rentalDetail.pickup')} value={fmtDate(rental.pickupDate)} />
                        <DataRow label={t('rentalDetail.returnPlanned')} value={fmtDate(rental.returnDate)} />
                        <DataRow label={t('rentalDetail.returnActual')} value={fmtDate(rental.actualReturnDate)} />
                    </dl>
                    {/* Mileage column */}
                    <dl className="divide-y divide-border/40">
                        <DataRow label={t('rentalDetail.pickupOdometer')} value={fmtKm(rental.pickupOdometer)} />
                        <DataRow label={t('rentalDetail.returnOdometerLabel')} value={fmtKm(rental.returnOdometer)} />
                        <DataRow label={t('rentalDetail.allowedMileage')} value={fmtKm(rental.allowedMileage)} />
                    </dl>
                </div>
                {rental.pickupLocation && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/50 pt-3 text-sm">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="text-xs">{t('rentalDetail.pickupLocation')}:</span>
                            <span className="font-medium text-foreground">{rental.pickupLocation}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <span className="text-xs">{t('rentalDetail.returnLocation')}:</span>
                            <span className="font-medium text-foreground">{rental.returnLocation || '—'}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* ── Cost + Deposit ────────────────────────────────── */}
            {(() => {
                const snap = rental.priceSnapshot as Record<string, unknown> | null;
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
                const SKIP_KEYS = new Set([
                    'approvedAt', 'pickupDate', 'returnDate', 'createdAt', 'updatedAt',
                    'carId', 'ratePlanId', 'coveragePackageId', 'currency', 'addOns',
                    'depositPercent',
                ]);
                const MINOR_MONEY_KEYS = new Set([
                    'grandTotal', 'rentalTotal', 'addOnsTotal', 'deliveryFee',
                    'depositAmount', 'dailyRateMinor', 'baseRentalCost',
                    'insuranceCost', 'extrasCost', 'total', 'totalCost', 'totalMinor',
                    'baseAmount',
                ]);
                const PERCENT_KEYS = new Set(['depositPercent']);
                const PLAIN_NUMBER_KEYS = new Set(['totalDays', 'dailyRate']);
                const TOTAL_KEYS = new Set(['total', 'totalCost', 'grandTotal']);

                const entries = snap
                    ? Object.entries(snap).filter(([k, v]) => !SKIP_KEYS.has(k) && !Array.isArray(v))
                    : [];
                const hasCost = entries.length > 0;
                const totalEntry = entries.find(([k]) => TOTAL_KEYS.has(k));
                const otherEntries = entries.filter(([k]) => !TOTAL_KEYS.has(k));
                const currency = (snap?.currency as string) || 'USD';
                const formatVal = (key: string, val: unknown): string => {
                    if (val == null) return '—';
                    if (PERCENT_KEYS.has(key)) return `${val}%`;
                    if (PLAIN_NUMBER_KEYS.has(key)) return String(val);
                    if (typeof val === 'string') return val;
                    if (typeof val === 'number') {
                        if (MINOR_MONEY_KEYS.has(key)) {
                            return `${(val / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
                        }
                        return `${val.toLocaleString('uk-UA')} ${currency}`;
                    }
                    return String(val);
                };

                const hasDeposit = rental.depositAmount != null;
                if (!hasCost && !hasDeposit) return null;

                return (
                    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                        {/* Cost breakdown */}
                        {hasCost && (
                            <div className="ios-card">
                                <SectionHeader icon={FileText} label={t('rentalDetail.cost')} />
                                <dl className="mt-3 divide-y divide-border/40">
                                    {otherEntries.map(([key, value]) => {
                                        const label = PRICE_LABELS[key]
                                            || key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
                                        return (
                                            <DataRow key={key} label={label} value={formatVal(key, value)} />
                                        );
                                    })}
                                </dl>
                                {totalEntry && (
                                    <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                                        <span className="text-sm font-semibold text-foreground">
                                            {t('rentalDetail.totalLabel')}
                                        </span>
                                        <span className="text-2xl font-bold text-foreground tabular-nums">
                                            {formatVal('total', totalEntry[1])}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Deposit sidebar */}
                        {hasDeposit && (
                            <div className="ios-card">
                                <SectionHeader icon={CreditCard} label={t('rentalDetail.deposit')} />
                                <p className="mt-3 text-2xl font-bold text-foreground tabular-nums">
                                    {fmtMoney(rental.depositAmount!, rental.depositCurrency || undefined)}
                                </p>
                                <span
                                    className={cn(
                                        'mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        rental.depositReturned
                                            ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
                                    )}
                                >
                                    {rental.depositReturned
                                        ? t('rentalDetail.depositReturned')
                                        : t('rentalDetail.depositNotReturned')}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* ── Add-ons ───────────────────────────────────────── */}
            {rental.rentalAddOns.length > 0 && (
                <div className="ios-card">
                    <SectionHeader icon={Plus} label={t('rentalDetail.addOns')} />
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

            {/* ── Extensions ────────────────────────────────────── */}
            {rental.rentalExtensions.length > 0 && (
                <div className="ios-card">
                    <SectionHeader icon={Clock} label={t('rentalDetail.extensions')} />
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

            {/* ── Notes ─────────────────────────────────────────── */}
            {rental.notes && (
                <div className="ios-card">
                    <SectionHeader icon={FileText} label={t('common.notes')} />
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{rental.notes}</p>
                </div>
            )}

            {/* ── Cancellation request ──────────────────────────── */}
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

            {/* ── Cancel reason ─────────────────────────────────── */}
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
