import {prisma} from '../utils';

class InspectionService {
    async getByRental(rentalId: number) {
        return await prisma.inspection.findMany({
            where: {rentalId},
            orderBy: {createdAt: 'desc'},
            include: {
                photos: true,
                inspector: {select: {id: true, email: true}},
            },
        });
    }

    async create(data: {
        rentalId: number;
        type: string;
        inspectorId?: number;
        odometer?: number;
        fuelLevel?: number;
        cleanlinessOk?: boolean;
        checklist?: any;
        damages?: any;
        notes?: string;
    }) {
        // Limit one completed inspection per type per rental
        const existing = await prisma.inspection.findFirst({
            where: {
                rentalId: data.rentalId,
                type: data.type,
                completedAt: {not: null},
            },
        });
        if (existing) {
            throw new Error(
                `Інспекція типу "${data.type}" вже завершена для цієї оренди (ID: ${existing.id}). Відредагуйте існуючу.`,
            );
        }

        return await prisma.inspection.create({
            data: {
                rentalId: data.rentalId,
                type: data.type,
                inspectorId: data.inspectorId || null,
                odometer: data.odometer || null,
                fuelLevel: data.fuelLevel || null,
                cleanlinessOk: data.cleanlinessOk !== undefined ? data.cleanlinessOk : true,
                checklist: data.checklist || null,
                damages: data.damages || null,
                notes: data.notes || null,
            },
            include: {
                photos: true,
                inspector: {select: {id: true, email: true}},
            },
        });
    }

    async update(id: number, data: {
        odometer?: number;
        fuelLevel?: number;
        cleanlinessOk?: boolean;
        checklist?: any;
        damages?: any;
        notes?: string;
    }) {
        return await prisma.inspection.update({
            where: {id},
            data,
            include: {
                photos: true,
                inspector: {select: {id: true, email: true}},
            },
        });
    }

    async addPhoto(inspectionId: number, url: string, caption?: string) {
        return await prisma.inspectionPhoto.create({
            data: {
                inspectionId,
                url,
                caption: caption || null,
            },
        });
    }

    async deletePhoto(photoId: number) {
        return await prisma.inspectionPhoto.delete({
            where: {id: photoId},
        });
    }

    async complete(id: number) {
        return await prisma.inspection.update({
            where: {id},
            data: {completedAt: new Date()},
            include: {
                photos: true,
                inspector: {select: {id: true, email: true}},
            },
        });
    }
}

export default new InspectionService();
