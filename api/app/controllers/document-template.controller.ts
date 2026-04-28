import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import documentTemplateService from '../services/document-template.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {
    validate,
    createDocumentTemplateSchema,
    updateDocumentTemplateSchema,
    renderDocumentTemplateSchema,
} from '../validators';

class DocumentTemplateController {
    async list(req: Request, res: Response) {
        const result = await documentTemplateService.list({
            kind: req.query.kind as string | undefined,
            language: req.query.language as string | undefined,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const tpl = await documentTemplateService.getOne(parseId(req.params.id));
        if (!tpl) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Template not found'});
        res.status(StatusCodes.OK).json({template: tpl});
    }

    async create(req: Request, res: Response) {
        const data = validate(createDocumentTemplateSchema, req.body);
        const tpl = await documentTemplateService.create({...data, createdById: res.locals.user?.id});
        logAudit({actorId: res.locals.user?.id, entityType: 'DocumentTemplate', entityId: tpl.id, action: 'CREATE', after: tpl, req});
        res.status(StatusCodes.CREATED).json({template: tpl});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateDocumentTemplateSchema, req.body);
        const tpl = await documentTemplateService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'DocumentTemplate', entityId: id, action: 'UPDATE', after: tpl, req});
        res.status(StatusCodes.OK).json({template: tpl});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await documentTemplateService.delete(id);
        logAudit({actorId: res.locals.user?.id, entityType: 'DocumentTemplate', entityId: id, action: 'DELETE', req});
        res.status(StatusCodes.OK).json({msg: 'Template deleted'});
    }

    async render(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const sources = validate(renderDocumentTemplateSchema, req.body);
        const result = await documentTemplateService.render(id, sources);
        res.status(StatusCodes.OK).json(result);
    }
}

export default new DocumentTemplateController();
