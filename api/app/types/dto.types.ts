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

type BookingRequestDto = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    pickupLocation: string;
    returnLocation: string;
    startDate: Date;
    endDate: Date;
    flightNumber?: string;
    comment?: string;
    carId?: number;
    carDetails?: any;
    selectedPlan?: any;
    selectedExtras?: any;
    totalDays?: number;
    priceBreakdown?: {
        baseRentalCost: number;
        insuranceCost: number;
        extrasCost: number;
        totalCost: number;
        depositAmount: number;
    };
};

type ContactRequestDto = {
    name: string;
    email: string;
    phone: string;
    message?: string;
};

type CallbackRequestDto = {
    name: string;
    phone: string;
    contactMethod?: string;
};

type BusinessRequestDto = {
    name: string;
    phone: string;
    email: string;
    message?: string;
};

export {
    CreateCarDto,
    UpdateCarDto,
    TariffDto,
    CountingRuleDto,
    CarPhotoDto,
    Language,
    BookingRequestDto,
    ContactRequestDto,
    CallbackRequestDto,
    BusinessRequestDto,
};
