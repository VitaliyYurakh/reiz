import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import financeService from '../services/finance.service';
import {parseId, parseOptionalId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createTransactionSchema, createAccountSchema, validate} from '../validators';

class FinanceController {
    // --- Accounts ---

    async getAllAccounts(req: Request, res: Response) {
        const accounts = await financeService.getAccounts();
        return res.status(StatusCodes.OK).json({accounts});
    }

    async getAccountBalances(req: Request, res: Response) {
        const balances = await financeService.getAccountBalances();
        return res.status(StatusCodes.OK).json({balances});
    }

    async createAccount(req: Request, res: Response) {
        const data = validate(createAccountSchema, req.body);
        const account = await financeService.createAccount(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Account', entityId: account.id, action: 'CREATE', after: account, req});
        return res.status(StatusCodes.CREATED).json({account});
    }

    async updateAccount(req: Request, res: Response) {
        const {id} = req.params;
        const account = await financeService.updateAccount(parseId(id), req.body);

        logAudit({actorId: res.locals.user?.id, entityType: 'Account', entityId: parseId(id), action: 'UPDATE', after: account, req});
        return res.status(StatusCodes.OK).json({account});
    }

    // --- Transactions ---

    async getTransactions(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const type = req.query.type as string | undefined;
        const accountId = parseOptionalId(req.query.accountId as string, 'accountId');
        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;
        const rentalId = parseOptionalId(req.query.rentalId as string, 'rentalId');
        const clientId = parseOptionalId(req.query.clientId as string, 'clientId');

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
    }

    async createTransaction(req: Request, res: Response) {
        const data = validate(createTransactionSchema, req.body);
        const user = res.locals.user;
        const transaction = await financeService.createTransaction({...data, createdByUserId: user.id});

        logAudit({actorId: res.locals.user?.id, entityType: 'Transaction', entityId: transaction.id, action: 'CREATE', after: transaction, req});
        return res.status(StatusCodes.CREATED).json({transaction});
    }

    // --- Summary & Balance ---

    async getSummary(req: Request, res: Response) {
        const from = req.query.from as string;
        const to = req.query.to as string;

        if (!from || !to) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
        }

        const summary = await financeService.getSummary(from, to);
        return res.status(StatusCodes.OK).json(summary);
    }

    async getRentalBalance(req: Request, res: Response) {
        const {rentalId} = req.params;
        const balance = await financeService.getRentalBalance(parseId(rentalId));
        return res.status(StatusCodes.OK).json(balance);
    }
}

export default new FinanceController();
