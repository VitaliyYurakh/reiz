import {prisma} from '../utils';

class ReportService {
    async getDashboard() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const [
            activeRentals,
            confirmedReservations,
            newRequestsThisMonth,
            totalClients,
            revenueThisMonth,
            revenueLastMonth,
            completedRentalsThisMonth,
            overdueRentals,
            totalCarsAvailable,
            totalCars,
        ] = await Promise.all([
            // Active rentals
            prisma.rental.count({where: {status: 'active'}}),

            // Confirmed reservations (upcoming)
            prisma.reservation.count({
                where: {
                    status: 'confirmed',
                    pickupDate: {gte: now},
                },
            }),

            // New rental requests this month
            prisma.rentalRequest.count({
                where: {
                    createdAt: {gte: startOfMonth},
                },
            }),

            // Total active clients
            prisma.client.count({where: {deletedAt: null}}),

            // Revenue this month (sum of incoming transactions in UAH)
            prisma.transaction.aggregate({
                where: {
                    direction: 'in',
                    createdAt: {gte: startOfMonth},
                },
                _sum: {amountUahMinor: true},
            }),

            // Revenue last month
            prisma.transaction.aggregate({
                where: {
                    direction: 'in',
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
                _sum: {amountUahMinor: true},
            }),

            // Completed rentals this month
            prisma.rental.count({
                where: {
                    status: 'completed',
                    actualReturnDate: {gte: startOfMonth},
                },
            }),

            // Overdue rentals (active with returnDate in the past)
            prisma.rental.count({
                where: {
                    status: 'active',
                    returnDate: {lt: now},
                },
            }),

            // Available cars
            prisma.car.count({where: {isAvailable: true}}),

            // Total cars
            prisma.car.count(),
        ]);

        return {
            activeRentals,
            confirmedReservations,
            newRequestsThisMonth,
            totalClients,
            revenueThisMonthMinor: revenueThisMonth._sum.amountUahMinor || 0,
            revenueLastMonthMinor: revenueLastMonth._sum.amountUahMinor || 0,
            completedRentalsThisMonth,
            overdueRentals,
            totalCarsAvailable,
            totalCars,
            fleetUtilizationPercent: totalCars > 0
                ? Math.round((activeRentals / totalCars) * 100)
                : 0,
        };
    }

