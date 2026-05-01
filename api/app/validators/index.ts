import {z} from 'zod';
import {Currency, ServiceEventType, InspectionType, FineType} from '@prisma/client';

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
    // Optional TOTP code or recovery code — required only when the user has
    // 2FA enabled. Service throws TwoFactorRequiredError if missing in that case.
    totpCode: z.string().min(6).max(20).optional(),
});

export const totpEnableSchema = z.object({
    code: z.string().min(6).max(8),
});

export const totpDisableSchema = z.object({
    pass: z.string().min(1),
    code: z.string().min(6).max(20),
});

// ── User management ──
// Post-RBAC: per-user `role` enum and `permissions` Json are gone. A user
// has exactly one `roleId` pointing at the `Role` table. Role permissions
// are managed via the separate `/role` admin endpoints.
export const createUserSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: passwordSchema,
    name: z.string().optional().default(''),
    roleId: z.number().int().positive(),
});

export const updateUserSchema = z.object({
    name: z.string().optional(),
    roleId: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
    password: passwordSchema,
});

// ── Client ──
// preferredLanguage is not a column on Client (audit H-14); it used to pass
// through here and then crash Prisma on create. If language preference becomes
// a real feature, use the existing Client.languages Json? column.
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
});

// ── Finance ──
const TRANSACTION_TYPES = [
    'PAYMENT', 'DEPOSIT_RECEIVED', 'DEPOSIT_RETURNED', 'REFUND',
    'FINE_PAYMENT', 'SERVICE_COST', 'ADDON_PAYMENT', 'EXTENSION_PAYMENT',
    'TRANSFER',
    // Income from a partner settling the monthly commission. Tagged with
    // `partnerId` so the revenue report can break out partner-driven income
    // separately from rental income.
    'PARTNER_COMMISSION',
] as const;

const ACCOUNT_TYPES = ['CASH', 'BANK_ACCOUNT', 'BANK_CARD'] as const;
// User-facing payment currencies. GBP/CZK/RON exist in the Currency enum
// for fxRateService to cache NBU rates, but operators don't transact in
// them — so the public API restricts to this 5-currency subset.
const CURRENCIES = ['UAH', 'USD', 'EUR', 'ILS', 'PLN'] as const;

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
    partnerId: z.number().int().positive().optional(),
});

// ── Partner monthly settlements ─────────────────────────────────────
const isoDateOnly = z.string().refine((s) => /^\d{4}-\d{2}-\d{2}/.test(s), 'YYYY-MM-DD expected');
export const createPartnerPaymentSchema = z.object({
    partnerId:   z.number().int().positive(),
    accountId:   z.number().int().positive(),
    periodFrom:  isoDateOnly,
    periodTo:    isoDateOnly,
    paidAt:      isoDateOnly,
    // Operator can override either of the UAH amounts before saving (rounding
    // / partial pay). EUR amount is recomputed on the server from the rentals
    // chosen so the operator can't accidentally send a number that doesn't
    // match the included rentals.
    receivedUahMinor: z.number().int().positive('Сума має бути додатна'),
    fxRate:           z.number().positive().optional(),  // override fx if needed
    rentalIds:        z.array(z.number().int().positive()).min(1, 'Оберіть хоча б одну оренду'),
    notes:            z.string().max(2000).optional(),
});

