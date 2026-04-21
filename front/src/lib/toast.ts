import { toast as sonnerToast } from 'sonner';

// Re-export sonner's toast API so call sites depend on this module rather than
// the library directly. Makes a future swap (or wrapping, e.g. telemetry) trivial.
export const toast = sonnerToast;

/**
 * Pull the best-available user-facing message out of an axios/fetch error.
 * Priority: server `msg` -> server `message` -> Error.message -> fallback.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
    const resp = (err as { response?: { data?: { msg?: unknown; message?: unknown } } })?.response?.data;

    if (typeof resp?.msg === 'string' && resp.msg.trim()) return resp.msg;
    if (typeof resp?.message === 'string' && resp.message.trim()) return resp.message;
    if (err instanceof Error && err.message.trim()) return err.message;

    return fallback;
}

/** Shorthand for the common "show a user-readable axios error" flow. */
export function toastError(err: unknown, fallback: string): void {
    toast.error(extractErrorMessage(err, fallback));
}
