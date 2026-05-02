import {defineConfig} from 'vitest/config';

// Integration suite — spins up real Postgres containers via testcontainers.
// Kept separate from the default unit suite (vitest.config.ts) so:
//   * `npm test` stays fast (no Docker dependency)
//   * the integration suite can have a generous timeout for container boot
//   * CI runs them as a parallel job that can fail without blocking unit
//     iteration on a contributor's machine
//
// Run with:  npm run test:integration

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/integration/**/*.int.test.ts'],
        // testcontainers + prisma migrate deploy on a fresh DB takes ~10–30s.
        // Default 5s timeout is way too tight; set 4 min per test.
        testTimeout: 240_000,
        hookTimeout: 240_000,
        // Each suite spins its own container — run sequentially so the
        // CI runner doesn't try to start 3 Postgres containers at once
        // and OOM. (~30s × 3 ≈ 90s total, acceptable.)
        fileParallelism: false,
        // No globals — explicit imports keep failures easy to trace.
        globals: false,
    },
});
