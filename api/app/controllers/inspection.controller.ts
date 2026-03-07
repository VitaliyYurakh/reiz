import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import inspectionService from '../services/inspection.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createInspectionSchema, updateInspectionSchema, validate} from '../validators';

class InspectionController {
    async getByRental(req: Request, res: Response) {
        const {rentalId} = req.params;
        const inspections = await inspectionService.getByRental(parseId(rentalId));
        return res.status(StatusCodes.OK).json({inspections});
    }

    async create(req: Request, res: Response) {
        const {rentalId} = req.params;
        const user = res.locals.user;
        const data = validate(createInspectionSchema, req.body);
        const inspection = await inspectionService.create({
            rentalId: parseId(rentalId),
            inspectorId: user.id,
            ...data,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: inspection.id, action: 'CREATE', after: inspection, req});
        return res.status(StatusCodes.CREATED).json({inspection});
    }

    async update(req: Request, res: Response) {
        const {inspId} = req.params;
        const data = validate(updateInspectionSchema, req.body);
        const inspection = await inspectionService.update(parseId(inspId), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: parseId(inspId), action: 'UPDATE', after: inspection, req});
        return res.status(StatusCodes.OK).json({inspection});
    }

    async addPhoto(req: Request, res: Response) {
        const {inspId} = req.params;
        const file = req.file;

        if (!file) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
        }

        const url = `/static/inspections/${file.filename}`;
        const {caption} = req.body;
        const photo = await inspectionService.addPhoto(parseId(inspId), url, caption);

        return res.status(StatusCodes.CREATED).json({photo});
    }

    async deletePhoto(req: Request, res: Response) {
        const {photoId} = req.params;
        await inspectionService.deletePhoto(parseId(photoId));
        return res.status(StatusCodes.OK).json({msg: 'Photo deleted'});
    }

    async complete(req: Request, res: Response) {
        const {inspId} = req.params;
        const inspection = await inspectionService.complete(parseId(inspId));

        logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: parseId(inspId), action: 'STATUS_CHANGE', after: inspection, req});
        return res.status(StatusCodes.OK).json({inspection});
    }
}

export default new InspectionController();
