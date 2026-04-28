/**
 * Partner monthly settlement service.
 *
 * Closes the loop on `partner.service.getReport()` — when the operator
 * receives the end-of-month transfer from a partner, this service:
 *
 *   1. Recomputes the EUR commission for the supplied rentalIds at the
 *      moment the payment is being recorded (defends against stale UI state
 *      where the operator's report was generated days ago).
 *   2. Locks the FX rate (NBU mid-rate from the day of payment, by default)
 *      so the historical record can't drift later.
 *   3. Inserts both the `PartnerPayment` row AND a paired
 *      `Transaction` (type=PARTNER_COMMISSION, direction=in) on the
 *      operator's chosen account in a single Prisma transaction. Failure
 *      anywhere → both rolled back.
 *   4. Links every covered rental via `partner_payment_rental` so the
 *      partner statement can render `✓ оплачено DD.MM` per rental.
 */

import {prisma, BadRequestError, NotFoundError} from '../utils';
import fxRateService from './fx-rate.service';

interface CreateInput {
    partnerId: number;
    accountId: number;
    periodFrom: string;     // YYYY-MM-DD
    periodTo: string;       // YYYY-MM-DD
    paidAt: string;         // YYYY-MM-DD
    receivedUahMinor: number;
    fxRate?: number;        // override the day's NBU rate if needed
    rentalIds: number[];
    notes?: string;
    createdById?: number;
}

interface CommissionTier {
    minDays: number;
    maxDays: number;
    percent: number;
}

const DEFAULT_TIERS: CommissionTier[] = [
    {minDays: 1, maxDays: 7,  percent: 15},
    {minDays: 8, maxDays: 29, percent: 12.5},
    {minDays: 30, maxDays: 0, percent: 10},
];

function pickTier(tiers: CommissionTier[], days: number): CommissionTier {
    const sorted = [...tiers].sort((a, b) => a.minDays - b.minDays);
    for (const t of sorted) {
        const max = t.maxDays === 0 ? Infinity : t.maxDays;
        if (days >= t.minDays && days <= max) return t;
    }
    return sorted[sorted.length - 1] ?? DEFAULT_TIERS[0];
}

function daysBetween(start: Date, end: Date): number {
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
}

/**
 * Compute commission in EUR-minor for one rental using the partner's tiers
 * and the same priceSnapshot heuristics as `partner.service.getReport`.
 */
function commissionEurMinorFor(
    rental: {priceSnapshot: any; pickupDate: Date; actualReturnDate: Date | null; returnDate: Date},
    tiers: CommissionTier[],
): number {
    const snap = (rental.priceSnapshot ?? {}) as Record<string, any>;
    const days = daysBetween(new Date(rental.pickupDate), new Date(rental.actualReturnDate ?? rental.returnDate));
    let basePriceCandidate =
        Number(snap.rentalTotalMinor) ||
        Number(snap.baseRentalCost) ||
        Number(snap.rentalTotal) ||
        Number(snap.totalCost) ||
        Number(snap.grandTotal) ||
        0;
    const looksLikeMinor = basePriceCandidate > 1000;
    const basePriceEur = looksLikeMinor ? basePriceCandidate / 100 : basePriceCandidate;
    const discountPercent = Number(snap.discountPercent) || 0;
    const priceAfterDiscount = basePriceEur * (1 - discountPercent / 100);
    const tier = pickTier(tiers, days);
    const commissionEur = priceAfterDiscount * tier.percent / 100;
    return Math.round(commissionEur * 100);
}

class PartnerPaymentService {
    async list(partnerId: number) {
        return await prisma.partnerPayment.findMany({
            where: {partnerId},
            orderBy: [{paidAt: 'desc'}, {id: 'desc'}],
            include: {
                account:     {select: {id: true, name: true, currency: true}},
                transaction: {select: {id: true, amountMinor: true, currency: true}},
                rentals: {
                    include: {
                        rental: {select: {id: true, contractNumber: true, pickupDate: true}},
                    },
                },
                createdBy:   {select: {id: true, name: true, email: true}},
            },
        });
    }

    async getOne(id: number) {
        return await prisma.partnerPayment.findUnique({
            where: {id},
            include: {
                partner:     true,
                account:     true,
                transaction: true,
                rentals: {
                    include: {
                        rental: {
                            include: {
                                car: {select: {brand: true, model: true, plateNumber: true}},
                                client: {select: {firstName: true, lastName: true}},
                            },
                        },
                    },
                },
                createdBy: {select: {id: true, name: true, email: true}},
            },
        });
    }

