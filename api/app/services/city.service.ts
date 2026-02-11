import {prisma} from '../utils';

class CityService {
    async getAll({page = 1, limit = 50, search}: {page?: number; limit?: number; search?: string}) {
        const where: any = {};

        if (search) {
            where.OR = [
                {nameUk: {contains: search, mode: 'insensitive'}},
                {nameRu: {contains: search, mode: 'insensitive'}},
                {nameEn: {contains: search, mode: 'insensitive'}},
                {slug: {contains: search, mode: 'insensitive'}},
                {region: {contains: search, mode: 'insensitive'}},
            ];
        }

        const [cities, total] = await Promise.all([
            prisma.city.findMany({
                where,
                include: {_count: {select: {pickupLocations: true}}},
                orderBy: {sortOrder: 'asc'},
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.city.count({where}),
        ]);

        return {cities, total, page, limit, pages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        return prisma.city.findUnique({
            where: {id},
            include: {
                pickupLocations: {orderBy: {sortOrder: 'asc'}},
            },
        });
    }

    async getBySlug(slug: string) {
        return prisma.city.findUnique({
            where: {slug},
            include: {
                pickupLocations: {orderBy: {sortOrder: 'asc'}},
            },
        });
    }

    async create(data: {
        slug: string;
        nameUk: string;
        nameRu: string;
        nameEn: string;
        nameLocativeUk: string;
        nameLocativeRu: string;
        nameLocativeEn: string;
        latitude: string;
        longitude: string;
        postalCode: string;
        region: string;
        sortOrder?: number;
        isPopular?: boolean;
        isActive?: boolean;
    }) {
        return prisma.city.create({data});
    }

    async update(id: number, data: any) {
        return prisma.city.update({where: {id}, data});
    }

    async delete(id: number) {
        return prisma.city.delete({where: {id}});
    }

    // ── Pickup Locations ──

    async getLocations(cityId: number) {
        return prisma.pickupLocation.findMany({
            where: {cityId},
            orderBy: {sortOrder: 'asc'},
        });
    }

    async createLocation(cityId: number, data: {
        slug: string;
        nameUk: string;
        nameRu: string;
        nameEn: string;
        type: string;
        sortOrder?: number;
        isActive?: boolean;
    }) {
        return prisma.pickupLocation.create({
            data: {...data, cityId},
        });
    }

    async updateLocation(cityId: number, locId: number, data: any) {
        return prisma.pickupLocation.update({
            where: {id: locId, cityId},
            data,
        });
    }

    async deleteLocation(cityId: number, locId: number) {
        return prisma.pickupLocation.delete({
            where: {id: locId, cityId},
        });
    }

    // ── Public (no auth) ──

    async getAllPublic() {
        return prisma.city.findMany({
            where: {isActive: true},
            include: {
                pickupLocations: {
                    where: {isActive: true},
                    orderBy: {sortOrder: 'asc'},
                },
            },
            orderBy: {sortOrder: 'asc'},
        });
    }
}

export default new CityService();
