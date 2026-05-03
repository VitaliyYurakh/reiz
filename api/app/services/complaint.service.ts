import {ComplaintCategory, ComplaintPriority, ComplaintAuthorType} from '@prisma/client';
import {prisma, logger, getErrorMessage} from '../utils';
import telegramService from './telegram.service';

const CATEGORY_LABEL_UK: Record<string, string> = {
    DEPOSIT: 'Застава',
    DAMAGE: 'Пошкодження',
    FINE: 'Штраф',
    SERVICE: 'Сервіс',
    GDPR: 'Персональні дані',
    OTHER: 'Інше',
};

const PRIORITY_LABEL_UK: Record<string, string> = {
    urgent: 'критичний',
    high: 'високий',
    normal: 'звичайний',
    low: 'низький',
};

const SLA_HOURS_BY_PRIORITY: Record<string, number> = {
    urgent: 4,
    high: 24,
    normal: 72,
    low: 168,
};

function generateTicketNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REIZ-COMP-${yyyy}-${mm}-${random}`;
}

class ComplaintService {
    async list(params: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        assignedManagerId?: number;
        clientId?: number;
        search?: string;
    } = {}) {
        const {page = 1, limit = 20, status, category, assignedManagerId, clientId, search} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;
        if (assignedManagerId) where.assignedManagerId = assignedManagerId;
        if (clientId) where.clientId = clientId;
        if (search?.trim()) {
            where.OR = [
                {ticketNumber: {contains: search.trim(), mode: 'insensitive'}},
                {subject: {contains: search.trim(), mode: 'insensitive'}},
                {contactName: {contains: search.trim(), mode: 'insensitive'}},
                {contactEmail: {contains: search.trim(), mode: 'insensitive'}},
                {contactPhone: {contains: search.trim()}},
            ];
        }

        const [items, total] = await Promise.all([
            prisma.complaint.findMany({
                where,
                orderBy: [{priority: 'desc'}, {createdAt: 'desc'}],
                skip,
                take: limit,
                include: {
                    client: {select: {id: true, firstName: true, lastName: true}},
                    rental: {select: {id: true, contractNumber: true}},
                    assignedManager: {select: {id: true, email: true, name: true}},
                    _count: {select: {messages: true}},
                },
            }),
            prisma.complaint.count({where}),
        ]);

        return {items, total};
    }

    async getOne(id: number) {
        return await prisma.complaint.findUnique({
            where: {id},
            include: {
                client: {select: {id: true, firstName: true, lastName: true, phone: true, email: true}},
                rental: {select: {id: true, contractNumber: true}},
                assignedManager: {select: {id: true, email: true, name: true}},
                messages: {
                    orderBy: {createdAt: 'asc'},
                    include: {authorUser: {select: {id: true, email: true, name: true}}},
                },
            },
        });
    }

    async create(data: {
        clientId?: number;
        rentalId?: number;
        category: ComplaintCategory;
        priority?: ComplaintPriority;
        subject: string;
        initialMessage: string;
        contactName?: string;
        contactEmail?: string;
        contactPhone?: string;
        attachments?: string[];
    }) {
        const priority = data.priority || 'normal';
        const slaHours = SLA_HOURS_BY_PRIORITY[priority] ?? 72;
        const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000);

        const complaint = await prisma.$transaction(async (tx) => {
            const created = await tx.complaint.create({
                data: {
                    ticketNumber: generateTicketNumber(),
                    clientId: data.clientId ?? null,
                    rentalId: data.rentalId ?? null,
                    category: data.category,
                    priority,
                    status: 'open',
                    subject: data.subject,
                    initialMessage: data.initialMessage,
                    contactName: data.contactName ?? null,
                    contactEmail: data.contactEmail ?? null,
                    contactPhone: data.contactPhone ?? null,
                    attachments: data.attachments ?? [],
                    slaDeadline,
                },
            });
            // Persist the initial message as the first thread entry too, so the
            // admin thread view always renders chronologically without special
            // casing the "initialMessage" column.
            await tx.complaintMessage.create({
                data: {
                    complaintId: created.id,
                    authorType: 'client',
                    body: data.initialMessage,
                    attachments: data.attachments ?? [],
                },
            });
            return created;
        });

        // Notify the manager group. Best-effort: a Telegram outage must not
        // block the user submitting a ticket.
        try {
            const esc = (s: string | null | undefined) =>
                (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const lines = [
                `🆕 <b>Нове звернення</b> ${esc(complaint.ticketNumber)}`,
                `Категорія: <b>${esc(CATEGORY_LABEL_UK[complaint.category] || complaint.category)}</b> · Пріоритет: ${esc(PRIORITY_LABEL_UK[complaint.priority] || complaint.priority)}`,
                `Тема: ${esc(complaint.subject)}`,
            ];
            if (data.contactName) lines.push(`Клієнт: ${esc(data.contactName)}`);
            if (data.contactPhone) lines.push(`Тел: ${esc(data.contactPhone)}`);
            if (data.contactEmail) lines.push(`Email: ${esc(data.contactEmail)}`);
            if (complaint.rentalId) lines.push(`Договір: rental#${complaint.rentalId}`);
            lines.push('');
            lines.push(esc(complaint.initialMessage.slice(0, 1500)));
            await telegramService.sendMessage(lines.join('\n'));
        } catch (err) {
            logger.error(`Failed to send Telegram notification for complaint #${complaint.id}: ${getErrorMessage(err)}`);
        }

        return complaint;
    }

    async addMessage(id: number, data: {
        body: string;
        authorType: ComplaintAuthorType;
        authorUserId?: number;
        attachments?: string[];
    }) {
        return await prisma.$transaction(async (tx) => {
            const message = await tx.complaintMessage.create({
                data: {
                    complaintId: id,
                    body: data.body,
                    authorType: data.authorType,
                    authorUserId: data.authorUserId ?? null,
                    attachments: data.attachments ?? [],
                },
            });
            // Staff reply moves status to awaiting_client; client reply re-opens.
            const newStatus = data.authorType === 'staff' ? 'awaiting_client' : 'open';
            await tx.complaint.update({
                where: {id},
                data: {status: newStatus},
            });
            return message;
        });
    }

    async update(id: number, data: {
        status?: string;
        category?: string;
        priority?: string;
        assignedManagerId?: number | null;
        resolution?: string;
    }) {
        const updateData: any = {...data};
        if (data.status === 'resolved' || data.status === 'rejected') {
            updateData.resolvedAt = new Date();
        }
        return await prisma.complaint.update({
            where: {id},
            data: updateData,
        });
    }

    async getStats() {
        const [open, inReview, awaitingClient, resolved, overdue] = await Promise.all([
            prisma.complaint.count({where: {status: 'open'}}),
            prisma.complaint.count({where: {status: 'in_review'}}),
            prisma.complaint.count({where: {status: 'awaiting_client'}}),
            prisma.complaint.count({where: {status: 'resolved'}}),
            prisma.complaint.count({
                where: {
                    status: {in: ['open', 'in_review', 'awaiting_client']},
                    slaDeadline: {lt: new Date()},
                },
            }),
        ]);
        return {open, inReview, awaitingClient, resolved, overdue};
    }
}

export default new ComplaintService();
