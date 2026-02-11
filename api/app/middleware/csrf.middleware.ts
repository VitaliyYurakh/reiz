import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

/**
 * CSRF protection via Origin/Referer header check.
 * Since we use httpOnly cookies for auth, we must verify that
 * state-changing requests come from our own origin.
 *
 * Only applies to non-GET/HEAD/OPTIONS methods.
 */
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3002')
    .split(',')
    .map((o) => o.trim());

const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    // Safe methods don't need CSRF protection
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // If origin header is present, check it
    if (origin) {
        if (allowedOrigins.includes(origin)) {
            return next();
        }
        return res.status(StatusCodes.FORBIDDEN).json({msg: 'CSRF validation failed'});
    }

    // Fallback: check referer header
    if (referer) {
        const refererOrigin = new URL(referer).origin;
        if (allowedOrigins.includes(refererOrigin)) {
            return next();
        }
        return res.status(StatusCodes.FORBIDDEN).json({msg: 'CSRF validation failed'});
    }

    // No origin or referer — allow requests without cookies (API clients like curl),
    // but block if a cookie is present (browser without origin = suspicious)
    if (req.cookies?.token) {
        return res.status(StatusCodes.FORBIDDEN).json({msg: 'CSRF validation failed'});
    }

    next();
};

export default csrfProtection;
