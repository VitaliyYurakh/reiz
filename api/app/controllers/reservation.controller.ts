import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import reservationService from '../services/reservation.service';
import {parseId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createReservationSchema, updateReservationSchema, pickupReservationSchema, cancelReservationSchema, addReservationAddOnSchema, validate} from '../validators';

class ReservationController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const status = req.query.status as string | undefined;

        const result = await reservationService.getAll({page, limit, status});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const reservation = await reservationService.getOne(parseId(id));

        if (!reservation) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Reservation not found'});
        }

        return res.status(StatusCodes.OK).json({reservation});
    }

    async create(req: Request, res: Response) {
        const data = validate(createReservationSchema, req.body);
        const reservation = await reservationService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: reservation.id, action: 'CREATE', after: reservation, req});
        return res.status(StatusCodes.CREATED).json({reservation});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateReservationSchema, req.body);
        const before = await reservationService.getOne(parseId(id));
        const reservation = await reservationService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseId(id), action: 'UPDATE', before, after: reservation, req});
        return res.status(StatusCodes.OK).json({reservation});
    }

    async pickup(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(pickupReservationSchema, req.body);
        const before = await reservationService.getOne(parseId(id));
        const result = await reservationService.pickup(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    async cancel(req: Request, res: Response) {
        const {id} = req.params;
        const {reason} = validate(cancelReservationSchema, req.body);
        const before = await reservationService.getOne(parseId(id));
        const reservation = await reservationService.cancel(parseId(id), reason);

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: reservation, req});
        return res.status(StatusCodes.OK).json({reservation});
    }

    async noShow(req: Request, res: Response) {
        const {id} = req.params;
        const before = await reservationService.getOne(parseId(id));
        const reservation = await reservationService.noShow(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: reservation, req});
        return res.status(StatusCodes.OK).json({reservation});
    }

    async reactivate(req: Request, res: Response) {
        const {id} = req.params;
        const before = await reservationService.getOne(parseId(id));
        const reservation = await reservationService.reactivate(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Reservation', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: reservation, req});
        return res.status(StatusCodes.OK).json({reservation});
    }

    async addAddOn(req: Request, res: Response) {
        const {id} = req.params;
        const {addOnId, quantity, unitPriceMinor, currency} = validate(addReservationAddOnSchema, req.body);
        const addOn = await reservationService.addAddOn(parseId(id), addOnId, quantity || 1, unitPriceMinor, currency || 'USD');

        logAudit({actorId: res.locals.user?.id, entityType: 'ReservationAddOn', entityId: addOn.id, action: 'CREATE', after: addOn, req});
        return res.status(StatusCodes.CREATED).json({addOn});
    }

    async removeAddOn(req: Request, res: Response) {
        const {addOnId} = req.params;
        await reservationService.removeAddOn(parseId(addOnId));

        logAudit({actorId: res.locals.user?.id, entityType: 'ReservationAddOn', entityId: parseId(addOnId), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Add-on removed'});
    }
}

export default new ReservationController();
