import {config} from 'dotenv';
config({ override: true }); // Override existing env vars with values from .env

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import {logger} from './utils';
import {router} from './routers';
import {auth, csrfProtection} from './middleware';
import path from 'node:path';

// ── Validate required env vars at startup ──
const REQUIRED_ENV = ['DATABASE_URL', 'SECRET'] as const;
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`FATAL: Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        const app = express();
        const port = process.env.PORT || 3000;
        const pathToUploads = path.resolve('./uploads/');

        // Security headers
        app.use(helmet());

        // CORS — restrict to known origins
        const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3002')
            .split(',')
            .map((o) => o.trim());

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

        // Static files: public uploads (car photos) — no auth
        const publicUploadsPath = path.join(pathToUploads);
        app.use('/static', express.static(publicUploadsPath));

        // Protected static files: client documents — require auth
        app.use('/static/client-documents', auth, express.static(path.join(pathToUploads, 'client-documents')));
        app.use('/static/documents', auth, express.static(path.join(pathToUploads, 'documents')));

        // CSRF protection (must be after cookieParser)
        app.use('/api', csrfProtection);

        // Request ID for tracing
        app.use((req, res, next) => {
            const requestId = crypto.randomUUID();
            res.setHeader('X-Request-Id', requestId);
            res.locals.requestId = requestId;
            next();
        });

        // API routes
        app.use('/api', router);

        app.listen(port, async () => {
            logger.info(`Server listening on port ${port}`);
        });
    } catch (error) {
        logger.fatal(error);
        process.exit(1);
    }
};

startServer();
