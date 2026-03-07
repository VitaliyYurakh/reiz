import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import rentalService from '../services/rental.service';
import {parseId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createRentalSchema, updateRentalSchema, completeRentalSchema, cancelRentalSchema, extendRentalSchema, validate} from '../validators';

class RentalController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const status = req.query.status as string | undefined;

        const result = await rentalService.getAll({page, limit, status});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const rental = await rentalService.getOne(parseId(id));

        if (!rental) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Rental not found'});
        }

        return res.status(StatusCodes.OK).json({rental});
    }

    async create(req: Request, res: Response) {
        const data = validate(createRentalSchema, req.body);
        const rental = await rentalService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: rental.id, action: 'CREATE', after: rental, req});
        return res.status(StatusCodes.CREATED).json({rental});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const rental = await rentalService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'UPDATE', before, after: rental, req});
        return res.status(StatusCodes.OK).json({rental});
    }

    async complete(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(completeRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const result = await rentalService.complete(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    async cancel(req: Request, res: Response) {
        const {id} = req.params;
        const {reason, depositAccountId} = validate(cancelRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const result = await rentalService.cancel(parseId(id), reason, depositAccountId);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    async extend(req: Request, res: Response) {
        const {id} = req.params;
        const {newReturnDate, reason} = validate(extendRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const rental = await rentalService.extend(parseId(id), newReturnDate, reason);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'UPDATE', before, after: rental, req});
        return res.status(StatusCodes.OK).json({rental});
    }
}

export default new RentalController();
