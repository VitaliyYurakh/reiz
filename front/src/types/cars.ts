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
  alt: string | null;
  carPhoto: CarPhoto[];
  carCountingRule: CarCountingRule[];
  rentalTariff: RentalTariff[];
  segment: Segment[];
}
