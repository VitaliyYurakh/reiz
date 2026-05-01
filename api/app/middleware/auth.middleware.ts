import {NextFunction, Request, Response} from 'express';

import {authServices} from '../services';
import {logger, prisma} from '../utils';
import {StatusCodes} from 'http-status-codes';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Read token from httpOnly cookie first, fallback to Authorization header
        const token = req.cookies?.token || req.header('Authorization');

        const decoded: any = await authServices.authenticateUser(token);

        // Fetch full user from DB. `role` is now a relation to the
        // `Role` table whose `permissions` Json holds the access map.
        // Selecting `name` from the role keeps the legacy "is this an
        // admin?" check (used by /admin sidebar) trivially answerable
        // via `user.role.name === 'Admin'`.
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                tokenVersion: true,
                role: {
                    select: {id: true, name: true, isSystem: true, permissions: true},
                },
            },
        });

        if (!user || !user.isActive) {
            return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Account deactivated'});
        }

        // Reject tokens issued before a logout/password change (tokenVersion mismatch)
        if (typeof decoded.tv === 'number' && decoded.tv !== user.tokenVersion) {
            return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Token revoked'});
        }

        res.locals.user = user;
        next();
    } catch (error) {
        logger.error(error);

        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Not authenticated'});
    }
};

export default auth;
