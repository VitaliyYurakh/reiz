import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import reservationService from '../services/reservation.service';
import logAudit from '../middleware/audit.middleware';

class ReservationController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string | undefined;

            const result = await reservationService.getAll({page, limit, status});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const reservation = await reservationService.getOne(parseInt(id));

            if (!reservation) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'Reservation not found'});
            }

            return res.status(StatusCodes.OK).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const reservation = await reservationService.create(req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: reservation.id, action: 'CREATE', after: reservation, req});
            return res.status(StatusCodes.CREATED).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await reservationService.getOne(parseInt(id));
            const reservation = await reservationService.update(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseInt(id), action: 'UPDATE', before, after: reservation, req});
            return res.status(StatusCodes.OK).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async pickup(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await reservationService.getOne(parseInt(id));
            const result = await reservationService.pickup(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {reason} = req.body;
            const before = await reservationService.getOne(parseInt(id));
            const reservation = await reservationService.cancel(parseInt(id), reason);

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: reservation, req});
            return res.status(StatusCodes.OK).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async noShow(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await reservationService.getOne(parseInt(id));
            const reservation = await reservationService.noShow(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: reservation, req});
            return res.status(StatusCodes.OK).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async reactivate(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await reservationService.getOne(parseInt(id));
            const reservation = await reservationService.reactivate(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: reservation, req});
            return res.status(StatusCodes.OK).json({reservation});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async addAddOn(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {addOnId, quantity, unitPriceMinor, currency} = req.body;
            const addOn = await reservationService.addAddOn(parseInt(id), addOnId, quantity || 1, unitPriceMinor, currency || 'USD');

            logAudit({actorId: res.locals.user?.id, entityType: 'ReservationAddOn', entityId: addOn.id, action: 'CREATE', after: addOn, req});
            return res.status(StatusCodes.CREATED).json({addOn});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async removeAddOn(req: Request, res: Response) {
        try {
            const {addOnId} = req.params;
            await reservationService.removeAddOn(parseInt(addOnId));

            logAudit({actorId: res.locals.user?.id, entityType: 'ReservationAddOn', entityId: parseInt(addOnId), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json({msg: 'Add-on removed'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new ReservationController();
