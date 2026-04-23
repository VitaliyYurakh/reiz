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

    async listOpen(_req: Request, res: Response) {
        const fines = await fineService.listOpen();
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

    async addAttachment(req: Request, res: Response) {
        const {fineId} = req.params;
        const file = req.file;
        if (!file) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
        }
        const fileUrl = `/static/fines/${file.filename}`;
        const fine = await fineService.addAttachment(parseId(fineId), fileUrl);
        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseId(fineId), action: 'UPDATE', after: {attachments: fine.attachments}, req});
        return res.status(StatusCodes.CREATED).json({fine, fileUrl});
    }

    async removeAttachment(req: Request, res: Response) {
        const {fineId} = req.params;
        const {url} = req.body;
        if (!url) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Missing url in body'});
        }
        const fine = await fineService.removeAttachment(parseId(fineId), url);
        logAudit({actorId: res.locals.user?.id, entityType: 'Fine', entityId: parseId(fineId), action: 'UPDATE', after: {attachments: fine.attachments}, req});
        return res.status(StatusCodes.OK).json({fine});
    }
}

export default new FineController();
