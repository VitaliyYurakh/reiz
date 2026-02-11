import {AccessDenied, createHashedPassword, verifyPassword, prisma, UserNotFoundError} from '../utils';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || '';
if (!SECRET || SECRET.length < 32) {
    throw new Error('FATAL: JWT SECRET must be set and at least 32 characters long. Set SECRET in .env');
}

class AuthService {
    async authenticateUser(token: string) {
        if (!token) {
            throw new AccessDenied();
        }

        const decode = jwt.verify(token.replace('Bearer ', ''), SECRET, {algorithms: ['HS256']});

        return decode;
    }

    async loginUser(email: string, pass: string) {
        const user = await prisma.user.findFirst({where: {email}});

        if (!user) {
            throw new UserNotFoundError();
        }

        const {valid, needsRehash} = await verifyPassword(pass, user.pass);

        if (!valid) {
            throw new AccessDenied();
        }

        // Transparent rehash: upgrade legacy PBKDF2 → bcrypt on successful login
        if (needsRehash) {
            const newHash = await createHashedPassword(pass);
            await prisma.user.update({where: {id: user.id}, data: {pass: newHash}});
        }

        const token = jwt.sign({id: user.id}, SECRET, {algorithm: 'HS256', expiresIn: '24h'});

        return token;
    }
}

export default new AuthService();
