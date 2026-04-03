import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

/**
 * Validates requests from Next.js BFF (customer cabinet).
 * Expects:
 * - Header `x-service-secret` matching SERVICE_SECRET env var
 * - Header `x-client-id` with the numeric client ID
 *
 * Sets `res.locals.clientId` on success.
 */
const serviceAuth = (req: Request, res: Response, next: NextFunction) => {
    const secret = req.header('x-service-secret');
    const clientId = req.header('x-client-id');

    if (!secret || secret !== process.env.SERVICE_SECRET) {
        return res.status(StatusCodes.FORBIDDEN).json({msg: 'Invalid service secret'});
    }

    if (!clientId || isNaN(Number(clientId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Missing or invalid x-client-id'});
    }

    res.locals.clientId = Number(clientId);
    next();
};

export default serviceAuth;
