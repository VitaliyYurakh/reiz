import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import clientService from '../services/client.service';
import {parseId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createClientSchema, validate} from '../validators';

class ClientController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const search = req.query.search as string | undefined;

        const result = await clientService.getAll({page, limit, search});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const client = await clientService.getOne(parseId(id));

        if (!client) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Client not found'});
        }

        return res.status(StatusCodes.OK).json({client});
    }

    async create(req: Request, res: Response) {
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
    }

    async checkDuplicates(req: Request, res: Response) {
        const phone = req.query.phone as string | undefined;
        const email = req.query.email as string | undefined;

        const duplicates = await clientService.findDuplicates(phone, email);
        return res.status(StatusCodes.OK).json({duplicates});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const before = await clientService.getOne(parseId(id));

        const {firstName, lastName, middleName, phone, email, dateOfBirth, passportNo, driverLicenseNo, driverLicenseExpiry, nationalId, address, city, country, source, notes, preferredLanguage} = req.body;
        const updateData = {firstName, lastName, middleName, phone, email, dateOfBirth, passportNo, driverLicenseNo, driverLicenseExpiry, nationalId, address, city, country, source, notes, preferredLanguage};

        const client = await clientService.update(parseId(id), updateData);

        logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseId(id), action: 'UPDATE', before, after: client, req});
        return res.status(StatusCodes.OK).json({client});
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const before = await clientService.getOne(parseId(id));
        await clientService.softDelete(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseId(id), action: 'DELETE', before, req});
        return res.status(StatusCodes.OK).json({msg: 'Client deleted'});
    }

    async setRating(req: Request, res: Response) {
        const {id} = req.params;
        const {rating, reason} = req.body;
        const user = res.locals.user;

        if (rating == null || rating < 1 || rating > 5) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Rating must be between 1 and 5'});
        }

        const before = await clientService.getOne(parseId(id));
        const client = await clientService.setRating(parseId(id), rating, reason, user.id);

        logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseId(id), action: 'UPDATE', before, after: client, req});
        return res.status(StatusCodes.OK).json({client});
    }

    async getHistory(req: Request, res: Response) {
        const {id} = req.params;
        const history = await clientService.getHistory(parseId(id));
        return res.status(StatusCodes.OK).json(history);
    }

    async uploadDocument(req: Request, res: Response) {
        const {id} = req.params;
        const file = req.file;

        if (!file) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
        }

        const {type} = req.body;
        const fileUrl = `/static/client-documents/${file.filename}`;
        const document = await clientService.uploadDocument(parseId(id), {
            type: type || 'OTHER',
            fileName: file.originalname,
            fileUrl,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'ClientDocument', entityId: document.id, action: 'CREATE', req});
        return res.status(StatusCodes.CREATED).json({document});
    }

    async deleteDocument(req: Request, res: Response) {
        const {id, docId} = req.params;
        await clientService.deleteDocument(parseId(id), parseId(docId));

        logAudit({actorId: res.locals.user?.id, entityType: 'ClientDocument', entityId: parseId(docId), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Document deleted'});
    }

    async block(req: Request, res: Response) {
        const {id} = req.params;
        const {reason} = req.body;

        if (!reason) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Block reason is required'});
        }

        const before = await clientService.getOne(parseId(id));
        const client = await clientService.block(parseId(id), reason);

        logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: client, req});
        return res.status(StatusCodes.OK).json({client});
    }

    async unblock(req: Request, res: Response) {
        const {id} = req.params;
        const before = await clientService.getOne(parseId(id));
        const client = await clientService.unblock(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Client', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: client, req});
        return res.status(StatusCodes.OK).json({client});
    }
}

export default new ClientController();
