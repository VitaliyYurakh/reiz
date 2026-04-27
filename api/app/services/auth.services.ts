import {AccessDenied, createHashedPassword, verifyPassword, prisma, UserNotFoundError} from '../utils';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import totpService from './totp.service';

const SECRET = env.SECRET;

// Custom marker so the controller can return a 200 with `requires2fa: true`
// instead of the generic 401, without exposing whether the password was right.
export class TwoFactorRequiredError extends Error {
    userId: number;
    constructor(userId: number) {
        super('2FA required');
        this.name = 'TwoFactorRequiredError';
        this.userId = userId;
    }
}

class AuthService {
    async authenticateUser(token: string) {
        if (!token) {
            throw new AccessDenied();
        }

        const decode = jwt.verify(token.replace('Bearer ', ''), SECRET, {algorithms: ['HS256']});

        return decode;
    }

    /**
     * Login pipeline:
     *   - verify password (constant-time via bcrypt)
     *   - if user has 2FA enabled and `totpCode` not supplied → throw
     *     TwoFactorRequiredError so the controller can prompt for the code
     *   - if `totpCode` supplied: try TOTP first, fall back to recovery code
     *   - on success: rehash legacy passwords, mint a 24h JWT
     */
    async loginUser(email: string, pass: string, totpCode?: string) {
        const user = await prisma.user.findFirst({
            where: {email},
            select: {id: true, pass: true, tokenVersion: true, totpEnabled: true, totpSecret: true},
        });

        if (!user) {
            throw new UserNotFoundError();
        }

        const {valid, needsRehash} = await verifyPassword(pass, user.pass);

        if (!valid) {
            throw new AccessDenied();
        }

        if (user.totpEnabled) {
            if (!totpCode) {
                throw new TwoFactorRequiredError(user.id);
            }
            const trimmed = totpCode.trim();
            const okTotp = user.totpSecret ? totpService.verify(user.totpSecret, trimmed) : false;
            const okRecovery = okTotp ? false : await totpService.consumeRecoveryCode(user.id, trimmed);
            if (!okTotp && !okRecovery) {
                throw new AccessDenied();
            }
        }

        // Transparent rehash: upgrade legacy PBKDF2 → bcrypt on successful login
        if (needsRehash) {
            const newHash = await createHashedPassword(pass);
            await prisma.user.update({where: {id: user.id}, data: {pass: newHash}});
        }

        const token = jwt.sign({id: user.id, tv: user.tokenVersion}, SECRET, {algorithm: 'HS256', expiresIn: '24h'});

        return token;
    }
}

export default new AuthService();
