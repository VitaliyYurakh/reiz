import {config} from 'dotenv';
config({override: true});

import {z} from 'zod';

const envSchema = z.object({
    // ── Required ──
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    SECRET: z.string().min(1, 'SECRET is required'),

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
