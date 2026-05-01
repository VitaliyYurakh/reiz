import {describe, it, expect} from 'vitest';
import {getErrorMessage, BadRequestError, NotFoundError, AccessDenied} from './error.utils';

describe('getErrorMessage', () => {
    it('extracts .message from Error instances', () => {
        expect(getErrorMessage(new Error('boom'))).toBe('boom');
    });

    it('returns string inputs as-is', () => {
        expect(getErrorMessage('plain string error')).toBe('plain string error');
    });

    it('JSON-stringifies plain objects', () => {
        expect(getErrorMessage({code: 'P2025'})).toBe('{"code":"P2025"}');
    });

    it('falls back to String() when JSON.stringify throws (cyclic)', () => {
        const cyclic: Record<string, unknown> = {};
        cyclic.self = cyclic;
        const result = getErrorMessage(cyclic);
        expect(typeof result).toBe('string');
        // Doesn't throw, returns something deterministic.
        expect(result.length).toBeGreaterThan(0);
    });

    it('handles null and undefined without throwing', () => {
        expect(getErrorMessage(null)).toBe('null');
        expect(getErrorMessage(undefined)).toBe('undefined');
    });

    it('preserves messages from custom domain errors', () => {
        expect(getErrorMessage(new BadRequestError('bad input'))).toBe('bad input');
        expect(getErrorMessage(new NotFoundError('client 42'))).toBe('client 42');
        expect(getErrorMessage(new AccessDenied())).toBe('Access denied');
    });
});
