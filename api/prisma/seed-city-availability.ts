import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCarCityAvailability() {
    const cities = await prisma.city.findMany({where: {isActive: true}});
    const cars = await prisma.car.findMany({select: {id: true}});

    if (!cities.length || !cars.length) {
        console.log('No active cities or cars found, skipping city availability seed');
        return;
    }

    let created = 0;
    for (const car of cars) {
        for (const city of cities) {
            const existing = await prisma.carCityAvailability.findUnique({
                where: {carId_cityId: {carId: car.id, cityId: city.id}},
            });
            if (!existing) {
                await prisma.carCityAvailability.create({
                    data: {
                        carId: car.id,
                        cityId: city.id,
                        deliveryFee: 0,
                        minRentalDays: 1,
                        isActive: true,
                    },
                });
                created++;
            }
        }
    }

    console.log(`Car city availability: ${created} records created (${cars.length} cars × ${cities.length} cities)`);
}

// Allow running standalone
if (require.main === module) {
    seedCarCityAvailability()
        .then(() => prisma.$disconnect())
        .catch((e) => {
            console.error(e);
            prisma.$disconnect();
            process.exit(1);
        });
}
