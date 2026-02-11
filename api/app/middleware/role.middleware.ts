import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';

const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user;

            if (!user || !user.role) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'Access forbidden: no role assigned'});
            }

            if (!roles.includes(user.role)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    msg: `Access forbidden: requires one of [${roles.join(', ')}]`,
                });
            }

            next();
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    };
};

const requirePermission = (module: string, level: 'view' | 'full') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user;

            if (!user) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'Access forbidden'});
            }

            // Admin bypasses all permission checks
            if (user.role === 'admin') return next();

            const perms = (user.permissions as Record<string, string>) || {};
            const userLevel = perms[module] || 'none';

            if (level === 'view' && (userLevel === 'view' || userLevel === 'full')) return next();
            if (level === 'full' && userLevel === 'full') return next();

            return res.status(StatusCodes.FORBIDDEN).json({msg: 'Insufficient permissions'});
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    };
};

export default requireRole;
export {requirePermission};
