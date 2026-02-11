import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import rentalRequestService from '../services/rental-request.service';
import logAudit from '../middleware/audit.middleware';

class RentalRequestController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string | undefined;

            const result = await rentalRequestService.getAll({page, limit, status});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const rentalRequest = await rentalRequestService.getOne(parseInt(id));

            if (!rentalRequest) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'Rental request not found'});
            }

            return res.status(StatusCodes.OK).json({rentalRequest});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const rentalRequest = await rentalRequestService.create(req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: rentalRequest.id, action: 'CREATE', after: rentalRequest, req});
            return res.status(StatusCodes.CREATED).json({rentalRequest});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await rentalRequestService.getOne(parseInt(id));
            const rentalRequest = await rentalRequestService.update(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseInt(id), action: 'UPDATE', before, after: rentalRequest, req});
            return res.status(StatusCodes.OK).json({rentalRequest});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async approve(req: Request, res: Response) {
        try {
            const {id} = req.params;
            logger.info({body: req.body, id}, 'approve rental request');
            const before = await rentalRequestService.getOne(parseInt(id));
            const result = await rentalRequestService.approve(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            const msg = error.message || 'Unknown error';
            // Business logic errors — 400, not 500
            if (
                msg.includes('зайняте') ||
                msg.includes('пізніше') ||
                msg.includes('not found') ||
                msg.includes('already approved')
            ) {
                logger.warn({msg, id: req.params.id}, 'approve rental request validation error');
                return res.status(StatusCodes.BAD_REQUEST).json({msg});
            }

            logger.error({err: error, stack: error.stack}, 'approve rental request failed');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async reject(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {reason} = req.body;
            const before = await rentalRequestService.getOne(parseInt(id));
            const rentalRequest = await rentalRequestService.reject(parseInt(id), reason);

            logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: rentalRequest, req});
            return res.status(StatusCodes.OK).json({rentalRequest});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new RentalRequestController();
