import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import clientService from '../services/client.service';
import logAudit from '../middleware/audit.middleware';
import {createClientSchema, validate, ValidationError} from '../validators';

class ClientController {
    async getAll(req: Request, res: Response) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
            const search = req.query.search as string | undefined;

            const result = await clientService.getAll({page, limit, search});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const client = await clientService.getOne(parseInt(id));

            if (!client) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'Client not found'});
            }

            return res.status(StatusCodes.OK).json({client});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Check for duplicates unless force=true (admin explicitly confirmed)
            const force = req.query.force === 'true';
            if (!force) {
                const duplicates = await clientService.findDuplicates(req.body.phone, req.body.email);
                if (duplicates.length > 0) {
                    return res.status(StatusCodes.CONFLICT).json({
                        msg: 'Найдены возможные дубликаты',
                        duplicates,
                    });
                }
            }

            const clientData = validate(createClientSchema, req.body);

            const client = await clientService.create(clientData);

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: client.id, action: 'CREATE', after: client, req});
            return res.status(StatusCodes.CREATED).json({client});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async checkDuplicates(req: Request, res: Response) {
        try {
            const phone = req.query.phone as string | undefined;
            const email = req.query.email as string | undefined;

            const duplicates = await clientService.findDuplicates(phone, email);

            return res.status(StatusCodes.OK).json({duplicates});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await clientService.getOne(parseInt(id));

            // Whitelist allowed fields to prevent mass assignment
            const {firstName, lastName, middleName, phone, email, dateOfBirth, passportNo, driverLicenseNo, driverLicenseExpiry, address, source, notes, preferredLanguage} = req.body;
            const updateData = {firstName, lastName, middleName, phone, email, dateOfBirth, passportNo, driverLicenseNo, driverLicenseExpiry, address, source, notes, preferredLanguage};

            const client = await clientService.update(parseInt(id), updateData);

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseInt(id), action: 'UPDATE', before, after: client, req});
            return res.status(StatusCodes.OK).json({client});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await clientService.getOne(parseInt(id));
            await clientService.softDelete(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseInt(id), action: 'DELETE', before, req});
            return res.status(StatusCodes.OK).json({msg: 'Client deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async setRating(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {rating, reason} = req.body;
            const user = res.locals.user;

            if (rating == null || rating < 1 || rating > 5) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Rating must be between 1 and 5'});
            }

            const before = await clientService.getOne(parseInt(id));
            const client = await clientService.setRating(parseInt(id), rating, reason, user.id);

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseInt(id), action: 'UPDATE', before, after: client, req});
            return res.status(StatusCodes.OK).json({client});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const history = await clientService.getHistory(parseInt(id));

            return res.status(StatusCodes.OK).json(history);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async uploadDocument(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const file = req.file;

            if (!file) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
            }

            const {type} = req.body;
            const fileUrl = `/static/client-documents/${file.filename}`;
            const document = await clientService.uploadDocument(parseInt(id), {
                type: type || 'OTHER',
                fileName: file.originalname,
                fileUrl,
            });

            logAudit({actorId: res.locals.user?.id, entityType: 'ClientDocument', entityId: document.id, action: 'CREATE', req});
            return res.status(StatusCodes.CREATED).json({document});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deleteDocument(req: Request, res: Response) {
        try {
            const {id, docId} = req.params;
            await clientService.deleteDocument(parseInt(id), parseInt(docId));

            logAudit({actorId: res.locals.user?.id, entityType: 'ClientDocument', entityId: parseInt(docId), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json({msg: 'Document deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async block(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {reason} = req.body;

            if (!reason) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Block reason is required'});
            }

            const before = await clientService.getOne(parseInt(id));
            const client = await clientService.block(parseInt(id), reason);

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: client, req});
            return res.status(StatusCodes.OK).json({client});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async unblock(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await clientService.getOne(parseInt(id));
            const client = await clientService.unblock(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseInt(id), action: 'STATUS_CHANGE', before, after: client, req});
            return res.status(StatusCodes.OK).json({client});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new ClientController();
