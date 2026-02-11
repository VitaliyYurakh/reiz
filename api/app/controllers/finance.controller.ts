import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import financeService from '../services/finance.service';
import logAudit from '../middleware/audit.middleware';
import {createTransactionSchema, createAccountSchema, validate, ValidationError} from '../validators';

class FinanceController {
    // --- Accounts ---

    async getAllAccounts(req: Request, res: Response) {
        try {
            const accounts = await financeService.getAccounts();

            return res.status(StatusCodes.OK).json({accounts});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createAccount(req: Request, res: Response) {
        try {
            const data = validate(createAccountSchema, req.body);
            const account = await financeService.createAccount(data);

            logAudit({actorId: res.locals.user?.id, entityType: 'Account', entityId: account.id, action: 'CREATE', after: account, req});
            return res.status(StatusCodes.CREATED).json({account});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateAccount(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const account = await financeService.updateAccount(parseInt(id), req.body);

            logAudit({actorId: res.locals.user?.id, entityType: 'Account', entityId: parseInt(id), action: 'UPDATE', after: account, req});
            return res.status(StatusCodes.OK).json({account});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Transactions ---

    async getTransactions(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const type = req.query.type as string | undefined;
            const accountId = req.query.accountId
                ? parseInt(req.query.accountId as string)
                : undefined;
            const from = req.query.from as string | undefined;
            const to = req.query.to as string | undefined;
            const rentalId = req.query.rentalId
                ? parseInt(req.query.rentalId as string)
                : undefined;
            const clientId = req.query.clientId
                ? parseInt(req.query.clientId as string)
                : undefined;

            const result = await financeService.getTransactions({
                page,
                limit,
                type,
                accountId,
                from,
                to,
                rentalId,
                clientId,
            });

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createTransaction(req: Request, res: Response) {
        try {
            const data = validate(createTransactionSchema, req.body);
            const user = res.locals.user;
            const transaction = await financeService.createTransaction({...data, createdByUserId: user.id});

            logAudit({actorId: res.locals.user?.id, entityType: 'Transaction', entityId: transaction.id, action: 'CREATE', after: transaction, req});
            return res.status(StatusCodes.CREATED).json({transaction});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Summary & Balance ---

    async getSummary(req: Request, res: Response) {
        try {
            const from = req.query.from as string;
            const to = req.query.to as string;

            if (!from || !to) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
            }

            const summary = await financeService.getSummary(from, to);

            return res.status(StatusCodes.OK).json(summary);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getRentalBalance(req: Request, res: Response) {
        try {
            const {rentalId} = req.params;
            const balance = await financeService.getRentalBalance(parseInt(rentalId));

            return res.status(StatusCodes.OK).json(balance);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new FinanceController();
