/**
 * Lead Gmail — sends outreach emails via Gmail SMTP and reads inbound replies
 * via Gmail IMAP. Uses an App Password (no OAuth) for simplicity.
 *
 * Required env vars:
 *   GMAIL_USER          e.g. partnerships@reiz.com.ua (Gmail-routed mailbox)
 *   GMAIL_APP_PASSWORD  16-character app password from Google Account → Security
 *
 * Required npm packages (install once):
 *   npm install nodemailer imapflow
 *   npm install --save-dev @types/nodemailer
 *
 * If either env var is missing OR the npm packages aren't installed, the service
 * degrades to a no-op so the rest of the system stays functional.
 */
import {env} from '../config/env';
import {logger, prisma, LeadStatus, LeadEmailDirection, LeadEmailTemplate} from '../utils';
import telegramService from './telegram.service';
import leadAiService from './lead-ai.service';

// Optional packages — loaded at runtime so the project still builds when
// they're absent. Install with: npm install nodemailer imapflow @types/nodemailer
//
// Using eval('require') keeps the resolution dynamic so TypeScript doesn't
// try to type-check missing packages at build time.
function tryRequire(name: string): any | null {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, no-eval
        const dynamicRequire = eval('require');
        return dynamicRequire(name);
    } catch {
        return null;
    }
}

interface SendArgs {
    to: string;
    toName?: string | null;
    subject: string;
    body: string;
    inReplyTo?: string;     // Gmail Message-Id of previous email in thread
    references?: string[];
}

interface SendResult {
    messageId: string;
    threadHint?: string;
}

class LeadGmailService {
    private transporter: any | null = null;
    private nodemailer: any | null = null;
    private imapflow: any | null = null;

    isConfigured(): boolean {
        return !!(env.GMAIL_USER && env.GMAIL_APP_PASSWORD);
    }

    /**
     * Lazy-load nodemailer. Returns null if package not installed.
     */
    private getNodemailer() {
        if (this.nodemailer) return this.nodemailer;
        const mod = tryRequire('nodemailer');
        if (!mod) {
            logger.warn('[lead-gmail] nodemailer not installed — run "npm install nodemailer @types/nodemailer" in api/');
            return null;
        }
        this.nodemailer = mod;
        return mod;
    }

    private getImapflow() {
        if (this.imapflow) return this.imapflow;
        const mod = tryRequire('imapflow');
        if (!mod) {
            logger.warn('[lead-gmail] imapflow not installed — run "npm install imapflow" in api/');
            return null;
        }
        this.imapflow = mod;
        return mod;
    }

