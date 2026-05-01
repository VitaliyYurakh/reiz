import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['app/**/*.test.ts'],
        exclude: ['node_modules', 'build', 'prisma'],
        globals: false,
        // Tests don't need a real DB connection — every service is run with
        // a mocked Prisma client. Keep DATABASE_URL set so any inadvertent
        // import of `prisma` from `app/utils/db.utils` doesn't crash on
        // env validation; it's never connected to.
        env: {
            NODE_ENV: 'test',
            DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
            SECRET: 'test-secret-test-secret-test-secret-12345',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['app/services/**/*.ts'],
            exclude: ['app/**/*.test.ts', 'app/types/**'],
        },
    },
});
