import {z} from 'zod';

// ── Password policy ──
const PASSWORD_MIN = 8;
const passwordSchema = z
    .string()
    .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit');

// ── Auth ──
export const loginSchema = z.object({
    nickname: z.string().min(1, 'Email is required').email('Invalid email format'),
    pass: z.string().min(1, 'Password is required'),
});

// ── User management ──
export const createUserSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: passwordSchema,
    name: z.string().optional().default(''),
    role: z.enum(['admin', 'manager', 'operator']).optional().default('manager'),
    permissions: z.record(z.string(), z.string()).optional().default({}),
});

export const updateUserSchema = z.object({
    name: z.string().optional(),
    role: z.enum(['admin', 'manager', 'operator']).optional(),
    permissions: z.record(z.string(), z.string()).optional(),
    isActive: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
    password: passwordSchema,
});

// ── Client ──
export const createClientSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    middleName: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    dateOfBirth: z.string().optional(),
    passportNo: z.string().optional(),
    driverLicenseNo: z.string().optional(),
    driverLicenseExpiry: z.string().optional(),
    address: z.string().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
    preferredLanguage: z.string().optional(),
});

// ── Finance ──
const TRANSACTION_TYPES = [
    'PAYMENT', 'DEPOSIT_RECEIVED', 'DEPOSIT_RETURNED', 'REFUND',
    'FINE_PAYMENT', 'SERVICE_COST', 'ADDON_PAYMENT', 'EXTENSION_PAYMENT',
] as const;

const ACCOUNT_TYPES = ['CASH', 'BANK_ACCOUNT', 'BANK_CARD'] as const;
const CURRENCIES = ['UAH', 'USD', 'EUR', 'ILS'] as const;

export const createTransactionSchema = z.object({
    type: z.enum(TRANSACTION_TYPES, {message: 'Invalid transaction type'}),
    accountId: z.number().int().positive(),
    direction: z.string().transform((v) => v.toLowerCase()).pipe(z.enum(['in', 'out'], {message: 'Direction must be in or out'})),
    amountMinor: z.number().int().positive('Amount must be positive'),
    currency: z.enum(CURRENCIES, {message: 'Currency must be UAH, USD, EUR or ILS'}),
    fxRate: z.number().positive().optional(),
    amountUahMinor: z.number().int().positive('UAH amount must be positive'),
    description: z.string().max(500).optional(),
    clientId: z.number().int().positive().optional(),
    rentalId: z.number().int().positive().optional(),
    reservationId: z.number().int().positive().optional(),
    fineId: z.number().int().positive().optional(),
});

export const createAccountSchema = z.object({
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(ACCOUNT_TYPES, {message: 'Account type must be CASH, BANK_ACCOUNT or BANK_CARD'}),
    currency: z.enum(CURRENCIES).optional().default('UAH'),
    isActive: z.boolean().optional().default(true),
});

export const updateAccountSchema = z.object({
    name: z.string().min(1).optional(),
    type: z.enum(ACCOUNT_TYPES).optional(),
    currency: z.enum(CURRENCIES).optional(),
    isActive: z.boolean().optional(),
});

// ── Document ──
export const generateDocumentSchema = z.object({
    type: z.enum(['RENTAL_CONTRACT', 'PICKUP_ACT', 'RETURN_ACT', 'INVOICE']),
    rentalId: z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]),
});

// ── Notification ──
export const createTemplateSchema = z.object({
    code: z.string().min(1).max(100),
    channel: z.enum(['EMAIL', 'SMS', 'PUSH']),
    subject: z.string().max(500).optional(),
    bodyTemplate: z.string().min(1).max(10000),
    isActive: z.boolean().optional().default(true),
});

export const sendNotificationSchema = z.object({
    templateCode: z.string().min(1),
    recipient: z.string().min(1),
    variables: z.record(z.string(), z.string()).optional().default({}),
});

// ── Car ──
export const createCarSchema = z.object({
    data: z.object({
        brand: z.string().min(1).max(100).optional(),
        model: z.string().min(1).max(100).optional(),
        plateNumber: z.string().min(1).max(20).optional(),
        VIN: z.string().min(1).max(50).optional(),
        yearOfManufacture: z.number().int().min(1900).max(2100).optional(),
        color: z.string().min(1).max(50).optional(),
        segmentIds: z.array(z.number().int().positive()).optional(),
    }),
});

