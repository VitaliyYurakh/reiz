import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import documentService from '../services/document.service';
import logAudit from '../middleware/audit.middleware';
import {generateDocumentSchema, validate, ValidationError} from '../validators';

class DocumentController {
    async generate(req: Request, res: Response) {
        try {
            const {type, rentalId} = validate(generateDocumentSchema, req.body);
            const document = await documentService.generate(type, Number(rentalId));

            logAudit({actorId: res.locals.user?.id, entityType: 'Document', entityId: document.id, action: 'CREATE', after: document, req});
            return res.status(StatusCodes.CREATED).json({document});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getByRental(req: Request, res: Response) {
        try {
            const rentalId = parseInt(req.query.rentalId as string);

            if (isNaN(rentalId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'rentalId query param is required'});
            }

            const documents = await documentService.getByRental(rentalId);

            return res.status(StatusCodes.OK).json({documents});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async download(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {filePath, fileName, mimeType} = await documentService.download(parseInt(id));

            // Sanitize filename to prevent header injection
            const safeFileName = fileName.replace(/[^\w.\-]/g, '_');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
            res.setHeader('Content-Type', mimeType);

            return res.sendFile(filePath);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await documentService.delete(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Document', entityId: parseInt(id), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json({msg: 'Document deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new DocumentController();
