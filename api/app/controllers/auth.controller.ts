import {Request, Response} from 'express';
import {logger, UserNotFoundError, AccessDenied, prisma} from '../utils';
import {authServices} from '../services';
import {StatusCodes} from 'http-status-codes';
import {loginSchema, validate, ValidationError} from '../validators';
import logAudit from '../middleware/audit.middleware';

const IS_PROD = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'strict' as const : 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24h — matches JWT expiry
    path: '/',
};

// Account lockout: max 5 failed attempts per email within 15 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const failedAttempts = new Map<string, {count: number; firstAttempt: number}>();

function checkLockout(email: string): boolean {
    const record = failedAttempts.get(email);
    if (!record) return false;

    // Reset if window expired
    if (Date.now() - record.firstAttempt > LOCKOUT_WINDOW_MS) {
        failedAttempts.delete(email);
        return false;
    }

    return record.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(email: string): void {
    const record = failedAttempts.get(email);
    const now = Date.now();

    if (!record || now - record.firstAttempt > LOCKOUT_WINDOW_MS) {
        failedAttempts.set(email, {count: 1, firstAttempt: now});
    } else {
        record.count++;
    }
}

function clearFailedAttempts(email: string): void {
    failedAttempts.delete(email);
}

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const {nickname, pass} = validate(loginSchema, req.body);

            // Account lockout check
            if (checkLockout(nickname)) {
                logger.warn({email: nickname}, 'Login blocked: account locked out');
                logAudit({entityType: 'Auth', entityId: 0, action: 'LOGIN_LOCKOUT', after: {email: nickname}, req});
                return res.status(StatusCodes.TOO_MANY_REQUESTS).json({msg: 'Account temporarily locked. Try again later.'});
            }

            const token = await authServices.loginUser(nickname, pass);

            clearFailedAttempts(nickname);

            // Audit: successful login
            const user = await prisma.user.findFirst({where: {email: nickname}, select: {id: true}});
            logAudit({actorId: user?.id, entityType: 'Auth', entityId: user?.id || 0, action: 'LOGIN_SUCCESS', req});

            res.cookie('token', token, COOKIE_OPTIONS);

            return res.status(StatusCodes.OK).json({token});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }

            logger.error(error);

            if (error instanceof UserNotFoundError || error instanceof AccessDenied) {
                const email = req.body?.nickname;
                if (email) recordFailedAttempt(email);

                // Audit: failed login
                logAudit({entityType: 'Auth', entityId: 0, action: 'LOGIN_FAILED', after: {email}, req});

                return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Invalid credentials'});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async checkAuth(req: Request, res: Response) {
        try {
            const token = req.cookies?.token || req.header('Authorization');

            await authServices.authenticateUser(token);

            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Not authenticated'});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = res.locals.user;
            return res.status(StatusCodes.OK).json({user});
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async logout(req: Request, res: Response) {
        // Audit: logout
        logAudit({actorId: res.locals.user?.id, entityType: 'Auth', entityId: res.locals.user?.id || 0, action: 'LOGOUT', req});

        res.clearCookie('token', {path: '/'});
        return res.status(StatusCodes.OK).json({msg: 'Logged out'});
    }
}

export default new AuthController();
