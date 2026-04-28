import {prisma} from '../utils';
import fxRateService from './fx-rate.service';

interface CommissionTier {
    minDays: number;
    maxDays: number;   // 0 = unlimited
    percent: number;
}

const DEFAULT_TIERS: CommissionTier[] = [
    {minDays: 1, maxDays: 7, percent: 15},
    {minDays: 8, maxDays: 29, percent: 12.5},
    {minDays: 30, maxDays: 0, percent: 10},
];

function pickTier(tiers: CommissionTier[], days: number): CommissionTier {
    const sorted = [...tiers].sort((a, b) => a.minDays - b.minDays);
    for (const t of sorted) {
        const max = t.maxDays === 0 ? Infinity : t.maxDays;
        if (days >= t.minDays && days <= max) return t;
    }
    // Fallback: highest tier
    return sorted[sorted.length - 1] ?? DEFAULT_TIERS[0];
}

function daysBetween(start: Date, end: Date): number {
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
}

class PartnerService {
    async list(params: {search?: string; isActive?: boolean} = {}) {
        const {search, isActive} = params;
        const where: any = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (search?.trim()) {
            const q = search.trim();
            where.OR = [
                {fullName: {contains: q, mode: 'insensitive'}},
                {companyName: {contains: q, mode: 'insensitive'}},
                {edrpou: {contains: q}},
                {phone: {contains: q}},
                {email: {contains: q, mode: 'insensitive'}},
            ];
        }
        const items = await prisma.partner.findMany({
            where,
            orderBy: [{isActive: 'desc'}, {fullName: 'asc'}],
            include: {_count: {select: {cars: true}}},
        });
        return {items, total: items.length};
    }

    async getOne(id: number) {
        return await prisma.partner.findUnique({
            where: {id},
            include: {
                cars: {
                    select: {id: true, brand: true, model: true, plateNumber: true, isAvailable: true},
                },
            },
        });
    }

    async create(data: {
        fullName: string;
        companyName?: string;
        edrpou?: string;
        ipn?: string;
        phone?: string;
        email?: string;
        iban?: string;
        bankName?: string;
        commissionTiers?: CommissionTier[];
        notes?: string;
    }) {
        return await prisma.partner.create({
            data: {
                fullName: data.fullName,
                companyName: data.companyName ?? null,
                edrpou: data.edrpou ?? null,
                ipn: data.ipn ?? null,
                phone: data.phone ?? null,
                email: data.email ?? null,
                iban: data.iban ?? null,
                bankName: data.bankName ?? null,
                commissionTiers: data.commissionTiers ?? (DEFAULT_TIERS as any),
                notes: data.notes ?? null,
            },
        });
    }

    async update(id: number, data: Partial<{
        fullName: string;
        companyName: string | null;
        edrpou: string | null;
        ipn: string | null;
        phone: string | null;
        email: string | null;
        iban: string | null;
        bankName: string | null;
        commissionTiers: CommissionTier[];
        notes: string | null;
        isActive: boolean;
    }>) {
        return await prisma.partner.update({
            where: {id},
            data: data as any,
        });
    }

    async delete(id: number) {
        // Detach cars first (set partnerId to null) then soft-block by deactivating.
        // Hard-delete only if no cars and no historical rentals.
        const carsCount = await prisma.car.count({where: {partnerId: id}});
        if (carsCount > 0) {
            return await prisma.partner.update({
                where: {id},
                data: {isActive: false},
            });
        }
        return await prisma.partner.delete({where: {id}});
    }

    /**
     * Generate a partner statement for a date range.
     *
     * Includes every COMPLETED rental whose car belongs to this partner
     * AND whose pickupDate falls in [from, to). Each row gets:
     *   - days (calendar days, min 1)
     *   - basePrice (€): from priceSnapshot.rentalTotal or priceSnapshot.baseRentalCost
     *   - discountPercent: from priceSnapshot if present, else 0
     *   - priceAfterDiscount
     *   - commissionPercent: picked from the partner's tier matching `days`
     *   - commissionAmount: priceAfterDiscount * commissionPercent / 100
     *   - currency
     *
     * Money values from priceSnapshot are in MINOR units (cents) for new rentals
     * so we divide by 100. Older rows may already store major — we fall back gracefully.
     */
    async getReport(partnerId: number, from: Date, to: Date) {
        const partner = await prisma.partner.findUnique({where: {id: partnerId}});
        if (!partner) throw new Error(`Partner ${partnerId} not found`);
        const tiers = (Array.isArray(partner.commissionTiers)
            ? (partner.commissionTiers as unknown as CommissionTier[])
            : DEFAULT_TIERS);

        const rentals = await prisma.rental.findMany({
            where: {
                car: {partnerId},
                status: {in: ['completed', 'active']},
                pickupDate: {gte: from, lt: to},
            },
            orderBy: {pickupDate: 'asc'},
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                client: {select: {firstName: true, lastName: true}},
            },
        });

