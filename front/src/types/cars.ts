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
  priceFixed: number | null;
  priceFixed30: number | null;
  depositFixed: number | null;
}

export interface RentalTariff {
  id: number;
  deposit: number;
  minDays: number;
  maxDays: number;
  dailyPrice: number;
  carId: number;
}

export interface Segment {
  id: number;
  name: string;
  description: string | null;
  overmileagePrice: number;
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
  description: string | null;
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
  deliveryPrice: number | null;
  freeDeliveryThreshold: number | null;
  cancellationHours: number | null;
  paymentMethods: string | null;
  minRentalDays: number | null;
  dailyMileageLimit: number | null;
  overmileagePrice: number | null;
  driverAge: number | null;
  driverExperience: number | null;
  fuelPolicy: string | null;
  weeklyMileageLimit: number | null;
  monthlyMileageLimit: number | null;
  unlimitedMileage: boolean;
  maxRentalDays: number | null;
  allowCrossBorder: boolean;
  crossBorderFee: number | null;
  crossBorderDailyFee: number | null;
  allowedCountries: string[] | null;
  lateReturnGraceMin: number | null;
  lateReturnFeePerHour: number | null;
  youngerDriverAge: number | null;
  youngerDriverSurcharge: number | null;
  petAllowed: boolean;
  cleaningFee: number | null;
  unlimitedMileagePrice1Day: number | null;
  unlimitedMileagePrice2to7: number | null;
  unlimitedMileageFreeFromDays: number | null;
  intercityDeliveryPrice: number | null;
  carWashPrice: number | null;
  emptyTankFee: number | null;
  additionalDriverFee: number | null;
  equipmentRentalPrice: number | null;
  afterHoursServiceFee: number | null;
  workingHoursStart: string | null;
  workingHoursEnd: string | null;
  damageTiresFee: number | null;
  damageGlassChipFee: number | null;
  damageLostKeysFee: number | null;
  damageBrokenGlassFee: number | null;
  damageTotalLossPercent: number | null;
  damageScratchesFee: number | null;
  damageSmokingFee: number | null;
  depositMultiplier: number | null;
  carPhoto: CarPhoto[];
  carCountingRule: CarCountingRule[];
  rentalTariff: RentalTariff[];
  segment: Segment[];
  cityAvailability?: CarCityAvailability[];
}