    async create(input: CreateInput) {
        const partner = await prisma.partner.findUnique({where: {id: input.partnerId}});
        if (!partner) throw new NotFoundError(`Partner ${input.partnerId} not found`);

        const account = await prisma.account.findUnique({where: {id: input.accountId}});
        if (!account) throw new NotFoundError(`Account ${input.accountId} not found`);
        if (account.currency !== 'UAH') {
            throw new BadRequestError(
                `Партнерські платежі приймаються в UAH. Обраний рахунок (${account.name}) у валюті ${account.currency}.`,
            );
        }

        const tiers: CommissionTier[] = Array.isArray(partner.commissionTiers)
            ? (partner.commissionTiers as unknown as CommissionTier[])
            : DEFAULT_TIERS;

        const rentals = await prisma.rental.findMany({
            where: {
                id:  {in: input.rentalIds},
                car: {partnerId: input.partnerId},
            },
        });
        if (rentals.length !== input.rentalIds.length) {
            const found = new Set(rentals.map((r) => r.id));
            const missing = input.rentalIds.filter((id) => !found.has(id));
            throw new BadRequestError(
                `Оренди не належать партнеру або не існують: [${missing.join(', ')}]`,
            );
        }

        // Refuse if any of the rentals is already settled in another payment
        // for the same partner. Operator can correct via separate
        // adjustment / refund row instead of double-paying.
        const alreadyPaid = await prisma.partnerPaymentRental.findFirst({
            where: {
                rentalId: {in: input.rentalIds},
                payment:  {partnerId: input.partnerId, status: {in: ['paid', 'partial']}},
            },
            include: {payment: true, rental: {select: {contractNumber: true}}},
        });
        if (alreadyPaid) {
            throw new BadRequestError(
                `Оренда ${alreadyPaid.rental.contractNumber || `#${alreadyPaid.rentalId}`} вже включена в платіж #${alreadyPaid.partnerPaymentId} від ${alreadyPaid.payment.paidAt.toISOString().slice(0, 10)}.`,
            );
        }

        // Recompute EUR commission per rental (don't trust client-side total).
        const perRental = rentals.map((r) => ({
            rentalId: r.id,
            commissionEurMinor: commissionEurMinorFor(r, tiers),
        }));
        const amountEurMinor = perRental.reduce((s, x) => s + x.commissionEurMinor, 0);

        // FX rate: explicit override > NBU rate on payment day > stale fallback.
        let fxRate = input.fxRate;
        if (fxRate == null) {
            const fx = await fxRateService.getRate('EUR', input.paidAt);
            if (!fx) {
                throw new BadRequestError(
                    'Не вдалось отримати курс НБУ EUR/UAH на дату платежу. Введіть курс вручну.',
                );
            }
            fxRate = fx.rate;
        }
        const expectedUahMinor = Math.round((amountEurMinor / 100) * fxRate * 100);

        return await prisma.$transaction(async (tx) => {
            const payment = await tx.partnerPayment.create({
                data: {
                    partnerId:        input.partnerId,
                    accountId:        input.accountId,
                    periodFrom:       new Date(input.periodFrom),
                    periodTo:         new Date(input.periodTo),
                    paidAt:           new Date(input.paidAt),
                    amountEurMinor,
                    expectedUahMinor,
                    receivedUahMinor: input.receivedUahMinor,
                    fxRate,
                    notes:            input.notes ?? null,
                    createdById:      input.createdById ?? null,
                    status:           input.receivedUahMinor < expectedUahMinor ? 'partial' : 'paid',
                    rentals: {
                        createMany: {
                            data: perRental.map((p) => ({
                                rentalId:           p.rentalId,
                                commissionEurMinor: p.commissionEurMinor,
                            })),
                        },
                    },
                },
            });

            const txn = await tx.transaction.create({
                data: {
                    type:           'PARTNER_COMMISSION',
                    accountId:      input.accountId,
                    direction:      'IN',
                    amountMinor:    input.receivedUahMinor,
                    currency:       'UAH',
                    fxRate:         1.0,
                    amountUahMinor: input.receivedUahMinor,
                    description:    `Комісія партнера ${partner.companyName || partner.fullName} за період ${input.periodFrom} — ${input.periodTo}`,
                    partnerId:      input.partnerId,
                    createdByUserId: input.createdById ?? null,
                },
            });

            const linked = await tx.partnerPayment.update({
                where: {id: payment.id},
                data:  {transactionId: txn.id},
                include: {
                    account:     true,
                    transaction: true,
                    rentals: {
                        include: {
                            rental: {select: {id: true, contractNumber: true, pickupDate: true}},
                        },
                    },
                },
            });

            return linked;
        });
    }

