import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import notificationService from '../services/notification.service';
import {createTemplateSchema, sendNotificationSchema, validate, ValidationError} from '../validators';

class NotificationController {
    // --- Templates ---

    async getAllTemplates(req: Request, res: Response) {
        try {
            const templates = await notificationService.getTemplates();

            return res.status(StatusCodes.OK).json({templates});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createTemplate(req: Request, res: Response) {
        try {
            const data = validate(createTemplateSchema, req.body);
            const template = await notificationService.createTemplate(data);

            return res.status(StatusCodes.CREATED).json({template});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateTemplate(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const template = await notificationService.updateTemplate(parseInt(id), req.body);

            return res.status(StatusCodes.OK).json({template});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Send ---

    async send(req: Request, res: Response) {
        try {
            const {templateCode, ...data} = validate(sendNotificationSchema, req.body);
            const result = await notificationService.send(templateCode, data);

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Logs ---

    async getLogs(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const channel = req.query.channel as string | undefined;
            const status = req.query.status as string | undefined;
            const clientId = req.query.clientId
                ? parseInt(req.query.clientId as string)
                : undefined;
            const from = req.query.from as string | undefined;
            const to = req.query.to as string | undefined;

            const result = await notificationService.getLogs({
                page,
                limit,
                channel,
                status,
                clientId,
                from,
                to,
            });

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new NotificationController();
