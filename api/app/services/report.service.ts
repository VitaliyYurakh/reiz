import {prisma, MS_PER_DAY, RentalStatus, ReservationStatus} from '../utils';

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
            prisma.rental.count({where: {status: RentalStatus.ACTIVE}}),

            // Confirmed reservations (upcoming)
            prisma.reservation.count({
                where: {
                    status: ReservationStatus.CONFIRMED,
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
                    status: RentalStatus.COMPLETED,
                    actualReturnDate: {gte: startOfMonth},
                },
            }),

            // Overdue rentals (active with returnDate in the past)
            prisma.rental.count({
                where: {
                    status: RentalStatus.ACTIVE,
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

    async getRevenue(from: string, to: string) {
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

    async getFleetUtilization(from: string, to: string, segmentId?: number) {
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
            Math.ceil((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY),
        );

        const carIds = cars.map((c) => c.id);

        // Single query for ALL cars instead of N+1
        const allRentals = await prisma.rental.findMany({
            where: {
                carId: {in: carIds},
                status: {in: [RentalStatus.ACTIVE, RentalStatus.COMPLETED]},
                pickupDate: {lt: toDate},
                OR: [
                    {returnDate: {gt: fromDate}},
                    {actualReturnDate: {gt: fromDate}},
                ],
            },
            select: {
                carId: true,
                pickupDate: true,
                returnDate: true,
                actualReturnDate: true,
            },
        });

        // Group rentals by carId
        const rentalsByCarId = new Map<number, typeof allRentals>();
        for (const rental of allRentals) {
            const list = rentalsByCarId.get(rental.carId) || [];
            list.push(rental);
            rentalsByCarId.set(rental.carId, list);
        }

        const utilization = cars.map((car) => {
            const rentals = rentalsByCarId.get(car.id) || [];
            let rentedDays = 0;
            for (const rental of rentals) {
                const rentalStart = rental.pickupDate > fromDate ? rental.pickupDate : fromDate;
                const rentalEnd = (rental.actualReturnDate || rental.returnDate) < toDate
                    ? (rental.actualReturnDate || rental.returnDate)
                    : toDate;

                const days = Math.max(
                    0,
                    Math.ceil((rentalEnd.getTime() - rentalStart.getTime()) / MS_PER_DAY),
                );
                rentedDays += days;
            }

            return {
                carId: car.id,
                brand: car.brand,
                model: car.model,
                plateNumber: car.plateNumber,
                rentedDays,
                totalDays: totalDaysInPeriod,
                utilizationPercent: Math.round((rentedDays / totalDaysInPeriod) * 100),
            };
        });

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

    private hasAccess(permissions: Record<string, string>, role: string, module: string): boolean {
        if (role === 'admin') return true;
        const level = permissions[module] || 'none';
        return level === 'view' || level === 'full';
    }

    async getNotifications(permissions: Record<string, string>, role: string) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * MS_PER_DAY);
        const threeDaysFromNow = new Date(now.getTime() + 3 * MS_PER_DAY);

        const canSeeRequests = this.hasAccess(permissions, role, 'requests');
        const canSeeService = this.hasAccess(permissions, role, 'service');
        const canSeeRentals = this.hasAccess(permissions, role, 'rentals');

        const [newRequests, upcomingService, overdueRentals] = await Promise.all([
            canSeeRequests
                ? prisma.rentalRequest.findMany({
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
                  })
                : Promise.resolve([]),

            canSeeService
                ? prisma.serviceEvent.findMany({
                      where: {
                          startDate: {gte: now, lte: threeDaysFromNow},
                      },
                      take: 10,
                      orderBy: {startDate: 'asc'},
                      include: {
                          car: {select: {brand: true, model: true, plateNumber: true}},
                      },
                  })
                : Promise.resolve([]),

            canSeeRentals
                ? prisma.rental.findMany({
                      where: {
                          status: RentalStatus.ACTIVE,
                          returnDate: {lt: now},
                      },
                      take: 10,
                      orderBy: {returnDate: 'asc'},
                      include: {
                          client: {select: {firstName: true, lastName: true}},
                          car: {select: {brand: true, model: true, plateNumber: true}},
                      },
                  })
                : Promise.resolve([]),
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
                : 'Client';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : 'Car';
            items.push({
                id: `request-${r.id}`,
                type: 'request',
                title: 'notification.newRequest',
                message: `${car} — ${client}`,
                createdAt: r.createdAt.toISOString(),
            });
        }

        for (const s of upcomingService) {
            const car = s.car ? `${s.car.brand} ${s.car.model}` : 'Car';
            const daysUntil = Math.ceil(
                (s.startDate.getTime() - now.getTime()) / MS_PER_DAY,
            );
            items.push({
                id: `service-${s.id}`,
                type: 'service',
                title: 'notification.plannedService',
                message: `${car} — ${daysUntil}d`,
                createdAt: s.startDate.toISOString(),
            });
        }

        for (const r of overdueRentals) {
            const client = r.client
                ? `${r.client.firstName} ${r.client.lastName}`.trim()
                : 'Client';
            const car = r.car ? `${r.car.brand} ${r.car.model}` : 'Car';
            const overdueDays = Math.ceil(
                (now.getTime() - r.returnDate.getTime()) / MS_PER_DAY,
            );
            items.push({
                id: `overdue-${r.id}`,
                type: 'overdue',
                title: 'notification.overdueReturn',
                message: `${car} — ${client} (${overdueDays}d)`,
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
                status: RentalStatus.ACTIVE,
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
                (now.getTime() - rental.returnDate.getTime()) / MS_PER_DAY,
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

    async search(query: string, permissions: Record<string, string> = {}, role = 'manager') {
        const q = query.trim();
        if (q.length < 2) return {results: []};

        const contains = (field: string) => ({[field]: {contains: q, mode: 'insensitive' as const}});

        const canSeeClients = this.hasAccess(permissions, role, 'clients');
        const canSeeCars = this.hasAccess(permissions, role, 'cars');
        const canSeeRequests = this.hasAccess(permissions, role, 'requests');
        const canSeeRentals = this.hasAccess(permissions, role, 'rentals');

        const [clients, cars, requests, rentals] = await Promise.all([
            canSeeClients
                ? prisma.client.findMany({
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
                  })
                : Promise.resolve([]),

            canSeeCars
                ? prisma.car.findMany({
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
                  })
                : Promise.resolve([]),

            canSeeRequests
                ? prisma.rentalRequest.findMany({
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
                  })
                : Promise.resolve([]),

            canSeeRentals
                ? prisma.rental.findMany({
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
                  })
                : Promise.resolve([]),
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
