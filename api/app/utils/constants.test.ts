import {describe, it, expect} from 'vitest';
import {parseId, parseOptionalId, parsePagination, BadParamError} from './constants';

describe('parseId', () => {
    it('parses positive integer string', () => {
        expect(parseId('42')).toBe(42);
    });

    it('throws BadParamError on non-numeric', () => {
        expect(() => parseId('abc')).toThrow(BadParamError);
        expect(() => parseId('abc')).toThrow(/Invalid id: abc/);
    });

    it('throws on zero and negatives (zero ids are not allowed by Postgres SERIAL)', () => {
        expect(() => parseId('0')).toThrow(BadParamError);
        expect(() => parseId('-5')).toThrow(BadParamError);
    });

    it('throws on float (would silently truncate otherwise)', () => {
        expect(() => parseId('3.14')).toThrow(BadParamError);
    });

    it('throws on undefined', () => {
        expect(() => parseId(undefined)).toThrow(BadParamError);
    });

    it('uses the supplied param name in the error message', () => {
        expect(() => parseId('x', 'rentalId')).toThrow(/Invalid rentalId/);
    });

    it('rejects values larger than INT4 max (regression: prod bot scraper crash)', () => {
        // Sentry caught GET /api/car/1766847957230 (13-digit timestamp as ID)
        // crashing Prisma findUnique with a ConnectorError instead of 400.
        // parseId now caps at 2_147_483_647 to fail at the route boundary.
        expect(() => parseId('1766847957230')).toThrow(/Invalid id/);
        expect(() => parseId('2147483648')).toThrow(/Invalid id/);
        expect(parseId('2147483647')).toBe(2147483647);
    });
});

describe('parseOptionalId', () => {
    it('returns undefined for missing input', () => {
        expect(parseOptionalId(undefined)).toBeUndefined();
        expect(parseOptionalId('')).toBeUndefined();
    });

    it('parses valid integer', () => {
        expect(parseOptionalId('17')).toBe(17);
    });

    it('throws when present but invalid (not silently coerced to undefined)', () => {
        expect(() => parseOptionalId('NaN')).toThrow(BadParamError);
    });
});

describe('parsePagination', () => {
    it('returns defaults when params absent', () => {
        expect(parsePagination({})).toEqual({page: 1, limit: 20});
    });

    it('parses page and limit from strings', () => {
        expect(parsePagination({page: '3', limit: '50'})).toEqual({page: 3, limit: 50});
    });

    it('clamps page to a minimum of 1 (no negative pages)', () => {
        expect(parsePagination({page: '-5', limit: '10'}).page).toBe(1);
        expect(parsePagination({page: '0', limit: '10'}).page).toBe(1);
    });

    it('caps limit at 100 to prevent abuse / OOM on big result sets', () => {
        expect(parsePagination({page: '1', limit: '500'}).limit).toBe(100);
    });

    it('uses supplied defaultLimit when limit absent', () => {
        expect(parsePagination({}, 25).limit).toBe(25);
    });

    it('rejects garbage limit and falls back to defaultLimit', () => {
        expect(parsePagination({limit: 'abc'}, 30).limit).toBe(30);
    });
});
