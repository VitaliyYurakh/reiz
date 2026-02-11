import {prisma} from '../utils';

interface ConflictItem {
    type: 'reservation' | 'rental' | 'service_event';
    id: number;
    startDate: Date;
    endDate: Date;
    status?: string;
}

const TYPE_LABELS: Record<string, string> = {
    reservation: 'Бронювання',
    rental: 'Оренда',
    service_event: 'Сервіс',
};

function fmtDate(d: Date) {
    return d.toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'});
}

export function formatConflicts(conflicts: ConflictItem[]): string {
    if (conflicts.length === 0) return '';
    const lines = conflicts.map((c) => {
        const type = TYPE_LABELS[c.type] || c.type;
        return `${type} #${c.id} (${fmtDate(c.startDate)} — ${fmtDate(c.endDate)})`;
    });
    return `Авто зайняте на обрані дати:\n${lines.join('\n')}`;
}

class AvailabilityService {
    async checkCarAvailability(
        carId: number,
        startDate: Date,
        endDate: Date,
        excludeReservationId?: number,
        excludeRentalId?: number,
    ): Promise<{available: boolean; conflicts: ConflictItem[]}> {
        const conflicts: ConflictItem[] = [];

        // Check reservations with confirmed status only
        // picked_up reservations are already represented by the rental
        // Overlap condition: A.start < B.end AND B.start < A.end
        const reservationWhere: any = {
            carId,
            status: {in: ['confirmed']},
            pickupDate: {lt: endDate},
            returnDate: {gt: startDate},
        };
        if (excludeReservationId) {
            reservationWhere.id = {not: excludeReservationId};
        }

        const conflictingReservations = await prisma.reservation.findMany({
            where: reservationWhere,
            select: {id: true, pickupDate: true, returnDate: true, status: true},
        });

        for (const r of conflictingReservations) {
            conflicts.push({
                type: 'reservation',
                id: r.id,
                startDate: r.pickupDate,
                endDate: r.returnDate,
                status: r.status,
            });
        }

        // Check rentals with active status
        const rentalWhere: any = {
            carId,
            status: {in: ['active']},
            pickupDate: {lt: endDate},
            returnDate: {gt: startDate},
        };
        if (excludeRentalId) {
            rentalWhere.id = {not: excludeRentalId};
        }

        const conflictingRentals = await prisma.rental.findMany({
            where: rentalWhere,
            select: {id: true, pickupDate: true, returnDate: true, status: true},
        });

        for (const r of conflictingRentals) {
            conflicts.push({
                type: 'rental',
                id: r.id,
                startDate: r.pickupDate,
                endDate: r.returnDate,
                status: r.status,
            });
        }

        // Check service events that block booking
        const conflictingServiceEvents = await prisma.serviceEvent.findMany({
            where: {
                carId,
                blocksBooking: true,
                startDate: {lt: endDate},
                OR: [
                    {endDate: {gt: startDate}},
                    {endDate: null},
                ],
            },
            select: {id: true, startDate: true, endDate: true, type: true},
        });

        for (const se of conflictingServiceEvents) {
            conflicts.push({
                type: 'service_event',
                id: se.id,
                startDate: se.startDate,
                endDate: se.endDate || new Date('2099-12-31'),
            });
        }

        return {available: conflicts.length === 0, conflicts};
    }

    async getCarOccupancy(carId: number, from: Date, to: Date) {
        const [reservations, rentals, serviceEvents] = await Promise.all([
            prisma.reservation.findMany({
                where: {
                    carId,
                    status: {in: ['confirmed']},
                    pickupDate: {lt: to},
                    returnDate: {gt: from},
                },
                select: {
                    id: true,
                    status: true,
                    pickupDate: true,
                    returnDate: true,
                    client: {select: {id: true, firstName: true, lastName: true}},
                },
            }),
            prisma.rental.findMany({
                where: {
                    carId,
                    status: {in: ['active']},
                    pickupDate: {lt: to},
                    returnDate: {gt: from},
                },
                select: {
                    id: true,
                    status: true,
                    pickupDate: true,
                    returnDate: true,
                    client: {select: {id: true, firstName: true, lastName: true}},
                },
            }),
            prisma.serviceEvent.findMany({
                where: {
                    carId,
                    blocksBooking: true,
                    startDate: {lt: to},
                    OR: [
                        {endDate: {gt: from}},
                        {endDate: null},
                    ],
                },
                select: {
                    id: true,
                    type: true,
                    startDate: true,
                    endDate: true,
                    description: true,
                },
            }),
        ]);

        const intervals: Array<{
            type: 'reservation' | 'rental' | 'service_event';
            id: number;
            startDate: Date;
            endDate: Date | null;
            status?: string;
            label?: string;
            client?: {id: number; firstName: string; lastName: string} | null;
        }> = [];

        for (const r of reservations) {
            intervals.push({
                type: 'reservation',
                id: r.id,
                startDate: r.pickupDate,
                endDate: r.returnDate,
                status: r.status,
                label: `Reservation #${r.id}`,
                client: r.client,
            });
        }

        for (const r of rentals) {
            intervals.push({
                type: 'rental',
                id: r.id,
                startDate: r.pickupDate,
                endDate: r.returnDate,
                status: r.status,
                label: `Rental #${r.id}`,
                client: r.client,
            });
        }

        for (const se of serviceEvents) {
            intervals.push({
                type: 'service_event',
                id: se.id,
                startDate: se.startDate,
                endDate: se.endDate,
                label: `${se.type}: ${se.description}`,
            });
        }

        return intervals;
    }
}

export default new AvailabilityService();
