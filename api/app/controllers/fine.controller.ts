import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import fineService from '../services/fine.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createFineSchema, updateFineSchema, markFinePaidSchema, validate} from '../validators';

class FineController {
    async getByRental(req: Request, res: Response) {
        const {rentalId} = req.params;
        const fines = await fineService.getByRental(parseId(rentalId));
        return res.status(StatusCodes.OK).json({fines});
    }

    async create(req: Request, res: Response) {
        const {rentalId} = req.params;
        const data = validate(createFineSchema, req.body);
        const fine = await fineService.create({
            rentalId: parseId(rentalId),
            ...data,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: fine.id, action: 'CREATE', after: fine, req});
        return res.status(StatusCodes.CREATED).json({fine});
    }

    async update(req: Request, res: Response) {
        const {fineId} = req.params;
        const data = validate(updateFineSchema, req.body);
        const fine = await fineService.update(parseId(fineId), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseId(fineId), action: 'UPDATE', after: fine, req});
        return res.status(StatusCodes.OK).json({fine});
    }

    async delete(req: Request, res: Response) {
        const {fineId} = req.params;
        await fineService.delete(parseId(fineId));

        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseId(fineId), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Fine deleted'});
    }

    async markPaid(req: Request, res: Response) {
        const {fineId} = req.params;
        const user = res.locals.user;
        const data = validate(markFinePaidSchema, req.body);
        const result = await fineService.markPaid(parseId(fineId), {
            ...data,
            createdByUserId: user.id,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseId(fineId), action: 'STATUS_CHANGE', after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }
}

export default new FineController();
