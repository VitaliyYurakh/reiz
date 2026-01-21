import crypto from 'node:crypto';
import {promisify} from 'node:util';

const pbkdf2 = promisify(crypto.pbkdf2);

const hashPassword = async (password: string): Promise<string> => {
    const salt = process.env.SALT;
    if (!salt) {
    }
    const derivedKey = await pbkdf2(password, salt, 10000, 64, 'sha512');

    return derivedKey.toString('hex');
};

const createHashedPassword = async (password: string, salt: string = ''): Promise<string> => {
    const hashedPassword = await hashPassword(password);

    return hashedPassword;
};

export default createHashedPassword;
