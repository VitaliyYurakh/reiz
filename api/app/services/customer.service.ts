import {prisma} from '../utils';

class CustomerService {
    async getProfile(clientId: number) {
        return prisma.client.findUnique({
            where: {id: clientId, deletedAt: null},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                phone: true,
                email: true,
                dateOfBirth: true,
                drivingSince: true,
                languages: true,
                driverLicenseNo: true,
                driverLicenseExpiry: true,
                passportNo: true,
                address: true,
                city: true,
                country: true,
                createdAt: true,
            },
        });
    }

    async updateProfile(clientId: number, data: {
        firstName?: string;
        lastName?: string;
        middleName?: string;
        phone?: string;
        address?: string;
        city?: string;
        country?: string;
        dateOfBirth?: string;
        drivingSince?: string;
        driverLicenseNo?: string;
        driverLicenseExpiry?: string;
        languages?: string[];
    }) {
        const updateData: any = {};
        if (data.firstName !== undefined) updateData.firstName = data.firstName;
        if (data.lastName !== undefined) updateData.lastName = data.lastName;
        if (data.middleName !== undefined) updateData.middleName = data.middleName;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.country !== undefined) updateData.country = data.country;
        if (data.dateOfBirth !== undefined) {
            updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
        }
        if (data.drivingSince !== undefined) {
            updateData.drivingSince = data.drivingSince ? parseInt(data.drivingSince, 10) : null;
        }
        if (data.driverLicenseNo !== undefined) {
            updateData.driverLicenseNo = data.driverLicenseNo || null;
        }
        if (data.driverLicenseExpiry !== undefined) {
            updateData.driverLicenseExpiry = data.driverLicenseExpiry ? new Date(data.driverLicenseExpiry) : null;
        }
        if (data.languages !== undefined) {
            updateData.languages = data.languages;
        }

        return prisma.client.update({
            where: {id: clientId},
            data: updateData,
        });
    }

    async getReservations(clientId: number, status?: string) {
        const where: any = {clientId};

        if (status === 'active') {
            where.status = {in: ['confirmed', 'pending']};
            where.cancelledAt = null;
        } else if (status === 'cancelled') {
            where.NOT = {cancelledAt: null};
        } else if (status === 'past') {
            where.returnDate = {lt: new Date()};
            where.cancelledAt = null;
        }

        return prisma.reservation.findMany({
            where,
            include: {
                car: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        previewUrl: true,
                        yearOfManufacture: true,
                    },
                },
            },
            orderBy: {pickupDate: 'desc'},
        });
    }

    async getRentals(clientId: number, status?: string) {
        const where: any = {clientId};

        if (status === 'active') {
            where.status = 'active';
        } else if (status === 'completed') {
            where.status = {in: ['completed', 'cancelled']};
        }

        return prisma.rental.findMany({
            where,
            include: {
                car: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        previewUrl: true,
                        yearOfManufacture: true,
                    },
                },
            },
            orderBy: {pickupDate: 'desc'},
        });
    }

    async getFavorites(clientId: number) {
        return prisma.favorite.findMany({
            where: {clientId},
            include: {
                car: {
                    include: {
                        carPhoto: {where: {type: 'PC'}, take: 1},
                        rentalTariff: {orderBy: {minDays: 'asc'}},
                        carCountingRule: true,
                        segment: true,
                    },
                },
            },
            orderBy: {createdAt: 'desc'},
        });
    }

    async addFavorite(clientId: number, carId: number) {
        return prisma.favorite.upsert({
            where: {clientId_carId: {clientId, carId}},
            create: {clientId, carId},
            update: {},
        });
    }

    async removeFavorite(clientId: number, carId: number) {
        return prisma.favorite.deleteMany({
            where: {clientId, carId},
        });
    }

    async getNotificationPreferences(clientId: number) {
        const prefs = await prisma.notificationPreference.findUnique({
            where: {clientId},
        });

        // Return defaults if none exist
        return prefs || {
            clientId,
            emailDeals: true,
            emailReminders: true,
            emailReceipts: true,
        };
    }

    async updateNotificationPreferences(clientId: number, data: {
        emailDeals?: boolean;
        emailReminders?: boolean;
        emailReceipts?: boolean;
    }) {
        return prisma.notificationPreference.upsert({
            where: {clientId},
            create: {
                clientId,
                emailDeals: data.emailDeals ?? true,
                emailReminders: data.emailReminders ?? true,
                emailReceipts: data.emailReceipts ?? true,
            },
            update: data,
        });
    }

    async exportData(clientId: number) {
        const [client, reservations, rentals, transactions, favorites, notifications] = await Promise.all([
            prisma.client.findUnique({
                where: {id: clientId},
                include: {documents: true},
            }),
            prisma.reservation.findMany({where: {clientId}}),
            prisma.rental.findMany({where: {clientId}}),
            prisma.transaction.findMany({where: {clientId}}),
            prisma.favorite.findMany({where: {clientId}}),
            prisma.notificationPreference.findUnique({where: {clientId}}),
        ]);

        return {
            exportedAt: new Date().toISOString(),
            profile: client,
            reservations,
            rentals,
            transactions,
            favorites,
            notificationPreferences: notifications,
        };
    }

    async requestCancellation(clientId: number, reservationId: number, reason?: string) {
        const reservation = await prisma.reservation.findUnique({
            where: {id: reservationId},
            include: {
                client: {select: {firstName: true, lastName: true, phone: true}},
                car: {select: {brand: true, model: true}},
            },
        });

        if (!reservation || reservation.clientId !== clientId) {
            throw new Error('Reservation not found');
        }

        if (reservation.status !== 'confirmed' && reservation.status !== 'pending') {
            throw new Error('Only confirmed or pending reservations can request cancellation');
        }

        if (reservation.cancellationRequestedAt) {
            throw new Error('Cancellation already requested');
        }

        const updated = await prisma.reservation.update({
            where: {id: reservationId},
            data: {
                cancellationRequestedAt: new Date(),
                cancellationRequestReason: reason || '',
            },
        });

        // Send Telegram notification
        try {
            const {default: telegramService} = await import('./telegram.service');
            const client = reservation.client;
            const car = reservation.car;
            const pickupDate = new Date(reservation.pickupDate).toLocaleDateString('uk-UA');
            const returnDate = new Date(reservation.returnDate).toLocaleDateString('uk-UA');

            const message = `❌ <b>Запит на скасування бронювання #${reservationId}</b>\n\n`
                + `👤 <b>Клієнт:</b> ${client.firstName} ${client.lastName}\n`
                + `📞 <b>Телефон:</b> ${client.phone}\n`
                + `🚗 <b>Авто:</b> ${car?.brand || ''} ${car?.model || ''}\n`
                + `📅 <b>Період:</b> ${pickupDate} — ${returnDate}\n`
                + `📍 <b>Локація:</b> ${reservation.pickupLocation}\n`
                + (reason ? `\n💬 <b>Причина:</b> ${reason}\n` : '')
                + `\n⏳ Очікує підтвердження в адмінці`;

            await telegramService.sendMessage(message);
        } catch (e) {
            // Don't fail the request if TG notification fails
        }

        return updated;
    }

    async getBookingHistory(clientId: number, filter?: string, page = 1, limit = 20) {
        const reservationWhere: any = {clientId};
        const rentalWhere: any = {clientId};

        if (filter === 'active') {
            reservationWhere.status = {in: ['confirmed', 'pending']};
            reservationWhere.cancelledAt = null;
            rentalWhere.status = 'active';
        } else if (filter === 'history') {
            reservationWhere.id = -1; // skip reservations — history shows only completed rentals
            rentalWhere.status = 'completed';
        } else if (filter === 'cancelled') {
            reservationWhere.cancelledAt = {not: null};
            rentalWhere.status = 'cancelled';
        }

        const [reservations, rentals] = await Promise.all([
            prisma.reservation.findMany({
                where: reservationWhere,
                include: {
                    car: {
                        select: {
                            id: true,
                            brand: true,
                            model: true,
                            previewUrl: true,
                            yearOfManufacture: true,
                        },
                    },
                    coveragePackage: {
                        select: {id: true, name: true, nameLocalized: true},
                    },
                    reservationAddOns: {
                        include: {
                            addOn: {select: {name: true, nameLocalized: true}},
                        },
                    },
                    transactions: {
                        select: {
                            id: true,
                            type: true,
                            direction: true,
                            amountMinor: true,
                            currency: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: {pickupDate: 'desc'},
            }),
            prisma.rental.findMany({
                where: rentalWhere,
                include: {
                    car: {
                        select: {
                            id: true,
                            brand: true,
                            model: true,
                            previewUrl: true,
                            yearOfManufacture: true,
                        },
                    },
                    rentalAddOns: {
                        include: {
                            addOn: {select: {name: true, nameLocalized: true}},
                        },
                    },
                    rentalExtensions: {
                        select: {
                            id: true,
                            oldReturnDate: true,
                            newReturnDate: true,
                            extraDays: true,
                            totalMinor: true,
                            currency: true,
                        },
                    },
                    fines: {
                        select: {
                            id: true,
                            type: true,
                            description: true,
                            amountMinor: true,
                            currency: true,
                            isPaid: true,
                        },
                    },
                    transactions: {
                        select: {
                            id: true,
                            type: true,
                            direction: true,
                            amountMinor: true,
                            currency: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: {pickupDate: 'desc'},
            }),
        ]);

        const enrichedReservations = reservations.map((r) => ({
            ...r,
            _type: 'reservation' as const,
            pricingSummary: this.buildReservationPricing(r),
        }));
        const enrichedRentals = rentals.map((r) => ({
            ...r,
            _type: 'rental' as const,
            pricingSummary: this.buildRentalPricing(r),
        }));

        // Merge into single timeline sorted by pickupDate desc
        const all = [...enrichedReservations, ...enrichedRentals]
            .sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime());

        const total = all.length;
        const totalPages = Math.ceil(total / limit);
        const items = all.slice((page - 1) * limit, page * limit);

        return {items, total, page, limit, totalPages};
    }

    private buildReservationPricing(reservation: any) {
        const ps = reservation.priceSnapshot as any;
        const totalPaidMinor = (reservation.transactions || [])
            .filter((t: any) => t.direction === 'in')
            .reduce((sum: number, t: any) => sum + (t.amountMinor || 0), 0);

        return {
            dailyRateMinor: ps?.dailyRateMinor || ps?.dailyRate || null,
            totalMinor: ps?.totalMinor || ps?.total || null,
            currency: ps?.currency || 'USD',
            totalPaidMinor,
            depositAmountMinor: ps?.depositAmountMinor || ps?.depositAmount || null,
            addOns: (reservation.reservationAddOns || []).map((ra: any) => ({
                name: ra.addOn?.name || '',
                nameLocalized: ra.addOn?.nameLocalized || null,
                quantity: ra.quantity,
                totalMinor: ra.totalMinor,
                currency: ra.currency,
            })),
        };
    }

    private buildRentalPricing(rental: any) {
        const ps = rental.priceSnapshot as any;
        const totalPaidMinor = (rental.transactions || [])
            .filter((t: any) => t.direction === 'in')
            .reduce((sum: number, t: any) => sum + (t.amountMinor || 0), 0);

        const totalFinesMinor = (rental.fines || [])
            .reduce((sum: number, f: any) => sum + (f.amountMinor || 0), 0);
        const totalFinesPaidMinor = (rental.fines || [])
            .filter((f: any) => f.isPaid)
            .reduce((sum: number, f: any) => sum + (f.amountMinor || 0), 0);

        const extensionsCount = (rental.rentalExtensions || []).length;
        const extensionsTotalMinor = (rental.rentalExtensions || [])
            .reduce((sum: number, e: any) => sum + (e.totalMinor || 0), 0);

        return {
            dailyRateMinor: ps?.dailyRateMinor || ps?.dailyRate || null,
            totalMinor: ps?.totalMinor || ps?.total || null,
            currency: ps?.currency || 'USD',
            totalPaidMinor,
            depositAmountMinor: rental.depositAmount || ps?.depositAmountMinor || null,
            depositReturned: rental.depositReturned ?? false,
            totalFinesMinor,
            totalFinesPaidMinor,
            fines: (rental.fines || []).map((f: any) => ({
                type: f.type,
                description: f.description,
                amountMinor: f.amountMinor,
                currency: f.currency,
                isPaid: f.isPaid,
            })),
            addOns: (rental.rentalAddOns || []).map((ra: any) => ({
                name: ra.addOn?.name || '',
                nameLocalized: ra.addOn?.nameLocalized || null,
                quantity: ra.quantity,
                totalMinor: ra.totalMinor,
                currency: ra.currency,
            })),
            extensionsCount,
            extensionsTotalMinor,
        };
    }

    async getStats(clientId: number) {
        const client = await prisma.client.findUnique({
            where: {id: clientId, deletedAt: null},
            select: {
                totalCompletedRentals: true,
                totalSpentMinor: true,
                loyaltyTier: true,
                createdAt: true,
            },
        });

        if (!client) return null;

        return {
            totalCompletedRentals: client.totalCompletedRentals,
            totalSpentMinor: client.totalSpentMinor,
            loyaltyTier: client.loyaltyTier,
            memberSince: client.createdAt,
        };
    }

    async deleteAccount(clientId: number) {
        const now = new Date();

        // Soft-delete client — anonymize PII
        await prisma.client.update({
            where: {id: clientId},
            data: {
                firstName: 'Deleted',
                lastName: 'User',
                middleName: null,
                phone: `deleted-${clientId}`,
                email: `deleted-${clientId}@removed.local`,
                dateOfBirth: null,
                driverLicenseNo: null,
                driverLicenseExpiry: null,
                passportNo: null,
                nationalId: null,
                address: null,
                city: null,
                notes: null,
                deletedAt: now,
            },
        });

        // Soft-delete customer account
        await prisma.customerAccount.updateMany({
            where: {clientId},
            data: {
                email: `deleted-${clientId}@removed.local`,
                passwordHash: null,
                googleId: null,
                avatarUrl: null,
                isActive: false,
                deletedAt: now,
            },
        });

        // Remove favorites and notification preferences
        await prisma.favorite.deleteMany({where: {clientId}});
        await prisma.notificationPreference.deleteMany({where: {clientId}});
    }
}

export default new CustomerService();
