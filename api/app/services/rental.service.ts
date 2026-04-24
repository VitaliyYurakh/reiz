import {prisma, MS_PER_DAY, RentalStatus, BadRequestError} from '../utils';
import {PriceSnapshot} from '../types/dto.types';
import availabilityService, {formatConflicts} from './availability.service';
import fxRateService from './fx-rate.service';

class RentalService {
    async getAll(params: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
    }) {
        const {page, limit, status, search} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status === 'cancellation_requested') {
            where.cancellationRequestedAt = {not: null};
            where.status = 'active';
        } else if (status) {
            where.status = status;
        }

        const trimmed = search?.trim();
        if (trimmed) {
            // Case-insensitive OR over contract, client, and car identifiers (audit H-7).
            where.OR = [
                {contractNumber: {contains: trimmed, mode: 'insensitive'}},
                {client: {firstName: {contains: trimmed, mode: 'insensitive'}}},
                {client: {lastName: {contains: trimmed, mode: 'insensitive'}}},
                {client: {phone: {contains: trimmed, mode: 'insensitive'}}},
                {car: {brand: {contains: trimmed, mode: 'insensitive'}}},
                {car: {model: {contains: trimmed, mode: 'insensitive'}}},
                {car: {plateNumber: {contains: trimmed, mode: 'insensitive'}}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.rental.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    client: {select: {id: true, firstName: true, lastName: true, phone: true}},
                    car: {
                        select: {
                            id: true, brand: true, model: true, plateNumber: true,
                            partner: {select: {id: true, fullName: true, companyName: true}},
                        },
                    },
                },
            }),
            prisma.rental.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.rental.findUnique({
            where: {id},
            include: {
                client: true,
                car: {
                    include: {
                        carPhoto: true,
                        rentalTariff: true,
                        segment: true,
                        partner: {select: {id: true, fullName: true, companyName: true}},
                    },
                },
                reservation: {
                    include: {
                        reservationAddOns: {include: {addOn: true}},
                        coveragePackage: true,
                    },
                },
                rentalAddOns: {include: {addOn: true}},
                rentalExtensions: {orderBy: {createdAt: 'desc'}},
                inspections: {
                    orderBy: {createdAt: 'desc'},
                    include: {photos: true},
                },
                fines: {orderBy: {createdAt: 'desc'}},
                transactions: {orderBy: {createdAt: 'desc'}},
                documents: {orderBy: {generatedAt: 'desc'}},
            },
        });
    }

    async create(data: {
        clientId: number;
        carId: number;
        pickupDate: Date;
        returnDate: Date;
        pickupLocation: string;
        returnLocation: string;
        pickupOdometer?: number;
        contractNumber?: string;
        priceSnapshot: any;
        depositAmount?: number;
        depositCurrency?: string;
        allowedMileage?: number;
        notes?: string;
    }) {
        return await prisma.$transaction(async (tx) => {
            // Check for conflicts INSIDE the transaction to prevent race conditions
            const availability = await availabilityService.checkCarAvailability(
                data.carId,
                new Date(data.pickupDate),
                new Date(data.returnDate),
            );

            if (!availability.available) {
                throw new Error(
                    formatConflicts(availability.conflicts),
                );
            }

            return await tx.rental.create({
                data: {
                    clientId: data.clientId,
                    carId: data.carId,
                    pickupDate: new Date(data.pickupDate),
                    returnDate: new Date(data.returnDate),
                    pickupLocation: data.pickupLocation,
                    returnLocation: data.returnLocation,
                    pickupOdometer: data.pickupOdometer || null,
                    contractNumber: data.contractNumber || null,
                    priceSnapshot: data.priceSnapshot,
                    depositAmount: data.depositAmount || 0,
                    depositCurrency: data.depositCurrency || 'UAH',
                    allowedMileage: data.allowedMileage || null,
                    notes: data.notes || null,
                },
                include: {
                    client: true,
                    car: true,
                },
            });
        });
    }

    async update(id: number, data: {
        pickupOdometer?: number;
        returnOdometer?: number;
        allowedMileage?: number;
        notes?: string;
        depositAmount?: number;
        depositCurrency?: string;
        depositReturned?: boolean;
        pickupLocation?: string;
        returnLocation?: string;
    }) {
        return await prisma.rental.update({
            where: {id},
            data,
        });
    }

    async complete(id: number, data: {
        returnOdometer: number;
        actualReturnDate: Date;
    }) {
        const rental = await prisma.rental.findUnique({
            where: {id},
            include: {car: {include: {segment: true}}},
        });

        if (!rental) {
            throw new Error(`Rental with id ${id} not found`);
        }

        if (rental.status !== RentalStatus.ACTIVE) {
            throw new Error(`Rental must be in active status to complete. Current status: ${rental.status}`);
        }

        // Calculate overmileage if applicable
        let overmileageKm = 0;
        let overmileageFee = 0;

        if (rental.pickupOdometer && data.returnOdometer && rental.allowedMileage) {
            const drivenKm = data.returnOdometer - rental.pickupOdometer;
            overmileageKm = Math.max(0, drivenKm - rental.allowedMileage);

            if (overmileageKm > 0) {
                // Prefer per-car override, fall back to first segment's legacy rate
                // (audit H-13). Many-to-many segment order is non-deterministic, so
                // relying on segment[0] alone was effectively random.
                const overmileagePrice =
                    rental.car.overmileagePrice ?? rental.car.segment[0]?.overmileagePrice;
                if (overmileagePrice != null) {
                    overmileageFee = Math.round(overmileageKm * overmileagePrice);
                }
            }
        }

        return await prisma.$transaction(async (tx) => {
            const updatedRental = await tx.rental.update({
                where: {id},
                data: {
                    status: RentalStatus.COMPLETED,
                    returnOdometer: data.returnOdometer,
                    actualReturnDate: new Date(data.actualReturnDate),
                },
                include: {
                    client: true,
                    car: true,
                },
            });

            // Auto-create OVERMILEAGE fine if applicable
            let overmileageFineRecord = null;
            if (overmileageFee > 0) {
                overmileageFineRecord = await tx.fine.create({
                    data: {
                        rentalId: id,
                        type: 'OVERMILEAGE',
                        description: `Перевищення пробігу на ${overmileageKm} км (дозволено: ${rental.allowedMileage} км, фактично: ${data.returnOdometer - (rental.pickupOdometer || 0)} км)`,
                        amountMinor: overmileageFee,
                        currency: 'UAH',
                    },
                });
            }

            // Calculate late return days and auto-create fine
            let lateReturnFine = null;
            const actualReturn = new Date(data.actualReturnDate);
            const expectedReturn = rental.returnDate;
            if (actualReturn > expectedReturn) {
                const lateDays = Math.ceil((actualReturn.getTime() - expectedReturn.getTime()) / MS_PER_DAY);
                // Use daily rate from priceSnapshot
                const ps = rental.priceSnapshot as PriceSnapshot;
                const dailyRate = ps?.dailyRateMinor || ps?.dailyRate || 0;
                if (lateDays > 0 && dailyRate > 0) {
                    const lateFee = dailyRate * lateDays;
                    lateReturnFine = await tx.fine.create({
                        data: {
                            rentalId: id,
                            type: 'LATE_RETURN',
                            description: `Прострочене повернення на ${lateDays} дн. (очікувалось: ${expectedReturn.toLocaleDateString('uk-UA')})`,
                            amountMinor: lateFee,
                            currency: (ps?.currency || 'UAH'),
                        },
                    });
                }
            }

            // Increment client loyalty counters. Aggregate in UAH копійки
            // (amountUahMinor) so multi-currency rentals sum into a single
            // comparable field, and exclude deposits — they are client money
            // held on our side, not lifetime spend. Matches NON_REVENUE_TYPES
            // used by the dashboard revenue aggregation.
            const totalPaid = await tx.transaction.aggregate({
                where: {
                    rentalId: id,
                    direction: 'in',
                    type: {notIn: ['DEPOSIT_RECEIVED', 'DEPOSIT_RETURNED']},
                },
                _sum: {amountUahMinor: true},
            });

            await tx.client.update({
                where: {id: rental.clientId},
                data: {
                    totalCompletedRentals: {increment: 1},
                    totalSpentMinor: {increment: totalPaid._sum.amountUahMinor || 0},
                },
            });

            return {
                rental: updatedRental,
                overmileageFine: overmileageFineRecord,
                lateReturnFine,
            };
        });
    }

    async cancel(id: number, reason: string, depositAccountId?: number) {
        const rental = await prisma.rental.findUnique({
            where: {id},
            include: {client: {select: {id: true}}},
        });

        if (!rental) {
            throw new Error(`Rental with id ${id} not found`);
        }

        return await prisma.$transaction(async (tx) => {
            const updatedRental = await tx.rental.update({
                where: {id},
                data: {
                    status: RentalStatus.CANCELLED,
                    cancelReason: reason,
                },
            });

            // Auto-return deposit if it was received but not yet returned
            let depositTransaction = null;
            if (rental.depositAmount > 0 && !rental.depositReturned) {
                await tx.rental.update({
                    where: {id},
                    data: {depositReturned: true},
                });

                if (depositAccountId) {
                    // Verify that the account's currency matches the deposit's currency.
                    // Otherwise amountMinor (stored per-account in its native currency)
                    // would corrupt the account balance — e.g. putting USD cents on a
                    // UAH cash drawer so `getAccountBalances` would read -20000 USD cents
                    // as if they were копійки.
                    const depAcc = await tx.account.findUnique({where: {id: depositAccountId}});
                    if (!depAcc || !depAcc.isActive) {
                        throw new BadRequestError(`Повернення застави: рахунок #${depositAccountId} не активний або не існує.`);
                    }
                    if (depAcc.currency !== rental.depositCurrency) {
                        throw new BadRequestError(
                            `Повернення застави: валюта рахунку "${depAcc.name}" (${depAcc.currency}) не збігається з валютою застави (${rental.depositCurrency}).`,
                        );
                    }

                    // Resolve fxRate for UAH normalization. Prefer the rate used when
                    // the deposit was originally received (so we "refund at the same rate"
                    // and the account's UAH-normalized balance nets to zero). Fall back to
                    // today's NBU rate, then 1.0 if the currency is UAH.
                    let fxRate = 1.0;
                    if (rental.depositCurrency !== 'UAH') {
                        const originalDeposit = await tx.transaction.findFirst({
                            where: {rentalId: id, type: 'DEPOSIT_RECEIVED'},
                            orderBy: {createdAt: 'asc'},
                        });
                        if (originalDeposit) {
                            fxRate = originalDeposit.fxRate;
                        } else {
                            const nbu = await fxRateService.getRate(rental.depositCurrency);
                            if (!nbu) {
                                throw new BadRequestError(
                                    `Неможливо визначити курс ${rental.depositCurrency} → UAH для повернення застави. Задайте курс вручну у /admin/finance.`,
                                );
                            }
                            fxRate = nbu.rate;
                        }
                    }

                    const amountUahMinor = rental.depositCurrency === 'UAH'
                        ? rental.depositAmount
                        : Math.round(rental.depositAmount * fxRate);

                    depositTransaction = await tx.transaction.create({
                        data: {
                            type: 'DEPOSIT_RETURNED',
                            accountId: depositAccountId,
                            direction: 'out',
                            amountMinor: rental.depositAmount,
                            currency: rental.depositCurrency,
                            fxRate,
                            amountUahMinor,
                            description: `Повернення застави за скасовану оренду #${id}`,
                            clientId: rental.clientId,
                            rentalId: id,
                        },
                    });
                }
            }

            return {rental: updatedRental, depositTransaction};
        });
    }

    async extend(
        id: number,
        newReturnDate: Date,
        reason?: string,
        paymentOptions?: {accountId?: number; fxRate?: number; skipPayment?: boolean},
    ) {
        const rental = await prisma.rental.findUnique({where: {id}});

        if (!rental) {
            throw new Error(`Rental with id ${id} not found`);
        }

        if (rental.status !== RentalStatus.ACTIVE) {
            throw new Error(`Rental must be in active status to extend. Current status: ${rental.status}`);
        }

        const newReturnDateObj = new Date(newReturnDate);
        const oldReturnDate = rental.returnDate;

        if (newReturnDateObj <= oldReturnDate) {
            throw new Error('New return date must be after the current return date');
        }

        // Calculate extra days
        const extraDays = Math.ceil((newReturnDateObj.getTime() - oldReturnDate.getTime()) / MS_PER_DAY);

        // Get daily rate from price snapshot
        const priceSnapshot = rental.priceSnapshot as PriceSnapshot;
        const dailyRateMinor = priceSnapshot?.dailyRateMinor || priceSnapshot?.dailyRate || 0;
        const currency = priceSnapshot?.currency || 'USD';
        const totalMinor = dailyRateMinor * extraDays;

        return await prisma.$transaction(async (tx) => {
            // Check availability INSIDE the transaction to prevent race conditions
            const availability = await availabilityService.checkCarAvailability(
                rental.carId,
                oldReturnDate,
                newReturnDateObj,
                undefined,
                id, // exclude this rental from conflict check
            );

            if (!availability.available) {
                throw new Error(
                    formatConflicts(availability.conflicts),
                );
            }
            // Create extension record
            const extension = await tx.rentalExtension.create({
                data: {
                    rentalId: id,
                    oldReturnDate,
                    newReturnDate: newReturnDateObj,
                    extraDays,
                    dailyRateMinor,
                    currency,
                    totalMinor,
                    reason: reason || null,
                },
            });

            // Auto-create EXTENSION_PAYMENT transaction so the extension's revenue
            // flows into the dashboard / reports just like the pickup PAYMENT does.
            // Without this, extending an active rental was silently invisible to
            // Revenue-this-month and the per-rental payments balance.
            let extensionTransaction = null;
            const shouldRecordPayment = !paymentOptions?.skipPayment && totalMinor > 0;
            if (shouldRecordPayment) {
                let accountId = paymentOptions?.accountId;
                if (accountId) {
                    // Verify admin-picked account's currency matches the extension's currency.
                    const acc = await tx.account.findUnique({where: {id: accountId}});
                    if (!acc || !acc.isActive) {
                        throw new BadRequestError(`Продовження: рахунок #${accountId} не активний або не існує.`);
                    }
                    if (acc.currency !== currency) {
                        throw new BadRequestError(
                            `Продовження: валюта рахунку "${acc.name}" (${acc.currency}) не збігається з валютою оренди (${currency}).`,
                        );
                    }
                } else {
                    const defaultAccount = await tx.account.findFirst({
                        where: {currency, isActive: true},
                        orderBy: {id: 'asc'},
                    });
                    if (!defaultAccount) {
                        throw new BadRequestError(
                            `Продовження: немає активного рахунку у валюті ${currency}. Створіть його у /admin/finance або передайте skipPayment=true.`,
                        );
                    }
                    accountId = defaultAccount.id;
                }

                let fxRate = 1.0;
                if (paymentOptions?.fxRate != null && paymentOptions.fxRate > 0) {
                    fxRate = paymentOptions.fxRate;
                } else if (currency !== 'UAH') {
                    const nbu = await fxRateService.getRate(currency);
                    if (!nbu) {
                        throw new BadRequestError(
                            `Продовження: не вдалося визначити курс ${currency}→UAH. Задайте курс вручну.`,
                        );
                    }
                    fxRate = nbu.rate;
                }
                const amountUahMinor = currency === 'UAH'
                    ? totalMinor
                    : Math.round(totalMinor * fxRate);

                extensionTransaction = await tx.transaction.create({
                    data: {
                        type: 'EXTENSION_PAYMENT',
                        accountId,
                        direction: 'in',
                        amountMinor: totalMinor,
                        currency,
                        fxRate,
                        amountUahMinor,
                        description: `Оплата продовження оренди #${id} (+${extraDays} дн.)`,
                        clientId: rental.clientId,
                        rentalId: id,
                    },
                });
            }

            // Update rental return date
            const updatedRental = await tx.rental.update({
                where: {id},
                data: {returnDate: newReturnDateObj},
                include: {
                    client: true,
                    car: true,
                    rentalExtensions: {orderBy: {createdAt: 'desc'}},
                },
            });

            return {rental: updatedRental, extension, transaction: extensionTransaction};
        });
    }
}

export default new RentalService();
