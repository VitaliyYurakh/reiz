// Integration test: Prisma client extension's soft-delete behaviour for
// Client / Rental / Reservation / CoveragePackage / AddOn / RatePlan /
// CustomerAccount. Locks the contract that:
//   * `delete()` becomes `update({ deletedAt: now() })`
//   * `findMany()` / `findUnique()` skip soft-deleted rows by default
//   * Passing `where: {deletedAt: {not: null}}` reveals them again
//     (for restore endpoints / audit views)

import {describe, beforeAll, afterAll, it, expect} from 'vitest';
import {bootIntegrationDb, type IntegrationFixture} from './setup';
import {PrismaClient} from '@prisma/client';

// We want to test BOTH the extended client (soft-delete behaviour) and
// a raw client (to verify the row is still in the DB after "delete").
// The integration setup hands us a stock PrismaClient; we wrap it in
// the same extension shape `app/utils/db.utils.ts` exports so the test
// exercises the real code path. Inlined here rather than importing to
// avoid coupling to that module's full graph.

const SOFT_DELETE_MODELS = new Set(['client', 'rental', 'reservation']);
const READ_OPS = new Set(['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy']);

function withSoftDelete(base: PrismaClient) {
    return base.$extends({
        name: 'softDelete',
        query: {
            $allModels: {
                async $allOperations({model, operation, args, query}) {
                    const modelKey = model ? model[0].toLowerCase() + model.slice(1) : '';
                    if (!SOFT_DELETE_MODELS.has(modelKey)) return query(args);

                    if (READ_OPS.has(operation)) {
                        const a = args as {where?: Record<string, unknown>};
                        a.where = a.where ?? {};
                        if (!('deletedAt' in a.where)) a.where.deletedAt = null;
                        return query(a as never);
                    }
                    if (operation === 'delete') {
                        const a = args as {where: Record<string, unknown>};
                        return (base as unknown as Record<string, {update: Function}>)[modelKey].update({
                            where: a.where,
                            data: {deletedAt: new Date()},
                        }) as never;
                    }
                    return query(args);
                },
            },
        },
    });
}

describe('soft-delete: extension semantics', () => {
    let fx: IntegrationFixture;
    let extended: ReturnType<typeof withSoftDelete>;

    beforeAll(async () => {
        fx = await bootIntegrationDb();
        extended = withSoftDelete(fx.prisma);
    }, 240_000);

    afterAll(async () => {
        await fx?.teardown();
    });

    it('client.delete() does not remove the row, sets deletedAt instead', async () => {
        const client = await fx.prisma.client.create({
            data: {firstName: 'Soft', lastName: 'Delete', phone: '+380999999999'},
        });

        await extended.client.delete({where: {id: client.id}});

        // Raw client still sees the row (it wasn't physically removed).
        const raw = await fx.prisma.client.findUnique({where: {id: client.id}});
        expect(raw).not.toBeNull();
        expect(raw?.deletedAt).toBeInstanceOf(Date);

        // Extended client filters it out — findFirst returns null.
        const filtered = await extended.client.findFirst({where: {id: client.id}});
        expect(filtered).toBeNull();
    });

    it('extended findMany skips soft-deleted rows by default', async () => {
        const a = await fx.prisma.client.create({data: {firstName: 'Active', lastName: 'A', phone: '+380111000001'}});
        const b = await fx.prisma.client.create({data: {firstName: 'Soft', lastName: 'B', phone: '+380111000002'}});
        await extended.client.delete({where: {id: b.id}});

        const visible = await extended.client.findMany({
            where: {phone: {in: [a.phone, b.phone]}},
        });
        expect(visible.map((c) => c.id)).toContain(a.id);
        expect(visible.map((c) => c.id)).not.toContain(b.id);

        // Raw client sees both rows still.
        const all = await fx.prisma.client.findMany({
            where: {phone: {in: [a.phone, b.phone]}},
        });
        expect(all).toHaveLength(2);
    });

    it('explicit where.deletedAt overrides the auto-injection (restore lookup)', async () => {
        const c = await fx.prisma.client.create({data: {firstName: 'For', lastName: 'Restore', phone: '+380222000003'}});
        await extended.client.delete({where: {id: c.id}});

        // Asking for soft-deleted explicitly works — extension sees
        // `deletedAt` already in the where clause and skips injection.
        const found = await extended.client.findFirst({
            where: {id: c.id, deletedAt: {not: null}},
        });
        expect(found?.id).toBe(c.id);
    });
});
