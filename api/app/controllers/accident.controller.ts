import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import accidentService from '../services/accident.service';
import {parseId, parseOptionalId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {validate, createAccidentSchema, updateAccidentSchema} from '../validators';

class AccidentController {
    async list(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const result = await accidentService.list({
            page, limit,
            status: req.query.status as string | undefined,
            carId: parseOptionalId(req.query.carId as string | undefined, 'carId'),
            clientId: parseOptionalId(req.query.clientId as string | undefined, 'clientId'),
            search: req.query.search as string | undefined,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const accident = await accidentService.getOne(parseId(req.params.id));
        if (!accident) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Accident not found'});
        res.status(StatusCodes.OK).json({accident});
    }

    async create(req: Request, res: Response) {
        const data = validate(createAccidentSchema, req.body);
        const accident = await accidentService.create({...data, reporterUserId: res.locals.user?.id});
        logAudit({actorId: res.locals.user?.id, entityType: 'Accident', entityId: accident!.id, action: 'CREATE', after: accident, req});
        res.status(StatusCodes.CREATED).json({accident});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateAccidentSchema, req.body);
        const accident = await accidentService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Accident', entityId: id, action: 'UPDATE', after: accident, req});
        res.status(StatusCodes.OK).json({accident});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await accidentService.delete(id);
        logAudit({actorId: res.locals.user?.id, entityType: 'Accident', entityId: id, action: 'DELETE', req});
        res.status(StatusCodes.OK).json({msg: 'Accident deleted'});
    }

    async stats(_req: Request, res: Response) {
        res.status(StatusCodes.OK).json(await accidentService.stats());
    }
}

export default new AccidentController();