export const updateCarSchema = z.object({
    data: z.object({
        brand: z.string().max(100).optional(),
        model: z.string().max(100).optional(),
        plateNumber: z.string().max(20).optional(),
        VIN: z.string().max(50).optional(),
        yearOfManufacture: z.number().int().min(1900).max(2100).optional(),
        color: z.string().max(50).optional(),
        segmentIds: z.array(z.number().int().positive()).optional(),
        isAvailable: z.boolean().optional(),
        description: z.string().max(5000).optional(),
        engineVolume: z.string().max(20).optional(),
        engineType: z.record(z.string(), z.string()).optional(),
        transmission: z.record(z.string(), z.string()).optional(),
        fuelConsumption: z.string().max(20).optional(),
        driveType: z.record(z.string(), z.string()).optional(),
        seats: z.number().int().min(1).max(100).optional(),
        discount: z.number().nullable().optional(),
        configuration: z.string().max(200).optional(),
        alt: z.string().max(500).optional(),
        isNew: z.boolean().optional(),
    }),
});

export const tariffSchema = z.object({
    data: z.array(z.object({
        deposit: z.number().min(0),
        minDays: z.number().int().min(0),
        maxDays: z.number().int().min(0),
        dailyPrice: z.number().min(0),
    })),
});

export const countingRuleSchema = z.object({
    data: z.array(z.object({
        pricePercent: z.number().min(0),
        depositPercent: z.number().min(0),
    })),
});

// ── Rental ──
export const createRentalSchema = z.object({
    clientId: z.number().int().positive(),
    carId: z.number().int().positive(),
    pickupDate: z.coerce.date(),
    returnDate: z.coerce.date(),
    pickupLocation: z.string().min(1).max(500),
    returnLocation: z.string().min(1).max(500),
    pickupOdometer: z.number().int().min(0).optional(),
    contractNumber: z.string().max(100).optional(),
    priceSnapshot: z.any(),
    depositAmount: z.number().int().min(0).optional(),
    depositCurrency: z.string().length(3).optional(),
    allowedMileage: z.number().int().min(0).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateRentalSchema = z.object({
    pickupOdometer: z.number().int().min(0).optional(),
    returnOdometer: z.number().int().min(0).optional(),
    allowedMileage: z.number().int().min(0).optional(),
    notes: z.string().max(5000).optional(),
    depositAmount: z.number().int().min(0).optional(),
    depositCurrency: z.string().length(3).optional(),
    depositReturned: z.boolean().optional(),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
});

export const completeRentalSchema = z.object({
    returnOdometer: z.number().int().min(0),
    actualReturnDate: z.coerce.date(),
});

export const cancelRentalSchema = z.object({
    reason: z.string().min(1).max(2000),
    depositAccountId: z.number().int().positive().optional(),
});

export const extendRentalSchema = z.object({
    newReturnDate: z.coerce.date(),
    reason: z.string().max(2000).optional(),
});

// ── Reservation ──
export const createReservationSchema = z.object({
    clientId: z.number().int().positive(),
    carId: z.number().int().positive(),
    pickupDate: z.coerce.date(),
    returnDate: z.coerce.date(),
    pickupLocation: z.string().min(1).max(500),
    returnLocation: z.string().min(1).max(500),
    coveragePackageId: z.number().int().positive().optional(),
    priceSnapshot: z.any().optional(),
    deliveryFee: z.number().int().min(0).optional(),
    deliveryCurrency: z.string().length(3).optional(),
    rentalRequestId: z.number().int().positive().optional(),
});

export const updateReservationSchema = z.object({
    pickupDate: z.coerce.date().optional(),
    returnDate: z.coerce.date().optional(),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
    coveragePackageId: z.number().int().positive().optional(),
    priceSnapshot: z.any().optional(),
    deliveryFee: z.number().int().min(0).optional(),
    deliveryCurrency: z.string().length(3).optional(),
});

export const pickupReservationSchema = z.object({
    pickupOdometer: z.number().int().min(0).optional(),
    contractNumber: z.string().max(100).optional(),
});

export const cancelReservationSchema = z.object({
    reason: z.string().min(1).max(2000),
});

export const addReservationAddOnSchema = z.object({
    addOnId: z.number().int().positive(),
    quantity: z.number().int().min(1).optional(),
    unitPriceMinor: z.number().int().min(0),
    currency: z.string().length(3).optional(),
});

// ── Rental Request ──
export const createRentalRequestSchema = z.object({
    source: z.string().max(100).optional(),
    status: z.string().max(50).optional(),
    clientId: z.number().int().positive().optional(),
    carId: z.number().int().positive().optional(),
    firstName: z.string().max(200).optional(),
    lastName: z.string().max(200).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional().or(z.literal('')),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
    pickupDate: z.coerce.date().optional(),
    returnDate: z.coerce.date().optional(),
    flightNumber: z.string().max(50).optional(),
    comment: z.string().max(5000).optional(),
    websiteSnapshot: z.any().optional(),
    assignedToUserId: z.number().int().positive().optional(),
});

export const updateRentalRequestSchema = z.object({
    status: z.string().max(50).optional(),
    clientId: z.number().int().positive().optional(),
    carId: z.number().int().positive().optional(),
    firstName: z.string().max(200).optional(),
    lastName: z.string().max(200).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional().or(z.literal('')),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
    pickupDate: z.coerce.date().optional(),
    returnDate: z.coerce.date().optional(),
    flightNumber: z.string().max(50).optional(),
    comment: z.string().max(5000).optional(),
    assignedToUserId: z.number().int().positive().optional(),
    rejectionReason: z.string().max(2000).optional(),
});

export const approveRentalRequestSchema = z.object({
    clientId: z.number().int().positive().optional(),
    carId: z.number().int().positive(),
    pickupDate: z.coerce.date(),
    returnDate: z.coerce.date(),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
    coveragePackageId: z.number().int().positive().optional(),
    addOns: z.array(z.object({
        addOnId: z.number().int().positive(),
        quantity: z.number().int().min(1),
        unitPriceMinor: z.number().int().min(0),
        currency: z.string().length(3),
    })).optional(),
    deliveryFee: z.number().int().min(0).optional(),
    priceSnapshot: z.any().optional(),
});

export const rejectRentalRequestSchema = z.object({
    reason: z.string().min(1).max(2000),
});

// ── Pricing ──
export const createRatePlanSchema = z.object({
    name: z.string().min(1).max(200),
    carId: z.number().int().positive(),
    minDays: z.number().int().min(0),
    maxDays: z.number().int().min(0),
    dailyPrice: z.number().int().min(0),
    currency: z.string().length(3).optional(),
    isActive: z.boolean().optional(),
});

export const updateRatePlanSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    minDays: z.number().int().min(0).optional(),
    maxDays: z.number().int().min(0).optional(),
    dailyPrice: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    isActive: z.boolean().optional(),
});

