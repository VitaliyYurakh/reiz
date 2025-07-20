import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: {email: 'admin@example.com'},
        update: {},
        create: {
            email: 'admin@example.com',
            pass: '7245a8a5730d2f8b5c254dafa3b5aa4c8f0dede5a435e7c5c3567195edd5c4415668f2fb81e5666dfe820e0c783118cac95cd98501ab97eab77381e47b67b6b2',
            role: 'admin',
        },
    });

    await prisma.segment.createMany({
        data: [
            {
                name: 'Economy',
                description: 'Affordable and fuel-efficient vehicles',
                overmileagePrice: 0.2,
            },
            {
                name: 'Business',
                description: 'Comfortable cars for business travel',
                overmileagePrice: 0.35,
            },
            {
                name: 'Luxury',
                description: 'Premium vehicles for VIP experience',
                overmileagePrice: 0.4,
            },
            {
                name: 'SUV',
                description: 'SUV',
                overmileagePrice: 0.45,
            },
            {
                name: 'VAN',
                description: 'VAN',
                overmileagePrice: 0.5,
            },
        ],
        skipDuplicates: true,
    });

    console.log('Seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
