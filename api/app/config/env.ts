import {config} from 'dotenv';

// Load .env for local dev (when running `npm run dev` outside Docker).
// In Docker / production, env vars come from the orchestrator (docker-compose
// `env_file:` or `environment:` block). Default `override: false` ensures
// injected vars win over any stale .env that might exist in the working dir
// — important after we moved to .dockerignore-ing .env (image no longer
// carries credentials).
config();

import {z} from 'zod';

const envSchema = z.object({
    // ── Required ──
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    SECRET: z.string().min(32, 'SECRET must be at least 32 characters'),

    // ── Optional with defaults ──
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3002'),
    PRETTY_LOGGING: z.string().optional(),

    // ── Legacy (optional) ──
    SALT: z.string().default(''),

    // ── Telegram (optional pair) ──
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),

    // ── B2B Outreach (all optional — degrades to no-op when missing) ──
    GOOGLE_PLACES_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GMAIL_USER: z.string().optional(),                    // sender address e.g. partnerships@reiz.com.ua
    GMAIL_APP_PASSWORD: z.string().optional(),            // 16-char app password from Google account
    OUTREACH_DAILY_CAP: z.coerce.number().int().min(0).max(500).default(30),
    OUTREACH_PUBLIC_URL: z.string().optional(),           // e.g. https://reiz.com.ua — used in unsubscribe links
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:');
    for (const issue of parsed.error.issues) {
        console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
}

export const env = parsed.data;
