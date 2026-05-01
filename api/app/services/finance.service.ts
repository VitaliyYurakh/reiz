import {AccountType, Currency, TransactionType, TransactionDirection} from '@prisma/client';
import {prisma, BadRequestError} from '../utils';
import fxRateService from './fx-rate.service';

class FinanceService {
    // --- Account CRUD ---

    async getAccounts(params?: {isActive?: boolean}) {
        const where: any = {};
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.account.findMany({
            where,
            orderBy: {createdAt: 'desc'},
        });
    }

    async getAccountBalances() {
        // Native balance per account via groupBy.
        const rows = await prisma.transaction.groupBy({
            by: ['accountId', 'direction'],
            _sum: {amountMinor: true},
        });

        const map = new Map<number, {totalIn: number; totalOut: number}>();
        for (const row of rows) {
            if (!map.has(row.accountId)) {
                map.set(row.accountId, {totalIn: 0, totalOut: 0});
            }
            const entry = map.get(row.accountId)!;
            if (row.direction === 'in') {
                entry.totalIn = row._sum.amountMinor ?? 0;
            } else {
                entry.totalOut = row._sum.amountMinor ?? 0;
            }
        }

        // Fetch the accounts so we know each account's currency.
        const accounts = await prisma.account.findMany({
            where: {id: {in: Array.from(map.keys())}},
            select: {id: true, currency: true},
        });
        const currencyById = new Map(accounts.map((a) => [a.id, a.currency]));

        // Resolve today's NBU rate per distinct non-UAH currency so the UAH
        // equivalent is accurate even when historical transactions were saved
        // with fxRate=1.0 (pre-audit data has amountUahMinor = amountMinor
        // for foreign-currency rows, which would otherwise make a $274 USD
        // account display as 274 грн in the pocket total). Doing the
        // conversion live means mark-to-market: the pocket shows cash-on-hand
        // at today's rate, which is the standard for a wallet/till view.
        const distinctCurrencies = Array.from(new Set(accounts.map((a) => a.currency)))
            .filter((c) => c !== 'UAH');
        const fxByCurrency = new Map<string, number>();
        for (const ccy of distinctCurrencies) {
            const nbu = await fxRateService.getRate(ccy);
            if (nbu) fxByCurrency.set(ccy, nbu.rate);
        }

        const result: Array<{
            accountId: number;
            totalIn: number;
            totalOut: number;
            balance: number;
            balanceUah: number;
        }> = [];
        for (const [accountId, v] of map) {
            const balance = v.totalIn - v.totalOut;
            const currency = currencyById.get(accountId) || 'UAH';
            const rate = currency === 'UAH' ? 1 : (fxByCurrency.get(currency) ?? 0);
            const balanceUah = Math.round(balance * rate);
            result.push({
                accountId,
                totalIn: v.totalIn,
                totalOut: v.totalOut,
                balance,
                balanceUah,
            });
        }
        return result;
    }

