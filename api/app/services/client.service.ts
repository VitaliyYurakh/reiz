import {prisma} from '../utils';

/**
 * Normalize phone to canonical "+DIGITS" form.
 * Handles: "972+972532414153", "+972 53-241-4153", "0532414153", etc.
 */
function normalizePhone(phone: string): string {
    if (!phone) return phone;

    // If "+" is in the middle (e.g. "972+972..."), take from "+" onwards
    const plusIdx = phone.indexOf('+');
    let cleaned = phone;
    if (plusIdx > 0) {
        cleaned = phone.slice(plusIdx);
    }

    // Strip everything except digits
    const digits = cleaned.replace(/\D/g, '');
    if (!digits) return phone;

    return `+${digits}`;
}

/**
 * Extract just the digits from a phone for flexible matching.
 * "972+972532414153" → "972532414153"
 * "+972 53-241-4153" → "97253241415"
 */
function phoneDigits(phone: string): string {
    const normalized = normalizePhone(phone);
    return normalized.replace(/\D/g, '');
}

class ClientService {
    /**
     * Find existing client by phone or email.
     * Phone matching uses digit-only "contains" so different formats all match.
     */
    async findByPhoneOrEmail(phone?: string | null, email?: string | null) {
        if (!phone && !email) return null;

        const conditions: any[] = [];

        if (phone) {
            const digits = phoneDigits(phone);
            if (digits.length >= 6) {
                conditions.push({phone: {contains: digits, mode: 'insensitive'}, deletedAt: null});
            }
        }

        if (email) {
            conditions.push(
                {email: {equals: email, mode: 'insensitive'}, deletedAt: null},
            );
        }

        if (conditions.length === 0) return null;

        return await prisma.client.findFirst({
            where: {OR: conditions},
            orderBy: {createdAt: 'asc'},
        });
    }

