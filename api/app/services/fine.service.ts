import {prisma} from '../utils';

class FineService {
    async getByRental(rentalId: number) {
        return await prisma.fine.findMany({
            where: {rentalId},
            orderBy: {createdAt: 'desc'},
            include: {
                transaction: true,
            },
        });
    }

    async create(data: {
        rentalId: number;
        type: string;
        description: string;
        amountMinor: number;
        currency?: string;
    }) {
        return await prisma.fine.create({
            data: {
                rentalId: data.rentalId,
                type: data.type,
                description: data.description,
                amountMinor: data.amountMinor,
                currency: data.currency || 'UAH',
            },
        });
    }

    async update(id: number, data: {
        type?: string;
        description?: string;
        amountMinor?: number;
        currency?: string;
    }) {
        return await prisma.fine.update({
            where: {id},
            data,
        });
    }

    async delete(id: number) {
        // Check if fine has a linked transaction — soft-delete to preserve FK
        const fine = await prisma.fine.findUnique({
            where: {id},
            include: {transaction: true},
        });

        if (!fine) {
            throw new Error(`Fine with id ${id} not found`);
        }

        if (fine.transaction) {
            // Soft-delete: mark as cancelled but keep the record for financial integrity
            return await prisma.fine.update({
                where: {id},
                data: {
                    description: `[СКАСОВАНО] ${fine.description}`,
                    amountMinor: 0,
                },
            });
        }

        // No linked transaction — safe to hard-delete
        return await prisma.fine.delete({
            where: {id},
        });
    }

    async markPaid(id: number, transactionData: {
        accountId: number;
        amountMinor: number;
        currency: string;
        fxRate?: number;
        amountUahMinor: number;
        createdByUserId?: number;
    }) {
        const fine = await prisma.fine.findUnique({
            where: {id},
            include: {rental: {select: {clientId: true}}},
        });

        if (!fine) {
            throw new Error(`Fine with id ${id} not found`);
        }

        if (fine.isPaid) {
            throw new Error(`Fine ${id} is already marked as paid`);
        }

        // Validate payment amount covers the fine
        if (transactionData.amountUahMinor < fine.amountMinor) {
            throw new Error(
                `Сума оплати (${transactionData.amountUahMinor / 100} грн) менша за суму штрафу (${fine.amountMinor / 100} грн)`,
            );
        }

        return await prisma.$transaction(async (tx) => {
            // Create the payment transaction
            const transaction = await tx.transaction.create({
                data: {
                    type: 'fine_payment',
                    accountId: transactionData.accountId,
                    direction: 'in',
                    amountMinor: transactionData.amountMinor,
                    currency: transactionData.currency,
                    fxRate: transactionData.fxRate || 1.0,
                    amountUahMinor: transactionData.amountUahMinor,
                    description: `Payment for fine #${id}: ${fine.type} - ${fine.description}`,
                    clientId: fine.rental.clientId,
                    rentalId: fine.rentalId,
                    fineId: id,
                    createdByUserId: transactionData.createdByUserId || null,
                },
            });

            // Mark the fine as paid
            const updatedFine = await tx.fine.update({
                where: {id},
                data: {isPaid: true},
                include: {transaction: true},
            });

            return {fine: updatedFine, transaction};
        });
    }
}

export default new FineService();
