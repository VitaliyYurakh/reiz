import {TransactionType} from '@prisma/client';
import {prisma, MS_PER_DAY, RentalStatus, ReservationStatus} from '../utils';

// Deposits are held on behalf of the client (liability, not revenue).
// Exclude from all operating-revenue / P&L calculations.
const NON_REVENUE_TYPES: TransactionType[] = [
    TransactionType.DEPOSIT_RECEIVED,
    TransactionType.DEPOSIT_RETURNED,
];

class ReportService {
    async getDashboard() {
        const now = new Date();
        // Month boundaries in UTC so the server's local timezone cannot drift
        // first-of-month transactions into the previous accounting month.
        // Postgres stores TIMESTAMP in UTC; the frontend dateRange() helper
        // also serializes with toISOString (UTC), so every clock on every path
        // now agrees on month boundaries.
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth();
        const startOfMonth = new Date(Date.UTC(y, m, 1));
        const startOfLastMonth = new Date(Date.UTC(y, m - 1, 1));
        const endOfLastMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

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

            // Revenue this month (sum of incoming transactions in UAH,
            // excluding deposits — those are client money we hold, not revenue).
            prisma.transaction.aggregate({
                where: {
                    direction: 'in',
                    type: {notIn: NON_REVENUE_TYPES},
                    createdAt: {gte: startOfMonth},
                },
                _sum: {amountUahMinor: true},
            }),

            // Revenue last month
            prisma.transaction.aggregate({
                where: {
                    direction: 'in',
                    type: {notIn: NON_REVENUE_TYPES},
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
            revenueThisMonthMinor: revenueThisMonth._sum?.amountUahMinor || 0,
            revenueLastMonthMinor: revenueLastMonth._sum?.amountUahMinor || 0,
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
        // `to` is a date string like "2026-04-22"; JS parses it as UTC midnight,
        // which excludes transactions that happened later on that same day.
        // Stretch to end of day so the current day is included.
        toDate.setUTCHours(23, 59, 59, 999);

        const transactions = await prisma.transaction.findMany({
            where: {
                type: {notIn: NON_REVENUE_TYPES},
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

        // Seed every day in the [from, to] range with zeros so the chart
        // has one data point per calendar day, not only the days that
        // happened to have transactions. Without this, a week with only two
        // active days collapses to 2 points and the 5-slot x-axis on the
        // dashboard duplicates labels ("21 апр / 21 апр / 22 апр / 22 апр /
        // 22 апр").
        const dailyRevenue: Record<string, {date: string; income: number; expense: number; net: number}> = {};
        const cursor = new Date(fromDate);
        cursor.setUTCHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setUTCHours(0, 0, 0, 0);
        while (cursor.getTime() <= end.getTime()) {
            const key = cursor.toISOString().slice(0, 10);
            dailyRevenue[key] = {date: key, income: 0, expense: 0, net: 0};
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        for (const tx of transactions) {
            const dateKey = tx.createdAt.toISOString().slice(0, 10);
            if (!dailyRevenue[dateKey]) {
                // Defensive: tx outside the seeded range (shouldn't happen
                // given the where-clause, but handles off-by-one edge cases).
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
        // See comment in getRevenue: stretch `to` to end of day so the current
        // day is counted as utilised.
        toDate.setUTCHours(23, 59, 59, 999);

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

    private hasAccess(permissions: Record<string, string>, _role: string, module: string): boolean {
        // Post-RBAC: there is no special "admin" bypass — the seeded Admin
        // role has every module at 'full', so it passes naturally. The
        // `_role` arg is kept for callsite compatibility (controllers still
        // pass user.role.name) but no longer participates in the decision.
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

    /**
     * Per-car P&L over a date range.
     *
     * Income: every IN transaction tied to a rental whose car matches.
     * Costs:  every OUT transaction tied to that rental + the car's
     *         service-event costs + accident clientDebt that we wrote off.
     *
     * All in UAH (uses amountUahMinor that's stored at transaction time).
     * Returns one row per car + a totals object.
     */
    async getCarPnl(from: Date, to: Date, partnerId?: number) {
        const carWhere: any = {};
        if (partnerId) carWhere.partnerId = partnerId;

        const cars = await prisma.car.findMany({
            where: carWhere,
            select: {
                id: true,
                brand: true,
                model: true,
                plateNumber: true,
                partnerId: true,
                partner: {select: {id: true, fullName: true, companyName: true}},
            },
        });
        if (cars.length === 0) return {rows: [], totals: empty()};

        const carIds = cars.map((c) => c.id);

        // Income & explicit OUT (refunds, deposit returns) attached to rentals
        const txns = await prisma.transaction.groupBy({
            by: ['rentalId', 'direction'],
            where: {
                rentalId: {not: null},
                rental: {carId: {in: carIds}, pickupDate: {gte: from, lt: to}},
            },
            _sum: {amountUahMinor: true},
        });

        // Resolve rental → car so we can roll up to car level.
        const rentalMap = new Map<number, number>();
        const rentals = await prisma.rental.findMany({
            where: {carId: {in: carIds}, pickupDate: {gte: from, lt: to}},
            select: {id: true, carId: true},
        });
        for (const r of rentals) rentalMap.set(r.id, r.carId);

        // Service events directly on the car
        const services = await prisma.serviceEvent.groupBy({
            by: ['carId'],
            where: {carId: {in: carIds}, startDate: {gte: from, lt: to}},
            _sum: {costMinor: true},
        });

        // Accidents — count clientDebt as recovered, estimatedDamage as cost
        const accidents = await prisma.accident.findMany({
            where: {carId: {in: carIds}, incidentAt: {gte: from, lt: to}},
            select: {carId: true, estimatedDamageMinor: true, insurancePayoutMinor: true, clientDebtMinor: true},
        });

        // Pre-aggregate per car
        const incomePerCar = new Map<number, number>();
        const refundPerCar = new Map<number, number>();
        for (const t of txns) {
            const carId = t.rentalId != null ? rentalMap.get(t.rentalId) : undefined;
            if (!carId) continue;
            const amount = t._sum.amountUahMinor ?? 0;
            const target = t.direction === 'in' ? incomePerCar : refundPerCar;
            target.set(carId, (target.get(carId) ?? 0) + amount);
        }

        const servicePerCar = new Map<number, number>();
        for (const s of services) {
            servicePerCar.set(s.carId, s._sum.costMinor ?? 0);
        }

        const accDamagePerCar = new Map<number, number>();
        const accRecoveryPerCar = new Map<number, number>();
        for (const a of accidents) {
            const dmg = a.estimatedDamageMinor ?? 0;
            const rec = (a.insurancePayoutMinor ?? 0) + (a.clientDebtMinor ?? 0);
            accDamagePerCar.set(a.carId, (accDamagePerCar.get(a.carId) ?? 0) + dmg);
            accRecoveryPerCar.set(a.carId, (accRecoveryPerCar.get(a.carId) ?? 0) + rec);
        }

        const rows = cars.map((c) => {
            const incomeMinor = incomePerCar.get(c.id) ?? 0;
            const refundMinor = refundPerCar.get(c.id) ?? 0;
            const serviceCostMinor = servicePerCar.get(c.id) ?? 0;
            const accidentCostMinor = accDamagePerCar.get(c.id) ?? 0;
            const accidentRecoveryMinor = accRecoveryPerCar.get(c.id) ?? 0;
            const profitMinor = incomeMinor - refundMinor - serviceCostMinor - accidentCostMinor + accidentRecoveryMinor;
            return {
                carId: c.id,
                brand: c.brand,
                model: c.model,
                plateNumber: c.plateNumber,
                partner: c.partner ? {id: c.partner.id, name: c.partner.companyName || c.partner.fullName} : null,
                incomeMinor, refundMinor, serviceCostMinor, accidentCostMinor, accidentRecoveryMinor,
                profitMinor,
            };
        });

        const totals = rows.reduce(
            (acc, r) => ({
                incomeMinor: acc.incomeMinor + r.incomeMinor,
                refundMinor: acc.refundMinor + r.refundMinor,
                serviceCostMinor: acc.serviceCostMinor + r.serviceCostMinor,
                accidentCostMinor: acc.accidentCostMinor + r.accidentCostMinor,
                accidentRecoveryMinor: acc.accidentRecoveryMinor + r.accidentRecoveryMinor,
                profitMinor: acc.profitMinor + r.profitMinor,
            }),
            empty(),
        );

        // Sort by profit desc — most-profitable cars at top.
        rows.sort((a, b) => b.profitMinor - a.profitMinor);

        return {rows, totals, period: {from, to}};
    }
}

function empty() {
    return {
        incomeMinor: 0,
        refundMinor: 0,
        serviceCostMinor: 0,
        accidentCostMinor: 0,
        accidentRecoveryMinor: 0,
        profitMinor: 0,
    };
}

export default new ReportService();
