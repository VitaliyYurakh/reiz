import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import auditService from '../services/audit.service';
import {parseOptionalId, parsePagination} from '../utils';

class AuditController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const entityType = req.query.entityType as string | undefined;
        const entityId = parseOptionalId(req.query.entityId as string, 'entityId');
        const action = req.query.action as string | undefined;
        const actorId = parseOptionalId(req.query.actorId as string, 'actorId');
        const from = req.query.from ? new Date(req.query.from as string) : undefined;
        const to = req.query.to ? new Date(req.query.to as string) : undefined;

        const result = await auditService.getAll({
            page,
            limit,
            entityType,
            entityId,
            action,
            actorId,
            from,
            to,
        });

        return res.status(StatusCodes.OK).json(result);
    }
}

export default new AuditController();
