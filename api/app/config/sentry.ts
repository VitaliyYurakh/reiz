import * as Sentry from '@sentry/node';
import {env} from './env';

/**
 * Initialise Sentry once at process start. No-op when SENTRY_DSN isn't
 * set, so dev runs without Sentry never hit the network. Call BEFORE
 * `express()` is built so Sentry's auto-instrumentation can wrap the
 * Express middleware stack.
 *
 * Setup steps for ops:
 *   1. Create a Node.js project at https://sentry.io
 *   2. Copy the DSN
 *   3. Add SENTRY_DSN as a GitHub Actions repo secret
 *   4. The deploy workflow already passes it to docker-compose
 */
export function initSentry() {
    if (!env.SENTRY_DSN) return;

    Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        // Trace 10% of transactions in prod — enough to spot regressions
        // without filling the Sentry quota during a busy month.
        tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Don't ship local request bodies to Sentry — risk of leaking PII
        // (email, phone) and bcrypt hashes on auth endpoints.
        sendDefaultPii: false,
    });
}

export {Sentry};
