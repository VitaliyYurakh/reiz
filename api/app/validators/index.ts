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
export const createTransactionSchema = z.object({
    type: z.string().min(1),
    accountId: z.number().int().positive(),
    direction: z.string().min(1),
    amountMinor: z.number().int().positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be a 3-letter code'),
    fxRate: z.number().optional(),
    amountUahMinor: z.number().int(),
    description: z.string().max(500).optional(),
    clientId: z.number().int().positive().optional(),
    rentalId: z.number().int().positive().optional(),
    reservationId: z.number().int().positive().optional(),
    fineId: z.number().int().positive().optional(),
});

export const createAccountSchema = z.object({
    name: z.string().min(1, 'Account name is required'),
    type: z.string().min(1, 'Account type is required'),
    currency: z.string().length(3).optional().default('UAH'),
    isActive: z.boolean().optional().default(true),
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
