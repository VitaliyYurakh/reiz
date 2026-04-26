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

// ── Lead / B2B outreach ──

export const LeadStatus = {
    NEW: 'NEW',
    ENRICHED: 'ENRICHED',
    READY: 'READY',
    CONTACTED: 'CONTACTED',
    FOLLOWED_UP_1: 'FOLLOWED_UP_1',
    FOLLOWED_UP_2: 'FOLLOWED_UP_2',
    BREAKUP_SENT: 'BREAKUP_SENT',
    REPLIED: 'REPLIED',
    INTERESTED: 'INTERESTED',
    CLIENT: 'CLIENT',
    DISQUALIFIED: 'DISQUALIFIED',
    BOUNCED: 'BOUNCED',
    UNSUBSCRIBED: 'UNSUBSCRIBED',
    PAUSED: 'PAUSED',
} as const;
export const LEAD_STATUSES = Object.values(LeadStatus);
export type LeadStatusValue = typeof LeadStatus[keyof typeof LeadStatus];

// Statuses where outreach automation may still send to this lead
export const LEAD_ACTIVE_STATUSES: LeadStatusValue[] = [
    LeadStatus.READY,
    LeadStatus.CONTACTED,
    LeadStatus.FOLLOWED_UP_1,
    LeadStatus.FOLLOWED_UP_2,
];

// Statuses that take the lead out of automation
export const LEAD_TERMINAL_STATUSES: LeadStatusValue[] = [
    LeadStatus.REPLIED,
    LeadStatus.INTERESTED,
    LeadStatus.CLIENT,
    LeadStatus.DISQUALIFIED,
    LeadStatus.BOUNCED,
    LeadStatus.UNSUBSCRIBED,
    LeadStatus.PAUSED,
];

export const LeadSource = {
    GOOGLE_PLACES: 'google_places',
    MANUAL: 'manual',
    CSV: 'csv',
} as const;
export const LEAD_SOURCES = Object.values(LeadSource);

export const LeadEmailDirection = {
    OUTBOUND: 'OUTBOUND',
    INBOUND: 'INBOUND',
} as const;
export const LEAD_EMAIL_DIRECTIONS = Object.values(LeadEmailDirection);

export const LeadEmailTemplate = {
    INITIAL: 'initial',
    FOLLOW_UP_3D: 'fu_3d',
    FOLLOW_UP_7D: 'fu_7d',
    BREAKUP_14D: 'breakup_14d',
} as const;
export const LEAD_EMAIL_TEMPLATES = Object.values(LeadEmailTemplate);

// Target markets — Russian-speaking owners-first prioritization
export const LEAD_TARGET_COUNTRIES = ['TR', 'ME', 'RS', 'AM', 'TH', 'ID', 'KZ'] as const;
export type LeadCountryCode = typeof LEAD_TARGET_COUNTRIES[number];

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
