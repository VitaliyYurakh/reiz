import {InventoryCategory as PInventoryCategory, InventoryStatus as PInventoryStatus, Currency} from '@prisma/client';
import {prisma, NotFoundError} from '../utils';
import {InventoryStatus} from '../utils/constants';

interface CreateInventoryItemInput {
    name: string;
    category?: PInventoryCategory;
    serialNumber?: string;
    status?: PInventoryStatus;
    quantity?: number;
    purchaseDate?: string | Date;
    purchasePriceMinor?: number;
    currentValueMinor?: number;
    currency?: Currency;
    locationId?: number;
    responsibleUserId?: number;
    notes?: string;
    attachments?: string[];
}

class InventoryService {
    async list(params: {page: number; limit: number; status?: string; category?: string; locationId?: number; responsibleUserId?: number; search?: string}) {
        const {page, limit, status, category, locationId, responsibleUserId, search} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;
        if (locationId) where.locationId = locationId;
        if (responsibleUserId) where.responsibleUserId = responsibleUserId;
        if (search?.trim()) {
            const q = search.trim();
            where.OR = [
                {name: {contains: q, mode: 'insensitive'}},
                {serialNumber: {contains: q, mode: 'insensitive'}},
                {notes: {contains: q, mode: 'insensitive'}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.inventoryItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{status: 'asc'}, {name: 'asc'}],
                include: {
                    location: {select: {id: true, nameUk: true, nameEn: true}},
                    responsibleUser: {select: {id: true, name: true, email: true}},
                },
            }),
            prisma.inventoryItem.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return await prisma.inventoryItem.findUnique({
            where: {id},
            include: {
                location: true,
                responsibleUser: {select: {id: true, name: true, email: true}},
            },
        });
    }

    async create(data: CreateInventoryItemInput) {
        const item = await prisma.inventoryItem.create({
            data: {
                name: data.name,
                category: data.category ?? 'TOOL',
                serialNumber: data.serialNumber ?? null,
                status: data.status ?? InventoryStatus.AVAILABLE,
                quantity: data.quantity ?? 1,
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
                purchasePriceMinor: data.purchasePriceMinor ?? null,
                currentValueMinor: data.currentValueMinor ?? null,
                currency: data.currency ?? 'UAH',
                locationId: data.locationId ?? null,
                responsibleUserId: data.responsibleUserId ?? null,
                assignedAt: data.responsibleUserId ? new Date() : null,
                notes: data.notes ?? null,
                attachments: (data.attachments ?? []) as any,
            },
        });
        return item;
    }

    async update(id: number, data: any) {
        const existing = await prisma.inventoryItem.findUnique({where: {id}});
        if (!existing) throw new NotFoundError(`InventoryItem ${id} not found`);

        const updateData: any = {};
        for (const k of [
            'name', 'category', 'serialNumber', 'status', 'quantity',
            'purchasePriceMinor', 'currentValueMinor', 'currency',
            'locationId', 'notes',
        ] as const) {
            if (data[k] !== undefined) updateData[k] = data[k];
        }
        if (data.purchaseDate !== undefined) {
            updateData.purchaseDate = data.purchaseDate ? new Date(data.purchaseDate as any) : null;
        }
        if (data.attachments !== undefined) updateData.attachments = data.attachments as any;

        // Track responsibility transitions: stamp assignedAt when a new owner takes the item.
        if (data.responsibleUserId !== undefined) {
            updateData.responsibleUserId = data.responsibleUserId;
            if (data.responsibleUserId !== existing.responsibleUserId) {
                updateData.assignedAt = data.responsibleUserId ? new Date() : null;
            }
            // Auto-set status to ASSIGNED when handed out, AVAILABLE when handed back.
            if (data.status === undefined) {
                if (data.responsibleUserId && existing.status === InventoryStatus.AVAILABLE) {
                    updateData.status = InventoryStatus.ASSIGNED;
                } else if (!data.responsibleUserId && existing.status === InventoryStatus.ASSIGNED) {
                    updateData.status = InventoryStatus.AVAILABLE;
                }
            }
        }

        return await prisma.inventoryItem.update({
            where: {id},
            data: updateData,
            include: {
                location: true,
                responsibleUser: {select: {id: true, name: true, email: true}},
            },
        });
    }

    async delete(id: number) {
        await prisma.inventoryItem.delete({where: {id}});
    }

    async stats() {
        const [total, available, assigned, maintenance, lost] = await Promise.all([
            prisma.inventoryItem.count(),
            prisma.inventoryItem.count({where: {status: InventoryStatus.AVAILABLE}}),
            prisma.inventoryItem.count({where: {status: InventoryStatus.ASSIGNED}}),
            prisma.inventoryItem.count({where: {status: InventoryStatus.MAINTENANCE}}),
            prisma.inventoryItem.count({where: {status: InventoryStatus.LOST}}),
        ]);
        const value = await prisma.inventoryItem.aggregate({_sum: {currentValueMinor: true}});
        return {
            total, available, assigned, maintenance, lost,
            totalValueMinor: value._sum.currentValueMinor ?? 0,
        };
    }
}

export default new InventoryService();
