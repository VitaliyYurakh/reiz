import {Car, CarCountingRule, RentalTariff, User} from '@prisma/client';
import {CarNotFoundError, prisma} from '../utils';
import {CreateCarDto, UpdateCarDto, CarPhotoDto, CountingRuleDto, TariffDto} from '../types';

class CarService {
    async getAll() {
        return await prisma.car.findMany({
            include: {carPhoto: true, carCountingRule: true, rentalTariff: true, segment: true},
        });
    }

    async getOne(id: number) {
        return await prisma.car.findUnique({
            where: {id},
            include: {carPhoto: true, carCountingRule: true, rentalTariff: true, segment: true},
        });
    }

    async createOne(car: CreateCarDto) {
        const {segmentIds, ...rest} = car;

        const newCar = await prisma.car.create({
            data: {
                ...rest,
                segment: {
                    connect: segmentIds ? segmentIds.map((sid) => ({id: sid})) : [{id: 1}],
                },
            },
        });

        this.updateRentalTariff(newCar.id, [
            {dailyPrice: 0, deposit: 0, minDays: 1, maxDays: 2},
            {dailyPrice: 0, deposit: 0, minDays: 3, maxDays: 7},
            {dailyPrice: 0, deposit: 0, minDays: 8, maxDays: 29},
            {dailyPrice: 0, deposit: 0, minDays: 30, maxDays: 0},
        ]);
        return newCar;
    }

    async updateOne(id: number, carDto: UpdateCarDto) {
        const car = await prisma.car.findUnique({where: {id}});

        if (!car) {
            throw new CarNotFoundError();
        }

        const {segmentIds, ...rest} = carDto;

        return await prisma.car.update({
            where: {id},
            data: {
                ...rest,
                ...(segmentIds
                    ? {
                          segment: {
                              set: segmentIds.map((sid) => ({id: sid})),
                          },
                      }
                    : {}),
            },
        });
    }

    async updateRentalTariff(carId: number, tariffs: TariffDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        for await (const tariff of tariffs) {
            const oldTariff = await prisma.rentalTariff.findFirst({
                where: {minDays: tariff.minDays, maxDays: tariff.maxDays, carId},
            });

            if (!oldTariff) {
                await prisma.rentalTariff.create({
                    data: {
                        ...tariff,
                        carId: car.id,
                    },
                });
                continue;
            }

            await prisma.rentalTariff.update({
                where: {id: oldTariff.id},
                data: tariff,
            });
        }
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

    async updateCountingRule(carId: number, countingRuleDto: CountingRuleDto) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await prisma.carCountingRule.create({
            data: {
                ...countingRuleDto,
                carId: car.id,
            },
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
}

export default new CarService();