export const createAddOnSchema = z.object({
    name: z.string().min(1).max(200),
    nameLocalized: z.any().optional(),
    pricingMode: z.enum(['PER_DAY', 'ONE_TIME', 'MANUAL_QTY']),
    unitPriceMinor: z.number().int().min(0),
    currency: z.string().length(3).optional(),
    defaultQty: z.string().optional(),
    qtyEditable: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const updateAddOnSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    nameLocalized: z.any().optional(),
    pricingMode: z.enum(['PER_DAY', 'ONE_TIME', 'MANUAL_QTY']).optional(),
    unitPriceMinor: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    defaultQty: z.string().optional(),
    qtyEditable: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const createCoveragePackageSchema = z.object({
    name: z.string().min(1).max(200),
    nameLocalized: z.any().optional(),
    depositPercent: z.number().min(0).max(100),
    description: z.string().max(5000).optional(),
    isActive: z.boolean().optional(),
});

export const updateCoveragePackageSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    nameLocalized: z.any().optional(),
    depositPercent: z.number().min(0).max(100).optional(),
    description: z.string().max(5000).optional(),
    isActive: z.boolean().optional(),
});

export const calculatePricingSchema = z.object({
    carId: z.number().int().positive(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    coveragePackageId: z.number().int().positive().optional(),
    addOns: z.array(z.object({
        addOnId: z.number().int().positive(),
        qty: z.number().int().min(1).optional(),
    })).optional(),
    deliveryFee: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
});

// ── Service Event ──
export const createServiceEventSchema = z.object({
    carId: z.number().int().positive(),
    type: z.string().min(1).max(100),
    description: z.string().min(1).max(5000),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    blocksBooking: z.boolean().optional(),
    costMinor: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    odometer: z.number().int().min(0).optional(),
    vendor: z.string().max(500).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateServiceEventSchema = z.object({
    type: z.string().min(1).max(100).optional(),
    description: z.string().max(5000).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    blocksBooking: z.boolean().optional(),
    costMinor: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    odometer: z.number().int().min(0).optional(),
    vendor: z.string().max(500).optional(),
    notes: z.string().max(5000).optional(),
});

// ── Inspection ──
export const createInspectionSchema = z.object({
    type: z.enum(['PICKUP', 'RETURN']),
    fuelLevel: z.number().int().min(0).max(100).optional(),
    cleanlinessOk: z.boolean().optional(),
    bodyDamage: z.string().max(5000).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateInspectionSchema = z.object({
    fuelLevel: z.number().int().min(0).max(100).optional(),
    cleanlinessOk: z.boolean().optional(),
    bodyDamage: z.string().max(5000).optional(),
    notes: z.string().max(5000).optional(),
});

// ── Fine ──
export const createFineSchema = z.object({
    type: z.string().min(1).max(100),
    description: z.string().min(1).max(5000),
    amountMinor: z.number().int().min(0),
    currency: z.string().length(3).optional(),
});

export const updateFineSchema = z.object({
    type: z.string().min(1).max(100).optional(),
    description: z.string().max(5000).optional(),
    amountMinor: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    fineDate: z.coerce.date().optional(),
});

export const markFinePaidSchema = z.object({
    accountId: z.number().int().positive(),
    amountMinor: z.number().int().min(0),
    currency: z.string().length(3),
    fxRate: z.number().optional(),
    amountUahMinor: z.number().int(),
});

// ── City ──
export const createCitySchema = z.object({
    slug: z.string().min(1).max(200),
    nameUk: z.string().min(1).max(200),
    nameRu: z.string().min(1).max(200),
    nameEn: z.string().min(1).max(200),
    nameLocativeUk: z.string().min(1).max(200),
    nameLocativeRu: z.string().min(1).max(200),
    nameLocativeEn: z.string().min(1).max(200),
    latitude: z.string().max(50),
    longitude: z.string().max(50),
    postalCode: z.string().max(20),
    region: z.string().max(200),
    sortOrder: z.number().int().min(0).optional(),
    isPopular: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const updateCitySchema = z.object({
    slug: z.string().min(1).max(200).optional(),
    nameUk: z.string().min(1).max(200).optional(),
    nameRu: z.string().min(1).max(200).optional(),
    nameEn: z.string().min(1).max(200).optional(),
    nameLocativeUk: z.string().min(1).max(200).optional(),
    nameLocativeRu: z.string().min(1).max(200).optional(),
    nameLocativeEn: z.string().min(1).max(200).optional(),
    latitude: z.string().max(50).optional(),
    longitude: z.string().max(50).optional(),
    postalCode: z.string().max(20).optional(),
    region: z.string().max(200).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPopular: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const createLocationSchema = z.object({
    slug: z.string().min(1).max(200),
    nameUk: z.string().min(1).max(200),
    nameRu: z.string().min(1).max(200),
    nameEn: z.string().min(1).max(200),
    type: z.string().min(1).max(100),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});

export const updateLocationSchema = z.object({
    slug: z.string().min(1).max(200).optional(),
    nameUk: z.string().min(1).max(200).optional(),
    nameRu: z.string().min(1).max(200).optional(),
    nameEn: z.string().min(1).max(200).optional(),
    type: z.string().max(100).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});

// ── Feedback (public) ──
export const bookingRequestSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(200),
    lastName: z.string().min(1, 'Last name is required').max(200),
    phone: z.string().min(5, 'Phone is required').max(30),
    email: z.string().email('Invalid email format').max(200),
    pickupLocation: z.string().min(1).max(500),
    returnLocation: z.string().min(1).max(500),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    flightNumber: z.string().max(50).optional(),
    comment: z.string().max(5000).optional(),
    carId: z.number().int().positive().optional(),
    carDetails: z.any().optional(),
    selectedPlan: z.any().optional(),
    selectedExtras: z.any().optional(),
    totalDays: z.number().int().positive().optional(),
    priceBreakdown: z.any().optional(),
});

export const contactRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    email: z.string().email('Invalid email format').max(200),
    phone: z.string().min(5, 'Phone is required').max(30),
    message: z.string().max(5000).optional(),
});

export const callbackRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    phone: z.string().min(5, 'Phone is required').max(30),
    contactMethod: z.string().max(50).optional(),
});

export const businessRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    phone: z.string().min(5, 'Phone is required').max(30),
    email: z.string().email('Invalid email format').max(200),
    message: z.string().max(5000).optional(),
});

export const investRequestSchema = z.object({
    car: z.string().min(1).max(200),
    model: z.string().min(1).max(200),
    transmission: z.string().max(50).optional(),
    mileage: z.string().max(50).optional(),
    year: z.string().max(10).optional(),
    color: z.string().max(50).optional(),
    complect: z.string().max(500).optional(),
    name: z.string().min(1, 'Name is required').max(200),
    phone: z.string().min(5, 'Phone is required').max(30),
    email: z.string().email('Invalid email format').max(200),
});

// ── Validation error class ──
export class ValidationError extends Error {
    errors: string[];
    constructor(errors: string[]) {
        super('Validation error');
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

// ── Helper: validate or throw ──
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    }
    const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new ValidationError(errors);
}
