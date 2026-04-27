/**
 * TOTP 2FA service — opt-in, per-user.
 *
 * Flow:
 *   1. /setup     → generate secret, return otpauth URI + QR data-URI.
 *                   Secret is persisted on User immediately so the QR survives
 *                   page refreshes; `totpEnabled` stays false until /enable.
 *   2. /enable    → user posts a code; if valid, flip `totpEnabled=true`,
 *                   generate 10 recovery codes, persist their bcrypt hashes,
 *                   bump tokenVersion, return the codes ONCE (plaintext) to
 *                   the user. They will never see them again.
 *   3. login      → if user has `totpEnabled`, require `totpCode` in the
 *                   login body. Service exposes verify(code) used by both the
 *                   login flow and the /enable handshake.
 *   4. /disable   → user posts password + code (TOTP or recovery). On
 *                   success, clear secret + codes, set enabled=false, bump
 *                   tokenVersion.
 *
 * Config:
 *   - 6-digit codes, 30-second step, SHA-1 (RFC 6238 default — what every
 *     authenticator app supports out-of-the-box).
 *   - 1-step window for clock skew (verify code from previous/next 30s slot).
 *
 * Storage:
 *   - `User.totpSecret`: base32 plaintext. Knowing the secret = ability to
 *     mint codes, but only if you also know the user's password (we re-check
 *     on disable). For higher assurance we could encrypt at rest with a
 *     KMS key — left as a follow-up.
 *   - `User.totpRecoveryCodes`: JSON array of bcrypt hashes. Each is single
 *     use; on consume we mark by removing from the array.
 */

import {authenticator} from 'otplib';
import qrcode from 'qrcode';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import {Prisma} from '@prisma/client';
import {prisma, BadRequestError, NotFoundError} from '../utils';

authenticator.options = {
    digits: 6,
    step: 30,
    window: 1,
};

const ISSUER = 'REIZ Admin';
const RECOVERY_CODE_COUNT = 10;
const RECOVERY_CODE_BYTES = 5; // 10 hex chars

function generateRecoveryCode(): string {
    return crypto.randomBytes(RECOVERY_CODE_BYTES).toString('hex');
}

class TotpService {
    /** Generate (or rotate) a secret for the user and return the otpauth URI + QR PNG data URI. */
    async setup(userId: number) {
        const user = await prisma.user.findUnique({where: {id: userId}, select: {email: true, totpEnabled: true}});
        if (!user) throw new NotFoundError('User not found');
        if (user.totpEnabled) {
            throw new BadRequestError('2FA already enabled — disable first to re-setup');
        }

        const secret = authenticator.generateSecret();
        await prisma.user.update({where: {id: userId}, data: {totpSecret: secret}});

        const otpauth = authenticator.keyuri(user.email, ISSUER, secret);
        const qrDataUri = await qrcode.toDataURL(otpauth, {margin: 1, width: 240});

        return {secret, otpauth, qrDataUri};
    }

    /** Verify the supplied code against the user's secret. Used by login + enable. */
    verify(secret: string, code: string): boolean {
        if (!secret || !code) return false;
        try {
            return authenticator.verify({token: code.replace(/\s+/g, ''), secret});
        } catch {
            return false;
        }
    }

    /** Confirm the first code, mint recovery codes, flip enabled. */
    async enable(userId: number, code: string): Promise<{recoveryCodes: string[]}> {
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {totpSecret: true, totpEnabled: true},
        });
        if (!user) throw new NotFoundError('User not found');
        if (user.totpEnabled) throw new BadRequestError('2FA already enabled');
        if (!user.totpSecret) throw new BadRequestError('Run /setup first');
        if (!this.verify(user.totpSecret, code)) {
            throw new BadRequestError('Invalid code');
        }

        const codes: string[] = [];
        const hashes: string[] = [];
        for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
            const c = generateRecoveryCode();
            codes.push(c);
            hashes.push(await bcrypt.hash(c, 10));
        }

        await prisma.user.update({
            where: {id: userId},
            data: {
                totpEnabled: true,
                totpRecoveryCodes: hashes,
                tokenVersion: {increment: 1}, // invalidate any prior sessions
            },
        });

        return {recoveryCodes: codes};
    }

    /**
     * Verify a recovery code and consume it (remove from the array).
     * Returns true on success.
     */
    async consumeRecoveryCode(userId: number, code: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {totpRecoveryCodes: true},
        });
        if (!user) return false;
        const hashes = (user.totpRecoveryCodes as string[] | null) ?? [];
        const trimmed = code.replace(/\s+/g, '').toLowerCase();
        for (let i = 0; i < hashes.length; i++) {
            if (await bcrypt.compare(trimmed, hashes[i])) {
                const remaining = [...hashes.slice(0, i), ...hashes.slice(i + 1)];
                await prisma.user.update({where: {id: userId}, data: {totpRecoveryCodes: remaining}});
                return true;
            }
        }
        return false;
    }

    async disable(userId: number) {
        await prisma.user.update({
            where: {id: userId},
            data: {
                totpEnabled: false,
                totpSecret: null,
                // Prisma's Json field needs the JsonNull sentinel to write SQL NULL.
                totpRecoveryCodes: Prisma.JsonNull,
                tokenVersion: {increment: 1},
            },
        });
    }

    async status(userId: number) {
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {totpEnabled: true, totpRecoveryCodes: true},
        });
        if (!user) throw new NotFoundError('User not found');
        const remaining = (user.totpRecoveryCodes as string[] | null)?.length ?? 0;
        return {enabled: user.totpEnabled, remainingRecoveryCodes: remaining};
    }
}

export default new TotpService();
