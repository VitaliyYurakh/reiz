import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import partnerPaymentService from '../services/partner-payment.service';
import {parseId, parseOptionalId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {validate, createPartnerPaymentSchema, updatePartnerPaymentSchema} from '../validators';

class PartnerPaymentController {
    async listForPartner(req: Request, res: Response) {
        const partnerId = parseId(req.query.partnerId as string, 'partnerId');
        const items = await partnerPaymentService.list(partnerId);
        res.status(StatusCodes.OK).json({items});
    }

    async stats(req: Request, res: Response) {
        const partnerId = parseId(req.query.partnerId as string, 'partnerId');
        const stats = await partnerPaymentService.getStats(partnerId);
        res.status(StatusCodes.OK).json(stats);
    }

    async getOne(req: Request, res: Response) {
        const payment = await partnerPaymentService.getOne(parseId(req.params.id));
        if (!payment) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Payment not found'});
        res.status(StatusCodes.OK).json({payment});
    }

    async create(req: Request, res: Response) {
        const data = validate(createPartnerPaymentSchema, req.body);
        const payment = await partnerPaymentService.create({...data, createdById: res.locals.user?.id});
        logAudit({
            actorId: res.locals.user?.id,
            entityType: 'PartnerPayment',
            entityId: payment.id,
            action: 'CREATE',
            after: payment,
            req,
        });
        res.status(StatusCodes.CREATED).json({payment});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updatePartnerPaymentSchema, req.body);
        const payment = await partnerPaymentService.update(id, data);
        logAudit({
            actorId: res.locals.user?.id,
            entityType: 'PartnerPayment',
            entityId: id,
            action: 'UPDATE',
            after: payment,
            req,
        });
        res.status(StatusCodes.OK).json({payment});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await partnerPaymentService.delete(id);
        logAudit({
            actorId: res.locals.user?.id,
            entityType: 'PartnerPayment',
            entityId: id,
            action: 'DELETE',
            req,
        });
        res.status(StatusCodes.OK).json({msg: 'Payment deleted'});
    }
}

export default new PartnerPaymentController();
