import {prisma} from '../utils';
import availabilityService from './availability.service';
import {formatConflicts} from './availability.service';

class ReservationService {
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
            prisma.reservation.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    client: {select: {id: true, firstName: true, lastName: true, phone: true}},
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    coveragePackage: {select: {id: true, name: true, depositPercent: true}},
                },
            }),
            prisma.reservation.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.reservation.findUnique({
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
                coveragePackage: true,
                reservationAddOns: {include: {addOn: true}},
                rental: true,
                transactions: {orderBy: {createdAt: 'desc'}},
                rentalRequest: true,
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
        coveragePackageId?: number;
        priceSnapshot?: any;
        deliveryFee?: number;
        deliveryCurrency?: string;
        rentalRequestId?: number;
    }) {
        const pickup = new Date(data.pickupDate);
        const ret = new Date(data.returnDate);

        if (ret <= pickup) {
            throw new Error('Дата повернення має бути пізніше дати видачі');
        }

        return await prisma.$transaction(async (tx) => {
            // Check for conflicts INSIDE the transaction to prevent race conditions
            const availability = await availabilityService.checkCarAvailability(
                data.carId,
                pickup,
                ret,
            );

            if (!availability.available) {
                throw new Error(
                    formatConflicts(availability.conflicts),
                );
            }

            return await tx.reservation.create({
            data: {
                clientId: data.clientId,
                carId: data.carId,
                pickupDate: pickup,
                returnDate: ret,
                pickupLocation: data.pickupLocation,
                returnLocation: data.returnLocation,
                coveragePackageId: data.coveragePackageId || null,
                priceSnapshot: data.priceSnapshot || {},
                deliveryFee: data.deliveryFee || 0,
                deliveryCurrency: data.deliveryCurrency || 'UAH',
                rentalRequestId: data.rentalRequestId || null,
            },
            include: {
                client: true,
                car: true,
                coveragePackage: true,
            },
            });
        });
    }

    async update(id: number, data: {
        pickupDate?: Date;
        returnDate?: Date;
        pickupLocation?: string;
        returnLocation?: string;
        coveragePackageId?: number;
        priceSnapshot?: any;
        deliveryFee?: number;
        deliveryCurrency?: string;
    }) {
        const reservation = await prisma.reservation.findUnique({where: {id}});
        if (!reservation) {
            throw new Error(`Reservation with id ${id} not found`);
        }

        // If dates changed, re-check conflicts
        const pickupDate = data.pickupDate ? new Date(data.pickupDate) : reservation.pickupDate;
        const returnDate = data.returnDate ? new Date(data.returnDate) : reservation.returnDate;

        const updateData: any = {};
        if (data.pickupDate) updateData.pickupDate = pickupDate;
        if (data.returnDate) updateData.returnDate = returnDate;
        if (data.pickupLocation !== undefined) updateData.pickupLocation = data.pickupLocation;
        if (data.returnLocation !== undefined) updateData.returnLocation = data.returnLocation;
        if (data.coveragePackageId !== undefined) updateData.coveragePackageId = data.coveragePackageId;
        if (data.priceSnapshot !== undefined) updateData.priceSnapshot = data.priceSnapshot;
        if (data.deliveryFee !== undefined) updateData.deliveryFee = data.deliveryFee;
        if (data.deliveryCurrency !== undefined) updateData.deliveryCurrency = data.deliveryCurrency;

        return await prisma.$transaction(async (tx) => {
            if (data.pickupDate || data.returnDate) {
                const availability = await availabilityService.checkCarAvailability(
                    reservation.carId,
                    pickupDate,
                    returnDate,
                    id, // exclude this reservation from conflict check
                );

                if (!availability.available) {
                    throw new Error(
                        formatConflicts(availability.conflicts),
                    );
                }
            }

            // Recalculate PER_DAY add-ons if dates changed
            if (data.pickupDate || data.returnDate) {
                const msPerDay = 24 * 60 * 60 * 1000;
                const newTotalDays = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / msPerDay));
                const addOns = await tx.reservationAddOn.findMany({
                    where: {reservationId: id},
                    include: {addOn: true},
                });
                for (const ra of addOns) {
                    if (ra.addOn.pricingMode === 'PER_DAY') {
                        await tx.reservationAddOn.update({
                            where: {id: ra.id},
                            data: {
                                quantity: newTotalDays,
                                totalMinor: ra.unitPriceMinor * newTotalDays,
                            },
                        });
                    }
                }
            }

            return await tx.reservation.update({
                where: {id},
                data: updateData,
                include: {
                    client: true,
                    car: true,
                    coveragePackage: true,
                    reservationAddOns: {include: {addOn: true}},
                },
            });
        });
    }

    async pickup(id: number, pickupData: {
        pickupOdometer?: number;
        contractNumber?: string;
    }) {
        const reservation = await prisma.reservation.findUnique({
            where: {id},
            include: {
                reservationAddOns: true,
                client: {select: {id: true, driverLicenseExpiry: true, firstName: true, lastName: true, isBlocked: true, blockReason: true}},
            },
        });

        if (!reservation) {
            throw new Error(`Reservation with id ${id} not found`);
        }

        if (reservation.status !== 'confirmed') {
            throw new Error(`Бронювання повинно мати статус "підтверджено". Поточний статус: ${reservation.status}`);
        }

        // Check if client is blocked
        if (reservation.client?.isBlocked) {
            const name = `${reservation.client.firstName} ${reservation.client.lastName}`.trim();
            const reason = reservation.client.blockReason ? `: ${reservation.client.blockReason}` : '';
            throw new Error(`Клієнт "${name}" заблокований${reason}. Видача неможлива.`);
        }

        // Warn if driver license is expired or expiring during rental
        const warnings: string[] = [];
        if (reservation.client?.driverLicenseExpiry) {
            const expiry = new Date(reservation.client.driverLicenseExpiry);
            const returnDate = new Date(reservation.returnDate);
            if (expiry < new Date()) {
                throw new Error(
                    `Посвідчення водія клієнта прострочене (закінчилось ${expiry.toLocaleDateString('uk-UA')}). Видача неможлива.`,
                );
            }
            if (expiry < returnDate) {
                warnings.push(`Посвідчення водія закінчується ${expiry.toLocaleDateString('uk-UA')}, до повернення авто.`);
            }
        }

        // Don't allow pickup before the reservation start date
        const now = new Date();
        const pickupDate = new Date(reservation.pickupDate);
        // Allow pickup from the start of the pickup day (not just the exact time)
        const pickupDay = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (today < pickupDay) {
            const fmtDt = pickupDate.toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'});
            throw new Error(`Видача можлива не раніше дати бронювання: ${fmtDt}`);
        }

        return await prisma.$transaction(async (tx) => {
            // Check for conflicts INSIDE the transaction to prevent race conditions
            const availability = await availabilityService.checkCarAvailability(
                reservation.carId,
                reservation.pickupDate,
                reservation.returnDate,
                id, // exclude this reservation
            );

            if (!availability.available) {
                throw new Error(
                    formatConflicts(availability.conflicts),
                );
            }
            // Update reservation status
            const updatedReservation = await tx.reservation.update({
                where: {id},
                data: {status: 'picked_up'},
            });

            // Create rental from reservation
            const rental = await tx.rental.create({
                data: {
                    reservationId: id,
                    clientId: reservation.clientId,
                    carId: reservation.carId,
                    pickupDate: reservation.pickupDate,
                    returnDate: reservation.returnDate,
                    pickupLocation: reservation.pickupLocation,
                    returnLocation: reservation.returnLocation,
                    pickupOdometer: pickupData.pickupOdometer || null,
                    contractNumber: pickupData.contractNumber || null,
                    priceSnapshot: reservation.priceSnapshot,
                    depositAmount: (reservation.priceSnapshot as any)?.depositAmount || 0,
                    // Copy add-ons from reservation to rental
                    rentalAddOns: reservation.reservationAddOns.length > 0
                        ? {
                            create: reservation.reservationAddOns.map((ra) => ({
                                addOnId: ra.addOnId,
                                quantity: ra.quantity,
                                unitPriceMinor: ra.unitPriceMinor,
                                currency: ra.currency,
                                totalMinor: ra.totalMinor,
                            })),
                        }
                        : undefined,
                },
                include: {
                    client: true,
                    car: true,
                    rentalAddOns: {include: {addOn: true}},
                    reservation: true,
                },
            });

            return {reservation: updatedReservation, rental, warnings};
        });
    }

    async cancel(id: number, reason: string) {
        return await prisma.reservation.update({
            where: {id},
            data: {
                status: 'cancelled',
                cancelReason: reason,
                cancelledAt: new Date(),
            },
        });
    }

    async noShow(id: number) {
        return await prisma.reservation.update({
            where: {id},
            data: {
                status: 'no_show',
                noShowAt: new Date(),
            },
        });
    }

    async reactivate(id: number) {
        const reservation = await prisma.reservation.findUnique({where: {id}});
        if (!reservation) {
            throw new Error(`Reservation with id ${id} not found`);
        }
        if (reservation.status !== 'no_show' && reservation.status !== 'cancelled') {
            throw new Error(`Можна реактивувати лише скасовані або no-show бронювання. Поточний статус: ${reservation.status}`);
        }

        // Check car availability for the original dates
        const availability = await availabilityService.checkCarAvailability(
            reservation.carId,
            reservation.pickupDate,
            reservation.returnDate,
            id,
        );
        if (!availability.available) {
            throw new Error(formatConflicts(availability.conflicts));
        }

        return await prisma.reservation.update({
            where: {id},
            data: {
                status: 'confirmed',
                cancelReason: null,
                cancelledAt: null,
                noShowAt: null,
            },
            include: {
                client: true,
                car: true,
                coveragePackage: true,
            },
        });
    }

    async addAddOn(
        reservationId: number,
        addOnId: number,
        quantity: number,
        unitPriceMinor: number,
        currency: string,
    ) {
        // Prevent duplicate add-ons on same reservation
        const existing = await prisma.reservationAddOn.findFirst({
            where: {reservationId, addOnId},
        });
        if (existing) {
            throw new Error('Эта услуга уже добавлена к бронированию');
        }

        // Enforce qty based on pricing mode
        const addOn = await prisma.addOn.findUnique({where: {id: addOnId}});
        if (!addOn) throw new Error('Услуга не найдена');

        let qty = quantity;
        if (addOn.pricingMode === 'ONE_TIME') {
            qty = 1;
        } else if (addOn.pricingMode === 'PER_DAY' && !addOn.qtyEditable) {
            qty = 1;
        }

        return await prisma.reservationAddOn.create({
            data: {
                reservationId,
                addOnId,
                quantity: qty,
                unitPriceMinor,
                currency,
                totalMinor: unitPriceMinor * qty,
            },
            include: {addOn: true},
        });
    }

    async removeAddOn(reservationAddOnId: number) {
        return await prisma.reservationAddOn.delete({
            where: {id: reservationAddOnId},
        });
    }
}

export default new ReservationService();
