import {Prisma, PrismaClient} from '@prisma/client';

const basePrisma = new PrismaClient();

// ─── Soft-delete extension ──────────────────────────────────────────────
// Models with `deletedAt DateTime?` get:
//   * Top-level reads (`findUnique`, `findFirst`, `findMany`, `count`,
//     `aggregate`, `groupBy`) automatically filtered to `deletedAt: null`.
//   * `delete` / `deleteMany` rewritten to `update` / `updateMany` with
//     `{ deletedAt: now() }` — preserves financial-history rows.
//
// Limitations (intentional, documented):
//   * Nested includes are NOT filtered. `prisma.car.findMany({ include:
//     { rentals: true } })` returns soft-deleted rentals as part of the
//     car's history blob. That's usually what you want in admin "show
//     this car's full timeline" contexts; if a specific surface needs
//     active-only nested reads, pass `where: { deletedAt: null }`
//     explicitly to the include.
//   * `findUnique` filter injection requires `extendedWhereUnique`
//     preview feature in Prisma 5; on 6.19 it works directly via
//     args.where mutation but if Prisma rejects the unknown field on a
//     unique selector we fall through without filtering. Practical
//     impact: an admin who has a soft-deleted client's id can still
//     `getOne(id)` them — that's by design (need access for restore).
//
// To bypass the filter for a one-off (e.g. restore endpoint, audit
// listing including deleted): pass `where: { deletedAt: { not: null } }`
// or `where: {OR: [{deletedAt: null}, {deletedAt: {not: null}}]}` — the
// extension only injects when no `deletedAt` key is present.

const SOFT_DELETE_MODELS = new Set([
    'client',
    'rental',
    'reservation',
    'coveragePackage',
    'addOn',
    'ratePlan',
    'customerAccount',
]);

const READ_OPS = new Set([
    'findUnique',
    'findUniqueOrThrow',
    'findFirst',
    'findFirstOrThrow',
    'findMany',
    'count',
    'aggregate',
    'groupBy',
]);

const prisma = basePrisma
    .$extends({
        // Phone normalisation — pre-existing fix-up for legacy
        // double-prefixed numbers like "972+972532414153".
        result: {
            client: {
                phone: {
                    needs: {phone: true},
                    compute(client) {
                        if (!client.phone) return client.phone;
                        const plusIdx = client.phone.indexOf('+');
                        if (plusIdx > 0) return client.phone.slice(plusIdx);
                        return client.phone;
                    },
                },
            },
        },
    })
    .$extends({
        name: 'softDelete',
        query: {
            $allModels: {
                async $allOperations({model, operation, args, query}) {
                    const modelKey = model ? model[0].toLowerCase() + model.slice(1) : '';
                    if (!SOFT_DELETE_MODELS.has(modelKey)) {
                        return query(args);
                    }

                    if (READ_OPS.has(operation)) {
                        // Inject {deletedAt: null} when caller hasn't
                        // already constrained that field. Skip for raw
                        // operations and explicit "include deleted"
                        // queries.
                        const a = args as {where?: Record<string, unknown>};
                        a.where = a.where ?? {};
                        if (!('deletedAt' in a.where)) {
                            a.where.deletedAt = null;
                        }
                        return query(a as never);
                    }

                    if (operation === 'delete') {
                        // Rewrite to soft-delete. The new operation runs
                        // through the extension again (and matches the
                        // update branch below, which is a no-op).
                        const a = args as {where: Record<string, unknown>};
                        return (basePrisma as unknown as Record<string, {update: Function}>)[modelKey].update({
                            where: a.where,
                            data: {deletedAt: new Date()},
                        }) as never;
                    }

                    if (operation === 'deleteMany') {
                        const a = args as {where?: Record<string, unknown>};
                        return (basePrisma as unknown as Record<string, {updateMany: Function}>)[modelKey].updateMany({
                            where: a.where ?? {},
                            data: {deletedAt: new Date()},
                        }) as never;
                    }

                    return query(args);
                },
            },
        },
    });

// Helper for callers that genuinely need to bypass soft-delete
// (restore endpoints, audit views). Returns the un-extended client.
export function rawPrisma(): PrismaClient {
    return basePrisma;
}

export default prisma;
export {Prisma};
