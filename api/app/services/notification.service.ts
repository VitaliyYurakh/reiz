import {prisma, logger} from '../utils';
import telegramService from './telegram.service';

class NotificationService {
    // --- Template CRUD ---

    async getTemplates(params?: {channel?: string; isActive?: boolean}) {
        const where: any = {};
        if (params?.channel) where.channel = params.channel;
        if (params?.isActive !== undefined) where.isActive = params.isActive;

        return await prisma.notificationTemplate.findMany({
            where,
            orderBy: {code: 'asc'},
        });
    }

    async createTemplate(data: {
        code: string;
        channel: string;
        subject?: string;
        bodyTemplate: string;
        isActive?: boolean;
    }) {
        // Check for duplicate code before creating
        const existing = await prisma.notificationTemplate.findUnique({
            where: {code: data.code},
        });
        if (existing) {
            throw new Error(`Шаблон з кодом "${data.code}" вже існує (ID: ${existing.id})`);
        }

        return await prisma.notificationTemplate.create({
            data: {
                code: data.code,
                channel: data.channel,
                subject: data.subject || null,
                bodyTemplate: data.bodyTemplate,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async updateTemplate(id: number, data: {
        code?: string;
        channel?: string;
        subject?: string;
        bodyTemplate?: string;
        isActive?: boolean;
    }) {
        return await prisma.notificationTemplate.update({
            where: {id},
            data,
        });
    }

    // --- Send ---

    async send(templateCode: string, data: {
        recipient: string;
        variables: Record<string, string>;
    }) {
        const template = await prisma.notificationTemplate.findUnique({
            where: {code: templateCode},
        });

        if (!template) {
            throw new Error(`Notification template with code "${templateCode}" not found`);
        }

        if (!template.isActive) {
            throw new Error(`Notification template "${templateCode}" is inactive`);
        }

        // Render the template by replacing {{variable}} placeholders
        let renderedBody = template.bodyTemplate;
        for (const [key, value] of Object.entries(data.variables)) {
            renderedBody = renderedBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        let renderedSubject = template.subject || '';
        for (const [key, value] of Object.entries(data.variables)) {
            renderedSubject = renderedSubject.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        let status = 'pending';
        let errorMessage: string | null = null;
        let sentAt: Date | null = null;

        // Send via channel
        if (template.channel === 'telegram') {
            const sent = await telegramService.sendMessage(renderedBody);
            if (sent) {
                status = 'sent';
                sentAt = new Date();
            } else {
                status = 'failed';
                errorMessage = 'Telegram API returned failure';
            }
        } else {
            // Other channels (email, SMS, etc.) can be added here
            logger.warn(`Unsupported notification channel: ${template.channel}`);
            status = 'failed';
            errorMessage = `Unsupported channel: ${template.channel}`;
        }

        // Log the notification
        const log = await prisma.notificationLog.create({
            data: {
                templateId: template.id,
                channel: template.channel,
                recipient: data.recipient,
                subject: renderedSubject || null,
                body: renderedBody,
                status,
                errorMessage,
                sentAt,
            },
            include: {
                template: {select: {id: true, code: true, channel: true}},
            },
        });

        return log;
    }

    // --- Logs ---

    async getLogs(params: {
        page: number;
        limit: number;
        templateId?: number;
        status?: string;
        channel?: string;
        from?: Date;
        to?: Date;
    }) {
        const {page, limit, templateId, status, channel, from, to} = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (templateId) where.templateId = templateId;
        if (status) where.status = status;
        if (channel) where.channel = channel;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            prisma.notificationLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    template: {select: {id: true, code: true, channel: true}},
                },
            }),
            prisma.notificationLog.count({where}),
        ]);

        return {items, total, page, limit, totalPages: Math.ceil(total / limit)};
    }
}

export default new NotificationService();
