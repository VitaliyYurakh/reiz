// All fields optional to match `createCarSchema` (Zod) — validator pre-2026-05
// allowed bare {} bodies so admins could draft a car row and fill it in
// later. Keep the runtime-validated shape and the TS DTO in sync; otherwise
// `validate()` returns a wider type than the DTO accepts.
type CreateCarDto = {
    brand?: string;
    model?: string;
    plateNumber?: string;
    VIN?: string;
    yearOfManufacture?: number;
    color?: string;
    segmentIds?: number[];
    partnerId?: number | null;
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
    // Either plain string (legacy) or i18n map (`{uk:'...', ru:'...', en:'...'}`).
    description?: string | Record<string, string>;
    engineVolume?: string;
    engineType?: Record<string, string>;
    transmission?: Record<string, string>;
    fuelConsumption?: string;
    driveType?: Record<string, string>;
    seats?: number | null;
    discount?: number | null;
    configuration?: Record<string, string>[];
    alt?: string;
    isNew?: boolean;
    deliveryPrice?: number | null;
    freeDeliveryThreshold?: number | null;
    cancellationHours?: number | null;
    paymentMethods?: string | null;
    minRentalDays?: number | null;
    dailyMileageLimit?: number | null;
    overmileagePriceMinor?: number | null;
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
    lateReturnFeePerHourMinor?: number | null;
    youngerDriverAge?: number | null;
    youngerDriverSurchargeMinor?: number | null;
    petAllowed?: boolean;
    cleaningFee?: number | null;
    unlimitedMileagePrice1DayMinor?: number | null;
    unlimitedMileagePrice2to7Minor?: number | null;
    unlimitedMileageFreeFromDays?: number | null;
    intercityDeliveryPriceMinor?: number | null;
    carWashPriceMinor?: number | null;
    emptyTankFeeMinor?: number | null;
    additionalDriverFeeMinor?: number | null;
    equipmentRentalPriceMinor?: number | null;
    afterHoursServiceFeeMinor?: number | null;
    workingHoursStart?: string | null;
    workingHoursEnd?: string | null;
    // Damage-fee schedule moved to its own 1:1 model `CarDamageFees`.
    // PATCH /car/:id accepts a nested `damageFees` object; the service
    // upserts into the related table.
    damageFees?: CarDamageFeesDto | null;
    // Maintenance state likewise lives in `CarMaintenance`.
    maintenance?: CarMaintenanceDto | null;
    // Owner of the car when fleet is operated under commission with another
    // business. `null` = REIZ-owned. Was missing before 2026-04-29 — Zod
    // silently stripped the key so PATCH /car/:id appeared to succeed but
    // never persisted the partner assignment.
    partnerId?: number | null;
};

type CarDamageFeesDto = {
    damageTiresFeeMinor?: number | null;
    damageGlassChipFeeMinor?: number | null;
    damageLostKeysFeeMinor?: number | null;
    damageBrokenGlassFeeMinor?: number | null;
    damageScratchesFeeMinor?: number | null;
    damageSmokingFeeMinor?: number | null;
    damageTotalLossPercent?: number | null;
    depositMultiplier?: number | null;
};

type CarMaintenanceDto = {
    currentOdometer?: number | null;
    serviceIntervalKm?: number | null;
    nextServiceMileageKm?: number | null;
    lastServiceMileageKm?: number | null;
    lastServiceAt?: string | Date | null;
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
    clientId?: number;
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
    CarDamageFeesDto,
    CarMaintenanceDto,
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