    async getRevenue(from: Date, to: Date) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            include: {
                account: {select: {id: true, name: true, type: true}},
            },
            orderBy: {createdAt: 'asc'},
        });

        // Group by day
        const dailyRevenue: Record<string, {date: string; income: number; expense: number; net: number}> = {};

        for (const tx of transactions) {
            const dateKey = tx.createdAt.toISOString().slice(0, 10);
            if (!dailyRevenue[dateKey]) {
                dailyRevenue[dateKey] = {date: dateKey, income: 0, expense: 0, net: 0};
            }

            if (tx.direction === 'in') {
                dailyRevenue[dateKey].income += tx.amountUahMinor;
            } else {
                dailyRevenue[dateKey].expense += tx.amountUahMinor;
            }
            dailyRevenue[dateKey].net = dailyRevenue[dateKey].income - dailyRevenue[dateKey].expense;
        }

        const daily = Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date));

        const totalIncome = daily.reduce((sum, d) => sum + d.income, 0);
        const totalExpense = daily.reduce((sum, d) => sum + d.expense, 0);

        return {
            period: {from: fromDate, to: toDate},
            totalIncome,
            totalExpense,
            net: totalIncome - totalExpense,
            daily,
        };
    }

    async getFleetUtilization(from: Date, to: Date, segmentId?: number) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const carWhere: any = {};
        if (segmentId) {
            carWhere.segment = {some: {id: segmentId}};
        }

        const cars = await prisma.car.findMany({
            where: carWhere,
            select: {
                id: true,
                brand: true,
                model: true,
                plateNumber: true,
            },
        });

        const totalDaysInPeriod = Math.max(
            1,
            Math.ceil((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)),
        );

        const utilization: Array<{
            carId: number;
            brand: string | null;
            model: string | null;
            plateNumber: string | null;
            rentedDays: number;
            totalDays: number;
            utilizationPercent: number;
        }> = [];

        for (const car of cars) {
            // Find all rentals for this car that overlap with the period
            const rentals = await prisma.rental.findMany({
                where: {
                    carId: car.id,
                    status: {in: ['active', 'completed']},
                    pickupDate: {lt: toDate},
                    OR: [
                        {returnDate: {gt: fromDate}},
                        {actualReturnDate: {gt: fromDate}},
                    ],
                },
                select: {
                    pickupDate: true,
                    returnDate: true,
                    actualReturnDate: true,
                },
            });

            let rentedDays = 0;
            for (const rental of rentals) {
                const rentalStart = rental.pickupDate > fromDate ? rental.pickupDate : fromDate;
                const rentalEnd = (rental.actualReturnDate || rental.returnDate) < toDate
                    ? (rental.actualReturnDate || rental.returnDate)
                    : toDate;

                const days = Math.max(
                    0,
                    Math.ceil((rentalEnd.getTime() - rentalStart.getTime()) / (24 * 60 * 60 * 1000)),
                );
                rentedDays += days;
            }

            utilization.push({
                carId: car.id,
                brand: car.brand,
                model: car.model,
                plateNumber: car.plateNumber,
                rentedDays,
                totalDays: totalDaysInPeriod,
                utilizationPercent: Math.round((rentedDays / totalDaysInPeriod) * 100),
            });
        }

        const avgUtilization = utilization.length > 0
            ? Math.round(utilization.reduce((sum, u) => sum + u.utilizationPercent, 0) / utilization.length)
            : 0;

        return {
            period: {from: fromDate, to: toDate},
            totalDaysInPeriod,
            averageUtilizationPercent: avgUtilization,
            cars: utilization.sort((a, b) => b.utilizationPercent - a.utilizationPercent),
        };
    }

    async getNotifications() {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const [newRequests, upcomingService, overdueRentals] = await Promise.all([
            // New rental requests (last 7 days)
            prisma.rentalRequest.findMany({
                where: {
                    status: 'new',
                    createdAt: {gte: sevenDaysAgo},
                },
                take: 10,
                orderBy: {createdAt: 'desc'},
                include: {
                    client: {select: {firstName: true, lastName: true}},
                    car: {select: {brand: true, model: true}},
                },
            }),

            // Service events starting in the next 3 days
            prisma.serviceEvent.findMany({
                where: {
                    startDate: {gte: now, lte: threeDaysFromNow},
                },
                take: 10,
                orderBy: {startDate: 'asc'},
                include: {
                    car: {select: {brand: true, model: true, plateNumber: true}},
                },
            }),

            // Overdue rentals
            prisma.rental.findMany({
                where: {
                    status: 'active',
                    returnDate: {lt: now},
                },
                take: 10,
                orderBy: {returnDate: 'asc'},
                include: {
                    client: {select: {firstName: true, lastName: true}},
                    car: {select: {brand: true, model: true, plateNumber: true}},
                },
            }),
        ]);

        const items: Array<{
            id: string;
            type: 'request' | 'service' | 'overdue';
            title: string;
            message: string;
            createdAt: string;
        }> = [];

        for (const r of newRequests) {
            const client = r.client
                ? `${r.client.firstName} ${r.client.lastName}`.trim()
                : 'Клиент';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : 'Авто';
            items.push({
                id: `request-${r.id}`,
                type: 'request',
                title: 'Новая заявка',
                message: `${car} — ${client}`,
                createdAt: r.createdAt.toISOString(),
            });
        }

        for (const s of upcomingService) {
            const car = s.car ? `${s.car.brand} ${s.car.model}` : 'Авто';
            const daysUntil = Math.ceil(
                (s.startDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
            );
            const when = daysUntil === 0 ? 'сегодня' : daysUntil === 1 ? 'завтра' : `через ${daysUntil} дн.`;
            items.push({
                id: `service-${s.id}`,
                type: 'service',
                title: 'Плановый сервис',
                message: `${car} — ${when}`,
                createdAt: s.startDate.toISOString(),
            });
        }

        for (const r of overdueRentals) {
            const client = r.client
                ? `${r.client.firstName} ${r.client.lastName}`.trim()
                : 'Клиент';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : 'Авто';
            const overdueDays = Math.ceil(
                (now.getTime() - r.returnDate.getTime()) / (24 * 60 * 60 * 1000),
            );
            items.push({
                id: `overdue-${r.id}`,
                type: 'overdue',
                title: 'Просрочен возврат',
                message: `${car} — ${client} (${overdueDays} дн.)`,
                createdAt: r.returnDate.toISOString(),
            });
        }

        // Sort newest first
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {count: items.length, items};
    }

    async getOverdue() {
        const now = new Date();

        const overdueRentals = await prisma.rental.findMany({
            where: {
                status: 'active',
                returnDate: {lt: now},
            },
            orderBy: {returnDate: 'asc'},
            include: {
                client: {select: {id: true, firstName: true, lastName: true, phone: true, email: true}},
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });

        const items = overdueRentals.map((rental) => {
            const overdueDays = Math.ceil(
                (now.getTime() - rental.returnDate.getTime()) / (24 * 60 * 60 * 1000),
            );
            return {
                ...rental,
                overdueDays,
            };
        });

        return {
            count: items.length,
            items,
        };
    }

    async search(query: string) {
        const q = query.trim();
        if (q.length < 2) return {results: []};

        const contains = (field: string) => ({[field]: {contains: q, mode: 'insensitive' as const}});

        const [clients, cars, requests, rentals] = await Promise.all([
            prisma.client.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        contains('firstName'),
                        contains('lastName'),
                        contains('phone'),
                        contains('email'),
                    ],
                },
                select: {id: true, firstName: true, lastName: true, phone: true, email: true},
                take: 5,
                orderBy: {lastName: 'asc'},
            }),

            prisma.car.findMany({
                where: {
                    OR: [
                        contains('brand'),
                        contains('model'),
                        contains('plateNumber'),
                        contains('VIN'),
                    ],
                },
                select: {id: true, brand: true, model: true, plateNumber: true},
                take: 5,
                orderBy: {brand: 'asc'},
            }),

            prisma.rentalRequest.findMany({
                where: {
                    OR: [
                        contains('firstName'),
                        contains('lastName'),
                        contains('phone'),
                        contains('email'),
                        {client: {OR: [contains('firstName'), contains('lastName')]}},
                    ],
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    firstName: true,
                    lastName: true,
                    car: {select: {brand: true, model: true}},
                },
                take: 5,
                orderBy: {createdAt: 'desc'},
            }),

            prisma.rental.findMany({
                where: {
                    OR: [
                        contains('contractNumber'),
                        {client: {OR: [contains('firstName'), contains('lastName'), contains('phone')]}},
                        {car: {OR: [contains('brand'), contains('model'), contains('plateNumber')]}},
                    ],
                },
                select: {
                    id: true,
                    status: true,
                    contractNumber: true,
                    client: {select: {firstName: true, lastName: true}},
                    car: {select: {brand: true, model: true}},
                },
                take: 5,
                orderBy: {createdAt: 'desc'},
            }),
        ]);

        const results: Array<{id: number; type: string; title: string; subtitle: string}> = [];

        for (const c of clients) {
            results.push({
                id: c.id,
                type: 'client',
                title: `${c.firstName} ${c.lastName}`.trim(),
                subtitle: c.phone || c.email || '',
            });
        }

        for (const c of cars) {
            results.push({
                id: c.id,
                type: 'car',
                title: `${c.brand || ''} ${c.model || ''}`.trim(),
                subtitle: c.plateNumber || '',
            });
        }

        for (const r of requests) {
            const name = `${r.firstName || ''} ${r.lastName || ''}`.trim() || 'Без имени';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : '';
            results.push({
                id: r.id,
                type: 'request',
                title: `Заявка #${r.id} — ${name}`,
                subtitle: car,
            });
        }

        for (const r of rentals) {
            const client = r.client ? `${r.client.firstName} ${r.client.lastName}`.trim() : '';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : '';
            results.push({
                id: r.id,
                type: 'rental',
                title: `Аренда ${r.contractNumber || `#${r.id}`}`,
                subtitle: [car, client].filter(Boolean).join(' — '),
            });
        }

        return {results};
    }
}

export default new ReportService();
