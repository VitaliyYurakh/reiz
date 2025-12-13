type CreateCarDto = {
    brand: string;
    model: string;
    plateNumber: string;
    VIN: string;
    yearOfManufacture: number;
    color: string;
    segmentIds: number[];
};

type Language = 'uk' | 'ru' | 'en';

type UpdateCarDto = {
    brand?: string;
    model?: string;
    plateNumber?: string;
    VIN?: string;
    yearOfManufacture?: number;
    color?: string;
    segmentIds?: number[];
    description?: string;
    engineVolume?: string;
    engineType?: string;
    transmission?: string;
    fuelConsumption?: string;
    driveType?: string;
    seats?: number;
    discount?: number;
    configuration?: string;
    alt?: string;
    isNew?: boolean;
};

type TariffDto = {
    deposit: number;
    minDays: number;
    maxDays: number;
    dailyPrice: number;
};

type CountingRuleDto = {
    pricePercent: number;
    depositPercent: number;
};

type CarPhotoDto = {
    type: 'MOBILE' | 'PC';
    url: string;
    alt: string;
};

export {CreateCarDto, UpdateCarDto, TariffDto, CountingRuleDto, CarPhotoDto, Language};
