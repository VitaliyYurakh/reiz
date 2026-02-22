export interface RentalClient {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
}

export interface CarPhoto {
    id: number;
    url: string;
    type: string;
    alt: string | null;
}

export interface RentalTariff {
    id: number;
    minDays: number;
    maxDays: number;
    dailyPrice: number;
    deposit: number;
}

export interface CarSegment {
    id: number;
    name: string;
}

export interface RentalCar {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    previewUrl: string | null;
    carPhoto: CarPhoto[];
    rentalTariff: RentalTariff[];
    segment: CarSegment[];
}

export interface AddOn {
    id: number;
    name: string;
    priceMinor: number;
    currency: string;
}

export interface RentalAddOn {
    id: number;
    addOn: AddOn;
}

export interface ReservationAddOn {
    id: number;
    addOn: AddOn;
}

export interface CoveragePackage {
    id: number;
    name: string;
    depositPercent: number;
}

export interface Reservation {
    id: number;
    reservationAddOns: ReservationAddOn[];
    coveragePackage: CoveragePackage | null;
}

export interface RentalExtension {
    id: number;
    oldReturnDate: string;
    newReturnDate: string;
    extraDays: number;
    dailyRateMinor: number;
    currency: string;
    totalMinor: number;
    reason: string | null;
    createdAt: string;
}

export interface InspectionPhoto {
    id: number;
    url: string;
}

export interface Inspection {
    id: number;
    type: 'PICKUP' | 'RETURN';
    odometer: number | null;
    fuelLevel: number | null;
    cleanlinessOk: boolean;
    checklist: Record<string, unknown> | null;
    damages: Record<string, unknown>[] | null;
    notes: string | null;
    completedAt: string | null;
    photos: InspectionPhoto[];
}

export interface Fine {
    id: number;
    type: string;
    description: string | null;
    amountMinor: number;
    currency: string;
    isPaid: boolean;
    createdAt: string;
}

export interface Transaction {
    id: number;
    type: string;
    direction: string;
    amountMinor: number;
    currency: string;
    createdAt: string;
}

export interface RentalDocument {
    id: number;
    type: string;
    fileName: string;
    fileUrl: string;
    generatedAt: string | null;
}

export interface Rental {
    id: number;
    status: string;
    contractNumber: string;
    pickupDate: string;
    returnDate: string;
    actualReturnDate: string | null;
    pickupLocation: string | null;
    returnLocation: string | null;
    pickupOdometer: number | null;
    returnOdometer: number | null;
    allowedMileage: number | null;
    depositAmount: number | null;
    depositCurrency: string | null;
    depositReturned: boolean;
    cancelReason: string | null;
    notes: string | null;
    priceSnapshot: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    client: RentalClient;
    car: RentalCar;
    reservation: Reservation | null;
    rentalAddOns: RentalAddOn[];
    rentalExtensions: RentalExtension[];
    inspections: Inspection[];
    fines: Fine[];
    transactions: Transaction[];
    documents: RentalDocument[];
}

export interface Account {
    id: number;
    name: string;
    type: string;
    currency: string;
    isActive: boolean;
}

export type TabKey = 'overview' | 'inspections' | 'fines' | 'payments' | 'documents';
