import {prisma} from '../utils';
import availabilityService, {formatConflicts} from './availability.service';

class RentalService {
    async getAll(params: {
        page: number;
        limit: number;
        status?: string;
    }) {
        const {page, limit, status} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [items, total] = await Promise.all([
            prisma.rental.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    client: {select: {id: true, firstName: true, lastName: true, phone: true}},
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
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

        if (rental.status !== 'active') {
            throw new Error(`Rental must be in active status to complete. Current status: ${rental.status}`);
        }

        // Calculate overmileage if applicable
        let overmileageKm = 0;
        let overmileageFee = 0;

        if (rental.pickupOdometer && data.returnOdometer && rental.allowedMileage) {
            const drivenKm = data.returnOdometer - rental.pickupOdometer;
            overmileageKm = Math.max(0, drivenKm - rental.allowedMileage);

            if (overmileageKm > 0 && rental.car.segment.length > 0) {
                // Use the first segment's overmileage price
                const overmileagePrice = rental.car.segment[0].overmileagePrice;
                overmileageFee = Math.round(overmileageKm * overmileagePrice);
            }
        }

        return await prisma.$transaction(async (tx) => {
            const updatedRental = await tx.rental.update({
                where: {id},
                data: {
                    status: 'completed',
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
                const msPerDay = 24 * 60 * 60 * 1000;
                const lateDays = Math.ceil((actualReturn.getTime() - expectedReturn.getTime()) / msPerDay);
                // Use daily rate from priceSnapshot
                const ps = rental.priceSnapshot as any;
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
                    status: 'cancelled',
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
                    depositTransaction = await tx.transaction.create({
                        data: {
                            type: 'deposit_returned',
                            accountId: depositAccountId,
                            direction: 'out',
                            amountMinor: rental.depositAmount,
                            currency: rental.depositCurrency,
                            fxRate: 1.0,
                            amountUahMinor: rental.depositAmount,
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

    async extend(id: number, newReturnDate: Date, reason?: string) {
        const rental = await prisma.rental.findUnique({where: {id}});

        if (!rental) {
            throw new Error(`Rental with id ${id} not found`);
        }

        if (rental.status !== 'active') {
            throw new Error(`Rental must be in active status to extend. Current status: ${rental.status}`);
        }

        const newReturnDateObj = new Date(newReturnDate);
        const oldReturnDate = rental.returnDate;

        if (newReturnDateObj <= oldReturnDate) {
            throw new Error('New return date must be after the current return date');
        }

        // Calculate extra days
        const msPerDay = 24 * 60 * 60 * 1000;
        const extraDays = Math.ceil((newReturnDateObj.getTime() - oldReturnDate.getTime()) / msPerDay);

        // Get daily rate from price snapshot
        const priceSnapshot = rental.priceSnapshot as any;
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

            return {rental: updatedRental, extension};
        });
    }
}

export default new RentalService();