        // Pre-fetch UAH rates for every rental's pickup-day in parallel.
        // Operator pays the partner in UAH at the end of each month, but the
        // rentals are priced in EUR — so we lock the conversion to the NBU
        // rate that was in force on the day of pickup. The fx-rate service
        // caches per-day in `daily_fx_rate`, so a re-run of the same report
        // hits the DB instead of NBU.
        const ratesByPickup = new Map<string, number | null>();
        await Promise.all(
            rentals.map(async (r) => {
                const snap = (r.priceSnapshot ?? {}) as Record<string, any>;
                const cur = (snap.currency as string) || 'EUR';
                const day = new Date(r.pickupDate);
                day.setUTCHours(0, 0, 0, 0);
                const key = `${cur}|${day.toISOString().slice(0, 10)}`;
                if (ratesByPickup.has(key)) return;
                const fx = await fxRateService.getRate(cur, day);
                ratesByPickup.set(key, fx ? fx.rate : null);
            }),
        );

        const rows = rentals.map((r) => {
            const snap = (r.priceSnapshot ?? {}) as Record<string, any>;
            const days = daysBetween(new Date(r.pickupDate), new Date(r.actualReturnDate ?? r.returnDate));

            // Try several common keys; assume MINOR units when key ends in "Minor"
            // or when value > 1000 (heuristic for older snapshots).
            let basePriceMinor =
                Number(snap.rentalTotalMinor) ||
                Number(snap.baseRentalCost) ||
                Number(snap.rentalTotal) ||
                Number(snap.totalCost) ||
                Number(snap.grandTotal) ||
                0;
            // If value looks too small to be cents, assume it's already main units.
            const looksLikeMinor = basePriceMinor > 1000;
            const basePrice = looksLikeMinor ? basePriceMinor / 100 : basePriceMinor;

            const discountPercent = Number(snap.discountPercent) || 0;
            const priceAfterDiscount = basePrice * (1 - discountPercent / 100);

            const tier = pickTier(tiers, days);
            const commissionAmount = +(priceAfterDiscount * tier.percent / 100).toFixed(2);

            const currency = snap.currency || 'EUR';
            const day = new Date(r.pickupDate);
            day.setUTCHours(0, 0, 0, 0);
            const fxRate = ratesByPickup.get(`${currency}|${day.toISOString().slice(0, 10)}`) ?? null;
            const commissionAmountUah = fxRate != null
                ? +(commissionAmount * fxRate).toFixed(2)
                : null;

            return {
                rentalId: r.id,
                contractNumber: r.contractNumber,
                date: r.pickupDate,
                car: `${r.car.brand} ${r.car.model}`,
                plateNumber: r.car.plateNumber,
                clientName: `${r.client.firstName} ${r.client.lastName}`,
                days,
                basePrice: +basePrice.toFixed(2),
                discountPercent,
                priceAfterDiscount: +priceAfterDiscount.toFixed(2),
                commissionPercent: tier.percent,
                commissionAmount,
                currency,
                // UAH-equivalent of commission, frozen at the NBU rate from
                // the pickup day. `null` if fx fetch failed (offline + no
                // cached rate). UI shows "—" in that case.
                fxRateToUah: fxRate,
                commissionAmountUah,
            };
        });

        const totalCommission = +rows.reduce((sum, r) => sum + r.commissionAmount, 0).toFixed(2);
        const totalBase = +rows.reduce((sum, r) => sum + r.basePrice, 0).toFixed(2);
        const totalAfterDiscount = +rows.reduce((sum, r) => sum + r.priceAfterDiscount, 0).toFixed(2);
        const totalCommissionUah = rows.every((r) => r.commissionAmountUah == null)
            ? null
            : +rows.reduce((sum, r) => sum + (r.commissionAmountUah ?? 0), 0).toFixed(2);

        return {
            partner: {
                id: partner.id,
                fullName: partner.fullName,
                companyName: partner.companyName,
                edrpou: partner.edrpou,
                iban: partner.iban,
            },
            tiers,
            period: {from, to},
            rows,
            summary: {
                rentalsCount: rows.length,
                totalBase,
                totalAfterDiscount,
                totalCommission,
                totalCommissionUah,
                payoutToPartner: +(totalAfterDiscount - totalCommission).toFixed(2),
            },
        };
    }
}

export default new PartnerService();
