export type CarPhotoType = "PC" | "MOBILE" | "TABLET" | "OTHER";

export interface CarPhoto {
  id: number;
  type: CarPhotoType | string;
  url: string;
  carId: number;
  alt: string | null;
}

export interface CarCountingRule {
  carId: number;
  depositPercent: number;
  id: number;
  pricePercent: number;
  priceFixedMinor: number | null;
  priceFixed30Minor: number | null;
  depositFixedMinor: number | null;
}

export interface RentalTariff {
  id: number;
  depositMinor: number;
  minDays: number;
  maxDays: number;
  dailyPriceMinor: number;
  carId: number;
}

export interface Segment {
  id: number;
  name: string;
  description: string | null;
  overmileagePriceMinor: number;
  driverAge: number;
  experience: number;
}

export interface LocalizedText {
  en: string;
  ru: string;
  uk: string;
  pl?: string;
  ro?: string;
}

/** Get localized value with fallback: locale → en → uk */
export function localized(obj: LocalizedText | null | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as unknown as Record<string, string>)[locale] || obj.en || obj.uk || '';
}

export interface CarCityAvailability {
  carId: number;
  cityId: number;
  deliveryFee: number;
  minRentalDays: number;
  isActive: boolean;
  city: {
    id: number;
    slug: string;
    nameUk: string;
    nameRu: string;
    nameEn: string;
    nameLocativeUk?: string;
    nameLocativeRu?: string;
    nameLocativeEn?: string;
  };
}

export interface Car {
  id: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  VIN: string | null;
  yearOfManufacture: number | null;
  color: string | null;
  // Prisma Json? column. Legacy rows contain a stringified JSON literal;
  // new writes store a LocalizedText object directly (audit M-9).
  description: string | LocalizedText | null;
  previewUrl: string | null;
  engineVolume: string | null;
  engineType: LocalizedText | null;
  transmission: LocalizedText | null;
  fuelConsumption: string | null;
  driveType: LocalizedText | null;
  seats: number | null;
  discount: number | null;
  configuration: LocalizedText[] | null;
  isNew: boolean;
  isAvailable: boolean;
  alt: string | null;
  deliveryPriceMinor: number | null;
  freeDeliveryThresholdMinor: number | null;
  cancellationHours: number | null;
  paymentMethods: string | null;
  minRentalDays: number | null;
  dailyMileageLimit: number | null;
  overmileagePriceMinor: number | null;
  driverAge: number | null;
  driverExperience: number | null;
  fuelPolicy: string | null;
  weeklyMileageLimit: number | null;
  monthlyMileageLimit: number | null;
  unlimitedMileage: boolean;
  maxRentalDays: number | null;
  allowCrossBorder: boolean;
  crossBorderFeeMinor: number | null;
  crossBorderDailyFeeMinor: number | null;
  allowedCountries: string[] | null;
  lateReturnGraceMin: number | null;
  lateReturnFeePerHourMinor: number | null;
  youngerDriverAge: number | null;
  youngerDriverSurchargeMinor: number | null;
  petAllowed: boolean;
  cleaningFeeMinor: number | null;
  unlimitedMileagePrice1DayMinor: number | null;
  unlimitedMileagePrice2to7Minor: number | null;
  unlimitedMileageFreeFromDays: number | null;
  intercityDeliveryPriceMinor: number | null;
  carWashPriceMinor: number | null;
  emptyTankFeeMinor: number | null;
  additionalDriverFeeMinor: number | null;
  equipmentRentalPriceMinor: number | null;
  afterHoursServiceFeeMinor: number | null;
  workingHoursStart: string | null;
  workingHoursEnd: string | null;
  // 1:1 child rows. `null` (or undefined) = car has no row in that table yet
  // (admin never filled it in / car too new). Front-end falls back to
  // platform defaults from the Terms page.
  damageFees: CarDamageFees | null;
  maintenance: CarMaintenance | null;
  carPhoto: CarPhoto[];
  carCountingRule: CarCountingRule[];
  rentalTariff: RentalTariff[];
  segment: Segment[];
  cityAvailability?: CarCityAvailability[];
}

export interface CarDamageFees {
  damageTiresFeeMinor: number | null;
  damageGlassChipFeeMinor: number | null;
  damageLostKeysFeeMinor: number | null;
  damageBrokenGlassFeeMinor: number | null;
  damageScratchesFeeMinor: number | null;
  damageSmokingFeeMinor: number | null;
  damageTotalLossPercent: number | null;
  depositMultiplier: number | null;
}

export interface CarMaintenance {
  currentOdometer: number | null;
  serviceIntervalKm: number | null;
  nextServiceMileageKm: number | null;
  lastServiceMileageKm: number | null;
  lastServiceAt: string | null;
}
