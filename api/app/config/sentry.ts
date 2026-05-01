import * as Sentry from '@sentry/node';
import {env} from './env';

/**
 * Initialise Sentry once at process start. No-op when SENTRY_DSN isn't
 * set, so dev runs without Sentry never hit the network. Call BEFORE
 * `express()` is built so Sentry's auto-instrumentation can wrap the
 * Express middleware stack.
 *
 * Setup is one-time-done — DSN lives as the `SENTRY_DSN` GitHub Actions
 * secret which the deploy workflow propagates to docker-compose. To
 * rotate or rebind, update the secret value and push any commit.
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
