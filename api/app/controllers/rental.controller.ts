import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import rentalService from '../services/rental.service';
import {parseId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {
    createRentalSchema, updateRentalSchema, completeRentalSchema,
    cancelRentalSchema, extendRentalSchema,
    swapRentalCarSchema, createRentalDepositSchema, updateRentalDepositSchema,
    collectRentalDepositSchema, validate,
} from '../validators';

class RentalController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;

        const result = await rentalService.getAll({page, limit, status, search});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const rental = await rentalService.getOne(parseId(id));

        if (!rental) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Rental not found'});
        }

        return res.status(StatusCodes.OK).json({rental});
    }

    async create(req: Request, res: Response) {
        const data = validate(createRentalSchema, req.body);
        const rental = await rentalService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: rental.id, action: 'CREATE', after: rental, req});
        return res.status(StatusCodes.CREATED).json({rental});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const rental = await rentalService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'UPDATE', before, after: rental, req});
        return res.status(StatusCodes.OK).json({rental});
    }

    async complete(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(completeRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const result = await rentalService.complete(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    async cancel(req: Request, res: Response) {
        const {id} = req.params;
        const {reason, depositAccountId} = validate(cancelRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const result = await rentalService.cancel(parseId(id), reason, depositAccountId);

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'STATUS_CHANGE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    async extend(req: Request, res: Response) {
        const {id} = req.params;
        const {newReturnDate, reason, paymentAccountId, paymentFxRate, skipPayment} = validate(extendRentalSchema, req.body);
        const before = await rentalService.getOne(parseId(id));
        const result = await rentalService.extend(parseId(id), newReturnDate, reason, {
            accountId: paymentAccountId,
            fxRate: paymentFxRate,
            skipPayment,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: parseId(id), action: 'UPDATE', before, after: result, req});
        return res.status(StatusCodes.OK).json(result);
    }

    // ── Mid-rental car swap ────────────────────────────────────────────
    async swapCar(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(swapRentalCarSchema, req.body);
        const before = await rentalService.getOne(id);
        const result = await rentalService.swapCar(id, {...data, authorUserId: res.locals.user?.id});
        logAudit({actorId: res.locals.user?.id, entityType: 'Rental', entityId: id, action: 'CAR_SWAP', before, after: result.rental, req});
        return res.status(StatusCodes.OK).json(result);
    }

    // ── Dynamic deposits per rental ────────────────────────────────────
    async listDeposits(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const items = await rentalService.listDeposits(id);
        return res.status(StatusCodes.OK).json({items});
    }

    async createDeposit(req: Request, res: Response) {
        const rentalId = parseId(req.params.id);
        const data = validate(createRentalDepositSchema, {...req.body, rentalId});
        const deposit = await rentalService.createDeposit(data);
        logAudit({actorId: res.locals.user?.id, entityType: 'RentalDeposit', entityId: deposit.id, action: 'CREATE', after: deposit, req});
        return res.status(StatusCodes.CREATED).json({deposit});
    }

    async updateDeposit(req: Request, res: Response) {
        const depositId = parseId(req.params.depositId, 'depositId');
        const data = validate(updateRentalDepositSchema, req.body);
        const deposit = await rentalService.updateDeposit(depositId, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'RentalDeposit', entityId: depositId, action: 'UPDATE', after: deposit, req});
        return res.status(StatusCodes.OK).json({deposit});
    }

    async collectDeposit(req: Request, res: Response) {
        const depositId = parseId(req.params.depositId, 'depositId');
        const data = validate(collectRentalDepositSchema, req.body);
        const deposit = await rentalService.collectDeposit(depositId, {...data, createdByUserId: res.locals.user?.id});
        logAudit({actorId: res.locals.user?.id, entityType: 'RentalDeposit', entityId: depositId, action: 'COLLECT', after: deposit, req});
        return res.status(StatusCodes.OK).json({deposit});
    }

    async returnDeposit(req: Request, res: Response) {
        const depositId = parseId(req.params.depositId, 'depositId');
        const data = validate(collectRentalDepositSchema, req.body);
        const deposit = await rentalService.returnDeposit(depositId, {...data, createdByUserId: res.locals.user?.id});
        logAudit({actorId: res.locals.user?.id, entityType: 'RentalDeposit', entityId: depositId, action: 'RETURN', after: deposit, req});
        return res.status(StatusCodes.OK).json({deposit});
    }

    async deleteDeposit(req: Request, res: Response) {
        const depositId = parseId(req.params.depositId, 'depositId');
        await rentalService.deleteDeposit(depositId);
        logAudit({actorId: res.locals.user?.id, entityType: 'RentalDeposit', entityId: depositId, action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Deposit deleted'});
    }
}

export default new RentalController();