    private getTransporter() {
        if (this.transporter) return this.transporter;
        const nm = this.getNodemailer();
        if (!nm || !this.isConfigured()) return null;
        this.transporter = nm.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD},
        });
        return this.transporter;
    }

    /**
     * Daily outreach sweep — picks READY/CONTACTED/FU1/FU2 leads, generates email
     * (initial via Gemini, follow-ups via local templates), sends, logs everything.
     *
     * Rate-limited via OUTREACH_DAILY_CAP env var. Counts already-sent today
     * across both initial and follow-up emails.
     */
    async runOutreachSweep(maxToSendNow: number) {
        if (!this.isConfigured()) {
            logger.warn('[lead-gmail] Gmail not configured — skipping outreach sweep');
            return {sent: 0, failed: 0, configured: false};
        }
        if (maxToSendNow <= 0) return {sent: 0, failed: 0, configured: true};

        let sent = 0;
        let failed = 0;

        // 1) Initial emails to READY leads (priority — fresh, unwarmed)
        const readyLeads = await prisma.lead.findMany({
            where: {status: LeadStatus.READY, email: {not: null}},
            take: maxToSendNow,
            orderBy: {createdAt: 'asc'},
        });
        for (const lead of readyLeads) {
            try {
                const generated = await leadAiService.generateInitial({
                    companyName: lead.companyName,
                    country: lead.country,
                    city: lead.city,
                    ownerName: lead.ownerName,
                    website: lead.website,
                    websiteContent: lead.websiteContent,
                    language: lead.language,
                });
                const result = await this.sendOne({
                    to: lead.email!,
                    toName: lead.ownerName,
                    subject: generated.subject,
                    body: appendUnsubscribeFooter(generated.body, lead.id),
                });
                await prisma.leadEmail.create({
                    data: {
                        leadId: lead.id,
                        direction: LeadEmailDirection.OUTBOUND,
                        template: LeadEmailTemplate.INITIAL,
                        subject: generated.subject,
                        body: generated.body,
                        sentAt: new Date(),
                        gmailMsgId: result.messageId,
                    },
                });
                await prisma.lead.update({
                    where: {id: lead.id},
                    data: {status: LeadStatus.CONTACTED, contactedAt: new Date()},
                });
                sent++;
                if (sent >= maxToSendNow) return {sent, failed, configured: true};
                await sleep(2000); // pacing
            } catch (err: any) {
                failed++;
                logger.error(`[lead-gmail] initial send failed for lead ${lead.id}: ${err.message}`);
            }
        }

        // 2) Follow-ups
        const remaining = maxToSendNow - sent;
        if (remaining > 0) {
            const fuPlan = await this.findFollowUpsDue(remaining);
            for (const {lead, kind, nextStatus} of fuPlan) {
                try {
                    const generated = leadAiService.buildFollowUp(
                        {
                            companyName: lead.companyName,
                            country: lead.country,
                            city: lead.city,
                            ownerName: lead.ownerName,
                            website: lead.website,
                            websiteContent: lead.websiteContent,
                            language: lead.language,
                        },
                        kind,
                    );
                    const result = await this.sendOne({
                        to: lead.email!,
                        toName: lead.ownerName,
                        subject: generated.subject,
                        body: appendUnsubscribeFooter(generated.body, lead.id),
                    });
                    await prisma.leadEmail.create({
                        data: {
                            leadId: lead.id,
                            direction: LeadEmailDirection.OUTBOUND,
                            template: kind,
                            subject: generated.subject,
                            body: generated.body,
                            sentAt: new Date(),
                            gmailMsgId: result.messageId,
                        },
                    });
                    await prisma.lead.update({
                        where: {id: lead.id},
                        data: {
                            status: nextStatus,
                            lastFollowUpAt: new Date(),
                            followUpCount: {increment: 1},
                        },
                    });
                    sent++;
                    if (sent >= maxToSendNow) break;
                    await sleep(2000);
                } catch (err: any) {
                    failed++;
                    logger.error(`[lead-gmail] follow-up send failed for lead ${lead.id}: ${err.message}`);
                }
            }
        }

        return {sent, failed, configured: true};
    }

    /**
     * Send a single email to a specific lead **right now**, ignoring the daily cap.
     * Used for smoke-testing and manual one-off sends from the admin UI.
     * Only initial-template generation; follow-ups still come from the cron
     * pipeline so we don't double-up on a lead that already replied.
     */
    async sendOneNow(leadId: number) {
        if (!this.isConfigured()) {
            throw new Error('Gmail not configured (GMAIL_USER / GMAIL_APP_PASSWORD missing)');
        }
        const lead = await prisma.lead.findUnique({where: {id: leadId}});
        if (!lead) throw new Error(`Lead ${leadId} not found`);
        if (!lead.email) throw new Error(`Lead ${leadId} has no email`);

        const generated = await leadAiService.generateInitial({
            companyName: lead.companyName,
            country: lead.country,
            city: lead.city,
            ownerName: lead.ownerName,
            website: lead.website,
            websiteContent: lead.websiteContent,
            language: lead.language,
        });
        const result = await this.sendOne({
            to: lead.email,
            toName: lead.ownerName,
            subject: generated.subject,
            body: appendUnsubscribeFooter(generated.body, lead.id),
        });
        await prisma.leadEmail.create({
            data: {
                leadId: lead.id,
                direction: LeadEmailDirection.OUTBOUND,
                template: LeadEmailTemplate.INITIAL,
                subject: generated.subject,
                body: generated.body,
                sentAt: new Date(),
                gmailMsgId: result.messageId,
            },
        });
        // Don't move lead off CONTACTED if it was already past that — only set
        // CONTACTED for fresh leads (READY/NEW/ENRICHED).
        const advanceableStatuses = [LeadStatus.NEW, LeadStatus.ENRICHED, LeadStatus.READY];
        if (advanceableStatuses.includes(lead.status as never)) {
            await prisma.lead.update({
                where: {id: lead.id},
                data: {status: LeadStatus.CONTACTED, contactedAt: new Date()},
            });
        }
        return {sent: true, subject: generated.subject, messageId: result.messageId};
    }

    private async findFollowUpsDue(limit: number) {
        const now = new Date();
        const days = (n: number) => new Date(now.getTime() - n * 86_400_000);

        const fu1 = await prisma.lead.findMany({
            where: {
                status: LeadStatus.CONTACTED,
                contactedAt: {lt: days(3)},
                email: {not: null},
            },
            take: limit,
            orderBy: {contactedAt: 'asc'},
        });
        const fu2 = await prisma.lead.findMany({
            where: {
                status: LeadStatus.FOLLOWED_UP_1,
                lastFollowUpAt: {lt: days(4)},
                email: {not: null},
            },
            take: limit,
            orderBy: {lastFollowUpAt: 'asc'},
        });
        const breakup = await prisma.lead.findMany({
            where: {
                status: LeadStatus.FOLLOWED_UP_2,
                lastFollowUpAt: {lt: days(7)},
                email: {not: null},
            },
            take: limit,
            orderBy: {lastFollowUpAt: 'asc'},
        });

        const plan: {lead: typeof fu1[number]; kind: 'fu_3d' | 'fu_7d' | 'breakup_14d'; nextStatus: string}[] = [];
        for (const l of fu1) plan.push({lead: l, kind: 'fu_3d', nextStatus: LeadStatus.FOLLOWED_UP_1});
        for (const l of fu2) plan.push({lead: l, kind: 'fu_7d', nextStatus: LeadStatus.FOLLOWED_UP_2});
        for (const l of breakup) plan.push({lead: l, kind: 'breakup_14d', nextStatus: LeadStatus.BREAKUP_SENT});
        return plan.slice(0, limit);
    }

    private async sendOne(args: SendArgs): Promise<SendResult> {
        const tr = this.getTransporter();
        if (!tr) throw new Error('Gmail transporter not available (check env + npm install)');

        const fromName = 'Marian (REIZ)';
        const headers: Record<string, string> = {};
        if (args.inReplyTo) headers['In-Reply-To'] = args.inReplyTo;
        if (args.references?.length) headers['References'] = args.references.join(' ');

        const info = await tr.sendMail({
            from: `"${fromName}" <${env.GMAIL_USER}>`,
            to: args.toName ? `"${args.toName}" <${args.to}>` : args.to,
            subject: args.subject,
            text: args.body,
            headers,
        });
        return {messageId: info.messageId};
    }

    /**
     * Read inbox, find unprocessed messages, match to leads by sender email.
     * Marks lead as REPLIED, stores the inbound message, pings Telegram.
     */
    async runInboxSweep() {
        if (!this.isConfigured()) {
            return {processed: 0, replies: 0, configured: false};
        }
        const ifMod = this.getImapflow();
        if (!ifMod) return {processed: 0, replies: 0, configured: false};
        const ImapFlow = ifMod.ImapFlow;

        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD},
            logger: false,
        });

        let processed = 0;
        let replies = 0;
        try {
            await client.connect();
            const lock = await client.getMailboxLock('INBOX');
            try {
                // Look at last 200 messages — Gmail-side filtering would be cleaner but this works
                const range = await client.search({since: new Date(Date.now() - 14 * 86_400_000)}) ?? [];
                for (const seq of range.slice(-100)) {
                    const msg = await client.fetchOne(seq, {envelope: true, source: false, internalDate: true, uid: true, flags: true});
                    if (!msg) continue;

                    const messageId = msg.envelope?.messageId ?? null;
                    if (messageId) {
                        const dup = await prisma.leadEmail.findUnique({where: {gmailMsgId: messageId}});
                        if (dup) continue;
                    }

                    const fromAddr = msg.envelope?.from?.[0]?.address?.toLowerCase();
                    if (!fromAddr) continue;
                    const lead = await prisma.lead.findFirst({where: {email: fromAddr}});
                    if (!lead) continue;

                    // Parse body — re-fetch with source for the actual content
                    const full = await client.fetchOne(seq, {source: true});
                    const bodyText = extractTextFromRfc822(full?.source?.toString() ?? '');

                    await prisma.leadEmail.create({
                        data: {
                            leadId: lead.id,
                            direction: LeadEmailDirection.INBOUND,
                            template: null,
                            subject: msg.envelope?.subject ?? '(no subject)',
                            body: bodyText.slice(0, 20000),
                            receivedAt: msg.internalDate ?? new Date(),
                            gmailMsgId: messageId ?? `imap-${msg.uid}`,
                        },
                    });

                    // Detect unsubscribe / stop
                    if (/^(stop|unsubscribe|отпиши|отписать|не пиш)/i.test(bodyText.trim())) {
                        await prisma.lead.update({
                            where: {id: lead.id},
                            data: {status: LeadStatus.UNSUBSCRIBED},
                        });
                    } else if (lead.status !== LeadStatus.REPLIED && lead.status !== LeadStatus.CLIENT) {
                        await prisma.lead.update({
                            where: {id: lead.id},
                            data: {status: LeadStatus.REPLIED, repliedAt: new Date()},
                        });
                        replies++;

                        // Ping Telegram
                        const adminUrl = (env.OUTREACH_PUBLIC_URL ?? '') + `/admin/leads/${lead.id}`;
                        const tgMsg = telegramService.formatLeadReply({
                            leadId: lead.id,
                            companyName: lead.companyName,
                            country: lead.country,
                            city: lead.city,
                            ownerName: lead.ownerName,
                            subject: msg.envelope?.subject ?? '(no subject)',
                            bodyPreview: bodyText,
                            adminUrl,
                        });
                        await telegramService.sendMessage(tgMsg);
                    }
                    processed++;
                }
            } finally {
                lock.release();
            }
            await client.logout();
        } catch (err: any) {
            logger.error(`[lead-gmail] inbox sweep failed: ${err.message}`);
        }
        return {processed, replies, configured: true};
    }
}

function appendUnsubscribeFooter(body: string, leadId: number): string {
    const tag = `\n\n---\nReply STOP if not interested — won't email again. (lead#${leadId})`;
    return body + tag;
}

function extractTextFromRfc822(raw: string): string {
    if (!raw) return '';
    // Cheap-and-cheerful: pull the first text/plain section. For richer parsing use mailparser later.
    const lower = raw.toLowerCase();
    const idx = lower.indexOf('content-type: text/plain');
    if (idx >= 0) {
        const blockStart = raw.indexOf('\r\n\r\n', idx);
        if (blockStart >= 0) {
            const blockEnd = raw.indexOf('\r\n--', blockStart);
            const block = raw.slice(blockStart + 4, blockEnd > 0 ? blockEnd : undefined);
            return block.replace(/=\r\n/g, '').replace(/\r\n/g, '\n').trim();
        }
    }
    // Fallback — just strip headers (everything before first blank line) and html tags
    const bodyStart = raw.indexOf('\r\n\r\n');
    const body = bodyStart >= 0 ? raw.slice(bodyStart + 4) : raw;
    return body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export default new LeadGmailService();
