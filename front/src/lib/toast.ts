import { toast as sonnerToast } from 'sonner';

// Re-export sonner's toast API so call sites depend on this module rather than
// the library directly. Makes a future swap (or wrapping, e.g. telemetry) trivial.
export const toast = sonnerToast;

/**
 * Pull the best-available user-facing message out of an axios/fetch error.
 * Priority: server `msg` (+ `errors[]` details) -> server `message` -> Error.message -> fallback.
 *
 * The `errors[]` expansion matters because our API returns Zod failures as
 * `{msg: 'Validation error', errors: ['field: Required', ...]}` — without it
 * the toast just said "Validation error" with no hint what was wrong, and the
 * short string sometimes rendered as a visually-empty red toast under sonner's
 * richColors theme.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
    const resp = (err as {
        response?: {
            data?: {
                msg?: unknown;
                message?: unknown;
                errors?: unknown;
                details?: unknown;
            };
        };
    })?.response?.data;

    const detailList = Array.isArray(resp?.errors)
        ? resp.errors
        : Array.isArray(resp?.details)
            ? resp.details
            : null;
    const detailStr = detailList
        ?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d)))
        .filter(Boolean)
        .join(', ');

    if (typeof resp?.msg === 'string' && resp.msg.trim()) {
        return detailStr ? `${resp.msg}: ${detailStr}` : resp.msg;
    }
    if (typeof resp?.message === 'string' && resp.message.trim()) {
        return detailStr ? `${resp.message}: ${detailStr}` : resp.message;
    }
    if (detailStr) return detailStr;
    if (err instanceof Error && err.message.trim()) return err.message;

    return fallback;
}

/** Shorthand for the common "show a user-readable axios error" flow. */
export function toastError(err: unknown, fallback: string): void {
    toast.error(extractErrorMessage(err, fallback));
}
