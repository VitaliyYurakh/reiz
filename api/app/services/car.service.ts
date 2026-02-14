import {Car, CarCountingRule, RentalTariff, User} from '@prisma/client';
import {CarNotFoundError, prisma} from '../utils';
import {CreateCarDto, UpdateCarDto, CarPhotoDto, CountingRuleDto, TariffDto} from '../types';
import {Language} from '../types/dto.types';

class CarService {
    async getAll() {
        return await prisma.car.findMany({
            include: {
                carPhoto: true,
                carCountingRule: {orderBy: {depositPercent: 'asc'}},
                rentalTariff: true,
                segment: true,
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
            },
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

        this.updateCountingRule(newCar.id, [
            {
                "pricePercent": 0,
                "depositPercent": 0,
            },
            {
                "pricePercent": 12,
                "depositPercent": 50,
            },
            {
                "pricePercent": 36,
                "depositPercent": 100,
            }
        ])

        return newCar;
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

    async updateCountingRule(carId: number, countingRulesDto: CountingRuleDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await Promise.all(countingRulesDto.map(async (countingRuleDto) => {
            await prisma.carCountingRule.create({
                data: {
                    ...countingRuleDto,
                    carId: car.id,
                },
            });
        }))
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
            where: {configuration: {not: null}},
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

    async migratePolish() {
        const ENGINE_PL: Record<string, string> = {
            'Petrol': 'Benzyna', 'Diesel': 'Diesel', 'Electric': 'Elektryczny', 'Hybrid': 'Hybryda',
            'Бензин': 'Benzyna', 'Дизель': 'Diesel', 'Електро': 'Elektryczny', 'Гібрид': 'Hybryda',
        };
        const TRANS_PL: Record<string, string> = {
            'Automatic': 'Automatyczna', 'Manual': 'Manualna', 'Robot': 'Zrobotyzowana', 'CVT': 'CVT',
            'Автомат': 'Automatyczna', 'Механіка': 'Manualna', 'Робот': 'Zrobotyzowana', 'Варіатор': 'CVT',
        };
        const DRIVE_PL: Record<string, string> = {
            'AWD': '4x4', 'Front': 'Przedni', 'Rear': 'Tylny',
            'Повний': '4x4', 'Передній': 'Przedni', 'Задній': 'Tylny',
        };
        const CONFIG_PL: Record<string, string> = {
            'Кондиціонер': 'Klimatyzacja', 'Клімат-контроль': 'Klimatyzacja automatyczna',
            'Підігрів сидінь': 'Podgrzewane fotele', 'Підігрів керма': 'Podgrzewana kierownica',
            'Шкіряний салон': 'Skórzana tapicerka', 'Люк': 'Szyberdach',
            'Панорамний дах': 'Dach panoramiczny', 'Тонування': 'Przyciemniane szyby',
            'Електросклопідйомники': 'Elektryczne szyby', 'Електрозеркала': 'Elektryczne lusterka',
            'Мультикермо': 'Wielofunkcyjna kierownica',
            'ABS': 'ABS', 'ESP': 'ESP',
            'Подушки безпеки': 'Poduszki powietrzne', 'Центральний замок': 'Centralny zamek',
            'Сигналізація': 'Alarm', 'Датчик дощу': 'Czujnik deszczu', 'Датчик світла': 'Czujnik zmierzchu',
            'Мультимедіа': 'System multimedialny', 'Мультимедійна система': 'System multimedialny',
            'Навігація': 'Nawigacja', 'Bluetooth': 'Bluetooth', 'USB': 'USB',
            'Apple CarPlay': 'Apple CarPlay', 'Android Auto': 'Android Auto',
            'Камера заднього виду': 'Kamera cofania', 'Камера 360°': 'Kamera 360°',
            'Парктронік': 'Czujniki parkowania', 'Бездротова зарядка': 'Ładowanie bezprzewodowe',
            'Круїз-контроль': 'Tempomat', 'Адаптивний круїз-контроль': 'Tempomat adaptacyjny',
            'Безключовий доступ': 'Bezkluczykowy dostęp', 'Кнопка запуску двигуна': 'Przycisk Start/Stop',
            'LED фари': 'Reflektory LED', 'Ксенон': 'Ksenon',
            'Туманки': 'Światła przeciwmgłowe', 'Протитуманні фари': 'Światła przeciwmgłowe',
            'Денні ходові вогні': 'Światła do jazdy dziennej',
            'Рейлінги': 'Relingi dachowe', 'Легкосплавні диски': 'Alufelgi',
            'Двозонний клімат-контроль': 'Dwustrefowa klimatyzacja',
            'Вентиляція сидінь': 'Wentylowane fotele',
            'Електрорегулювання сидінь': 'Elektryczna regulacja foteli',
            'Система контролю тиску в шинах': 'Czujniki ciśnienia w oponach',
            'Head-Up дисплей': 'Wyświetlacz Head-Up',
            'Система моніторингу мертвих зон': 'System monitorowania martwego pola',
            'Асистент паркування': 'Asystent parkowania',
        };

        const addPl = (obj: any, dict: Record<string, string>) => {
            if (!obj || typeof obj !== 'object' || obj.pl) return obj;
            return {...obj, pl: dict[obj.en] || dict[obj.uk] || obj.en || ''};
        };

        const cars = await prisma.car.findMany();
        let updated = 0;

        for (const car of cars) {
            const data: Record<string, any> = {};
            let changed = false;

            if (car.engineType && typeof car.engineType === 'object' && !(car.engineType as any).pl) {
                data.engineType = addPl(car.engineType, ENGINE_PL);
                changed = true;
            }
            if (car.transmission && typeof car.transmission === 'object' && !(car.transmission as any).pl) {
                data.transmission = addPl(car.transmission, TRANS_PL);
                changed = true;
            }
            if (car.driveType && typeof car.driveType === 'object' && !(car.driveType as any).pl) {
                data.driveType = addPl(car.driveType, DRIVE_PL);
                changed = true;
            }
            if (car.description && typeof car.description === 'object' && !(car.description as any).pl) {
                const desc = car.description as any;
                data.description = {...desc, pl: desc.en || desc.uk || ''};
                changed = true;
            }
            if (car.configuration && Array.isArray(car.configuration)) {
                const cfg = car.configuration as any[];
                if (cfg.some((i) => i && typeof i === 'object' && !i.pl)) {
                    data.configuration = cfg.map((item) => {
                        if (!item || typeof item !== 'object' || item.pl) return item;
                        return {...item, pl: CONFIG_PL[item.uk?.trim()] || CONFIG_PL[item.en?.trim()] || item.en || ''};
                    });
                    changed = true;
                }
            }

            if (changed) {
                await prisma.car.update({where: {id: car.id}, data});
                updated++;
            }
        }

        return {updated, total: cars.length};
    }
}

export default new CarService();
