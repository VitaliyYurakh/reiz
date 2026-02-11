import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import auditService from '../services/audit.service';

class AuditController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const entityType = req.query.entityType as string | undefined;
            const entityId = req.query.entityId
                ? parseInt(req.query.entityId as string)
                : undefined;
            const action = req.query.action as string | undefined;
            const actorId = req.query.actorId
                ? parseInt(req.query.actorId as string)
                : undefined;
            const from = req.query.from as string | undefined;
            const to = req.query.to as string | undefined;

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
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new AuditController();
