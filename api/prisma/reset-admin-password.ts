/**
 * One-time script to reset the admin password.
 * Usage: npx tsx prisma/reset-admin-password.ts
 *
 * Set NEW_PASSWORD env var to override default, e.g.:
 *   NEW_PASSWORD=mysecret npx tsx prisma/reset-admin-password.ts
 */

import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'admin@example.com';
const NEW_PASSWORD = process.env.NEW_PASSWORD || 'admin123';

async function main() {
    const hash = await bcrypt.hash(NEW_PASSWORD, 12);

    const user = await prisma.user.upsert({
        where: {email: ADMIN_EMAIL},
        update: {pass: hash},
        create: {email: ADMIN_EMAIL, pass: hash, role: 'admin'},
    });

    console.log(`✅ Password reset for ${user.email}`);
    console.log(`   New password: ${NEW_PASSWORD}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
