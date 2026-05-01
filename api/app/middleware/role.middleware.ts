import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {logger, getErrorMessage} from '../utils';
import {hasPermission, type PermissionModule} from '../types/permissions';

// Compatibility shape for `res.locals.user.role` after the RBAC refactor.
// Auth middleware now selects the related `Role` row, so `role.name` and
// `role.permissions` are both available.
type AuthedUser = {
    id: number;
    role?: {
        name: string;
        permissions: unknown;
    } | null;
};

/**
 * Gate by role NAME. Used for endpoints whose access is "Admin only" by
 * convention (user management, audit log) — kept as a thin wrapper around
 * the new `Role.name` so the calling code reads `requireRole('Admin')`
 * just like before.
 *
 * For granular access prefer `requirePermission(module, level)` — adding a
 * new role won't require touching any router file then.
 */
const requireRole = (...roleNames: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user as AuthedUser | undefined;
            const roleName = user?.role?.name;

            if (!roleName) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'Access forbidden: no role assigned'});
            }

            if (!roleNames.includes(roleName)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    msg: `Access forbidden: requires one of [${roleNames.join(', ')}]`,
                });
            }

            next();
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: getErrorMessage(error)});
        }
    };
};

/**
 * Gate by permission. Reads `user.role.permissions[module]` and compares
 * against the required level (`'view'` accepts both `'view'` and `'full'`,
 * `'full'` requires exactly `'full'`).
 *
 * No more hard-coded admin bypass — the seeded Admin role has every module
 * at level 'full', so it passes naturally. If a future "Operator" role
 * needs a new permission, edit the role in the DB; no code change.
 */
const requirePermission = (moduleName: PermissionModule, level: 'view' | 'full') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user as AuthedUser | undefined;

            if (!user) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'Access forbidden'});
            }

            const perms = (user.role?.permissions ?? {}) as Record<string, string>;

            if (hasPermission(perms as never, moduleName, level)) return next();

            return res.status(StatusCodes.FORBIDDEN).json({msg: 'Insufficient permissions'});
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: getErrorMessage(error)});
        }
    };
};

export default requireRole;
export {requirePermission};
