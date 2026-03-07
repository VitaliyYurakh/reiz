import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import documentService from '../services/document.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {generateDocumentSchema, validate} from '../validators';

class DocumentController {
    async generate(req: Request, res: Response) {
        const {type, rentalId} = validate(generateDocumentSchema, req.body);
        const document = await documentService.generate(type, Number(rentalId));

        logAudit({actorId: res.locals.user?.id, entityType: 'Document', entityId: document.id, action: 'CREATE', after: document, req});
        return res.status(StatusCodes.CREATED).json({document});
    }

    async getByRental(req: Request, res: Response) {
        const rentalId = parseId(req.query.rentalId as string, 'rentalId');

        const documents = await documentService.getByRental(rentalId);
        return res.status(StatusCodes.OK).json({documents});
    }

    async download(req: Request, res: Response) {
        const {id} = req.params;
        const {filePath, fileName, mimeType} = await documentService.download(parseId(id));

        const safeFileName = fileName.replace(/[^\w.\-]/g, '_');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        res.setHeader('Content-Type', mimeType);

        return res.sendFile(filePath);
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        await documentService.delete(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Document', entityId: parseId(id), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Document deleted'});
    }
}

export default new DocumentController();
