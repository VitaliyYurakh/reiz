import {prisma} from '../utils';

class PricingService {
    async calculate(params: {
        carId: number;
        startDate: Date;
        endDate: Date;
        coveragePackageId?: number;
        addOns?: Array<{addOnId: number; qty?: number}>;
        deliveryFee?: number;
        currency?: string;
    }) {
        const {carId, startDate, endDate, coveragePackageId, addOns, deliveryFee, currency} = params;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const msPerDay = 24 * 60 * 60 * 1000;
        const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / msPerDay));

        // Find applicable rate plan
        const ratePlan = await prisma.ratePlan.findFirst({
            where: {
                carId,
                isActive: true,
                deletedAt: null,
                minDays: {lte: totalDays},
                maxDays: {gte: totalDays},
            },
            orderBy: {dailyPrice: 'asc'},
        });

        // Fallback to legacy rental tariff if no rate plan found
        let dailyRateMinor = 0;
        let ratePlanId: number | null = null;
        let ratePlanName: string | null = null;
        let rateCurrency = currency || 'USD';

        if (ratePlan) {
            dailyRateMinor = ratePlan.dailyPrice;
            ratePlanId = ratePlan.id;
            ratePlanName = ratePlan.name;
            rateCurrency = ratePlan.currency;
        } else {
            // Fallback: find from old rental tariffs
            const tariff = await prisma.rentalTariff.findFirst({
                where: {
                    carId,
                    minDays: {lte: totalDays},
                    OR: [
                        {maxDays: {gte: totalDays}},
                        {maxDays: 0}, // 0 means unlimited
                    ],
                },
                orderBy: {minDays: 'asc'},
            });

            if (tariff) {
                dailyRateMinor = tariff.dailyPrice;
            }
        }

        const rentalTotal = dailyRateMinor * totalDays;

        // Coverage package
        let depositPercent = 100;
        let coveragePackageName: string | null = null;
        if (coveragePackageId) {
            const coveragePackage = await prisma.coveragePackage.findUnique({
                where: {id: coveragePackageId},
            });
            if (coveragePackage) {
                depositPercent = coveragePackage.depositPercent;
                coveragePackageName = coveragePackage.name;
            }
        }

        // Calculate deposit based on the coverage package deposit percent and rental total
        const depositAmount = Math.round((rentalTotal * depositPercent) / 100);

        // Add-ons
        const addOnBreakdown: Array<{
            addOnId: number;
            name: string;
            pricingMode: string;
            quantity: number;
            unitPriceMinor: number;
            currency: string;
            totalMinor: number;
        }> = [];
        let addOnsTotal = 0;

        if (addOns && addOns.length > 0) {
            const addOnIds = addOns.map((a) => a.addOnId);
            const addOnRecords = await prisma.addOn.findMany({
                where: {id: {in: addOnIds}, isActive: true, deletedAt: null},
            });

            for (const addOnInput of addOns) {
                const addOnRecord = addOnRecords.find((a) => a.id === addOnInput.addOnId);
                if (!addOnRecord) continue;

                let quantity = addOnInput.qty || 1;
                let total = 0;

                // Enforce qty rules based on pricing mode
                if (addOnRecord.pricingMode === 'ONE_TIME') {
                    quantity = 1;
                } else if (addOnRecord.pricingMode === 'PER_DAY' && !addOnRecord.qtyEditable) {
                    quantity = 1;
                }

                if (addOnRecord.pricingMode === 'PER_DAY') {
                    total = addOnRecord.unitPriceMinor * totalDays * quantity;
                } else if (addOnRecord.pricingMode === 'ONE_TIME') {
                    total = addOnRecord.unitPriceMinor * 1;
                } else if (addOnRecord.pricingMode === 'MANUAL_QTY') {
                    total = addOnRecord.unitPriceMinor * quantity;
                }

                addOnBreakdown.push({
                    addOnId: addOnRecord.id,
                    name: addOnRecord.name,
                    pricingMode: addOnRecord.pricingMode,
                    quantity,
                    unitPriceMinor: addOnRecord.unitPriceMinor,
                    currency: addOnRecord.currency,
                    totalMinor: total,
                });

                addOnsTotal += total;
            }
        }

        const deliveryFeeAmount = deliveryFee || 0;
        const grandTotal = rentalTotal + addOnsTotal + deliveryFeeAmount;

        return {
            carId,
            totalDays,
            ratePlanId,
            ratePlanName,
            dailyRateMinor,
            currency: rateCurrency,
            rentalTotal,
            coveragePackageId: coveragePackageId || null,
            coveragePackageName,
            depositPercent,
            depositAmount,
            addOns: addOnBreakdown,
            addOnsTotal,
            deliveryFee: deliveryFeeAmount,
            grandTotal,
        };
    }

    // --- RatePlan CRUD ---

    async getRatePlans(params?: {carId?: number; isActive?: boolean}) {
        const where: any = {deletedAt: null};
        if (params?.carId) where.carId = params.carId;
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.ratePlan.findMany({
            where,
            orderBy: [{minDays: 'asc'}, {carId: 'asc'}],
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });
    }

    async createRatePlan(data: {
        name: string;
        carId: number;
        minDays: number;
        maxDays: number;
        dailyPrice: number;
        currency?: string;
        isActive?: boolean;
    }) {
        return await prisma.ratePlan.create({
            data: {
                name: data.name,
                carId: data.carId,
                minDays: data.minDays,
                maxDays: data.maxDays,
                dailyPrice: data.dailyPrice,
                currency: data.currency || 'USD',
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateRatePlan(id: number, data: {
        name?: string;
        minDays?: number;
        maxDays?: number;
        dailyPrice?: number;
        currency?: string;
        isActive?: boolean;
    }) {
        return await prisma.ratePlan.update({
            where: {id},
            data,
        });
    }

    async softDeleteRatePlan(id: number) {
        return await prisma.ratePlan.update({
            where: {id},
            data: {deletedAt: new Date(), isActive: false},
        });
    }

    // --- AddOn CRUD ---

    async getAddOns(params?: {isActive?: boolean}) {
        const where: any = {deletedAt: null};
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.addOn.findMany({
            where,
            orderBy: {name: 'asc'},
        });
    }

    async createAddOn(data: {
        name: string;
        nameLocalized?: any;
        pricingMode: 'PER_DAY' | 'ONE_TIME' | 'MANUAL_QTY';
        unitPriceMinor: number;
        currency?: string;
        defaultQty?: string;
        qtyEditable?: boolean;
        isActive?: boolean;
    }) {
        return await prisma.addOn.create({
            data: {
                name: data.name,
                nameLocalized: data.nameLocalized || null,
                pricingMode: data.pricingMode,
                unitPriceMinor: data.unitPriceMinor,
                currency: data.currency || 'USD',
                defaultQty: data.defaultQty || null,
                qtyEditable: data.qtyEditable || false,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateAddOn(id: number, data: {
        name?: string;
        nameLocalized?: any;
        pricingMode?: 'PER_DAY' | 'ONE_TIME' | 'MANUAL_QTY';
        unitPriceMinor?: number;
        currency?: string;
        defaultQty?: string;
        qtyEditable?: boolean;
        isActive?: boolean;
    }) {
        return await prisma.addOn.update({
            where: {id},
            data,
        });
    }

    async softDeleteAddOn(id: number) {
        return await prisma.addOn.update({
            where: {id},
            data: {deletedAt: new Date(), isActive: false},
        });
    }

    // --- CoveragePackage CRUD ---

    async getCoveragePackages(params?: {isActive?: boolean}) {
        const where: any = {deletedAt: null};
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.coveragePackage.findMany({
            where,
            orderBy: {depositPercent: 'asc'},
        });
    }

    async createCoveragePackage(data: {
        name: string;
        nameLocalized?: any;
        depositPercent: number;
        description?: string;
        isActive?: boolean;
    }) {
        return await prisma.coveragePackage.create({
            data: {
                name: data.name,
                nameLocalized: data.nameLocalized || null,
                depositPercent: data.depositPercent,
                description: data.description || null,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateCoveragePackage(id: number, data: {
        name?: string;
        nameLocalized?: any;
        depositPercent?: number;
        description?: string;
        isActive?: boolean;
    }) {
        return await prisma.coveragePackage.update({
            where: {id},
            data,
        });
    }

    async softDeleteCoveragePackage(id: number) {
        return await prisma.coveragePackage.update({
            where: {id},
            data: {deletedAt: new Date(), isActive: false},
        });
    }
}

export default new PricingService();