export const updatePartnerPaymentSchema = z.object({
    paidAt:           isoDateOnly.optional(),
    receivedUahMinor: z.number().int().positive().optional(),
    notes:            z.string().max(2000).nullable().optional(),
    status:           z.enum(['paid', 'partial', 'disputed', 'refunded']).optional(),
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
// TELEGRAM is the channel actually wired up in notification.service (see H-2).
// EMAIL/SMS/PUSH are placeholders kept for forward compatibility.
export const createTemplateSchema = z.object({
    code: z.string().min(1).max(100),
    channel: z.enum(['TELEGRAM', 'EMAIL', 'SMS', 'PUSH']),
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
        partnerId: z.number().int().positive().nullable().optional(),
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
        // Accept either a legacy stringified JSON (existing records) or the
        // structured multilingual object that the admin UI now sends directly
        // (audit M-9). The Prisma column type is Json? so both fit.
        description: z.union([z.string().max(5000), z.record(z.string(), z.string())]).optional(),
        engineVolume: z.string().max(20).optional(),
        engineType: z.record(z.string(), z.string()).optional(),
        transmission: z.record(z.string(), z.string()).optional(),
        fuelConsumption: z.string().max(20).optional(),
        driveType: z.record(z.string(), z.string()).optional(),
        seats: z.number().int().min(1).max(100).optional(),
        discount: z.number().nullable().optional(),
        configuration: z.array(z.record(z.string(), z.string())).optional(),
        alt: z.string().max(500).optional(),
        isNew: z.boolean().optional(),
        deliveryPrice: z.number().int().min(0).nullable().optional(),
        freeDeliveryThreshold: z.number().int().min(0).nullable().optional(),
        cancellationHours: z.number().int().min(0).nullable().optional(),
        paymentMethods: z.string().max(500).nullable().optional(),
        minRentalDays: z.number().int().min(1).nullable().optional(),
        dailyMileageLimit: z.number().int().min(0).nullable().optional(),
        overmileagePriceMinor: z.number().int().min(0).nullable().optional(),
        driverAge: z.number().int().min(16).nullable().optional(),
        driverExperience: z.number().int().min(0).nullable().optional(),
        fuelPolicy: z.enum(['full_to_full', 'same_level', 'prepaid', 'included']).nullable().optional(),
        weeklyMileageLimit: z.number().int().min(0).nullable().optional(),
        monthlyMileageLimit: z.number().int().min(0).nullable().optional(),
        unlimitedMileage: z.boolean().optional(),
        maxRentalDays: z.number().int().min(1).nullable().optional(),
        allowCrossBorder: z.boolean().optional(),
        crossBorderFee: z.number().int().min(0).nullable().optional(),
        crossBorderDailyFee: z.number().int().min(0).nullable().optional(),
        allowedCountries: z.array(z.string()).nullable().optional(),
        lateReturnGraceMin: z.number().int().min(0).nullable().optional(),
        lateReturnFeePerHourMinor: z.number().int().min(0).nullable().optional(),
        youngerDriverAge: z.number().int().min(16).nullable().optional(),
        youngerDriverSurchargeMinor: z.number().int().min(0).nullable().optional(),
        petAllowed: z.boolean().optional(),
        cleaningFee: z.number().int().min(0).nullable().optional(),
        unlimitedMileagePrice1DayMinor: z.number().int().min(0).nullable().optional(),
        unlimitedMileagePrice2to7Minor: z.number().int().min(0).nullable().optional(),
        unlimitedMileageFreeFromDays: z.number().int().min(0).nullable().optional(),
        intercityDeliveryPriceMinor: z.number().int().min(0).nullable().optional(),
        carWashPriceMinor: z.number().int().min(0).nullable().optional(),
        emptyTankFeeMinor: z.number().int().min(0).nullable().optional(),
        additionalDriverFeeMinor: z.number().int().min(0).nullable().optional(),
        equipmentRentalPriceMinor: z.number().int().min(0).nullable().optional(),
        afterHoursServiceFeeMinor: z.number().int().min(0).nullable().optional(),
        workingHoursStart: z.string().max(10).nullable().optional(),
        workingHoursEnd: z.string().max(10).nullable().optional(),
        // Damage fees moved to nested object (1:1 relation in DB).
        // Money fields are stored in копійки (Int *Minor); the percent and
        // multiplier remain plain numbers since they aren't money.
        damageFees: z
            .object({
                damageTiresFeeMinor: z.number().int().min(0).nullable().optional(),
                damageGlassChipFeeMinor: z.number().int().min(0).nullable().optional(),
                damageLostKeysFeeMinor: z.number().int().min(0).nullable().optional(),
                damageBrokenGlassFeeMinor: z.number().int().min(0).nullable().optional(),
                damageScratchesFeeMinor: z.number().int().min(0).nullable().optional(),
                damageSmokingFeeMinor: z.number().int().min(0).nullable().optional(),
                damageTotalLossPercent: z.number().min(0).nullable().optional(),
                depositMultiplier: z.number().min(0).nullable().optional(),
            })
            .nullable()
            .optional(),
        // Owner partner. `null` = REIZ-owned. Was missing — Zod silently
        // dropped the key so the partner assignment never reached Prisma
        // (reported 2026-04-29: change owner to "Leokar", save, re-open,
        // owner reverted to "REIZ").
        partnerId: z.number().int().positive().nullable().optional(),
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

export const carCityAvailabilitySchema = z.object({
    data: z.array(z.object({
        cityId: z.number().int().positive(),
        deliveryFee: z.number().int().min(0).default(0),
        minRentalDays: z.number().int().min(1).default(1),
        isActive: z.boolean(),
    })),
});

export const countingRuleSchema = z.object({
    data: z.array(z.object({
        pricePercent: z.number().min(0),
        depositPercent: z.number().min(0),
        priceFixed: z.number().min(0).nullable().optional(),
        priceFixed30: z.number().min(0).nullable().optional(),
        depositFixed: z.number().min(0).nullable().optional(),
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
    depositCurrency: z.nativeEnum(Currency).optional(),
    allowedMileage: z.number().int().min(0).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateRentalSchema = z.object({
    pickupOdometer: z.number().int().min(0).optional(),
    returnOdometer: z.number().int().min(0).optional(),
    allowedMileage: z.number().int().min(0).optional(),
    notes: z.string().max(5000).optional(),
    depositAmount: z.number().int().min(0).optional(),
    depositCurrency: z.nativeEnum(Currency).optional(),
    depositReturned: z.boolean().optional(),
    pickupLocation: z.string().max(500).optional(),
    returnLocation: z.string().max(500).optional(),
});

export const completeRentalSchema = z.object({
    returnOdometer: z.number().int().min(0).optional(),
    actualReturnDate: z.coerce.date().optional(),
    notes: z.string().max(5000).optional(),
});

export const cancelRentalSchema = z.object({
    reason: z.string().min(1).max(2000),
    depositAccountId: z.number().int().positive().optional(),
});

export const extendRentalSchema = z.object({
    newReturnDate: z.coerce.date(),
    reason: z.string().max(2000).optional(),
    // Payment options for the auto-created EXTENSION_PAYMENT transaction.
    // If accountId is omitted, the service picks the first active account
    // matching the rental's currency. skipPayment=true lets admin record the
    // extension without creating a transaction (e.g. unpaid extension).
    paymentAccountId: z.number().int().positive().optional(),
    paymentFxRate: z.number().positive().optional(),
    skipPayment: z.boolean().optional(),
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
    deliveryCurrency: z.nativeEnum(Currency).optional(),
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
    deliveryCurrency: z.nativeEnum(Currency).optional(),
});

export const pickupReservationSchema = z.object({
    pickupOdometer: z.number().int().min(0).optional(),
    contractNumber: z.string().max(100).optional(),
    // Payment auto-capture. If omitted, service picks the first active account
    // matching priceSnapshot.currency. skipPayment=true records pickup without
    // creating the PAYMENT Transaction (client pays later).
    paymentAccountId: z.number().int().positive().optional(),
    paymentFxRate: z.number().positive().optional(),
    skipPayment: z.boolean().optional(),
    // Deposit auto-capture. Defaults to paymentAccountId if omitted. Same semantics.
    depositAccountId: z.number().int().positive().optional(),
    depositFxRate: z.number().positive().optional(),
    skipDeposit: z.boolean().optional(),
    // Optional live-recomputed price snapshot. When a pricing rule changes
    // (deposit formula, etc.) the reservation's frozen priceSnapshot may no
    // longer reflect what the admin sees on-screen. The UI passes the fresh
    // snapshot so the rental and its PAYMENT / DEPOSIT_RECEIVED transactions
    // are created against current numbers rather than stale ones.
    priceSnapshot: z.any().optional(),
});

export const cancelReservationSchema = z.object({
    reason: z.string().min(1).max(2000),
});

export const addReservationAddOnSchema = z.object({
    addOnId: z.number().int().positive(),
    quantity: z.number().int().min(1).optional(),
    unitPriceMinor: z.number().int().min(0),
    currency: z.nativeEnum(Currency).optional(),
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
        currency: z.nativeEnum(Currency),
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
    currency: z.nativeEnum(Currency).optional(),
    isActive: z.boolean().optional(),
});

export const updateRatePlanSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    minDays: z.number().int().min(0).optional(),
    maxDays: z.number().int().min(0).optional(),
    dailyPrice: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    isActive: z.boolean().optional(),
});

export const createAddOnSchema = z.object({
    name: z.string().min(1).max(200),
    nameLocalized: z.any().optional(),
    pricingMode: z.enum(['PER_DAY', 'ONE_TIME', 'MANUAL_QTY']),
    unitPriceMinor: z.number().int().min(0),
    currency: z.nativeEnum(Currency).optional(),
    defaultQty: z.string().optional(),
    qtyEditable: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const updateAddOnSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    nameLocalized: z.any().optional(),
    pricingMode: z.enum(['PER_DAY', 'ONE_TIME', 'MANUAL_QTY']).optional(),
    unitPriceMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
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
    currency: z.nativeEnum(Currency).optional(),
});

// ── Service Event ──
export const createServiceEventSchema = z.object({
    carId: z.number().int().positive(),
    type: z.nativeEnum(ServiceEventType),
    description: z.string().min(1).max(5000),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    blocksBooking: z.boolean().optional(),
    costMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    odometer: z.number().int().min(0).optional(),
    vendor: z.string().max(500).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateServiceEventSchema = z.object({
    type: z.nativeEnum(ServiceEventType).optional(),
    description: z.string().max(5000).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    blocksBooking: z.boolean().optional(),
    costMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    odometer: z.number().int().min(0).optional(),
    vendor: z.string().max(500).optional(),
    notes: z.string().max(5000).optional(),
});

// ── Inspection ──
export const createInspectionSchema = z.object({
    type: z.nativeEnum(InspectionType),
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
    type: z.nativeEnum(FineType),
    description: z.string().min(1).max(5000),
    amountMinor: z.number().int().min(0),
    currency: z.nativeEnum(Currency).optional(),
    externalCaseNumber: z.string().max(200).optional(),
    incidentAt: z.coerce.date().optional(),
    location: z.string().max(500).optional(),
    authority: z.string().max(200).optional(),
    attachments: z.array(z.string().url().or(z.string().min(1))).optional(),
    inspectionId: z.number().int().positive().optional(),
});

export const updateFineSchema = z.object({
    type: z.nativeEnum(FineType).optional(),
    description: z.string().max(5000).optional(),
    amountMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    externalCaseNumber: z.string().max(200).nullable().optional(),
    incidentAt: z.coerce.date().nullable().optional(),
    location: z.string().max(500).nullable().optional(),
    authority: z.string().max(200).nullable().optional(),
    attachments: z.array(z.string()).optional(),
    inspectionId: z.number().int().positive().nullable().optional(),
});

export const markFinePaidSchema = z.object({
    accountId: z.number().int().positive(),
    amountMinor: z.number().int().min(0),
    currency: z.nativeEnum(Currency),
    fxRate: z.number().optional(),
    amountUahMinor: z.number().int(),
});

// ── Partner ──
const commissionTierSchema = z.object({
    minDays: z.number().int().min(1),
    maxDays: z.number().int().min(0),
    percent: z.number().min(0).max(100),
});

export const createPartnerSchema = z.object({
    fullName: z.string().min(1).max(200),
    companyName: z.string().max(200).optional(),
    edrpou: z.string().max(20).optional(),
    ipn: z.string().max(20).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().max(200).optional(),
    iban: z.string().max(50).optional(),
    bankName: z.string().max(200).optional(),
    commissionTiers: z.array(commissionTierSchema).optional(),
    notes: z.string().max(5000).optional(),
});

export const updatePartnerSchema = z.object({
    fullName: z.string().min(1).max(200).optional(),
    companyName: z.string().max(200).nullable().optional(),
    edrpou: z.string().max(20).nullable().optional(),
    ipn: z.string().max(20).nullable().optional(),
    phone: z.string().max(50).nullable().optional(),
    email: z.string().email().max(200).nullable().optional(),
    iban: z.string().max(50).nullable().optional(),
    bankName: z.string().max(200).nullable().optional(),
    commissionTiers: z.array(commissionTierSchema).optional(),
    notes: z.string().max(5000).nullable().optional(),
    isActive: z.boolean().optional(),
});

// ── Complaint ──
const COMPLAINT_CATEGORIES = ['DEPOSIT', 'DAMAGE', 'FINE', 'SERVICE', 'GDPR', 'OTHER'] as const;
const COMPLAINT_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
const COMPLAINT_STATUSES = ['open', 'in_review', 'awaiting_client', 'resolved', 'rejected'] as const;

export const createComplaintSchema = z.object({
    clientId: z.number().int().positive().optional(),
    rentalId: z.number().int().positive().optional(),
    category: z.enum(COMPLAINT_CATEGORIES),
    priority: z.enum(COMPLAINT_PRIORITIES).optional(),
    subject: z.string().min(3).max(500),
    initialMessage: z.string().min(5).max(20000),
    contactName: z.string().max(200).optional(),
    contactEmail: z.string().email().max(200).optional(),
    contactPhone: z.string().max(50).optional(),
    attachments: z.array(z.string()).optional(),
});

export const updateComplaintSchema = z.object({
    status: z.enum(COMPLAINT_STATUSES).optional(),
    category: z.enum(COMPLAINT_CATEGORIES).optional(),
    priority: z.enum(COMPLAINT_PRIORITIES).optional(),
    assignedManagerId: z.number().int().positive().nullable().optional(),
    resolution: z.string().max(20000).optional(),
});

export const addComplaintMessageSchema = z.object({
    body: z.string().min(1).max(20000),
    attachments: z.array(z.string()).optional(),
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
    clientId: z.number().int().positive().optional(),
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

// ── Lead / B2B outreach ──
const LEAD_STATUS_VALUES = [
    'NEW', 'ENRICHED', 'READY', 'CONTACTED',
    'FOLLOWED_UP_1', 'FOLLOWED_UP_2', 'BREAKUP_SENT',
    'REPLIED', 'INTERESTED', 'CLIENT',
    'DISQUALIFIED', 'BOUNCED', 'UNSUBSCRIBED', 'PAUSED',
] as const;
const LEAD_SOURCE_VALUES = ['google_places', 'manual', 'csv'] as const;
const LEAD_DIRECTION_VALUES = ['OUTBOUND', 'INBOUND'] as const;
const LEAD_TEMPLATE_VALUES = ['initial', 'fu_3d', 'fu_7d', 'breakup_14d'] as const;

export const createLeadSchema = z.object({
    companyName: z.string().min(1).max(200),
    country: z.string().length(2).toUpperCase(),
    city: z.string().min(1).max(100),
    website: z.string().url().max(500).optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    email: z.string().email().max(200).optional().or(z.literal('')),
    ownerName: z.string().max(200).optional(),
    language: z.string().min(2).max(10).optional().default('ru'),
    source: z.enum(LEAD_SOURCE_VALUES).optional().default('manual'),
    googlePlaceId: z.string().max(200).optional(),
    notes: z.string().max(5000).optional(),
});

export const updateLeadSchema = z.object({
    companyName: z.string().min(1).max(200).optional(),
    country: z.string().length(2).toUpperCase().optional(),
    city: z.string().min(1).max(100).optional(),
    website: z.string().url().max(500).nullable().optional().or(z.literal('')),
    phone: z.string().max(50).nullable().optional(),
    email: z.string().email().max(200).nullable().optional().or(z.literal('')),
    ownerName: z.string().max(200).nullable().optional(),
    language: z.string().min(2).max(10).optional(),
    status: z.enum(LEAD_STATUS_VALUES).optional(),
    pausedReason: z.string().max(500).nullable().optional(),
    assignedManagerId: z.number().int().positive().nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
});

export const updateLeadStatusSchema = z.object({
    status: z.enum(LEAD_STATUS_VALUES),
    pausedReason: z.string().max(500).optional(),
});

export const addLeadEmailSchema = z.object({
    direction: z.enum(LEAD_DIRECTION_VALUES),
    template: z.enum(LEAD_TEMPLATE_VALUES).nullable().optional(),
    subject: z.string().min(1).max(500),
    body: z.string().min(1).max(50000),
    sentAt: z.string().datetime().optional(),
    receivedAt: z.string().datetime().optional(),
    gmailMsgId: z.string().max(200).optional(),
    gmailThreadId: z.string().max(200).optional(),
});

export const bulkImportLeadsSchema = z.object({
    items: z.array(createLeadSchema).min(1).max(500),
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

// ── Accident / ДТП ──
const ACCIDENT_STATUSES = ['REPORTED', 'INVESTIGATING', 'AWAITING_PAYOUT', 'RESOLVED', 'CLOSED'] as const;
const ACCIDENT_FAULTS = ['CLIENT', 'COMPANY', 'THIRD_PARTY', 'UNKNOWN'] as const;
const isoDate = z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date');

export const createAccidentSchema = z.object({
    carId: z.number().int().positive(),
    rentalId: z.number().int().positive().optional(),
    clientId: z.number().int().positive().optional(),
    incidentAt: isoDate,
    location: z.string().max(500).optional(),
    description: z.string().min(3).max(20000),
    fault: z.enum(ACCIDENT_FAULTS).optional(),
    status: z.enum(ACCIDENT_STATUSES).optional(),
    policeReportNumber: z.string().max(200).optional(),
    insuranceCompany: z.string().max(200).optional(),
    insuranceClaimNumber: z.string().max(200).optional(),
    expertVisitAt: isoDate.optional(),
    expertNotes: z.string().max(20000).optional(),
    estimatedDamageMinor: z.number().int().min(0).optional(),
    insurancePayoutMinor: z.number().int().min(0).optional(),
    clientDebtMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    blocksCar: z.boolean().optional(),
    attachments: z.array(z.string().url()).optional(),
    notes: z.string().max(20000).optional(),
});

export const updateAccidentSchema = z.object({
    incidentAt: isoDate.optional(),
    location: z.string().max(500).nullable().optional(),
    description: z.string().min(3).max(20000).optional(),
    fault: z.enum(ACCIDENT_FAULTS).optional(),
    status: z.enum(ACCIDENT_STATUSES).optional(),
    policeReportNumber: z.string().max(200).nullable().optional(),
    insuranceCompany: z.string().max(200).nullable().optional(),
    insuranceClaimNumber: z.string().max(200).nullable().optional(),
    expertVisitAt: isoDate.nullable().optional(),
    expertNotes: z.string().max(20000).nullable().optional(),
    estimatedDamageMinor: z.number().int().min(0).nullable().optional(),
    insurancePayoutMinor: z.number().int().min(0).nullable().optional(),
    clientDebtMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    blocksCar: z.boolean().optional(),
    attachments: z.array(z.string().url()).optional(),
    notes: z.string().max(20000).nullable().optional(),
});

// ── Inventory ──
const INVENTORY_CATEGORIES = ['TOOL', 'EQUIPMENT', 'ACCESSORY', 'KEYS', 'OTHER'] as const;
const INVENTORY_STATUSES = ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'LOST', 'WRITTEN_OFF'] as const;

export const createInventoryItemSchema = z.object({
    name: z.string().min(1).max(200),
    category: z.enum(INVENTORY_CATEGORIES).optional(),
    serialNumber: z.string().max(100).optional(),
    status: z.enum(INVENTORY_STATUSES).optional(),
    quantity: z.number().int().min(0).optional(),
    purchaseDate: isoDate.optional(),
    purchasePriceMinor: z.number().int().min(0).optional(),
    currentValueMinor: z.number().int().min(0).optional(),
    currency: z.nativeEnum(Currency).optional(),
    locationId: z.number().int().positive().optional(),
    responsibleUserId: z.number().int().positive().optional(),
    notes: z.string().max(5000).optional(),
    attachments: z.array(z.string().url()).optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial().extend({
    name: z.string().min(1).max(200).optional(),
    serialNumber: z.string().max(100).nullable().optional(),
    locationId: z.number().int().positive().nullable().optional(),
    responsibleUserId: z.number().int().positive().nullable().optional(),
    purchaseDate: isoDate.nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
});

// ── DocumentTemplate ──
const DOCUMENT_TEMPLATE_KINDS = ['RENTAL_AGREEMENT', 'ACT_TRANSFER', 'ACT_RETURN', 'INVOICE', 'INSURANCE_CLAIM', 'OTHER'] as const;
const DOCUMENT_TEMPLATE_LANGUAGES = ['uk', 'ru', 'en', 'pl', 'ro'] as const;

export const createDocumentTemplateSchema = z.object({
    name: z.string().min(1).max(200),
    kind: z.enum(DOCUMENT_TEMPLATE_KINDS),
    language: z.enum(DOCUMENT_TEMPLATE_LANGUAGES).optional(),
    bodyHtml: z.string().min(1),
    bodyText: z.string().optional(),
    placeholders: z.array(z.string().max(200)).optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});

export const updateDocumentTemplateSchema = createDocumentTemplateSchema.partial().extend({
    bodyText: z.string().nullable().optional(),
});

export const renderDocumentTemplateSchema = z.object({
    rentalId: z.number().int().positive().optional(),
    reservationId: z.number().int().positive().optional(),
    clientId: z.number().int().positive().optional(),
    accidentId: z.number().int().positive().optional(),
    extraContext: z.record(z.string(), z.any()).optional(),
});

// ── Rental Car Swap ──
export const swapRentalCarSchema = z.object({
    toCarId: z.number().int().positive(),
    fromOdometer: z.number().int().min(0).optional(),
    toOdometer: z.number().int().min(0).optional(),
    reason: z.string().max(500).optional(),
    notes: z.string().max(5000).optional(),
});

// ── Rental Deposit (dynamic) ──
const RENTAL_DEPOSIT_STATUSES = ['PENDING', 'RECEIVED', 'RETURNED', 'FORFEITED'] as const;

export const createRentalDepositSchema = z.object({
    rentalId: z.number().int().positive(),
    reason: z.string().min(1).max(500),
    amountMinor: z.number().int().positive(),
    currency: z.nativeEnum(Currency).optional(),
    dueAt: isoDate.optional(),
    notes: z.string().max(5000).optional(),
});

export const updateRentalDepositSchema = z.object({
    reason: z.string().min(1).max(500).optional(),
    amountMinor: z.number().int().positive().optional(),
    currency: z.nativeEnum(Currency).optional(),
    status: z.enum(RENTAL_DEPOSIT_STATUSES).optional(),
    dueAt: isoDate.nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
});

export const collectRentalDepositSchema = z.object({
    accountId: z.number().int().positive(),
    fxRate: z.number().positive().optional(),
});

// ── Inter-account transfer ──
export const transferAccountsSchema = z.object({
    fromAccountId: z.number().int().positive(),
    toAccountId: z.number().int().positive(),
    amountMinor: z.number().int().positive(),
    fxRate: z.number().positive().optional(), // override when from/to currencies differ
    description: z.string().max(500).optional(),
}).refine((d) => d.fromAccountId !== d.toAccountId, {
    message: 'Source and destination accounts must differ',
});

// ── Car block / unblock (for fleet operations) ──
export const blockCarSchema = z.object({
    reason: z.string().min(1).max(1000),
});

// ── Car maintenance schedule (mileage-based) ──
export const updateCarMaintenanceSchema = z.object({
    currentOdometer: z.number().int().min(0).nullable().optional(),
    serviceIntervalKm: z.number().int().min(0).nullable().optional(),
    nextServiceMileageKm: z.number().int().min(0).nullable().optional(),
    lastServiceMileageKm: z.number().int().min(0).nullable().optional(),
    lastServiceAt: isoDate.nullable().optional(),
});
