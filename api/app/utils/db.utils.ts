import {PrismaClient} from '@prisma/client';

const basePrisma = new PrismaClient();

/**
 * Prisma 6 $extends: auto-fix duplicate country code in Client.phone
 * e.g. "972+972532414153" → "+972532414153"
 */
const prisma = basePrisma.$extends({
    result: {
        client: {
            phone: {
                needs: {phone: true},
                compute(client) {
                    if (!client.phone) return client.phone;
                    const plusIdx = client.phone.indexOf('+');
                    if (plusIdx > 0) return client.phone.slice(plusIdx);
                    return client.phone;
                },
            },
        },
    },
});

export default prisma;
