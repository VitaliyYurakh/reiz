import {prisma} from '../utils';
import availabilityService, {formatConflicts} from './availability.service';
import clientService from './client.service';

class RentalRequestService {
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
            prisma.rentalRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    client: {select: {id: true, firstName: true, lastName: true, phone: true}},
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    assignedTo: {select: {id: true, email: true}},
                },
            }),
            prisma.rentalRequest.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.rentalRequest.findUnique({
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
                bookingRequest: true,
                reservation: {
                    include: {
                        reservationAddOns: {include: {addOn: true}},
                    },
                },
                assignedTo: {select: {id: true, email: true}},
            },
        });
    }

    async create(data: {
        source?: string;
        status?: string;
        clientId?: number;
        carId?: number;
        firstName?: string;
        lastName?: string;
        phone?: string;
        email?: string;
        pickupLocation?: string;
        returnLocation?: string;
        pickupDate?: Date;
        returnDate?: Date;
        flightNumber?: string;
        comment?: string;
        websiteSnapshot?: any;
        assignedToUserId?: number;
    }) {
        return await prisma.rentalRequest.create({data});
    }

    async update(id: number, data: {
        status?: string;
        clientId?: number;
        carId?: number;
        firstName?: string;
        lastName?: string;
        phone?: string;
        email?: string;
        pickupLocation?: string;
        returnLocation?: string;
        pickupDate?: Date;
        returnDate?: Date;
        flightNumber?: string;
        comment?: string;
        assignedToUserId?: number;
        rejectionReason?: string;
    }) {
        return await prisma.rentalRequest.update({
            where: {id},
            data,
        });
    }

    async approve(id: number, approvalData: {
        clientId?: number;
        carId: number;
        pickupDate: string | Date;
        returnDate: string | Date;
        pickupLocation?: string;
        returnLocation?: string;
        coveragePackageId?: number;
        addOns?: Array<{addOnId: number; quantity: number; unitPriceMinor: number; currency: string}>;
        deliveryFee?: number;
        priceSnapshot?: any;
    }) {
        const {
            carId,
            coveragePackageId,
            addOns,
            deliveryFee,
            priceSnapshot,
        } = approvalData;

        const pickup = new Date(approvalData.pickupDate);
        const ret = new Date(approvalData.returnDate);

        if (ret <= pickup) {
            throw new Error('Дата повернення має бути пізніше дати видачі');
        }

        const pickupLoc = approvalData.pickupLocation || '';
        const returnLoc = approvalData.returnLocation || '';

        return await prisma.$transaction(async (tx) => {
            // Fetch request and check status
            const req = await tx.rentalRequest.findUnique({where: {id}});
            if (!req) throw new Error('Rental request not found');
            if (req.status === 'approved') throw new Error('Request is already approved');

            // Check for conflicts INSIDE the transaction to prevent race conditions
            const availability = await availabilityService.checkCarAvailability(
                carId,
                pickup,
                ret,
            );
            if (!availability.available) {
                throw new Error(formatConflicts(availability.conflicts));
            }

            // Build priceSnapshot from websiteSnapshot if not provided explicitly
            let snapshot = priceSnapshot;
            if (!snapshot) {
                const ws = req.websiteSnapshot as Record<string, any> | null;
                if (ws && ws.priceBreakdown) {
                    snapshot = {
                        ...ws.priceBreakdown,
                        totalDays: ws.totalDays,
                        ratePlanName: ws.selectedPlan?.name,
                        approvedAt: new Date().toISOString(),
                    };
                } else {
                    snapshot = {
                        approvedAt: new Date().toISOString(),
                        pickupDate: pickup.toISOString(),
                        returnDate: ret.toISOString(),
                    };
                }
            }

            // Resolve coveragePackageId from websiteSnapshot if not provided
            // selectedPlan.id is a CarCountingRule, not CoveragePackage — match by depositPercent
            let resolvedCoverageId = coveragePackageId || null;
            if (!resolvedCoverageId) {
                const ws = req.websiteSnapshot as Record<string, any> | null;
                const depPercent = ws?.selectedPlan?.depositPercent;
                if (depPercent != null) {
                    const pkg = await tx.coveragePackage.findFirst({
                        where: {depositPercent: depPercent, isActive: true, deletedAt: null},
                    });
                    if (pkg) resolvedCoverageId = pkg.id;
                }
            }

            // Resolve or auto-create client (with deduplication)
            let resolvedClientId = approvalData.clientId;
            if (!resolvedClientId) {
                const {client} = await clientService.findOrCreate({
                    firstName: req.firstName || 'Unknown',
                    lastName: req.lastName || '',
                    phone: req.phone || '',
                    email: req.email || null,
                    source: req.source || 'website',
                }, tx);
                resolvedClientId = client.id;
            }

            // Check if client is blocked
            const clientRecord = await tx.client.findUnique({
                where: {id: resolvedClientId},
                select: {isBlocked: true, blockReason: true, firstName: true, lastName: true},
            });
            if (clientRecord?.isBlocked) {
                const name = `${clientRecord.firstName} ${clientRecord.lastName}`.trim();
                const reason = clientRecord.blockReason ? `: ${clientRecord.blockReason}` : '';
                throw new Error(`Клієнт "${name}" заблокований${reason}. Зніміть блокування перед схваленням.`);
            }

            const rentalRequest = await tx.rentalRequest.update({
                where: {id},
                data: {
                    status: 'approved',
                    clientId: resolvedClientId,
                    carId,
                    pickupDate: pickup,
                    returnDate: ret,
                    pickupLocation: pickupLoc,
                    returnLocation: returnLoc,
                },
            });

            const reservation = await tx.reservation.create({
                data: {
                    rentalRequestId: id,
                    clientId: resolvedClientId,
                    carId,
                    pickupDate: pickup,
                    returnDate: ret,
                    pickupLocation: pickupLoc,
                    returnLocation: returnLoc,
                    coveragePackageId: resolvedCoverageId,
                    deliveryFee: deliveryFee || 0,
                    priceSnapshot: snapshot,
                    reservationAddOns: addOns && addOns.length > 0
                        ? {
                            create: addOns.map((a) => ({
                                addOnId: a.addOnId,
                                quantity: a.quantity,
                                unitPriceMinor: a.unitPriceMinor,
                                currency: a.currency,
                                totalMinor: a.unitPriceMinor * a.quantity,
                            })),
                        }
                        : undefined,
                },
                include: {
                    reservationAddOns: {include: {addOn: true}},
                    client: true,
                    car: true,
                },
            });

            return {rentalRequest, reservation};
        });
    }

    async reject(id: number, reason: string) {
        return await prisma.rentalRequest.update({
            where: {id},
            data: {
                status: 'rejected',
                rejectionReason: reason,
            },
        });
    }

    async cancel(id: number) {
        return await prisma.rentalRequest.update({
            where: {id},
            data: {status: 'cancelled'},
        });
    }

    async createFromBookingRequest(bookingRequestId: number) {
        const bookingRequest = await prisma.bookingRequest.findUnique({
            where: {id: bookingRequestId},
        });

        if (!bookingRequest) {
            throw new Error(`BookingRequest with id ${bookingRequestId} not found`);
        }

        return await prisma.rentalRequest.create({
            data: {
                source: 'website',
                status: 'new',
                bookingRequestId: bookingRequest.id,
                carId: bookingRequest.carId,
                firstName: bookingRequest.firstName,
                lastName: bookingRequest.lastName,
                phone: bookingRequest.phone,
                email: bookingRequest.email,
                pickupLocation: bookingRequest.pickupLocation,
                returnLocation: bookingRequest.returnLocation,
                pickupDate: bookingRequest.startDate,
                returnDate: bookingRequest.endDate,
                flightNumber: bookingRequest.flightNumber,
                comment: bookingRequest.comment,
                websiteSnapshot: {
                    carDetails: bookingRequest.carDetails,
                    selectedPlan: bookingRequest.selectedPlan,
                    selectedExtras: bookingRequest.selectedExtras,
                    totalDays: bookingRequest.totalDays,
                    priceBreakdown: bookingRequest.priceBreakdown,
                },
            },
            include: {
                bookingRequest: true,
                car: true,
            },
        });
    }
}

export default new RentalRequestService();
