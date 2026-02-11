import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import fineService from '../services/fine.service';
import logAudit from '../middleware/audit.middleware';

class FineController {
    async getByRental(req: Request, res: Response) {
        try {
            const {rentalId} = req.params;
            const fines = await fineService.getByRental(parseInt(rentalId));

            return res.status(StatusCodes.OK).json({fines});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {rentalId} = req.params;
            const fine = await fineService.create({
                rentalId: parseInt(rentalId),
                ...req.body,
            });

            logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: fine.id, action: 'CREATE', after: fine, req});
            return res.status(StatusCodes.CREATED).json({fine});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {fineId} = req.params;
            const fine = await fineService.update(parseInt(fineId), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseInt(fineId), action: 'UPDATE', after: fine, req});
            return res.status(StatusCodes.OK).json({fine});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {fineId} = req.params;
            await fineService.delete(parseInt(fineId));

            logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseInt(fineId), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json({msg: 'Fine deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async markPaid(req: Request, res: Response) {
        try {
            const {fineId} = req.params;
            const user = res.locals.user;
            const result = await fineService.markPaid(parseInt(fineId), {
                ...req.body,
                createdByUserId: user.id,
            });

            logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseInt(fineId), action: 'STATUS_CHANGE', after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new FineController();
