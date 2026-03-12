import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import serviceEventService from '../services/service-event.service';
import {parseId, parseOptionalId, parsePagination, NotFoundError, BadRequestError} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createServiceEventSchema, updateServiceEventSchema, validate} from '../validators';

class ServiceEventController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const carId = parseOptionalId(req.query.carId as string, 'carId');
        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;

        const result = await serviceEventService.getAll({page, limit, carId, from, to});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const serviceEvent = await serviceEventService.getOne(parseId(id));

        if (!serviceEvent) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Service event not found'});
        }

        return res.status(StatusCodes.OK).json({serviceEvent});
    }

    async create(req: Request, res: Response) {
        const data = validate(createServiceEventSchema, req.body);
        const serviceEvent = await serviceEventService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: serviceEvent.id, action: 'CREATE', after: serviceEvent, req});
        return res.status(StatusCodes.CREATED).json({serviceEvent});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateServiceEventSchema, req.body);
        const before = await serviceEventService.getOne(parseId(id));
        const serviceEvent = await serviceEventService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: parseId(id), action: 'UPDATE', before, after: serviceEvent, req});
        return res.status(StatusCodes.OK).json({serviceEvent});
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        await serviceEventService.delete(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'ServiceEvent', entityId: parseId(id), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Service event deleted'});
    }

    async addPhoto(req: Request, res: Response) {
        const {id} = req.params;
        const serviceEventId = parseId(id);

        if (!req.file) {
            throw new BadRequestError('No file uploaded');
        }

        const event = await serviceEventService.getOne(serviceEventId);
        if (!event) throw new NotFoundError('Service event not found');

        const label = req.body.label as string | undefined;
        const url = `/static/uploads/${path.basename(req.file.path)}`;

        const photo = await serviceEventService.addPhoto(serviceEventId, url, label);
        return res.status(StatusCodes.CREATED).json({photo});
    }

    async deletePhoto(req: Request, res: Response) {
        const {photoId} = req.params;
        const id = parseId(photoId, 'photoId');

        // Find the photo to get its file path before deleting
        const {prisma} = await import('../utils');
        const photo = await prisma.serviceEventPhoto.findUnique({where: {id}});
        if (!photo) throw new NotFoundError('Photo not found');

        await serviceEventService.deletePhoto(id);

        // Delete file from disk
        const filePath = path.resolve(`./uploads/${path.basename(photo.url)}`);
        fs.unlink(filePath, () => {});

        return res.status(StatusCodes.OK).json({msg: 'Photo deleted'});
    }
}

export default new ServiceEventController();
