// Integration-test fixture: spins up a throwaway Postgres container,
// applies the full Prisma migration history, and hands callers a Prisma
// client pointed at the fresh DB. Each suite gets its own instance so
// tests can't mutate each other's state.
//
// Why integration over unit-with-mocks: we already learned the hard way
// that mocks don't catch SQL drift (the `IN`/`in` direction case-bug
// from earlier this year, the JSON-string-of-JSON description blob from
// today). One real-DB sanity test would have caught both before they
// reached prod. Keeping the suite small + focused on hot paths so the
// per-test setup overhead (~2-4s spinning Postgres) doesn't drown the
// signal.

import {GenericContainer, StartedTestContainer, Wait} from 'testcontainers';
import {PrismaClient} from '@prisma/client';
import {execSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';

export interface IntegrationFixture {
    prisma: PrismaClient;
    teardown: () => Promise<void>;
    databaseUrl: string;
}

/**
 * Boot a Postgres 16 container, run `prisma migrate deploy` against it,
 * return a connected client. Caller is expected to invoke `teardown()`
 * in its `afterAll` to free the container.
 *
 * The default 4-minute container start timeout in testcontainers is
 * usually overkill, but Postgres on a busy CI runner sometimes takes
 * 30-40s to flip to "ready", so we don't shorten it.
 */
export async function bootIntegrationDb(): Promise<IntegrationFixture> {
    const dbName = `reiz_int_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const password = 'integration-test-password';

    const container = await new GenericContainer('postgres:16-alpine')
        .withEnvironment({
            POSTGRES_USER: 'postgres',
            POSTGRES_PASSWORD: password,
            POSTGRES_DB: dbName,
        })
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/, 2))
        .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);
    const databaseUrl = `postgresql://postgres:${password}@${host}:${port}/${dbName}?schema=public`;

    // `migrate deploy` is the same command prod uses on container start —
    // running it here proves migrations apply cleanly on a brand-new DB
    // (no manual fix-ups needed). Streaming the output to /dev/null keeps
    // the test reporter clean; if the migrate call fails, exec throws
    // and the suite fails loudly.
    const apiRoot = join(__dirname, '..', '..');
    execSync('npx prisma migrate deploy', {
        cwd: apiRoot,
        env: {...process.env, DATABASE_URL: databaseUrl},
        stdio: 'pipe',
    });

    const prisma = new PrismaClient({datasources: {db: {url: databaseUrl}}});
    await prisma.$connect();

    return {
        prisma,
        databaseUrl,
        teardown: async () => {
            await prisma.$disconnect();
            await (container as StartedTestContainer).stop({timeout: 5_000});
        },
    };
}
