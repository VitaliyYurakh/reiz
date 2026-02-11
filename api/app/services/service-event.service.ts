import {prisma} from '../utils';
import availabilityService, {formatConflicts} from './availability.service';

class ServiceEventService {
    async getAll(params: {
        page: number;
        limit: number;
        carId?: number;
        from?: string | Date;
        to?: string | Date;
    }) {
        const {page, limit, carId, from, to} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (carId) where.carId = carId;
        if (from || to) {
            where.startDate = {};
            if (from) where.startDate.gte = new Date(from);
            if (to) where.startDate.lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            prisma.serviceEvent.findMany({
                where,
                skip,
                take: limit,
                orderBy: {startDate: 'desc'},
                include: {
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                },
            }),
            prisma.serviceEvent.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.serviceEvent.findUnique({
            where: {id},
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });
    }

    async create(data: {
        carId: number;
        type: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        blocksBooking?: boolean;
        costMinor?: number;
        currency?: string;
        odometer?: number;
        vendor?: string;
        notes?: string;
    }) {
        // If the event blocks booking, check for conflicts
        const blocksBooking = data.blocksBooking !== undefined ? data.blocksBooking : true;

        if (blocksBooking) {
            const endDate = data.endDate ? new Date(data.endDate) : new Date('2099-12-31');
            const availability = await availabilityService.checkCarAvailability(
                data.carId,
                new Date(data.startDate),
                endDate,
            );

            if (!availability.available) {
                throw new Error(
                    formatConflicts(availability.conflicts),
                );
            }
        }

        return await prisma.serviceEvent.create({
            data: {
                carId: data.carId,
                type: data.type,
                description: data.description,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                blocksBooking,
                costMinor: data.costMinor || null,
                currency: data.currency || 'UAH',
                odometer: data.odometer || null,
                vendor: data.vendor || null,
                notes: data.notes || null,
            },
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });
    }

    async update(id: number, data: {
        type?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        blocksBooking?: boolean;
        costMinor?: number;
        currency?: string;
        odometer?: number;
        vendor?: string;
        notes?: string;
    }) {
        return await prisma.serviceEvent.update({
            where: {id},
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });
    }

    async delete(id: number) {
        // Check if the service event is currently blocking a car that has upcoming bookings
        const event = await prisma.serviceEvent.findUnique({where: {id}});
        if (!event) {
            throw new Error(`Service event with id ${id} not found`);
        }

        // Warn: if this event was blocking booking, any existing confirmed reservations
        // may now conflict. This is informational — we still allow deletion.
        return await prisma.serviceEvent.delete({
            where: {id},
        });
    }
}

export default new ServiceEventService();