    async createAccount(data: {
        name: string;
        type: AccountType;
        currency?: Currency;
        isActive?: boolean;
    }) {
        return await prisma.account.create({
            data: {
                name: data.name,
                type: data.type,
                currency: data.currency ?? Currency.UAH,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateAccount(id: number, data: {
        name?: string;
        type?: AccountType;
        currency?: Currency;
        isActive?: boolean;
    }) {
        return await prisma.account.update({
            where: {id},
            data,
        });
    }

    // --- Transactions ---

    async createTransaction(data: {
        type: TransactionType;
        accountId: number;
        direction: TransactionDirection;
        amountMinor: number;
        currency: Currency;
        fxRate?: number;
        amountUahMinor: number;
        description?: string;
        clientId?: number;
        rentalId?: number;
        reservationId?: number;
        fineId?: number;
        createdByUserId?: number;
    }) {
        return await prisma.$transaction(async (tx) => {
            // Invariant: a transaction's currency must match its account's currency.
            // Violating this silently corrupts getAccountBalances() (which sums amountMinor
            // without a currency filter), mixing cents+копійки as if they were the same unit.
            const account = await tx.account.findUnique({where: {id: data.accountId}});
            if (!account) {
                throw new BadRequestError(`Рахунок #${data.accountId} не існує.`);
            }
            if (account.currency !== data.currency) {
                throw new BadRequestError(
                    `Валюта транзакції (${data.currency}) не збігається з валютою рахунку "${account.name}" (${account.currency}). Оберіть інший рахунок або створіть рахунок у потрібній валюті.`,
                );
            }

            const transaction = await tx.transaction.create({
                data: {
                    type: data.type,
                    accountId: data.accountId,
                    direction: data.direction,
                    amountMinor: data.amountMinor,
                    currency: data.currency,
                    fxRate: data.fxRate || 1.0,
                    amountUahMinor: data.amountUahMinor,
                    description: data.description || null,
                    clientId: data.clientId || null,
                    rentalId: data.rentalId || null,
                    reservationId: data.reservationId || null,
                    fineId: data.fineId || null,
                    createdByUserId: data.createdByUserId || null,
                },
                include: {
                    account: true,
                    client: {select: {id: true, firstName: true, lastName: true}},
                    rental: {select: {id: true, contractNumber: true}},
                    createdBy: {select: {id: true, email: true}},
                },
            });

            // Auto-close the fine when a FINE_PAYMENT transaction is recorded against it.
            if (data.type === 'FINE_PAYMENT' && data.fineId) {
                await tx.fine.update({
                    where: {id: data.fineId},
                    data: {isPaid: true},
                });
            }

            return transaction;
        });
    }

    async getTransactions(params: {
        page: number;
        limit: number;
        accountId?: number;
        type?: string;
        clientId?: number;
        rentalId?: number;
        from?: string | Date;
        to?: string | Date;
    }) {
        const {page, limit, accountId, type, clientId, rentalId, from, to} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (accountId) where.accountId = accountId;
        if (type) where.type = type;
        if (clientId) where.clientId = clientId;
        if (rentalId) where.rentalId = rentalId;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    account: {select: {id: true, name: true, type: true}},
                    client: {select: {id: true, firstName: true, lastName: true}},
                    rental: {select: {id: true, contractNumber: true}},
                    reservation: {select: {id: true}},
                    fine: {select: {id: true, type: true}},
                    createdBy: {select: {id: true, email: true}},
                },
            }),
            prisma.transaction.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }

    async getSummary(from: string | Date, to: string | Date) {
        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            include: {
                account: {select: {id: true, name: true, type: true}},
            },
        });

        // Summarize by account
        const byAccount: Record<number, {
            accountId: number;
            accountName: string;
            accountType: string;
            totalIn: number;
            totalOut: number;
            net: number;
        }> = {};

        // Summarize by type
        const byType: Record<string, {
            type: string;
            totalIn: number;
            totalOut: number;
            net: number;
        }> = {};

        let totalIn = 0;
        let totalOut = 0;

        for (const tx of transactions) {
            const amountUah = tx.amountUahMinor;
            const isIn = tx.direction === 'in';

            // By account
            if (!byAccount[tx.accountId]) {
                byAccount[tx.accountId] = {
                    accountId: tx.accountId,
                    accountName: tx.account.name,
                    accountType: tx.account.type,
                    totalIn: 0,
                    totalOut: 0,
                    net: 0,
                };
            }
            if (isIn) {
                byAccount[tx.accountId].totalIn += amountUah;
                totalIn += amountUah;
            } else {
                byAccount[tx.accountId].totalOut += amountUah;
                totalOut += amountUah;
            }
            byAccount[tx.accountId].net = byAccount[tx.accountId].totalIn - byAccount[tx.accountId].totalOut;

            // By type
            if (!byType[tx.type]) {
                byType[tx.type] = {type: tx.type, totalIn: 0, totalOut: 0, net: 0};
            }
            if (isIn) {
                byType[tx.type].totalIn += amountUah;
            } else {
                byType[tx.type].totalOut += amountUah;
            }
            byType[tx.type].net = byType[tx.type].totalIn - byType[tx.type].totalOut;
        }

