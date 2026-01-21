import {AccessDenied, createHashedPassword, prisma, UserNotFoundError} from '../utils';
import jwt from 'jsonwebtoken';

const API_SECRET = process.env.API_SECRET || '';

class AuthService {
    async authenticateUser(token: string) {
        if (!token) {
            throw new AccessDenied();
        }

        const decode = jwt.verify(token.replace('Bearer ', ''), API_SECRET);

        return decode;
    }

    async loginUser(email: string, pass: string) {
        const user = await prisma.user.findFirst({where: {email}});

        if (!user) {
            throw new UserNotFoundError();
        }

        const hashedPassword = await createHashedPassword(pass);

        if (user.pass !== hashedPassword) {
            throw new AccessDenied();
        }

        const token = jwt.sign({id: user.id, role: user.role}, API_SECRET, {expiresIn: '24h'});

        return token;
    }
}

export default new AuthService();
