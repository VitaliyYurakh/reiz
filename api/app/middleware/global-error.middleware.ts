import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import {logger, AccessDenied, UserNotFoundError, CarNotFoundError, BadParamError, NotFoundError, BadRequestError, ConflictError, ForbiddenError} from '../utils';
import {ValidationError} from '../validators';

const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (res.headersSent) return;

    // 400 — validation & bad params
    if (err instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: err.errors});
    }

    if (err instanceof BadParamError || err instanceof BadRequestError) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: err.message});
    }

    // 401
    if (err instanceof AccessDenied) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Access denied'});
    }

    // 403
    if (err instanceof ForbiddenError) {
        return res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }

    // 404
    if (err instanceof UserNotFoundError || err instanceof CarNotFoundError || err instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: err.message});
    }

    // 409
    if (err instanceof ConflictError) {
        return res.status(StatusCodes.CONFLICT).json({msg: err.message});
    }

    // Prisma unique constraint violation → 409
    if ('code' in err && (err as any).code === 'P2002') {
        return res.status(StatusCodes.CONFLICT).json({msg: 'Record already exists'});
    }

    // Prisma record not found → 404
    if ('code' in err && (err as any).code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({msg: 'Record not found'});
    }

    // Prisma validation error (e.g. Float provided for Int field) → 400
    if (err.constructor?.name === 'PrismaClientValidationError') {
        logger.error({err, requestId: res.locals.requestId}, 'Prisma validation error');
        return res.status(StatusCodes.BAD_REQUEST).json({msg: err.message});
    }

    logger.error({err, requestId: res.locals.requestId}, 'Unhandled error');
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
};

export default globalErrorHandler;
