/**
 * Centralized error logger for the admin frontend.
 *
 * Development: writes to `console.error` so devs see the full stack locally.
 * Production: no-op by default — intended as the single hook point for a
 *             future Sentry / Datadog / OpenTelemetry integration.
 *
 * Use instead of sprinkling `console.error(err)` across components. Call
 * sites pass an optional short context string so logs are grep-friendly.
 */

const isDev = process.env.NODE_ENV !== 'production';

export function logError(err: unknown, context?: string): void {
    if (!isDev) {
        // Hook point: report to external service here (Sentry.captureException, etc).
        return;
    }
    if (context) {
        // eslint-disable-next-line no-console
        console.error(`[${context}]`, err);
    } else {
        // eslint-disable-next-line no-console
        console.error(err);
    }
}
