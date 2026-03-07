import {StatusCodes} from 'http-status-codes';
import {logger, parseId, parsePagination} from '../utils';
import {Request, Response} from 'express';
import rentalRequestService from '../services/rental-request.service';
import logAudit from '../middleware/audit.middleware';
import {createRentalRequestSchema, updateRentalRequestSchema, approveRentalRequestSchema, rejectRentalRequestSchema, validate} from '../validators';

class RentalRequestController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const status = req.query.status as string | undefined;

        const result = await rentalRequestService.getAll({page, limit, status});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const rentalRequest = await rentalRequestService.getOne(parseId(id));

        if (!rentalRequest) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Rental request not found'});
        }

        return res.status(StatusCodes.OK).json({rentalRequest});
    }

    async create(req: Request, res: Response) {
        const data = validate(createRentalRequestSchema, req.body);
        const rentalRequest = await rentalRequestService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: rentalRequest.id, action: 'CREATE', after: rentalRequest, req});
        return res.status(StatusCodes.CREATED).json({rentalRequest});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateRentalRequestSchema, req.body);
        const before = await rentalRequestService.getOne(parseId(id));
        const rentalRequest = await rentalRequestService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseId(id), action: 'UPDATE', before, after: rentalRequest, req});
        return res.status(StatusCodes.OK).json({rentalRequest});
    }

    async approve(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const data = validate(approveRentalRequestSchema, req.body);
            logger.info({body: data, id}, 'approve rental request');
            const before = await rentalRequestService.getOne(parseId(id));
            const result = await rentalRequestService.approve(parseId(id), data);

            logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            const msg = error.message || 'Unknown error';
            if (
                msg.includes('зайняте') ||
                msg.includes('пізніше') ||
                msg.includes('not found') ||
                msg.includes('already approved')
            ) {
                logger.warn({msg, id: req.params.id}, 'approve rental request validation error');
                return res.status(StatusCodes.BAD_REQUEST).json({msg});
            }

            logger.error({err: error, stack: error.stack}, 'approve rental request failed');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async reject(req: Request, res: Response) {
        const {id} = req.params;
        const {reason} = validate(rejectRentalRequestSchema, req.body);
        const before = await rentalRequestService.getOne(parseId(id));
        const rentalRequest = await rentalRequestService.reject(parseId(id), reason);

        logAudit({actorId: res.locals.user?.id, entityType: 'RentalRequest', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: rentalRequest, req});
        return res.status(StatusCodes.OK).json({rentalRequest});
    }
}

export default new RentalRequestController();
