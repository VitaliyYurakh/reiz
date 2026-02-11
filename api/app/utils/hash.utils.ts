import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import {promisify} from 'node:util';

const BCRYPT_ROUNDS = 12;

const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * Legacy PBKDF2 hash — only used to verify old passwords during migration.
 */
const legacyHash = async (password: string): Promise<string> => {
    const salt = process.env.SALT || '';
    const derivedKey = await pbkdf2(password, salt, 10000, 64, 'sha512');
    return derivedKey.toString('hex');
};

/**
 * Hash a password with bcrypt (per-user random salt).
 */
const createHashedPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Verify a password against a stored hash.
 * Supports both bcrypt ($2a$/$2b$ prefix) and legacy PBKDF2 hashes.
 * Returns { valid, needsRehash } so callers can upgrade old hashes.
 */
const verifyPassword = async (password: string, storedHash: string): Promise<{valid: boolean; needsRehash: boolean}> => {
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
        const valid = await bcrypt.compare(password, storedHash);
        return {valid, needsRehash: false};
    }

    // Legacy PBKDF2 hash
    const legacyResult = await legacyHash(password);
    const valid = legacyResult === storedHash;
    return {valid, needsRehash: valid};
};

export default createHashedPassword;
export {verifyPassword};
