import {describe, it, expect, vi, beforeEach} from 'vitest';

// Mocks have to live inside `vi.hoisted` because vi.mock factories run
// before any top-level `const` declarations are initialised. Using
// hoisted state lets the factory and the test bodies share the same
// mock instances.
const mocks = vi.hoisted(() => ({
    transaction: {
        findMany: vi.fn(),
        groupBy: vi.fn(),
    },
    account: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
    },
}));

vi.mock('../utils/db.utils', () => ({
    default: {
        transaction: mocks.transaction,
        account: mocks.account,
        $transaction: vi.fn(async (cb: (tx: unknown) => unknown) =>
            cb({transaction: mocks.transaction, account: mocks.account}),
        ),
    },
}));

vi.mock('./fx-rate.service', () => ({
    default: {getRate: vi.fn(async () => null)},
}));

// Now import the service — picks up the mocked prisma.
import financeService from './finance.service';

const {transaction: transactionMock, account: accountMock} = mocks;

describe('financeService.getRentalBalance', () => {
    beforeEach(() => {
        transactionMock.findMany.mockReset();
    });

    it('returns zeros when there are no transactions for the rental', async () => {
        transactionMock.findMany.mockResolvedValue([]);
        const result = await financeService.getRentalBalance(42);
        expect(result).toMatchObject({
            rentalId: 42,
            totalCharged: 0,
            totalPaid: 0,
            balance: 0,
        });
    });

    it('counts incoming transactions (direction=in) toward totalPaid', async () => {
        transactionMock.findMany.mockResolvedValue([
            {id: 1, direction: 'in', amountUahMinor: 50000},
            {id: 2, direction: 'in', amountUahMinor: 30000},
        ]);
        const result = await financeService.getRentalBalance(1);
        expect(result.totalPaid).toBe(80000);
        expect(result.totalCharged).toBe(0);
        expect(result.balance).toBe(80000);
    });

    it('counts outgoing transactions (direction=out) toward totalCharged', async () => {
        transactionMock.findMany.mockResolvedValue([
            {id: 1, direction: 'out', amountUahMinor: 25000},
        ]);
        const result = await financeService.getRentalBalance(1);
        expect(result.totalPaid).toBe(0);
        expect(result.totalCharged).toBe(25000);
        expect(result.balance).toBe(-25000);
    });

    it('balance is paid minus charged across mixed directions', async () => {
        transactionMock.findMany.mockResolvedValue([
            {id: 1, direction: 'in', amountUahMinor: 100000},
            {id: 2, direction: 'out', amountUahMinor: 30000},
            {id: 3, direction: 'in', amountUahMinor: 20000},
        ]);
        const result = await financeService.getRentalBalance(7);
        expect(result.totalPaid).toBe(120000);
        expect(result.totalCharged).toBe(30000);
        expect(result.balance).toBe(90000);
    });

    it('passes rentalId through unchanged in the response', async () => {
        transactionMock.findMany.mockResolvedValue([]);
        const result = await financeService.getRentalBalance(999);
        expect(result.rentalId).toBe(999);
    });
});

describe('financeService.getAccountBalances', () => {
    beforeEach(() => {
        transactionMock.groupBy.mockReset();
        accountMock.findMany.mockReset();
    });

    it('returns empty list when no accounts have transactions', async () => {
        transactionMock.groupBy.mockResolvedValue([]);
        accountMock.findMany.mockResolvedValue([]);
        const result = await financeService.getAccountBalances();
        expect(result).toEqual([]);
    });

    it('aggregates IN/OUT per account into balance = in - out', async () => {
        transactionMock.groupBy.mockResolvedValue([
            {accountId: 1, direction: 'in', _sum: {amountMinor: 30700}},
            {accountId: 1, direction: 'out', _sum: {amountMinor: 0}},
        ]);
        accountMock.findMany.mockResolvedValue([{id: 1, currency: 'UAH'}]);

        const result = await financeService.getAccountBalances();
        expect(result).toEqual([
            {
                accountId: 1,
                totalIn: 30700,
                totalOut: 0,
                balance: 30700,
                balanceUah: 30700,
            },
        ]);
    });

    it('regression — direction lowercase is the canonical form (the morning bug)', async () => {
        // The whole today started with `direction: 'IN'` (uppercase) being
        // counted as OUT and producing a -307 ₴ balance. Lock this in: only
        // lowercase 'in' is accepted; anything else is treated as out.
        transactionMock.groupBy.mockResolvedValue([
            {accountId: 1, direction: 'in', _sum: {amountMinor: 1000}},
        ]);
        accountMock.findMany.mockResolvedValue([{id: 1, currency: 'UAH'}]);

        const result = await financeService.getAccountBalances();
        expect(result[0].balance).toBe(1000);
        expect(result[0].totalIn).toBe(1000);
        expect(result[0].totalOut).toBe(0);
    });
});
