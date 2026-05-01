import {AccidentStatus as PAccidentStatus, AccidentFault as PAccidentFault, Currency} from '@prisma/client';
import {prisma, BadRequestError, NotFoundError} from '../utils';
import {AccidentStatus, AccidentFault, ACCIDENT_OPEN_STATUSES, ACCIDENT_TERMINAL_STATUSES} from '../utils/constants';

interface CreateAccidentInput {
    carId: number;
    rentalId?: number;
    clientId?: number;
    reporterUserId?: number;
    incidentAt: string | Date;
    location?: string;
    description: string;
    fault?: PAccidentFault;
    status?: PAccidentStatus;
    policeReportNumber?: string;
    insuranceCompany?: string;
    insuranceClaimNumber?: string;
    expertVisitAt?: string | Date;
    expertNotes?: string;
    estimatedDamageMinor?: number;
    insurancePayoutMinor?: number;
    clientDebtMinor?: number;
    currency?: Currency;
    blocksCar?: boolean;
    attachments?: string[];
    notes?: string;
}

class AccidentService {
    async list(params: {page: number; limit: number; status?: string; carId?: number; clientId?: number; search?: string}) {
        const {page, limit, status, carId, clientId, search} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status === 'open') where.status = {in: ACCIDENT_OPEN_STATUSES};
        else if (status === 'closed') where.status = {in: ACCIDENT_TERMINAL_STATUSES};
        else if (status) where.status = status;
        if (carId) where.carId = carId;
        if (clientId) where.clientId = clientId;
        if (search?.trim()) {
            const q = search.trim();
            where.OR = [
                {description: {contains: q, mode: 'insensitive'}},
                {location: {contains: q, mode: 'insensitive'}},
                {policeReportNumber: {contains: q, mode: 'insensitive'}},
                {insuranceClaimNumber: {contains: q, mode: 'insensitive'}},
                {insuranceCompany: {contains: q, mode: 'insensitive'}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.accident.findMany({
                where,
                skip,
                take: limit,
                orderBy: {incidentAt: 'desc'},
                include: {
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    client: {select: {id: true, firstName: true, lastName: true, phone: true}},
                    rental: {select: {id: true, contractNumber: true}},
                },
            }),
            prisma.accident.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.accident.findUnique({
            where: {id},
            include: {
                car: true,
                client: true,
                rental: {select: {id: true, contractNumber: true, pickupDate: true, returnDate: true}},
                reporter: {select: {id: true, name: true, email: true}},
                linkedFine: true,
            },
        });
    }

    async create(data: CreateAccidentInput) {
        const car = await prisma.car.findUnique({where: {id: data.carId}, select: {id: true, isBlocked: true}});
        if (!car) throw new NotFoundError(`Car ${data.carId} not found`);

        const blocksCar = data.blocksCar !== false;
        const status = data.status || AccidentStatus.REPORTED;
        const fault = data.fault || AccidentFault.UNKNOWN;
        const currency = data.currency || 'UAH';
        const clientDebt = data.clientDebtMinor ?? 0;

        return await prisma.$transaction(async (tx) => {
            const accident = await tx.accident.create({
                data: {
                    carId: data.carId,
                    rentalId: data.rentalId ?? null,
                    clientId: data.clientId ?? null,
                    reporterUserId: data.reporterUserId ?? null,
                    incidentAt: new Date(data.incidentAt),
                    location: data.location ?? null,
                    description: data.description,
                    fault,
                    status,
                    policeReportNumber: data.policeReportNumber ?? null,
                    insuranceCompany: data.insuranceCompany ?? null,
                    insuranceClaimNumber: data.insuranceClaimNumber ?? null,
                    expertVisitAt: data.expertVisitAt ? new Date(data.expertVisitAt) : null,
                    expertNotes: data.expertNotes ?? null,
                    estimatedDamageMinor: data.estimatedDamageMinor ?? null,
                    insurancePayoutMinor: data.insurancePayoutMinor ?? null,
                    clientDebtMinor: clientDebt,
                    currency,
                    blocksCar,
                    attachments: (data.attachments ?? []) as any,
                    notes: data.notes ?? null,
                },
            });

            // Auto-block the car while case is open.
            if (blocksCar && !car.isBlocked) {
                await tx.car.update({
                    where: {id: data.carId},
                    data: {isBlocked: true, blockReason: `Accident #${accident.id}`},
                });
            }

            // If fault=CLIENT and we have a Rental → auto-create a Fine for the
            // uninsured loss so the debt is visible in the standard fine ledger.
            if (fault === AccidentFault.CLIENT && data.rentalId && clientDebt > 0) {
                const fine = await tx.fine.create({
                    data: {
                        rentalId: data.rentalId,
                        type: 'ACCIDENT',
                        description: `ДТП ${new Date(data.incidentAt).toISOString().slice(0, 10)}: ${data.description.slice(0, 200)}`,
                        amountMinor: clientDebt,
                        currency,
                        externalCaseNumber: data.policeReportNumber ?? null,
                        incidentAt: new Date(data.incidentAt),
                        location: data.location ?? null,
                    },
                });
                await tx.accident.update({where: {id: accident.id}, data: {linkedFineId: fine.id}});
                return await tx.accident.findUnique({where: {id: accident.id}, include: {linkedFine: true}});
            }

            return accident;
        });
    }

    async update(id: number, data: any) {
        const existing = await prisma.accident.findUnique({where: {id}});
        if (!existing) throw new NotFoundError(`Accident ${id} not found`);

        const movingToClosed =
            data.status &&
            (ACCIDENT_TERMINAL_STATUSES as readonly string[]).includes(data.status) &&
            !(ACCIDENT_TERMINAL_STATUSES as readonly string[]).includes(existing.status);

        return await prisma.$transaction(async (tx) => {
            const updateData: any = {};
            for (const k of [
                'location', 'description', 'fault', 'status',
                'policeReportNumber', 'insuranceCompany', 'insuranceClaimNumber',
                'expertNotes', 'estimatedDamageMinor', 'insurancePayoutMinor',
                'clientDebtMinor', 'currency', 'blocksCar', 'notes',
            ] as const) {
                if (data[k] !== undefined) updateData[k] = data[k];
            }
            if (data.incidentAt) updateData.incidentAt = new Date(data.incidentAt as any);
            if (data.expertVisitAt !== undefined) {
                updateData.expertVisitAt = data.expertVisitAt ? new Date(data.expertVisitAt as any) : null;
            }
            if (data.attachments !== undefined) updateData.attachments = data.attachments as any;

            if (movingToClosed) {
                updateData.resolvedAt = new Date();
                // If this accident was the reason the car was blocked, unblock it.
                const car = await tx.car.findUnique({
                    where: {id: existing.carId},
                    select: {isBlocked: true, blockReason: true},
                });
                if (car?.isBlocked && car.blockReason === `Accident #${existing.id}`) {
                    // Only auto-unblock if no other open accident still blocks the car.
                    const other = await tx.accident.count({
                        where: {
                            carId: existing.carId,
                            id: {not: existing.id},
                            status: {in: ACCIDENT_OPEN_STATUSES},
                            blocksCar: true,
                        },
                    });
                    if (other === 0) {
                        await tx.car.update({
                            where: {id: existing.carId},
                            data: {isBlocked: false, blockReason: null},
                        });
                    }
                }
            }

            return await tx.accident.update({
                where: {id},
                data: updateData,
                include: {car: true, client: true, rental: true, linkedFine: true},
            });
        });
    }

    async delete(id: number) {
        const existing = await prisma.accident.findUnique({where: {id}, select: {id: true, carId: true, blocksCar: true, status: true, linkedFineId: true}});
        if (!existing) throw new NotFoundError(`Accident ${id} not found`);

        return await prisma.$transaction(async (tx) => {
            // Detach the linked Fine first so we keep the financial record but
            // remove the @unique back-pointer that would otherwise prevent re-link.
            if (existing.linkedFineId) {
                await tx.accident.update({where: {id}, data: {linkedFineId: null}});
            }
            await tx.accident.delete({where: {id}});
            // Unblock car if this was the only thing keeping it blocked.
            const car = await tx.car.findUnique({where: {id: existing.carId}, select: {blockReason: true}});
            if (car?.blockReason === `Accident #${id}`) {
                await tx.car.update({where: {id: existing.carId}, data: {isBlocked: false, blockReason: null}});
            }
        });
    }

    async stats() {
        const [open, awaitingPayout, resolvedThisMonth, totalDebt] = await Promise.all([
            prisma.accident.count({where: {status: {in: ACCIDENT_OPEN_STATUSES}}}),
            prisma.accident.count({where: {status: AccidentStatus.AWAITING_PAYOUT}}),
            prisma.accident.count({
                where: {
                    status: {in: ACCIDENT_TERMINAL_STATUSES},
                    resolvedAt: {gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)},
                },
            }),
            prisma.accident.aggregate({
                where: {status: {in: ACCIDENT_OPEN_STATUSES}},
                _sum: {clientDebtMinor: true},
            }),
        ]);
        return {
            open,
            awaitingPayout,
            resolvedThisMonth,
            outstandingClientDebtMinor: totalDebt._sum.clientDebtMinor ?? 0,
        };
    }
}

export default new AccidentService();
