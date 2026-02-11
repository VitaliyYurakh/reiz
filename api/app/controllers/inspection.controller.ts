import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import inspectionService from '../services/inspection.service';
import logAudit from '../middleware/audit.middleware';

class InspectionController {
    async getByRental(req: Request, res: Response) {
        try {
            const {rentalId} = req.params;
            const inspections = await inspectionService.getByRental(parseInt(rentalId));

            return res.status(StatusCodes.OK).json({inspections});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {rentalId} = req.params;
            const user = res.locals.user;
            const inspection = await inspectionService.create({
                rentalId: parseInt(rentalId),
                inspectorId: user.id,
                ...req.body,
            });

            logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: inspection.id, action: 'CREATE', after: inspection, req});
            return res.status(StatusCodes.CREATED).json({inspection});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {inspId} = req.params;
            const inspection = await inspectionService.update(parseInt(inspId), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: parseInt(inspId), action: 'UPDATE', after: inspection, req});
            return res.status(StatusCodes.OK).json({inspection});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async addPhoto(req: Request, res: Response) {
        try {
            const {inspId} = req.params;
            const file = req.file;

            if (!file) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
            }

            const url = `/static/inspections/${file.filename}`;
            const {caption} = req.body;
            const photo = await inspectionService.addPhoto(parseInt(inspId), url, caption);

            return res.status(StatusCodes.CREATED).json({photo});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deletePhoto(req: Request, res: Response) {
        try {
            const {photoId} = req.params;
            await inspectionService.deletePhoto(parseInt(photoId));

            return res.status(StatusCodes.OK).json({msg: 'Photo deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async complete(req: Request, res: Response) {
        try {
            const {inspId} = req.params;
            const inspection = await inspectionService.complete(parseInt(inspId));

            logAudit({actorId: res.locals.user?.id, entityType: 'Inspection', entityId: parseInt(inspId), action: 'STATUS_CHANGE', after: inspection, req});
            return res.status(StatusCodes.OK).json({inspection});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new InspectionController();
