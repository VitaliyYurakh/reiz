import {Prisma} from '@prisma/client';
import {prisma, LeadStatus, LeadSource} from '../utils';

interface ListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    country?: string;
    assignedManagerId?: number;
}

interface CreateLeadData {
    companyName: string;
    country: string;
    city: string;
    website?: string | null;
    phone?: string | null;
    email?: string | null;
    ownerName?: string | null;
    language?: string;
    source?: string;
    googlePlaceId?: string;
    notes?: string | null;
}

class LeadService {
    async list(params: ListParams = {}) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, Math.max(1, params.limit ?? 25));
        const skip = (page - 1) * limit;

        const where: Prisma.LeadWhereInput = {};
        if (params.status) where.status = params.status;
        if (params.country) where.country = params.country.toUpperCase();
        if (params.assignedManagerId) where.assignedManagerId = params.assignedManagerId;
        if (params.search?.trim()) {
            const q = params.search.trim();
            where.OR = [
                {companyName: {contains: q, mode: 'insensitive'}},
                {city: {contains: q, mode: 'insensitive'}},
                {email: {contains: q, mode: 'insensitive'}},
                {ownerName: {contains: q, mode: 'insensitive'}},
                {phone: {contains: q}},
                {website: {contains: q, mode: 'insensitive'}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: [{createdAt: 'desc'}],
                skip,
                take: limit,
                include: {
                    assignedManager: {select: {id: true, name: true, email: true}},
                    _count: {select: {emails: true}},
                },
            }),
            prisma.lead.count({where}),
        ]);

        return {items, total, page, limit};
    }

    async getOne(id: number) {
        return await prisma.lead.findUnique({
            where: {id},
            include: {
                assignedManager: {select: {id: true, name: true, email: true}},
                emails: {orderBy: {createdAt: 'asc'}},
            },
        });
    }

    async create(data: CreateLeadData) {
        return await prisma.lead.create({
            data: {
                source: data.source ?? LeadSource.MANUAL,
                googlePlaceId: data.googlePlaceId ?? null,
                companyName: data.companyName,
                country: data.country.toUpperCase(),
                city: data.city,
                website: data.website || null,
                phone: data.phone || null,
                email: data.email || null,
                ownerName: data.ownerName || null,
                language: data.language ?? 'ru',
                notes: data.notes || null,
                // Status: if email is already known on creation, jump straight to READY
                status: data.email ? LeadStatus.READY : LeadStatus.NEW,
            },
        });
    }

    async update(id: number, data: Partial<CreateLeadData & {
        status: string;
        pausedReason: string | null;
        assignedManagerId: number | null;
    }>) {
        const patch: Prisma.LeadUpdateInput = {};
        if (data.companyName !== undefined) patch.companyName = data.companyName;
        if (data.country !== undefined) patch.country = data.country.toUpperCase();
        if (data.city !== undefined) patch.city = data.city;
        if (data.website !== undefined) patch.website = data.website || null;
        if (data.phone !== undefined) patch.phone = data.phone || null;
        if (data.email !== undefined) patch.email = data.email || null;
        if (data.ownerName !== undefined) patch.ownerName = data.ownerName || null;
        if (data.language !== undefined) patch.language = data.language;
        if (data.status !== undefined) patch.status = data.status;
        if (data.pausedReason !== undefined) patch.pausedReason = data.pausedReason;
        if (data.notes !== undefined) patch.notes = data.notes;
        if (data.assignedManagerId !== undefined) {
            patch.assignedManager = data.assignedManagerId
                ? {connect: {id: data.assignedManagerId}}
                : {disconnect: true};
        }
        return await prisma.lead.update({where: {id}, data: patch});
    }

    async updateStatus(id: number, status: string, pausedReason?: string | null) {
        const patch: Prisma.LeadUpdateInput = {status};
        if (status === LeadStatus.PAUSED) patch.pausedReason = pausedReason ?? null;
        if (status === LeadStatus.REPLIED && !await this.hasReplyTimestamp(id)) {
            patch.repliedAt = new Date();
        }
        return await prisma.lead.update({where: {id}, data: patch});
    }

    private async hasReplyTimestamp(id: number) {
        const row = await prisma.lead.findUnique({where: {id}, select: {repliedAt: true}});
        return !!row?.repliedAt;
    }

    async delete(id: number) {
        // Treat delete as soft-disqualify — keep the row for audit / dedup against
        // future Google Places re-imports (the unique googlePlaceId still pins it).
        return await prisma.lead.update({
            where: {id},
            data: {status: LeadStatus.DISQUALIFIED},
        });
    }

    async addEmail(leadId: number, data: {
        direction: string;
        template?: string | null;
        subject: string;
        body: string;
        sentAt?: Date;
        receivedAt?: Date;
        gmailMsgId?: string;
        gmailThreadId?: string;
    }) {
        return await prisma.leadEmail.create({
            data: {
                leadId,
                direction: data.direction,
                template: data.template ?? null,
                subject: data.subject,
                body: data.body,
                sentAt: data.sentAt ?? null,
                receivedAt: data.receivedAt ?? null,
                gmailMsgId: data.gmailMsgId ?? null,
                gmailThreadId: data.gmailThreadId ?? null,
            },
        });
    }

    async bulkImport(items: CreateLeadData[]) {
        // Idempotent by googlePlaceId when provided. Falls back to (companyName, city) match.
        let created = 0;
        let skipped = 0;
        for (const item of items) {
            const where: Prisma.LeadWhereInput = item.googlePlaceId
                ? {googlePlaceId: item.googlePlaceId}
                : {companyName: item.companyName, city: item.city};
            const existing = await prisma.lead.findFirst({where});
            if (existing) {
                skipped++;
                continue;
            }
            await this.create(item);
            created++;
        }
        return {created, skipped, total: items.length};
    }

    async getStats() {
        const groups = await prisma.lead.groupBy({
            by: ['status', 'country'],
            _count: {_all: true},
        });
        const byStatus: Record<string, number> = {};
        const byCountry: Record<string, number> = {};
        let total = 0;
        for (const g of groups) {
            byStatus[g.status] = (byStatus[g.status] ?? 0) + g._count._all;
            byCountry[g.country] = (byCountry[g.country] ?? 0) + g._count._all;
            total += g._count._all;
        }
        const contacted = (byStatus.CONTACTED ?? 0) + (byStatus.FOLLOWED_UP_1 ?? 0) + (byStatus.FOLLOWED_UP_2 ?? 0) + (byStatus.BREAKUP_SENT ?? 0) + (byStatus.REPLIED ?? 0) + (byStatus.INTERESTED ?? 0) + (byStatus.CLIENT ?? 0);
        const replied = (byStatus.REPLIED ?? 0) + (byStatus.INTERESTED ?? 0) + (byStatus.CLIENT ?? 0);
        const replyRate = contacted > 0 ? Math.round((replied / contacted) * 1000) / 10 : 0;

        // Stuck = lead has been sitting in its current stage too long without progressing.
        // READY: enriched but never sent — createdAt > 5d ago and never contacted.
        // CONTACTED / FOLLOWED_UP_1 / FOLLOWED_UP_2: last touch > 5d ago, no reply yet.
        const STUCK_DAYS = 5;
        const cutoff = new Date(Date.now() - STUCK_DAYS * 24 * 60 * 60 * 1000);
        const [stuckReady, stuckContacted, stuckFu1, stuckFu2] = await Promise.all([
            prisma.lead.count({where: {status: 'READY', contactedAt: null, createdAt: {lt: cutoff}}}),
            prisma.lead.count({where: {status: 'CONTACTED', repliedAt: null, OR: [{lastFollowUpAt: {lt: cutoff}}, {AND: [{lastFollowUpAt: null}, {contactedAt: {lt: cutoff}}]}]}}),
            prisma.lead.count({where: {status: 'FOLLOWED_UP_1', repliedAt: null, lastFollowUpAt: {lt: cutoff}}}),
            prisma.lead.count({where: {status: 'FOLLOWED_UP_2', repliedAt: null, lastFollowUpAt: {lt: cutoff}}}),
        ]);
        const stuckByStatus: Record<string, number> = {
            READY: stuckReady,
            CONTACTED: stuckContacted,
            FOLLOWED_UP_1: stuckFu1,
            FOLLOWED_UP_2: stuckFu2,
        };

        return {total, byStatus, byCountry, replyRate, contacted, replied, stuckByStatus};
    }
}

export default new LeadService();
