import {Request, Response} from 'express';
import {logger, UserNotFoundError, AccessDenied, prisma, BadRequestError} from '../utils';
import {authServices} from '../services';
import {TwoFactorRequiredError} from '../services/auth.services';
import totpService from '../services/totp.service';
import {StatusCodes} from 'http-status-codes';
import {loginSchema, validate, ValidationError} from '../validators';
import logAudit from '../middleware/audit.middleware';
import {env} from '../config/env';
import {z} from 'zod';
import {verifyPassword} from '../utils';

const IS_PROD = env.NODE_ENV === 'production';

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
    // Login keeps its own try/catch for lockout logic (unique error handling)
    async login(req: Request, res: Response) {
        try {
            const {nickname, pass, totpCode} = validate(loginSchema, req.body);

            if (checkLockout(nickname)) {
                logger.warn({email: nickname}, 'Login blocked: account locked out');
                logAudit({entityType: 'Auth', entityId: 0, action: 'LOGIN_LOCKOUT', after: {email: nickname}, req});
                return res.status(StatusCodes.TOO_MANY_REQUESTS).json({msg: 'Account temporarily locked. Try again later.'});
            }

            const token = await authServices.loginUser(nickname, pass, totpCode);

            clearFailedAttempts(nickname);

            const user = await prisma.user.findFirst({where: {email: nickname}, select: {id: true}});
            logAudit({actorId: user?.id, entityType: 'Auth', entityId: user?.id || 0, action: 'LOGIN_SUCCESS', req});

            res.cookie('token', token, COOKIE_OPTIONS);

            return res.status(StatusCodes.OK).json({ok: true});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }

            // 2FA required — password was correct, prompt for TOTP without
            // revealing whether the account exists (failed attempt counter
            // not bumped, but auditable).
            if (error instanceof TwoFactorRequiredError) {
                logAudit({actorId: error.userId, entityType: 'Auth', entityId: error.userId, action: 'LOGIN_2FA_REQUIRED', req});
                return res.status(StatusCodes.OK).json({requires2fa: true});
            }

            if (error instanceof UserNotFoundError || error instanceof AccessDenied) {
                const email = req.body?.nickname;
                if (email) recordFailedAttempt(email);

                logAudit({entityType: 'Auth', entityId: 0, action: 'LOGIN_FAILED', after: {email}, req});

                return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Invalid credentials'});
            }

            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // ── 2FA ──────────────────────────────────────────────────────────

    async totpStatus(_req: Request, res: Response) {
        const status = await totpService.status(res.locals.user.id);
        return res.status(StatusCodes.OK).json(status);
    }

    async totpSetup(req: Request, res: Response) {
        const {qrDataUri, otpauth, secret} = await totpService.setup(res.locals.user.id);
        logAudit({actorId: res.locals.user.id, entityType: 'Auth', entityId: res.locals.user.id, action: '2FA_SETUP_START', req});
        return res.status(StatusCodes.OK).json({qrDataUri, otpauth, secret});
    }

    async totpEnable(req: Request, res: Response) {
        const {code} = req.body ?? {};
        if (typeof code !== 'string' || code.length < 6) {
            throw new BadRequestError('Code required');
        }
        const {recoveryCodes} = await totpService.enable(res.locals.user.id, code);
        logAudit({actorId: res.locals.user.id, entityType: 'Auth', entityId: res.locals.user.id, action: '2FA_ENABLED', req});
        // tokenVersion was bumped — invalidate the cookie too so the next
        // request forces a re-login (with the new TOTP requirement).
        res.clearCookie('token', {path: '/'});
        return res.status(StatusCodes.OK).json({recoveryCodes});
    }

    async totpDisable(req: Request, res: Response) {
        const {pass, code} = req.body ?? {};
        if (typeof pass !== 'string' || typeof code !== 'string') {
            throw new BadRequestError('Password and code required');
        }
        const userId = res.locals.user.id;
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {passwordHash: true, totpSecret: true, totpEnabled: true},
        });
        if (!user || !user.totpEnabled) {
            throw new BadRequestError('2FA is not enabled');
        }
        const {valid} = await verifyPassword(pass, user.passwordHash);
        if (!valid) throw new AccessDenied();

        const okTotp = user.totpSecret ? totpService.verify(user.totpSecret, code) : false;
        const okRecovery = okTotp ? false : await totpService.consumeRecoveryCode(userId, code);
        if (!okTotp && !okRecovery) {
            throw new AccessDenied();
        }

        await totpService.disable(userId);
        logAudit({actorId: userId, entityType: 'Auth', entityId: userId, action: '2FA_DISABLED', req});
        res.clearCookie('token', {path: '/'});
        return res.status(StatusCodes.OK).json({ok: true});
    }

    async checkAuth(req: Request, res: Response) {
        const token = req.cookies?.token || req.header('Authorization');
        await authServices.authenticateUser(token);
        return res.status(StatusCodes.OK).json();
    }

    async me(req: Request, res: Response) {
        const user = res.locals.user;
        return res.status(StatusCodes.OK).json({user});
    }

    async logout(req: Request, res: Response) {
        logAudit({actorId: res.locals.user?.id, entityType: 'Auth', entityId: res.locals.user?.id || 0, action: 'LOGOUT', req});

        if (res.locals.user?.id) {
            await prisma.user.update({where: {id: res.locals.user.id}, data: {tokenVersion: {increment: 1}}});
        }

        res.clearCookie('token', {path: '/'});
        return res.status(StatusCodes.OK).json({msg: 'Logged out'});
    }
}

export default new AuthController();
