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

    async listOpen() {
        return await prisma.fine.findMany({
            where: {isPaid: false, description: {not: {startsWith: '[СКАСОВАНО]'}}},
            orderBy: {createdAt: 'desc'},
            include: {
                rental: {select: {id: true, contractNumber: true, clientId: true}},
            },
            take: 200,
        });
    }

    async create(data: {
        rentalId: number;
        type: string;
        description: string;
        amountMinor: number;
        currency?: string;
        externalCaseNumber?: string;
        incidentAt?: string | Date;
        location?: string;
        authority?: string;
        attachments?: string[];
        inspectionId?: number;
    }) {
        // Legal requirement: TRAFFIC fines must reference an authority case + at
        // least one attachment (a photo or scan of the police notice).
        if (data.type === 'TRAFFIC') {
            if (!data.externalCaseNumber?.trim()) {
                const err: any = new Error('TRAFFIC-штраф потребує номера постанови (externalCaseNumber)');
                err.status = 400;
                throw err;
            }
            if (!data.attachments || data.attachments.length === 0) {
                const err: any = new Error('TRAFFIC-штраф потребує хоча б одного скана постанови (attachments)');
                err.status = 400;
                throw err;
            }
        }

        return await prisma.fine.create({
            data: {
                rentalId: data.rentalId,
                type: data.type,
                description: data.description,
                amountMinor: data.amountMinor,
                currency: data.currency || 'UAH',
                externalCaseNumber: data.externalCaseNumber || null,
                incidentAt: data.incidentAt ? new Date(data.incidentAt) : null,
                location: data.location || null,
                authority: data.authority || null,
                attachments: data.attachments ?? [],
                inspectionId: data.inspectionId || null,
            },
        });
    }

    async update(id: number, data: {
        type?: string;
        description?: string;
        amountMinor?: number;
        currency?: string;
        externalCaseNumber?: string | null;
        incidentAt?: string | Date | null;
        location?: string | null;
        authority?: string | null;
        attachments?: string[];
        inspectionId?: number | null;
    }) {
        const updateData: any = {...data};
        if (data.incidentAt !== undefined) {
            updateData.incidentAt = data.incidentAt ? new Date(data.incidentAt) : null;
        }
        return await prisma.fine.update({
            where: {id},
            data: updateData,
        });
    }

    async addAttachment(id: number, fileUrl: string) {
        const fine = await prisma.fine.findUnique({where: {id}});
        if (!fine) throw new Error(`Fine ${id} not found`);
        const current = Array.isArray(fine.attachments) ? (fine.attachments as string[]) : [];
        return await prisma.fine.update({
            where: {id},
            data: {attachments: [...current, fileUrl]},
        });
    }

    async removeAttachment(id: number, fileUrl: string) {
        const fine = await prisma.fine.findUnique({where: {id}});
        if (!fine) throw new Error(`Fine ${id} not found`);
        const current = Array.isArray(fine.attachments) ? (fine.attachments as string[]) : [];
        return await prisma.fine.update({
            where: {id},
            data: {attachments: current.filter((u) => u !== fileUrl)},
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
                    type: 'FINE_PAYMENT',
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
