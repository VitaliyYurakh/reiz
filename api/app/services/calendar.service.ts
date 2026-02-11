import {prisma} from '../utils';

class CalendarService {
    async getData(from: string, to: string, carIds?: number[]) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const carWhere: any = {};
        if (carIds && carIds.length > 0) {
            carWhere.id = {in: carIds};
        }

        const cars = await prisma.car.findMany({
            where: carWhere,
            select: {
                id: true,
                brand: true,
                model: true,
                plateNumber: true,
                isAvailable: true,
            },
            orderBy: {brand: 'asc'},
        });

        const carIdList = cars.map((c) => c.id);

        const [reservations, rentals, serviceEvents] = await Promise.all([
            prisma.reservation.findMany({
                where: {
                    carId: {in: carIdList},
                    status: {in: ['confirmed']},
                    pickupDate: {lt: toDate},
                    returnDate: {gt: fromDate},
                },
                select: {
                    id: true,
                    carId: true,
                    status: true,
                    pickupDate: true,
                    returnDate: true,
                    client: {select: {id: true, firstName: true, lastName: true}},
                },
            }),
            prisma.rental.findMany({
                where: {
                    carId: {in: carIdList},
                    status: {in: ['active']},
                    pickupDate: {lt: toDate},
                    returnDate: {gt: fromDate},
                },
                select: {
                    id: true,
                    carId: true,
                    status: true,
                    pickupDate: true,
                    returnDate: true,
                    contractNumber: true,
                    client: {select: {id: true, firstName: true, lastName: true}},
                },
            }),
            prisma.serviceEvent.findMany({
                where: {
                    carId: {in: carIdList},
                    blocksBooking: true,
                    startDate: {lt: toDate},
                    OR: [
                        {endDate: {gt: fromDate}},
                        {endDate: null},
                    ],
                },
                select: {
                    id: true,
                    carId: true,
                    type: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                },
            }),
        ]);

        const result = cars.map((car) => {
            const intervals: Array<{
                type: 'reservation' | 'rental' | 'service';
                id: number;
                startDate: Date;
                endDate: Date | null;
                status?: string;
                label: string;
                clientName?: string;
            }> = [];

            for (const r of reservations.filter((r) => r.carId === car.id)) {
                intervals.push({
                    type: 'reservation',
                    id: r.id,
                    startDate: r.pickupDate,
                    endDate: r.returnDate,
                    status: r.status,
                    label: `#${r.id}`,
                    clientName: r.client ? `${r.client.firstName} ${r.client.lastName}` : undefined,
                });
            }

            for (const r of rentals.filter((r) => r.carId === car.id)) {
                intervals.push({
                    type: 'rental',
                    id: r.id,
                    startDate: r.pickupDate,
                    endDate: r.returnDate,
                    status: r.status,
                    label: r.contractNumber || `#${r.id}`,
                    clientName: r.client ? `${r.client.firstName} ${r.client.lastName}` : undefined,
                });
            }

            for (const se of serviceEvents.filter((se) => se.carId === car.id)) {
                intervals.push({
                    type: 'service',
                    id: se.id,
                    startDate: se.startDate,
                    endDate: se.endDate,
                    label: `${se.type}: ${se.description}`,
                });
            }

            return {
                car: {
                    id: car.id,
                    name: `${car.brand || ''} ${car.model || ''}`.trim(),
                    plateNumber: car.plateNumber,
                    isAvailable: car.isAvailable,
                },
                intervals,
            };
        });

        return {cars: result, from: fromDate, to: toDate};
    }
}

export default new CalendarService();