    async update(id: number, data: {paidAt?: string; receivedUahMinor?: number; notes?: string | null; status?: string}) {
        const updateData: any = {};
        if (data.paidAt !== undefined) updateData.paidAt = new Date(data.paidAt);
        if (data.receivedUahMinor !== undefined) updateData.receivedUahMinor = data.receivedUahMinor;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.status !== undefined) updateData.status = data.status;
        return await prisma.partnerPayment.update({where: {id}, data: updateData});
    }

    async delete(id: number) {
        const payment = await prisma.partnerPayment.findUnique({where: {id}});
        if (!payment) throw new NotFoundError(`PartnerPayment ${id} not found`);
        await prisma.$transaction(async (tx) => {
            // Detach the linked transaction first so the @unique fk doesn't
            // block the cascade. We delete the txn too — partner payments
            // shouldn't leave orphaned IN entries on the account ledger.
            const txnId = payment.transactionId;
            if (txnId) {
                await tx.partnerPayment.update({where: {id}, data: {transactionId: null}});
                await tx.transaction.delete({where: {id: txnId}});
            }
            await tx.partnerPayment.delete({where: {id}});
        });
    }

    /**
     * Stats card: how much partner X paid us this year, how much is still
     * waiting (rentals not in any payment yet), and any underpayment delta.
     *
     * `pendingUahMinor` mirrors the report's UAH column — each pending rental
     * is converted at the NBU EUR/UAH rate from its pickup day (same rule
     * `partner.service.getReport()` uses), so the operator sees a number
     * directly comparable to what they'll actually receive.
     */
    async getStats(partnerId: number) {
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const [paidAgg, settledLinks] = await Promise.all([
            prisma.partnerPayment.aggregate({
                where: {partnerId, paidAt: {gte: yearStart}},
                _sum: {receivedUahMinor: true, expectedUahMinor: true, amountEurMinor: true},
                _count: {_all: true},
            }),
            prisma.partnerPaymentRental.findMany({
                where: {payment: {partnerId, status: {in: ['paid', 'partial']}}},
                select: {rentalId: true},
            }),
        ]);
        const settledIds = new Set(settledLinks.map((l) => l.rentalId));

        const partner = await prisma.partner.findUnique({where: {id: partnerId}});
        if (!partner) {
            return {
                paymentsCount: 0,
                receivedUahMinor: 0,
                expectedUahMinor: 0,
                varianceUahMinor: 0,
                pendingEurMinor: 0,
                pendingUahMinor: 0,
                pendingRentalsCount: 0,
            };
        }
        const tiers: CommissionTier[] = Array.isArray(partner.commissionTiers)
            ? (partner.commissionTiers as unknown as CommissionTier[])
            : DEFAULT_TIERS;
        const allRentals = await prisma.rental.findMany({
            where: {
                car: {partnerId},
                status: {in: ['completed', 'active']},
            },
        });
        const pending = allRentals.filter((r) => !settledIds.has(r.id));

        // Sum pending in BOTH currencies — UAH per-rental at its pickup-day
        // NBU rate. Cache rates per (currency, day) so a long pending list
        // doesn't bombard the NBU API.
        const rateCache = new Map<string, number>();
        const ratesNeeded = pending.map((r) => {
            const day = new Date(r.pickupDate);
            day.setUTCHours(0, 0, 0, 0);
            return day.toISOString().slice(0, 10);
        });
        const uniqueDays = Array.from(new Set(ratesNeeded));
        await Promise.all(
            uniqueDays.map(async (dayKey) => {
                const fx = await fxRateService.getRate('EUR', dayKey);
                if (fx) rateCache.set(dayKey, fx.rate);
            }),
        );

        let pendingEurMinor = 0;
        let pendingUahMinor = 0;
        for (const r of pending) {
            const eur = commissionEurMinorFor(r, tiers);
            pendingEurMinor += eur;
            const day = new Date(r.pickupDate);
            day.setUTCHours(0, 0, 0, 0);
            const rate = rateCache.get(day.toISOString().slice(0, 10));
            if (rate != null) {
                pendingUahMinor += Math.round((eur / 100) * rate * 100);
            }
        }

        const received = paidAgg._sum.receivedUahMinor ?? 0;
        const expected = paidAgg._sum.expectedUahMinor ?? 0;
        return {
            paymentsCount: paidAgg._count._all,
            receivedUahMinor: received,
            expectedUahMinor: expected,
            // Negative = overall underpayment from rounding.
            varianceUahMinor: received - expected,
            pendingEurMinor,
            pendingUahMinor,
            pendingRentalsCount: pending.length,
        };
    }
}

export default new PartnerPaymentService();
