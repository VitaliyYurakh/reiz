import {prisma} from '../utils';

class AuditService {
    async log(
        actorId: number | null,
        entityType: string,
        entityId: number,
        action: string,
        before?: any,
        after?: any,
        ip?: string,
        userAgent?: string,
    ) {
        return await prisma.auditLog.create({
            data: {
                actorId: actorId || null,
                entityType,
                entityId,
                action,
                before: before || null,
                after: after || null,
                ipAddress: ip || null,
                userAgent: userAgent || null,
            },
        });
    }

    async getAll(params: {
        page: number;
        limit: number;
        entityType?: string;
        entityId?: number;
        action?: string;
        actorId?: number;
        from?: Date;
        to?: Date;
    }) {
        const {page, limit, entityType, entityId, action, actorId, from, to} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (entityType) where.entityType = entityType;
        if (entityId) where.entityId = entityId;
        if (action) where.action = action;
        if (actorId) where.actorId = actorId;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    actor: {
                        select: {id: true, name: true, email: true},
                    },
                },
            }),
            prisma.auditLog.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }
}

export default new AuditService();
