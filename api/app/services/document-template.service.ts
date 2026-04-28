import {prisma, NotFoundError, BadRequestError} from '../utils';

interface CreateInput {
    name: string;
    kind: string;
    language?: string;
    bodyHtml: string;
    bodyText?: string;
    placeholders?: string[];
    isActive?: boolean;
    isDefault?: boolean;
    createdById?: number;
}

interface RenderContextSources {
    rentalId?: number;
    reservationId?: number;
    clientId?: number;
    accidentId?: number;
    extraContext?: Record<string, any>;
}

/**
 * Tiny template engine.
 *
 * Supports `{{path.to.value}}` substitution from a deeply-nested context.
 * Missing keys render as empty string (intentional — keeps templates safe to
 * use even when a context is partial). Use `{{#if path}}...{{/if}}` for
 * optional blocks.
 *
 * Not Handlebars. Deliberately small (~30 lines) so it has no dependency,
 * fast cold-start, and is easy to audit.
 */
function getDeep(obj: any, path: string): any {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function renderTemplate(template: string, ctx: Record<string, any>): string {
    // 1. Conditional blocks {{#if path}}...{{/if}}
    let out = template.replace(
        /\{\{#if\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (_, path: string, inner: string) => {
            const val = getDeep(ctx, path.trim());
            return val ? inner : '';
        },
    );
    // 2. Plain placeholders {{path}}
    out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
        const val = getDeep(ctx, path.trim());
        if (val === undefined || val === null) return '';
        if (val instanceof Date) return val.toISOString().slice(0, 10);
        return String(val);
    });
    return out;
}

function fmtMoney(minor: number | null | undefined, currency = 'UAH'): string {
    if (minor == null) return '';
    return `${(minor / 100).toFixed(2)} ${currency}`;
}

function fmtDate(d: Date | string | null | undefined): string {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('uk-UA', {year: 'numeric', month: '2-digit', day: '2-digit'});
}

class DocumentTemplateService {
    async list(params: {kind?: string; language?: string; isActive?: boolean} = {}) {
        const where: any = {};
        if (params.kind) where.kind = params.kind;
        if (params.language) where.language = params.language;
        if (params.isActive !== undefined) where.isActive = params.isActive;

        const items = await prisma.documentTemplate.findMany({
            where,
            orderBy: [{kind: 'asc'}, {language: 'asc'}, {isDefault: 'desc'}, {name: 'asc'}],
            include: {createdBy: {select: {id: true, name: true, email: true}}},
        });
        return {items, total: items.length};
    }

    async getOne(id: number) {
        return await prisma.documentTemplate.findUnique({
            where: {id},
            include: {createdBy: {select: {id: true, name: true, email: true}}},
        });
    }

    async create(data: CreateInput) {
        return await prisma.$transaction(async (tx) => {
            // If this template is being marked default, unset previous defaults
            // for the same (kind, language) tuple.
            if (data.isDefault) {
                await tx.documentTemplate.updateMany({
                    where: {kind: data.kind, language: data.language ?? 'uk', isDefault: true},
                    data: {isDefault: false},
                });
            }
            return await tx.documentTemplate.create({
                data: {
                    name: data.name,
                    kind: data.kind,
                    language: data.language ?? 'uk',
                    bodyHtml: data.bodyHtml,
                    bodyText: data.bodyText ?? null,
                    placeholders: (data.placeholders ?? []) as any,
                    isActive: data.isActive ?? true,
                    isDefault: data.isDefault ?? false,
                    createdById: data.createdById ?? null,
                },
            });
        });
    }

    async update(id: number, data: any) {
        const existing = await prisma.documentTemplate.findUnique({where: {id}});
        if (!existing) throw new NotFoundError(`DocumentTemplate ${id} not found`);

        return await prisma.$transaction(async (tx) => {
            const updateData: any = {};
            for (const k of ['name', 'kind', 'language', 'bodyHtml', 'bodyText', 'isActive', 'isDefault'] as const) {
                if (data[k] !== undefined) updateData[k] = data[k];
            }
            if (data.placeholders !== undefined) updateData.placeholders = data.placeholders as any;

            // Single-default invariant per (kind, language).
            if (data.isDefault === true) {
                const kind = data.kind ?? existing.kind;
                const language = data.language ?? existing.language;
                await tx.documentTemplate.updateMany({
                    where: {kind, language, isDefault: true, id: {not: id}},
                    data: {isDefault: false},
                });
            }

            return await tx.documentTemplate.update({
                where: {id},
                data: updateData,
            });
        });
    }

    async delete(id: number) {
        await prisma.documentTemplate.delete({where: {id}});
    }

