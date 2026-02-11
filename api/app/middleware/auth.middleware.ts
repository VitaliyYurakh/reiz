import {NextFunction, Request, Response} from 'express';

import {authServices} from '../services';
import {logger, prisma} from '../utils';
import {StatusCodes} from 'http-status-codes';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Read token from httpOnly cookie first, fallback to Authorization header
        const token = req.cookies?.token || req.header('Authorization');

        const decoded: any = await authServices.authenticateUser(token);

        // Fetch full user from DB to get permissions and current role
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                permissions: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Account deactivated'});
        }

        res.locals.user = user;
        next();
    } catch (error) {
        logger.error(error);

        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Not authenticated'});
    }
};

export default auth;
