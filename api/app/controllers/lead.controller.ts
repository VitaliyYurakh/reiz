import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import leadService from '../services/lead.service';
import leadCronService from '../services/lead-cron.service';
import leadAiService from '../services/lead-ai.service';
import leadGmailService from '../services/lead-gmail.service';
import {parseId, parseOptionalId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {
    validate,
    createLeadSchema,
    updateLeadSchema,
    updateLeadStatusSchema,
    addLeadEmailSchema,
    bulkImportLeadsSchema,
} from '../validators';

class LeadController {
    async list(req: Request, res: Response) {
        const result = await leadService.list({
            page: parseOptionalId(req.query.page as string, 'page'),
            limit: parseOptionalId(req.query.limit as string, 'limit'),
            search: req.query.search as string | undefined,
            status: req.query.status as string | undefined,
            country: req.query.country as string | undefined,
            assignedManagerId: parseOptionalId(req.query.assignedManagerId as string, 'assignedManagerId'),
        });
        res.status(StatusCodes.OK).json(result);
    }

    async stats(_req: Request, res: Response) {
        const data = await leadService.getStats();
        res.status(StatusCodes.OK).json(data);
    }

    async getOne(req: Request, res: Response) {
        const lead = await leadService.getOne(parseId(req.params.id));
        if (!lead) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Lead not found'});
        res.status(StatusCodes.OK).json({lead});
    }

    async create(req: Request, res: Response) {
        const data = validate(createLeadSchema, req.body);
        const lead = await leadService.create(data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', entityId: lead.id, action: 'CREATE', after: lead, req});
        res.status(StatusCodes.CREATED).json({lead});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateLeadSchema, req.body);
        const lead = await leadService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', entityId: id, action: 'UPDATE', after: lead, req});
        res.status(StatusCodes.OK).json({lead});
    }

    async updateStatus(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateLeadStatusSchema, req.body);
        const lead = await leadService.updateStatus(id, data.status, data.pausedReason);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', entityId: id, action: 'UPDATE_STATUS', after: {status: data.status}, req});
        res.status(StatusCodes.OK).json({lead});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await leadService.delete(id);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', entityId: id, action: 'DELETE', req});
        res.status(StatusCodes.OK).json({msg: 'Lead disqualified'});
    }

    async addEmail(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(addLeadEmailSchema, req.body);
        const email = await leadService.addEmail(id, {
            ...data,
            sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
            receivedAt: data.receivedAt ? new Date(data.receivedAt) : undefined,
        });
        res.status(StatusCodes.CREATED).json({email});
    }

    async bulkImport(req: Request, res: Response) {
        const data = validate(bulkImportLeadsSchema, req.body);
        const result = await leadService.bulkImport(data.items);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', action: 'BULK_IMPORT', after: result, req});
        res.status(StatusCodes.OK).json(result);
    }

    async previewEmail(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const lead = await leadService.getOne(id);
        if (!lead) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Lead not found'});

        const kind = (req.query.kind as string) || 'initial';
        const aiInput = {
            companyName: lead.companyName,
            country: lead.country,
            city: lead.city,
            ownerName: lead.ownerName,
            website: lead.website,
            websiteContent: lead.websiteContent,
            language: lead.language,
        };

        let generated;
        if (kind === 'fu_3d' || kind === 'fu_7d' || kind === 'breakup_14d') {
            generated = leadAiService.buildFollowUp(aiInput, kind);
        } else {
            generated = await leadAiService.generateInitial(aiInput);
        }

        res.status(StatusCodes.OK).json({
            kind,
            usedAi: leadAiService.isConfigured() && kind === 'initial',
            ...generated,
        });
    }

    async sendNow(req: Request, res: Response) {
        const id = parseId(req.params.id);
        try {
            const result = await leadGmailService.sendOneNow(id);
            logAudit({actorId: res.locals.user?.id, entityType: 'Lead', entityId: id, action: 'SEND_NOW', after: result, req});
            res.status(StatusCodes.OK).json(result);
        } catch (err: any) {
            res.status(StatusCodes.BAD_REQUEST).json({msg: err.message ?? 'Send failed'});
        }
    }

    async runStep(req: Request, res: Response) {
        const step = req.params.step as 'discovery' | 'enrichment' | 'outreach' | 'inbox' | 'report';
        const valid = ['discovery', 'enrichment', 'outreach', 'inbox', 'report'];
        if (!valid.includes(step)) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: `Unknown step: ${step}`});
        }
        const result = await leadCronService.runStep(step);
        logAudit({actorId: res.locals.user?.id, entityType: 'Lead', action: `RUN_${step.toUpperCase()}`, after: result, req});
        res.status(StatusCodes.OK).json({step, result});
    }
}

export default new LeadController();