    /**
     * Build a context object from the linked entities and render the template.
     * Returns rendered HTML + the context that was used (so the UI can show a
     * "missing data" warning if a template referenced something we couldn't fill).
     */
    async render(templateId: number, sources: RenderContextSources) {
        const template = await prisma.documentTemplate.findUnique({where: {id: templateId}});
        if (!template) throw new NotFoundError(`DocumentTemplate ${templateId} not found`);
        if (!template.isActive) throw new BadRequestError('Template is inactive');

        const ctx: Record<string, any> = {
            company: {
                name: 'REIZ',
                phone: '+380 67 000 0000',
                email: 'info@reiz.com.ua',
                edrpou: '',
            },
            now: {
                date: fmtDate(new Date()),
                year: new Date().getFullYear(),
            },
            ...(sources.extraContext || {}),
        };

        if (sources.rentalId) {
            const rental = await prisma.rental.findUnique({
                where: {id: sources.rentalId},
                include: {
                    client: true,
                    car: {include: {partner: true}},
                },
            });
            if (rental) {
                ctx.rental = {
                    id: rental.id,
                    contractNumber: rental.contractNumber || `R-${rental.id}`,
                    pickupDate: fmtDate(rental.pickupDate),
                    returnDate: fmtDate(rental.returnDate),
                    pickupLocation: rental.pickupLocation,
                    returnLocation: rental.returnLocation,
                    pickupOdometer: rental.pickupOdometer ?? '',
                    allowedMileage: rental.allowedMileage ?? '',
                    deposit: fmtMoney(rental.depositAmount, rental.depositCurrency),
                    notes: rental.notes ?? '',
                };
                ctx.client = clientCtx(rental.client);
                ctx.car = carCtx(rental.car);
            }
        }

        if (sources.reservationId && !ctx.rental) {
            const reservation = await prisma.reservation.findUnique({
                where: {id: sources.reservationId},
                include: {client: true, car: true},
            });
            if (reservation) {
                ctx.reservation = {
                    id: reservation.id,
                    pickupDate: fmtDate(reservation.pickupDate),
                    returnDate: fmtDate(reservation.returnDate),
                };
                ctx.client = clientCtx(reservation.client);
                ctx.car = carCtx(reservation.car as any);
            }
        }

        if (sources.clientId && !ctx.client) {
            const client = await prisma.client.findUnique({where: {id: sources.clientId}});
            if (client) ctx.client = clientCtx(client);
        }

        if (sources.accidentId) {
            const accident = await prisma.accident.findUnique({
                where: {id: sources.accidentId},
                include: {car: true, client: true, rental: true},
            });
            if (accident) {
                ctx.accident = {
                    id: accident.id,
                    incidentAt: fmtDate(accident.incidentAt),
                    location: accident.location ?? '',
                    description: accident.description,
                    fault: accident.fault,
                    status: accident.status,
                    policeReportNumber: accident.policeReportNumber ?? '',
                    insuranceClaimNumber: accident.insuranceClaimNumber ?? '',
                    insuranceCompany: accident.insuranceCompany ?? '',
                    estimatedDamage: fmtMoney(accident.estimatedDamageMinor, accident.currency),
                    insurancePayout: fmtMoney(accident.insurancePayoutMinor, accident.currency),
                    clientDebt: fmtMoney(accident.clientDebtMinor, accident.currency),
                };
                if (!ctx.car && accident.car) ctx.car = carCtx(accident.car);
                if (!ctx.client && accident.client) ctx.client = clientCtx(accident.client);
            }
        }

        const html = renderTemplate(template.bodyHtml, ctx);
        const text = template.bodyText ? renderTemplate(template.bodyText, ctx) : null;

        return {
            template: {id: template.id, name: template.name, kind: template.kind, language: template.language},
            html,
            text,
            context: ctx,
        };
    }
}

function clientCtx(c: any): Record<string, any> {
    if (!c) return {};
    return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        middleName: c.middleName ?? '',
        fullName: [c.lastName, c.firstName, c.middleName].filter(Boolean).join(' '),
        phone: c.phone,
        email: c.email ?? '',
        passportNo: c.passportNo ?? '',
        nationalId: c.nationalId ?? '',
        driverLicenseNo: c.driverLicenseNo ?? '',
        driverLicenseExpiry: fmtDate(c.driverLicenseExpiry),
        address: c.address ?? '',
        city: c.city ?? '',
        country: c.country ?? '',
    };
}

function carCtx(c: any): Record<string, any> {
    if (!c) return {};
    return {
        id: c.id,
        brand: c.brand ?? '',
        model: c.model ?? '',
        plateNumber: c.plateNumber ?? '',
        VIN: c.VIN ?? '',
        year: c.yearOfManufacture ?? '',
        color: c.color ?? '',
        partnerName: c.partner?.fullName ?? c.partner?.companyName ?? '',
    };
}

export default new DocumentTemplateService();
