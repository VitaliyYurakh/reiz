import {NextFunction, Request, Response} from 'express';

import {authServices} from '../services';
import {AccessDenied, logger} from '../utils';
import {StatusCodes} from 'http-status-codes';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        const decoded = await authServices.authenticateUser(token);
        res.locals.user = decoded;
        next();
    } catch (error) {
        logger.error(error);

        if (error instanceof AccessDenied) {
            return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.msg});
    }
};

export default auth;
