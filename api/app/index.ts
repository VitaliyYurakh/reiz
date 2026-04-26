import {env} from './config/env';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import {logger, prisma} from './utils';
import {router} from './routers';
import {auth, csrfProtection, globalErrorHandler, requirePermission} from './middleware';
import {requestContext} from './config/request-context';
import leadCronService from './services/lead-cron.service';
import path from 'node:path';

const SHUTDOWN_TIMEOUT = 10_000;

const startServer = async () => {
    try {
        const app = express();
        const port = env.PORT;
        const pathToUploads = path.resolve('./uploads/');

        // Caddy sits in front as a single reverse proxy; X-Forwarded-For is trusted.
        // Required so req.ip, express-rate-limit and audit_log.ip_address reflect the
        // real client IP instead of Caddy's Docker-bridge address.
        app.set('trust proxy', 1);

        // Security headers
        app.use(helmet());

        // CORS — restrict to known origins
        const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());

        app.use(cors({
            origin: (origin, callback) => {
                // Allow requests with no origin (mobile apps, curl, etc.)
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
        }));

        // Cookie parser (must be before routes)
        app.use(cookieParser());

        // Body parser with size limit
        app.use(express.json({limit: '1mb'}));

        // Global rate limiter
        app.use(rateLimit({
            windowMs: 15 * 60 * 1000, // 15 min
            max: 500,
            standardHeaders: true,
            legacyHeaders: false,
            message: {msg: 'Too many requests, please try again later'},
        }));

        // Strict rate limiter for auth endpoints
        const authLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 min
            max: 15,
            standardHeaders: true,
            legacyHeaders: false,
            message: {msg: 'Too many login attempts, please try again later'},
        });
        app.use('/api/auth/login', authLimiter);

        // Rate limiter for public feedback endpoints
        const feedbackLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 10,
            standardHeaders: true,
            legacyHeaders: false,
            message: {msg: 'Too many requests, please try again later'},
        });
        app.use('/api/feedback', feedbackLimiter);

        // Protected static files — require auth AND the specific module permission.
        // Must be registered BEFORE the public /static mount so more-specific paths win.
        // express.static runs only if auth + requirePermission both pass.
        app.use(
            '/static/client-documents',
            auth,
            requirePermission('clients', 'view'),
            express.static(path.join(pathToUploads, 'client-documents'))
        );
        app.use(
            '/static/documents',
            auth,
            requirePermission('rentals', 'view'),
            express.static(path.join(pathToUploads, 'documents'))
        );

        // Static files: public uploads (car photos) — no auth
        const publicUploadsPath = path.join(pathToUploads);
        app.use('/static', express.static(publicUploadsPath));

        // CSRF protection (must be after cookieParser)
        app.use('/api', csrfProtection);

        // Request ID for tracing — propagated to all logs via AsyncLocalStorage
        app.use((req, res, next) => {
            const requestId = crypto.randomUUID();
            res.setHeader('X-Request-Id', requestId);
            res.locals.requestId = requestId;
            requestContext.run({requestId}, next);
        });

        // API routes
        app.use('/api', router);

        // Global error handler (must be after routes)
        app.use(globalErrorHandler);

        const server = app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });

        // Start B2B outreach pipeline (no-op when env vars missing).
        // Disabled in test env to avoid intermittent network calls during tests.
        if (env.NODE_ENV !== 'test') {
            try {
                leadCronService.start();
            } catch (err: any) {
                logger.error(`[lead-cron] failed to start: ${err.message}`);
            }
        }

        // ── Graceful shutdown ──
        const shutdown = (signal: string) => {
            logger.info(`${signal} received — shutting down gracefully`);

            server.close(async () => {
                logger.info('HTTP server closed');
                await prisma.$disconnect();
                logger.info('Database disconnected');
                process.exit(0);
            });

            setTimeout(() => {
                logger.error('Forced shutdown — timeout exceeded');
                process.exit(1);
            }, SHUTDOWN_TIMEOUT);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        logger.fatal(error);
        process.exit(1);
    }
};

startServer();
