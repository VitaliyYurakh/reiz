import {prisma} from '../utils';

class FinanceService {
    // --- Account CRUD ---

    async getAccounts(params?: {isActive?: boolean}) {
        const where: any = {};
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.account.findMany({
            where,
            orderBy: {createdAt: 'desc'},
        });
    }

    async createAccount(data: {
        name: string;
        type: string;
        currency?: string;
        isActive?: boolean;
    }) {
        return await prisma.account.create({
            data: {
                name: data.name,
                type: data.type,
                currency: data.currency || 'UAH',
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateAccount(id: number, data: {
        name?: string;
        type?: string;
        currency?: string;
        isActive?: boolean;
    }) {
        return await prisma.account.update({
            where: {id},
            data,
        });
    }

    // --- Transactions ---

    async createTransaction(data: {
        type: string;
        accountId: number;
        direction: string;
        amountMinor: number;
        currency: string;
        fxRate?: number;
        amountUahMinor: number;
        description?: string;
        clientId?: number;
        rentalId?: number;
        reservationId?: number;
        fineId?: number;
        createdByUserId?: number;
    }) {
        return await prisma.transaction.create({
            data: {
                type: data.type,
                accountId: data.accountId,
                direction: data.direction,
                amountMinor: data.amountMinor,
                currency: data.currency,
                fxRate: data.fxRate || 1.0,
                amountUahMinor: data.amountUahMinor,
                description: data.description || null,
                clientId: data.clientId || null,
                rentalId: data.rentalId || null,
                reservationId: data.reservationId || null,
                fineId: data.fineId || null,
                createdByUserId: data.createdByUserId || null,
            },
            include: {
                account: true,
                client: {select: {id: true, firstName: true, lastName: true}},
                rental: {select: {id: true, contractNumber: true}},
                createdBy: {select: {id: true, email: true}},
            },
        });
    }

    async getTransactions(params: {
        page: number;
        limit: number;
        accountId?: number;
        type?: string;
        clientId?: number;
        rentalId?: number;
        from?: string | Date;
        to?: string | Date;
    }) {
        const {page, limit, accountId, type, clientId, rentalId, from, to} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (accountId) where.accountId = accountId;
        if (type) where.type = type;
        if (clientId) where.clientId = clientId;
        if (rentalId) where.rentalId = rentalId;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    account: {select: {id: true, name: true, type: true}},
                    client: {select: {id: true, firstName: true, lastName: true}},
                    rental: {select: {id: true, contractNumber: true}},
                    reservation: {select: {id: true}},
                    fine: {select: {id: true, type: true}},
                    createdBy: {select: {id: true, email: true}},
                },
            }),
            prisma.transaction.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getSummary(from: string | Date, to: string | Date) {
        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            include: {
                account: {select: {id: true, name: true, type: true}},
            },
        });

        // Summarize by account
        const byAccount: Record<number, {
            accountId: number;
            accountName: string;
            accountType: string;
            totalIn: number;
            totalOut: number;
            net: number;
        }> = {};

        // Summarize by type
        const byType: Record<string, {
            type: string;
            totalIn: number;
            totalOut: number;
            net: number;
        }> = {};

        let totalIn = 0;
        let totalOut = 0;

        for (const tx of transactions) {
            const amountUah = tx.amountUahMinor;
            const isIn = tx.direction === 'in';

            // By account
            if (!byAccount[tx.accountId]) {
                byAccount[tx.accountId] = {
                    accountId: tx.accountId,
                    accountName: tx.account.name,
                    accountType: tx.account.type,
                    totalIn: 0,
                    totalOut: 0,
                    net: 0,
                };
            }
            if (isIn) {
                byAccount[tx.accountId].totalIn += amountUah;
                totalIn += amountUah;
            } else {
                byAccount[tx.accountId].totalOut += amountUah;
                totalOut += amountUah;
            }
            byAccount[tx.accountId].net = byAccount[tx.accountId].totalIn - byAccount[tx.accountId].totalOut;

            // By type
            if (!byType[tx.type]) {
                byType[tx.type] = {type: tx.type, totalIn: 0, totalOut: 0, net: 0};
            }
            if (isIn) {
                byType[tx.type].totalIn += amountUah;
            } else {
                byType[tx.type].totalOut += amountUah;
            }
            byType[tx.type].net = byType[tx.type].totalIn - byType[tx.type].totalOut;
        }

        return {
            period: {from, to},
            totalIn,
            totalOut,
            net: totalIn - totalOut,
            byAccount: Object.values(byAccount),
            byType: Object.values(byType),
        };
    }

    async getRentalBalance(rentalId: number) {
        const transactions = await prisma.transaction.findMany({
            where: {rentalId},
            orderBy: {createdAt: 'asc'},
        });

        let totalCharged = 0;
        let totalPaid = 0;

        for (const tx of transactions) {
            if (tx.direction === 'in') {
                totalPaid += tx.amountUahMinor;
            } else {
                totalCharged += tx.amountUahMinor;
            }
        }

        return {
            rentalId,
            totalCharged,
            totalPaid,
            balance: totalPaid - totalCharged,
            transactions,
        };
    }
}

export default new FinanceService();
