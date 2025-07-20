import {AccessDenied, createHashedPassword, prisma, UserNotFoundError} from '../utils';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || '';

class AuthService {
    async authenticateUser(token: string) {
        if (!token) {
            throw new AccessDenied();
        }

        const decode = jwt.verify(token.replace('Bearer ', ''), SECRET);

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

        const token = jwt.sign({id: user.id, role: user.role}, SECRET, {expiresIn: '24h'});

        return token;
    }
}

export default new AuthService();
