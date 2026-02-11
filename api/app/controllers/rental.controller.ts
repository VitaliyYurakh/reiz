import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import rentalService from '../services/rental.service';
import logAudit from '../middleware/audit.middleware';

class RentalController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string | undefined;

            const result = await rentalService.getAll({page, limit, status});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const rental = await rentalService.getOne(parseInt(id));

            if (!rental) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'Rental not found'});
            }

            return res.status(StatusCodes.OK).json({rental});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const rental = await rentalService.create(req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: rental.id, action: 'CREATE', after: rental, req});
            return res.status(StatusCodes.CREATED).json({rental});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await rentalService.getOne(parseInt(id));
            const rental = await rentalService.update(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseInt(id), action: 'UPDATE', before, after: rental, req});
            return res.status(StatusCodes.OK).json({rental});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async complete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await rentalService.getOne(parseInt(id));
            const result = await rentalService.complete(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {reason, depositAccountId} = req.body;
            const before = await rentalService.getOne(parseInt(id));
            const result = await rentalService.cancel(parseInt(id), reason, depositAccountId);

            logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async extend(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {newReturnDate, reason} = req.body;
            const before = await rentalService.getOne(parseInt(id));
            const rental = await rentalService.extend(parseInt(id), newReturnDate, reason);

            logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseInt(id), action: 'UPDATE', before, after: rental, req});
            return res.status(StatusCodes.OK).json({rental});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new RentalController();
