import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import serviceEventService from '../services/service-event.service';
import logAudit from '../middleware/audit.middleware';

class ServiceEventController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const carId = req.query.carId
                ? parseInt(req.query.carId as string)
                : undefined;
            const from = req.query.from as string | undefined;
            const to = req.query.to as string | undefined;

            const result = await serviceEventService.getAll({page, limit, carId, from, to});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const serviceEvent = await serviceEventService.getOne(parseInt(id));

            if (!serviceEvent) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'Service event not found'});
            }

            return res.status(StatusCodes.OK).json({serviceEvent});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const serviceEvent = await serviceEventService.create(req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: serviceEvent.id, action: 'CREATE', after: serviceEvent, req});
            return res.status(StatusCodes.CREATED).json({serviceEvent});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await serviceEventService.getOne(parseInt(id));
            const serviceEvent = await serviceEventService.update(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: parseInt(id), action: 'UPDATE', before, after: serviceEvent, req});
            return res.status(StatusCodes.OK).json({serviceEvent});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await serviceEventService.delete(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: parseInt(id), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json({msg: 'Service event deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new ServiceEventController();
