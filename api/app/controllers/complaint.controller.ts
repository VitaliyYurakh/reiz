import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import complaintService from '../services/complaint.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {validate, createComplaintSchema, updateComplaintSchema, addComplaintMessageSchema} from '../validators';

class ComplaintController {
    async list(req: Request, res: Response) {
        const page = parseInt((req.query.page as string) || '1');
        const limit = parseInt((req.query.limit as string) || '20');
        const result = await complaintService.list({
            page,
            limit,
            status: req.query.status as string | undefined,
            category: req.query.category as string | undefined,
            assignedManagerId: req.query.assignedManagerId
                ? parseInt(req.query.assignedManagerId as string)
                : undefined,
            clientId: req.query.clientId
                ? parseInt(req.query.clientId as string)
                : undefined,
            search: req.query.search as string | undefined,
        });
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const complaint = await complaintService.getOne(parseId(req.params.id));
        if (!complaint) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Complaint not found'});
        }
        return res.status(StatusCodes.OK).json({complaint});
    }

    async create(req: Request, res: Response) {
        const data = validate(createComplaintSchema, req.body);
        const complaint = await complaintService.create(data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Complaint', entityId: complaint.id, action: 'CREATE', after: complaint, req});
        return res.status(StatusCodes.CREATED).json({complaint});
    }

    async addMessage(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(addComplaintMessageSchema, req.body);
        const user = res.locals.user;
        const message = await complaintService.addMessage(id, {
            ...data,
            authorType: user ? 'staff' : 'client',
            authorUserId: user?.id,
        });
        logAudit({actorId: user?.id, entityType: 'Complaint', entityId: id, action: 'UPDATE', after: {message}, req});
        return res.status(StatusCodes.CREATED).json({message});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateComplaintSchema, req.body);
        const complaint = await complaintService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Complaint', entityId: id, action: 'UPDATE', after: complaint, req});
        return res.status(StatusCodes.OK).json({complaint});
    }

    async stats(_req: Request, res: Response) {
        const stats = await complaintService.getStats();
        return res.status(StatusCodes.OK).json(stats);
    }
}

export default new ComplaintController();