    /**
     * Find or create a client. If a match by phone/email exists,
     * returns the existing client (optionally updating missing fields).
     * Otherwise creates a new one.
     */
    async findOrCreate(data: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string | null;
        source?: string;
    }, tx?: any) {
        const db = tx || prisma;

        // Try to find existing client
        const existing = await this._findByPhoneOrEmailInTx(db, data.phone, data.email);

        if (existing) {
            // Optionally fill in missing fields on existing record
            const updates: any = {};
            if (!existing.email && data.email) updates.email = data.email;
            if (!existing.firstName && data.firstName) updates.firstName = data.firstName;
            if (!existing.lastName && data.lastName) updates.lastName = data.lastName;

            if (Object.keys(updates).length > 0) {
                return {
                    client: await db.client.update({where: {id: existing.id}, data: updates}),
                    isNew: false,
                };
            }

            return {client: existing, isNew: false};
        }

        // Create new client
        const createData: any = {...data};
        if (data.phone) {
            createData.phone = normalizePhone(data.phone);
        }

        return {
            client: await db.client.create({data: createData}),
            isNew: true,
        };
    }

    /**
     * Internal: find by phone/email within a given transaction context.
     * Uses digit-only "contains" matching so "+972532414153", "972+972532414153",
     * "+972 53-241-4153" all match each other.
     */
    private async _findByPhoneOrEmailInTx(db: any, phone?: string | null, email?: string | null) {
        if (!phone && !email) return null;

        const conditions: any[] = [];

        if (phone) {
            const digits = phoneDigits(phone);
            if (digits.length >= 6) {
                // Use contains on digit substring to match regardless of stored format
                conditions.push({phone: {contains: digits, mode: 'insensitive'}, deletedAt: null});
            }
        }

        if (email) {
            conditions.push(
                {email: {equals: email, mode: 'insensitive'}, deletedAt: null},
            );
        }

        if (conditions.length === 0) return null;

        return await db.client.findFirst({
            where: {OR: conditions},
            orderBy: {createdAt: 'asc'},
        });
    }

    /**
     * Check for potential duplicates before manual creation.
     * Returns list of matching clients.
     */
    async findDuplicates(phone?: string, email?: string) {
        if (!phone && !email) return [];

        const conditions: any[] = [];

        if (phone) {
            const digits = phoneDigits(phone);
            if (digits.length >= 6) {
                conditions.push({phone: {contains: digits, mode: 'insensitive'}, deletedAt: null});
            }
        }

        if (email) {
            conditions.push({email: {equals: email, mode: 'insensitive'}, deletedAt: null});
        }

        if (conditions.length === 0) return [];

        return await prisma.client.findMany({
            where: {OR: conditions},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                createdAt: true,
                source: true,
            },
            take: 10,
        });
    }

    async getAll(params: {
        page: number;
        limit: number;
        search?: string;
        deletedAt?: boolean;
    }) {
        const {page, limit, search, deletedAt} = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        // By default, only show non-deleted clients
        if (deletedAt) {
            where.deletedAt = {not: null};
        } else {
            where.deletedAt = null;
        }

        if (search) {
            where.OR = [
                {firstName: {contains: search, mode: 'insensitive'}},
                {lastName: {contains: search, mode: 'insensitive'}},
                {phone: {contains: search, mode: 'insensitive'}},
                {email: {contains: search, mode: 'insensitive'}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.client.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    ratingAuthor: {select: {id: true, email: true}},
                },
            }),
            prisma.client.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        const client = await prisma.client.findUnique({
            where: {id},
            include: {
                documents: true,
                rentalRequests: {
                    orderBy: {createdAt: 'desc'},
                    include: {
                        car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    },
                },
                reservations: {
                    orderBy: {createdAt: 'desc'},
                    include: {
                        car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    },
                },
                rentals: {
                    orderBy: {createdAt: 'desc'},
                    include: {
                        car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    },
                },
                ratingAuthor: {select: {id: true, email: true}},
                transactions: {
                    orderBy: {createdAt: 'desc'},
                    take: 20,
                },
            },
        });
        return client;
    }

    async create(data: {
        firstName: string;
        lastName: string;
        middleName?: string;
        phone: string;
        email?: string;
        dateOfBirth?: string | Date;
        driverLicenseNo?: string;
        driverLicenseExpiry?: string | Date;
        passportNo?: string;
        nationalId?: string;
        address?: string;
        city?: string;
        country?: string;
        notes?: string;
        source?: string;
    }) {
        const createData: any = {...data};
        if (data.phone) {
            createData.phone = normalizePhone(data.phone);
        }
        if (data.dateOfBirth) {
            createData.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (data.driverLicenseExpiry) {
            createData.driverLicenseExpiry = new Date(data.driverLicenseExpiry);
        }
        return await prisma.client.create({data: createData});
    }

    async update(id: number, data: {
        firstName?: string;
        lastName?: string;
        middleName?: string;
        phone?: string;
        email?: string;
        dateOfBirth?: string | Date;
        driverLicenseNo?: string;
        driverLicenseExpiry?: string | Date;
        passportNo?: string;
        nationalId?: string;
        address?: string;
        city?: string;
        country?: string;
        notes?: string;
        source?: string;
    }) {
        const updateData: any = {...data};
        if (data.phone) {
            updateData.phone = normalizePhone(data.phone);
        }
        if (data.dateOfBirth) {
            updateData.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (data.driverLicenseExpiry) {
            updateData.driverLicenseExpiry = new Date(data.driverLicenseExpiry);
        }
        return await prisma.client.update({
            where: {id},
            data: updateData,
        });
    }

    async softDelete(id: number) {
        return await prisma.client.update({
            where: {id},
            data: {deletedAt: new Date()},
        });
    }

    async setRating(id: number, rating: number, reason: string, authorId: number) {
        return await prisma.client.update({
            where: {id},
            data: {
                rating,
                ratingReason: reason,
                ratingAuthorId: authorId,
            },
        });
    }

    async uploadDocument(clientId: number, data: {
        type: string;
        fileName: string;
        fileUrl: string;
    }) {
        return await prisma.clientDocument.create({
            data: {
                clientId,
                type: data.type,
                fileName: data.fileName,
                fileUrl: data.fileUrl,
            },
        });
    }

    async deleteDocument(clientId: number, docId: number) {
        return await prisma.clientDocument.delete({
            where: {id: docId, clientId},
        });
    }

    async block(id: number, reason: string) {
        return await prisma.client.update({
            where: {id},
            data: {
                isBlocked: true,
                blockReason: reason,
                blockedAt: new Date(),
            },
        });
    }

    async unblock(id: number) {
        return await prisma.client.update({
            where: {id},
            data: {
                isBlocked: false,
                blockReason: null,
                blockedAt: null,
            },
        });
    }

    async getHistory(id: number) {
        const [rentals, reservations, rentalRequests] = await Promise.all([
            prisma.rental.findMany({
                where: {clientId: id},
                orderBy: {createdAt: 'desc'},
                include: {
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                    fines: true,
                    transactions: true,
                },
            }),
            prisma.reservation.findMany({
                where: {clientId: id},
                orderBy: {createdAt: 'desc'},
                include: {
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                },
            }),
            prisma.rentalRequest.findMany({
                where: {clientId: id},
                orderBy: {createdAt: 'desc'},
                include: {
                    car: {select: {id: true, brand: true, model: true, plateNumber: true}},
                },
            }),
        ]);

        return {rentals, reservations, rentalRequests};
    }
}

export default new ClientService();