        return {
            period: {from, to},
            totalIn,
            totalOut,
            net: totalIn - totalOut,
            byAccount: Object.values(byAccount),
            byType: Object.values(byType),
        };
    }

    async getRentalBalance(rentalId: number) {
        const transactions = await prisma.transaction.findMany({
            where: {rentalId},
            orderBy: {createdAt: 'asc'},
        });

        let totalCharged = 0;
        let totalPaid = 0;

        for (const tx of transactions) {
            if (tx.direction === 'in') {
                totalPaid += tx.amountUahMinor;
            } else {
                totalCharged += tx.amountUahMinor;
            }
        }

        return {
            rentalId,
            totalCharged,
            totalPaid,
            balance: totalPaid - totalCharged,
            transactions,
        };
    }

    /**
     * Inter-account transfer ("інкасація" / "transfer between accounts").
     *
     * Creates a paired pair of Transaction rows — one OUT from the source,
     * one IN to the destination — linked via `transferPairId` so reports can
     * deduplicate and the UI can render a "transfer" badge instead of two
     * orphan ledger entries. Currency conversion uses the supplied fxRate or
     * 1.0 when both sides share a currency.
     *
     * Returns both legs.
     */
    async transferBetweenAccounts(data: {
        fromAccountId: number;
        toAccountId: number;
        amountMinor: number;
        fxRate?: number;
        description?: string;
        createdByUserId?: number;
    }) {
        if (data.fromAccountId === data.toAccountId) {
            throw new Error('Source and destination accounts must differ');
        }
        return await prisma.$transaction(async (tx) => {
            const [from, to] = await Promise.all([
                tx.account.findUnique({where: {id: data.fromAccountId}}),
                tx.account.findUnique({where: {id: data.toAccountId}}),
            ]);
            if (!from || !to) throw new Error('One of the accounts not found');

            const sameCurrency = from.currency === to.currency;
            const fxRate = data.fxRate ?? 1.0;
            if (!sameCurrency && data.fxRate == null) {
                throw new Error(`Cross-currency transfer (${from.currency}→${to.currency}) requires explicit fxRate`);
            }

            // Outgoing leg in source currency. For non-UAH source we apply
            // fxRate (or 1 fallback when sameCurrency is true).
            const outAmountUahMinor = from.currency === Currency.UAH
                ? data.amountMinor
                : Math.round(data.amountMinor * (sameCurrency ? fxRate : 1));

            // Determine the destination amount in destination currency
            const inAmountMinorDest = sameCurrency
                ? data.amountMinor
                : Math.round(data.amountMinor * fxRate);

            const inAmountUahMinor = to.currency === 'UAH'
                ? inAmountMinorDest
                : Math.round(inAmountMinorDest * (sameCurrency ? 1 : 1)); // unknown UAH rate cross-cross — keep simple

            const description = data.description || `Переказ між рахунками: ${from.name} → ${to.name}`;

            const outLeg = await tx.transaction.create({
                data: {
                    type: 'TRANSFER',
                    accountId: data.fromAccountId,
                    direction: 'out',
                    amountMinor: data.amountMinor,
                    currency: from.currency,
                    fxRate: 1.0,
                    amountUahMinor: outAmountUahMinor,
                    description,
                    createdByUserId: data.createdByUserId ?? null,
                },
            });

            const inLeg = await tx.transaction.create({
                data: {
                    type: 'TRANSFER',
                    accountId: data.toAccountId,
                    direction: 'in',
                    amountMinor: inAmountMinorDest,
                    currency: to.currency,
                    fxRate,
                    amountUahMinor: inAmountUahMinor,
                    description,
                    createdByUserId: data.createdByUserId ?? null,
                    transferPairId: outLeg.id,
                },
            });

            // Back-link the OUT leg to the IN leg.
            const outLegLinked = await tx.transaction.update({
                where: {id: outLeg.id},
                data: {transferPairId: inLeg.id},
            });

            return {out: outLegLinked, in: inLeg};
        });
    }
}

export default new FinanceService();
