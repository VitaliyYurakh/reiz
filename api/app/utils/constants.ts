export const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ── Status Constants ──

export const ReservationStatus = {
    CONFIRMED: 'confirmed',
    PICKED_UP: 'picked_up',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
} as const;

export const RentalStatus = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

export const RentalRequestStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
} as const;

/**
 * Parse a route param as integer. Throws 400-style error if NaN.
 */
export function parseId(value: string | undefined, name = 'id'): number {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        throw new BadParamError(`Invalid ${name}: ${value}`);
    }
    return n;
}

/**
 * Parse an optional query param as integer. Returns undefined if absent/empty.
 * Throws if present but not a valid positive integer.
 */
export function parseOptionalId(value: string | undefined, name = 'id'): number | undefined {
    if (value === undefined || value === '') return undefined;
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        throw new BadParamError(`Invalid ${name}: ${value}`);
    }
    return n;
}

export class BadParamError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadParamError';
    }
}

/**
 * Parse pagination query params with safe defaults and bounds.
 */
export function parsePagination(query: Record<string, any>, defaultLimit = 20): {page: number; limit: number} {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || defaultLimit));
    return {page, limit};
}
