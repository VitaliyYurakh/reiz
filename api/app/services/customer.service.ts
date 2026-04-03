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
    }) {
        const updateData: any = {};
        if (data.firstName !== undefined) updateData.firstName = data.firstName;
        if (data.lastName !== undefined) updateData.lastName = data.lastName;
        if (data.middleName !== undefined) updateData.middleName = data.middleName;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.country !== undefined) updateData.country = data.country;
        if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth);

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
                        rentalTariff: {orderBy: {minDays: 'asc'}, take: 1},
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
