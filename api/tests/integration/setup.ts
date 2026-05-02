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

    // `prisma db push` projects the CURRENT schema.prisma straight to the
    // fresh DB, skipping the historical migration sequence. Why not
    // `migrate deploy` (what prod uses): some early migrations were
    // written assuming sibling tables already existed (e.g.
    // `20260501120000_promote_status_columns_to_enums` ALTERs `lead`,
    // which was created in a *later* migration). On prod that worked
    // because the table existed by the time the enum-promote ran;
    // re-applying from a clean slate fails with `relation "lead" does
    // not exist`. Rebaselining the history is a separate piece of work;
    // for the integration suite, `db push` lets us test the schema we
    // actually run today, which is the contract we care about.
    const apiRoot = join(__dirname, '..', '..');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
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
