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
    engineType?: Record<string, string>;
    transmission?: Record<string, string>;
    fuelConsumption?: string;
    driveType?: Record<string, string>;
    seats?: number;
    discount?: number;
    configuration?: Record<string, string>[];
    alt?: string;
    isNew?: boolean;
    deliveryPrice?: number | null;
    freeDeliveryThreshold?: number | null;
    cancellationHours?: number | null;
    paymentMethods?: string | null;
    minRentalDays?: number | null;
    dailyMileageLimit?: number | null;
    overmileagePrice?: number | null;
    driverAge?: number | null;
    driverExperience?: number | null;
    fuelPolicy?: string | null;
    weeklyMileageLimit?: number | null;
    monthlyMileageLimit?: number | null;
    unlimitedMileage?: boolean;
    maxRentalDays?: number | null;
    allowCrossBorder?: boolean;
    crossBorderFee?: number | null;
    crossBorderDailyFee?: number | null;
    allowedCountries?: string[] | null;
    lateReturnGraceMin?: number | null;
    lateReturnFeePerHour?: number | null;
    youngerDriverAge?: number | null;
    youngerDriverSurcharge?: number | null;
    petAllowed?: boolean;
    cleaningFee?: number | null;
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
    priceFixed?: number | null;
    priceFixed30?: number | null;
    depositFixed?: number | null;
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

type InvestRequestDto = {
    car: string;
    model: string;
    transmission?: string;
    mileage?: string;
    year?: string;
    color?: string;
    complect?: string;
    name: string;
    phone: string;
    email: string;
};

/**
 * Shape of the `priceSnapshot` JSON blob stored in Reservation / Rental.
 * All fields optional because the snapshot can come from different sources
 * (website booking, manual creation, rental-request approval).
 */
type PriceSnapshot = {
    dailyRateMinor?: number;
    dailyRate?: number;
    currency?: string;
    depositAmount?: number;
    baseRentalCost?: number;
    insuranceCost?: number;
    extrasCost?: number;
    totalCost?: number;
    totalDays?: number;
    ratePlanName?: string;
    approvedAt?: string;
    pickupDate?: string;
    returnDate?: string;
    [key: string]: unknown; // allow additional fields from website snapshot
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
    InvestRequestDto,
    PriceSnapshot,
};
