import {Car, CarCountingRule, Prisma, RentalTariff, User} from '@prisma/client';
import {CarNotFoundError, prisma} from '../utils';
import {CreateCarDto, UpdateCarDto, CarPhotoDto, CountingRuleDto, TariffDto} from '../types';
import {Language} from '../types/dto.types';

class CarService {
    async getAll(citySlug?: string) {
        const where: any = {};

        if (citySlug) {
            where.cityAvailability = {
                some: {
                    isActive: true,
                    city: {slug: citySlug, isActive: true},
                },
            };
        }

        return await prisma.car.findMany({
            where,
            include: {
                carPhoto: true,
                carCountingRule: {orderBy: {depositPercent: 'asc'}},
                rentalTariff: true,
                segment: true,
                cityAvailability: {
                    where: {isActive: true},
                    include: {
                        city: {select: {id: true, slug: true, nameUk: true, nameRu: true, nameEn: true, nameLocativeUk: true, nameLocativeRu: true, nameLocativeEn: true}},
                    },
                },
            },
        });
    }

    async getOne(id: number) {
        return await prisma.car.findUnique({
            where: {id},
            include: {
                carPhoto: true,
                carCountingRule: {orderBy: {depositPercent: 'asc'}},
                rentalTariff: true,
                segment: true,
                cityAvailability: {
                    include: {
                        city: {select: {id: true, slug: true, nameUk: true, nameRu: true, nameEn: true, nameLocativeUk: true, nameLocativeRu: true, nameLocativeEn: true}},
                    },
                },
            },
        });
    }

    async getCityAvailability(carId: number) {
        return prisma.carCityAvailability.findMany({
            where: {carId},
            include: {
                city: {select: {id: true, slug: true, nameUk: true, nameRu: true, nameEn: true, isActive: true}},
            },
        });
    }

    async updateCityAvailability(carId: number, availability: {cityId: number; deliveryFee: number; minRentalDays: number; isActive: boolean}[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});
        if (!car) throw new CarNotFoundError();

        await prisma.$transaction(
            availability.map((item) =>
                prisma.carCityAvailability.upsert({
                    where: {carId_cityId: {carId, cityId: item.cityId}},
                    create: {carId, cityId: item.cityId, deliveryFee: item.deliveryFee, minRentalDays: item.minRentalDays, isActive: item.isActive},
                    update: {deliveryFee: item.deliveryFee, minRentalDays: item.minRentalDays, isActive: item.isActive},
                })
            )
        );
    }

    async createOne(car: CreateCarDto) {
        const {segmentIds, ...rest} = car;

        // Atomic create: Car + default RentalTariff rows + default CarCountingRule rows.
        // Before the transaction, updateRentalTariff/updateCountingRule were called
        // without await and without transaction — a failure on either left the Car
        // in the DB without pricing data (audit H-3).
        return await prisma.$transaction(async (tx) => {
            const newCar = await tx.car.create({
                data: {
                    ...rest,
                    ...(segmentIds && segmentIds.length > 0 && {
                        segment: {connect: segmentIds.map((sid) => ({id: sid}))},
                    }),
                },
            });

            await tx.rentalTariff.createMany({
                data: [
                    {dailyPrice: 0, deposit: 0, minDays: 1, maxDays: 2, carId: newCar.id},
                    {dailyPrice: 0, deposit: 0, minDays: 3, maxDays: 7, carId: newCar.id},
                    {dailyPrice: 0, deposit: 0, minDays: 8, maxDays: 29, carId: newCar.id},
                    {dailyPrice: 0, deposit: 0, minDays: 30, maxDays: 0, carId: newCar.id},
                ],
            });

            await tx.carCountingRule.createMany({
                data: [
                    {pricePercent: 0, depositPercent: 0, carId: newCar.id},
                    {pricePercent: 12, depositPercent: 50, carId: newCar.id},
                    {pricePercent: 36, depositPercent: 100, carId: newCar.id},
                ],
            });

            return newCar;
        });
    }

    async updateOne(id: number, carDto: UpdateCarDto) {
        const car = await prisma.car.findUnique({where: {id}});

        if (!car) {
            throw new CarNotFoundError();
        }

        const {segmentIds, description, ...rest} = carDto;
        const data: UpdateCarDto & {
            segment?: Record<string, unknown[]>;
        } = {...rest};

        if (segmentIds) data.segment = {set: segmentIds.map((sid) => ({id: sid}))};
        if (description) data.description = description;

        return await prisma.car.update({
            where: {id},
            data,
        });
    }

    async updateRentalTariff(carId: number, tariffs: TariffDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        // Atomic upsert of all tariffs using the @@unique([minDays, maxDays, carId])
        // compound key. Before the transaction, the loop could partially succeed —
        // a mid-iteration failure left the car with a mix of old and new prices
        // (audit H-5).
        await prisma.$transaction(
            tariffs.map((tariff) =>
                prisma.rentalTariff.upsert({
                    where: {
                        minDays_maxDays_carId: {
                            minDays: tariff.minDays,
                            maxDays: tariff.maxDays,
                            carId,
                        },
                    },
                    create: {...tariff, carId},
                    update: tariff,
                })
            )
        );
    }

    async addCarPreviewPhoto(carId: number, url: string) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await prisma.car.update({
            where: {
                id: carId,
            },
            data: {
                previewUrl: url,
            },
        });

        return url;
    }

    async addCarPhoto(carId: number, carPhoto: CarPhotoDto) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await prisma.carPhoto.create({
            data: {
                ...carPhoto,
                carId: car.id,
            },
        });

        return carPhoto.url;
    }

    async updateCountingRule(carId: number, countingRulesDto: CountingRuleDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        // Atomic replace: deleteMany + createMany in a single transaction.
        // Before this, a failure between deleteMany and the parallel creates
        // left the car with zero counting rules (audit H-4).
        // CarCountingRule has no business-level unique key, so full-replace is
        // the only correct semantics here — but it MUST be atomic.
        await prisma.$transaction(async (tx) => {
            await tx.carCountingRule.deleteMany({where: {carId}});
            if (countingRulesDto.length > 0) {
                await tx.carCountingRule.createMany({
                    data: countingRulesDto.map((rule) => ({...rule, carId: car.id})),
                });
            }
        });
    }

    async updatePhotoCar(carPhotoId: number, alt: string) {
        await prisma.carPhoto.update({
            where: {id: carPhotoId},
            data: {
                alt,
            },
        });
    }

    async deleteCarPhoto(id: number) {
        await prisma.carPhoto.delete({where: {id}});
    }

    async deleteOne(id: number) {
        await prisma.car.delete({where: {id}});
    }

    async getConfigurationOptions() {
        const cars = await prisma.car.findMany({
            where: {configuration: {not: Prisma.DbNull}},
            select: {configuration: true},
        });

        const seen = new Map<string, {uk: string; ru: string; en: string; pl: string}>();

        for (const car of cars) {
            const config = car.configuration as any[];
            if (!Array.isArray(config)) continue;

            for (const item of config) {
                if (!item || typeof item !== 'object') continue;
                const uk = (item.uk || '').trim();
                if (!uk) continue;
                if (!seen.has(uk)) {
                    seen.set(uk, {
                        uk,
                        ru: (item.ru || '').trim(),
                        en: (item.en || '').trim(),
                        pl: (item.pl || '').trim(),
                    });
                }
            }
        }

        return Array.from(seen.values()).sort((a, b) => a.uk.localeCompare(b.uk, 'uk'));
    }

}

export default new CarService();
