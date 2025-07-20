import crypto from 'node:crypto';
import {promisify} from 'node:util';

const pbkdf2 = promisify(crypto.pbkdf2);
const salt = process.env.SALT;

const hashPassword = async (password: string): Promise<string> => {
    const derivedKey = await pbkdf2(password, salt, 10000, 64, 'sha512');

    return derivedKey.toString('hex');
};

const createHashedPassword = async (password: string, salt: string = ''): Promise<string> => {
    const hashedPassword = await hashPassword(password);

    return hashedPassword;
};

createHashedPassword('test').then(console.log);

export default createHashedPassword;
