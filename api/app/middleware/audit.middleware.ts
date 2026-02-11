import {Request} from 'express';
import {logger, prisma} from '../utils';

interface AuditLogParams {
    actorId?: number;
    entityType: string;
    entityId?: number | string;
    action: string;
    details?: string;
    before?: Record<string, any>;
    after?: Record<string, any>;
    req?: Request;
}

const logAudit = async ({actorId, entityType, entityId, action, details, before, after, req}: AuditLogParams) => {
    try {
        await prisma.auditLog.create({
            data: {
                actorId,
                entityType,
                entityId: entityId ? Number(entityId) : 0,
                action,
                before: before ? JSON.parse(JSON.stringify(before)) : undefined,
                after: after ? JSON.parse(JSON.stringify(after)) : undefined,
                ipAddress: req?.ip || null,
                userAgent: req?.headers['user-agent'] || null,
            },
        });
    } catch (error) {
        logger.error({msg: 'Failed to write audit log', error});
    }
};

export default logAudit;
