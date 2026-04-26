/**
 * Lead Cron — orchestrates the outreach pipeline on simple setInterval timers.
 * Avoids node-cron dependency. Runs only when start() is called from the
 * server bootstrap; safe to leave dormant in development if you want to
 * trigger steps manually via the admin UI.
 */
import {logger, prisma, LeadStatus} from '../utils';
import {env} from '../config/env';
import leadDiscoveryService from './lead-discovery.service';
import leadEnrichmentService from './lead-enrichment.service';
import leadGmailService from './lead-gmail.service';
import telegramService from './telegram.service';

interface ScheduleHandle {
    stop: () => void;
    runOnce: () => Promise<unknown>;
}

const HOUR = 3600_000;
const MINUTE = 60_000;

class LeadCronService {
    private handles: ScheduleHandle[] = [];
    private started = false;

    start() {
        if (this.started) return;
        this.started = true;

        // Discovery — once a day at runtime + 30s, then every 24h
        this.handles.push(this.schedule('discovery', 30_000, 24 * HOUR, () => leadDiscoveryService.discoverAll()));

        // Enrichment — every 30 minutes, batches of 5
        this.handles.push(this.schedule('enrichment', 60_000, 30 * MINUTE, () => leadEnrichmentService.enrichBatch(5)));

        // Outreach sender — every 60 minutes, paced to daily cap
        this.handles.push(this.schedule('outreach-send', 5 * MINUTE, 60 * MINUTE, async () => {
            const cap = env.OUTREACH_DAILY_CAP;
            const batchSize = Math.max(1, Math.floor(cap / 8)); // spread cap over the day
            const sentToday = await this.countSentToday();
            const remaining = Math.max(0, cap - sentToday);
            const toSend = Math.min(batchSize, remaining);
            if (toSend === 0) return {skipped: true, sentToday, cap};
            return leadGmailService.runOutreachSweep(toSend);
        }));

        // Inbox reader — every 15 minutes
        this.handles.push(this.schedule('inbox', 2 * MINUTE, 15 * MINUTE, () => leadGmailService.runInboxSweep()));

        // Daily Telegram report — every 24h, first run 1h after boot
        this.handles.push(this.schedule('daily-report', HOUR, 24 * HOUR, () => this.sendDailyReport()));

        logger.info('[lead-cron] all schedules started');
    }

    stop() {
        for (const h of this.handles) h.stop();
        this.handles = [];
        this.started = false;
    }

    /**
     * Manually run a single step. Used by the admin "Run now" button.
     */
    async runStep(step: 'discovery' | 'enrichment' | 'outreach' | 'inbox' | 'report') {
        switch (step) {
            case 'discovery': return leadDiscoveryService.discoverAll();
            case 'enrichment': return leadEnrichmentService.enrichBatch(20);
            case 'outreach': {
                const cap = env.OUTREACH_DAILY_CAP;
                const sentToday = await this.countSentToday();
                const remaining = Math.max(0, cap - sentToday);
                return leadGmailService.runOutreachSweep(remaining);
            }
            case 'inbox': return leadGmailService.runInboxSweep();
            case 'report': return this.sendDailyReport();
        }
    }

    private schedule(label: string, initialDelayMs: number, intervalMs: number, fn: () => Promise<unknown>): ScheduleHandle {
        let interval: NodeJS.Timeout | null = null;
        const wrap = async () => {
            try {
                const result = await fn();
                logger.info(`[lead-cron:${label}] tick → ${JSON.stringify(result).slice(0, 200)}`);
            } catch (err: any) {
                logger.error(`[lead-cron:${label}] failed: ${err.message}`);
            }
        };
        const initial = setTimeout(() => {
            wrap();
            interval = setInterval(wrap, intervalMs);
        }, initialDelayMs);

        return {
            stop: () => {
                clearTimeout(initial);
                if (interval) clearInterval(interval);
            },
            runOnce: () => fn(),
        };
    }

    private async countSentToday(): Promise<number> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return prisma.leadEmail.count({
            where: {direction: 'OUTBOUND', sentAt: {gte: startOfDay}},
        });
    }

    private async sendDailyReport() {
        const since = new Date(Date.now() - 24 * HOUR);
        const [sent, replied] = await Promise.all([
            prisma.leadEmail.count({where: {direction: 'OUTBOUND', sentAt: {gte: since}}}),
            prisma.lead.count({where: {repliedAt: {gte: since}}}),
        ]);
        const bounced = await prisma.lead.count({where: {status: LeadStatus.BOUNCED, updatedAt: {gte: since}}});
        const unsubscribed = await prisma.lead.count({where: {status: LeadStatus.UNSUBSCRIBED, updatedAt: {gte: since}}});

        const byCountryRows = await prisma.lead.groupBy({
            by: ['country'],
            where: {contactedAt: {gte: since}},
            _count: {_all: true},
        });
        const byCountry: Record<string, number> = {};
        for (const r of byCountryRows) byCountry[r.country] = r._count._all;

        if (sent === 0 && replied === 0 && bounced === 0 && unsubscribed === 0) {
            return {skipped: true};
        }
        const msg = telegramService.formatOutreachDailyReport({sent, replied, bounced, unsubscribed, byCountry});
        await telegramService.sendMessage(msg);
        return {sent, replied, bounced, unsubscribed};
    }
}

export default new LeadCronService();
