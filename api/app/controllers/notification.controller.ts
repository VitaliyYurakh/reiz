import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import notificationService from '../services/notification.service';
import {parseId, parsePagination} from '../utils';
import {createTemplateSchema, sendNotificationSchema, validate} from '../validators';
import logAudit from '../middleware/audit.middleware';

class NotificationController {
    // --- Templates ---

    async getAllTemplates(req: Request, res: Response) {
        const templates = await notificationService.getTemplates();
        return res.status(StatusCodes.OK).json({templates});
    }

    async createTemplate(req: Request, res: Response) {
        const data = validate(createTemplateSchema, req.body);
        const template = await notificationService.createTemplate(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'NotificationTemplate', entityId: template.id, action: 'CREATE', after: template, req});
        return res.status(StatusCodes.CREATED).json({template});
    }

    async updateTemplate(req: Request, res: Response) {
        const {id} = req.params;
        const template = await notificationService.updateTemplate(parseId(id), req.body);

        logAudit({actorId: res.locals.user?.id, entityType: 'NotificationTemplate', entityId: parseId(id), action: 'UPDATE', after: template, req});
        return res.status(StatusCodes.OK).json({template});
    }

    // --- Send ---

    async send(req: Request, res: Response) {
        const {templateCode, ...data} = validate(sendNotificationSchema, req.body);
        const result = await notificationService.send(templateCode, data);
        return res.status(StatusCodes.OK).json(result);
    }

    // --- Logs ---

    async getLogs(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const channel = req.query.channel as string | undefined;
        const status = req.query.status as string | undefined;
        const from = req.query.from ? new Date(req.query.from as string) : undefined;
        const to = req.query.to ? new Date(req.query.to as string) : undefined;

        const result = await notificationService.getLogs({
            page,
            limit,
            channel,
            status,
            from,
            to,
        });

        return res.status(StatusCodes.OK).json(result);
    }
}

export default new NotificationController();
