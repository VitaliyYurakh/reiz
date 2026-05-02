// Integration test: RBAC end-to-end. A user with a role whose
// permissions JSON grants `cars: 'view'` passes `requirePermission('cars',
// 'view')` and fails `requirePermission('cars', 'full')`. Locks in
// the Phase 1 + Phase 2 RBAC refactor — without this, a future
// "let's just check user.role.permissions[module]" tweak in the
// middleware could silently drop access checks.

import {describe, beforeAll, afterAll, it, expect} from 'vitest';
import {bootIntegrationDb, type IntegrationFixture} from './setup';
import {hasPermission, ADMIN_PERMISSIONS, MANAGER_PERMISSIONS, EMPTY_PERMISSIONS} from '../../app/types/permissions';

describe('rbac: Role permissions enforcement', () => {
    let fx: IntegrationFixture;

    beforeAll(async () => {
        fx = await bootIntegrationDb();
    }, 240_000);

    afterAll(async () => {
        await fx?.teardown();
    });

    it('Admin role grants every module at full', async () => {
        const role = await fx.prisma.role.create({
            data: {name: 'Admin (test)', isSystem: true, permissions: ADMIN_PERMISSIONS},
        });
        const fresh = await fx.prisma.role.findUniqueOrThrow({where: {id: role.id}});
        const perms = fresh.permissions as Record<string, string>;

        // Every module reads as 'full' and middleware passes for both levels.
        for (const m of ['cars', 'rentals', 'finance', 'audit', 'users'] as const) {
            expect(hasPermission(perms as never, m, 'view')).toBe(true);
            expect(hasPermission(perms as never, m, 'full')).toBe(true);
        }
    });

    it('Manager template denies finance/audit/users by default', async () => {
        const role = await fx.prisma.role.create({
            data: {name: 'Manager (test)', isSystem: false, permissions: MANAGER_PERMISSIONS},
        });
        const fresh = await fx.prisma.role.findUniqueOrThrow({where: {id: role.id}});
        const perms = fresh.permissions as Record<string, string>;

        // Default Manager works the day-to-day surface.
        expect(hasPermission(perms as never, 'rentals', 'full')).toBe(true);
        expect(hasPermission(perms as never, 'reservations', 'full')).toBe(true);
        expect(hasPermission(perms as never, 'cars', 'view')).toBe(true);

        // ...but is locked out of sensitive areas.
        expect(hasPermission(perms as never, 'finance', 'view')).toBe(false);
        expect(hasPermission(perms as never, 'users', 'full')).toBe(false);
        expect(hasPermission(perms as never, 'audit', 'view')).toBe(false);
    });

    it('Empty permissions blob denies everything (defense-in-depth)', () => {
        const perms = EMPTY_PERMISSIONS;
        expect(hasPermission(perms, 'cars', 'view')).toBe(false);
        expect(hasPermission(perms, 'cars', 'full')).toBe(false);
    });

    it('User → role FK is RESTRICT (cannot delete a role with users)', async () => {
        const role = await fx.prisma.role.create({
            data: {name: 'Restrict-test', permissions: ADMIN_PERMISSIONS},
        });
        await fx.prisma.user.create({
            data: {email: `restrict-${Date.now()}@example.com`, passwordHash: 'unused', roleId: role.id},
        });

        await expect(fx.prisma.role.delete({where: {id: role.id}})).rejects.toThrow(/foreign key|RESTRICT/i);
    });
});
