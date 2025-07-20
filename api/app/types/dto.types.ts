import {Express} from 'express';

type CreateCarDto = {
    brand: string;
    model: string;
    plateNumber: string;
    VIN: string;
    yearOfManufacture: number;
    color: string;
    segmentId: number;
};

type UpdateCarDto = {
    brand?: string;
    model?: string;
    plateNumber?: string;
    VIN?: string;
    yearOfManufacture?: number;
    color?: string;
    segmentId?: number;
    description?: string;
    engineVolume?: string;
    engineType?: string;
    transmission?: string;
    fuelConsumption?: string;
    driveType?: string;
    seats?: number;
    discount?: number;
    configuration?: string;
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
};

export {CreateCarDto, UpdateCarDto, TariffDto, CountingRuleDto, CarPhotoDto};
