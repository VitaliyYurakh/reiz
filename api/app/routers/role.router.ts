import {Router, Request, Response} from 'express';
import {prisma} from '../utils';
import {auth, requirePermission} from '../middleware';
import {validate, ValidationError} from '../validators';
import logAudit from '../middleware/audit.middleware';
import {z} from 'zod';
import {StatusCodes} from 'http-status-codes';
import {PERMISSION_MODULES, PERMISSION_LEVELS} from '../types/permissions';

const router = Router();

// Phase 1 of the RBAC refactor: minimal Role API. List + read are gated by
// `users.view` (anyone managing users needs to know what roles exist);
// create / update / delete by `users.full`. Phase 2 adds a richer admin
// UI; for now this powers the role-picker dropdown in `UserModal`.

const moduleEnum = z.enum(PERMISSION_MODULES as unknown as [string, ...string[]]);
const levelEnum = z.enum(PERMISSION_LEVELS as unknown as [string, ...string[]]);
const permissionsSchema = z.record(moduleEnum, levelEnum);

const createRoleSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).nullable().optional(),
    permissions: permissionsSchema.optional().default({}),
});

const updateRoleSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    permissions: permissionsSchema.optional(),
});

router.get(
    '/',
    auth,
    requirePermission('users', 'view'),
    async (_req: Request, res: Response) => {
        const roles = await prisma.role.findMany({
            select: {id: true, name: true, description: true, isSystem: true, permissions: true},
            orderBy: [{isSystem: 'desc'}, {name: 'asc'}],
        });
        return res.status(StatusCodes.OK).json(roles);
    },
);

router.get(
    '/:id',
    auth,
    requirePermission('users', 'view'),
    async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const role = await prisma.role.findUnique({where: {id}});
        if (!role) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Role not found'});
        return res.status(StatusCodes.OK).json(role);
    },
);

router.post(
    '/',
    auth,
    requirePermission('users', 'full'),
    async (req: Request, res: Response) => {
        try {
            const data = validate(createRoleSchema, req.body);
            const role = await prisma.role.create({data: {...data, permissions: data.permissions ?? {}}});
            logAudit({actorId: res.locals.user?.id, entityType: 'Role', entityId: role.id, action: 'CREATE', after: role, req});
            return res.status(StatusCodes.CREATED).json(role);
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: err.errors});
            }
            throw err;
        }
    },
);

router.patch(
    '/:id',
    auth,
    requirePermission('users', 'full'),
    async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const data = validate(updateRoleSchema, req.body);

            // System roles can't be renamed (would break the seed bootstrap on
            // fresh DBs that look up "Admin" by name). Permissions ARE editable
            // — admin can dial Admin's grants if they ever need to.
            const existing = await prisma.role.findUnique({where: {id}});
            if (!existing) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Role not found'});
            if (existing.isSystem && data.name && data.name !== existing.name) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'System role cannot be renamed'});
            }

            const role = await prisma.role.update({where: {id}, data});
            logAudit({actorId: res.locals.user?.id, entityType: 'Role', entityId: id, action: 'UPDATE', before: existing, after: role, req});
            return res.status(StatusCodes.OK).json(role);
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: err.errors});
            }
            throw err;
        }
    },
);

router.delete(
    '/:id',
    auth,
    requirePermission('users', 'full'),
    async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const existing = await prisma.role.findUnique({
            where: {id},
            include: {_count: {select: {users: true}}},
        });
        if (!existing) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Role not found'});
        if (existing.isSystem) {
            return res.status(StatusCodes.FORBIDDEN).json({msg: 'System role cannot be deleted'});
        }
        if (existing._count.users > 0) {
            return res
                .status(StatusCodes.CONFLICT)
                .json({msg: `Role is assigned to ${existing._count.users} user(s); reassign them first`});
        }
        await prisma.role.delete({where: {id}});
        logAudit({actorId: res.locals.user?.id, entityType: 'Role', entityId: id, action: 'DELETE', before: existing, req});
        return res.status(StatusCodes.OK).json({msg: 'Role deleted'});
    },
);

export default router;
