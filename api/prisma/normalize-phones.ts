/**
 * One-time script: normalize all stored phone numbers to "+DIGITS" format.
 * Usage: npx tsx prisma/normalize-phones.ts
 */

import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

function normalizePhone(phone: string): string {
    if (!phone) return phone;
    const plusIdx = phone.indexOf('+');
    let cleaned = phone;
    if (plusIdx > 0) {
        cleaned = phone.slice(plusIdx);
    }
    const digits = cleaned.replace(/\D/g, '');
    if (!digits) return phone;
    return `+${digits}`;
}

async function main() {
    const clients = await prisma.client.findMany({
        select: {id: true, phone: true},
    });

    let updated = 0;
    for (const c of clients) {
        if (!c.phone) continue;
        const normalized = normalizePhone(c.phone);
        if (normalized !== c.phone) {
            await prisma.client.update({
                where: {id: c.id},
                data: {phone: normalized},
            });
            console.log(`  #${c.id}: "${c.phone}" → "${normalized}"`);
            updated++;
        }
    }

    console.log(`\nDone. Updated ${updated} of ${clients.length} phone numbers.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
