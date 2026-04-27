/**
 * Mail Service — IMAP+SMTP-backed inbox at /admin/mail.
 *
 * Speaks plain IMAP/SMTP so it works against any mailbox host (Hostinger,
 * Gmail, Zoho, custom). Credentials come from MAIL_* env vars; the first
 * sync auto-creates the MailAccount row.
 *
 * Sync strategy:
 *   - Open IMAP, list mailboxes, upsert MailFolder rows.
 *   - For each folder: fetch envelopes + flags for UIDs we don't yet have
 *     (UID > stored max). Store metadata; body fetched lazily on first read
 *     and then cached in MailMessage.bodyHtml/bodyText.
 *   - Existing rows refreshed with new flags (seen/flagged) every sync.
 *
 * HTML safety:
 *   - sanitize-html strips scripts/handlers/dangerous URIs server-side.
 *   - Frontend additionally renders inside a sandboxed iframe — defense in
 *     depth.
 */

import {ImapFlow, type FetchMessageObject} from 'imapflow';
import nodemailer, {type Transporter} from 'nodemailer';
import {simpleParser, type ParsedMail, type Attachment as ParsedAttachment} from 'mailparser';
import sanitizeHtml from 'sanitize-html';
import {Readable} from 'stream';
import type {MailAccount, MailMessage, Prisma} from '@prisma/client';

import {env} from '../config/env';
import {logger, prisma, NotFoundError, BadRequestError} from '../utils';

// ── Types ────────────────────────────────────────────────────────────────

interface AddressObj {
    name?: string | null;
    address: string;
}

export interface SendMailInput {
    to: AddressObj[];
    cc?: AddressObj[];
    bcc?: AddressObj[];
    subject: string;
    text?: string;
    html?: string;
    inReplyToMessageId?: number; // MailMessage.id we're replying to
    attachments?: Array<{
        filename: string;
        path: string; // absolute path on disk (multer upload)
        contentType?: string;
    }>;
}

interface ListMessagesParams {
    accountId: number;
    folderPath?: string;
    folderId?: number;
    page?: number;
    limit?: number;
    search?: string;
    filter?: 'all' | 'unread' | 'flagged' | 'attachments';
}

// ── Config helpers ───────────────────────────────────────────────────────

const SANITIZE_OPTS: sanitizeHtml.IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img', 'h1', 'h2', 'style',
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['style', 'class', 'id', 'align', 'bgcolor', 'color'],
        img: ['src', 'alt', 'title', 'width', 'height', 'style'],
        a: ['href', 'name', 'target', 'rel', 'title'],
        table: ['border', 'cellpadding', 'cellspacing', 'width', 'height', 'align', 'bgcolor', 'style'],
        td: ['colspan', 'rowspan', 'width', 'height', 'align', 'valign', 'bgcolor', 'style'],
        th: ['colspan', 'rowspan', 'width', 'height', 'align', 'valign', 'bgcolor', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'cid', 'data'],
    allowedSchemesByTag: {
        img: ['http', 'https', 'cid', 'data'],
    },
    transformTags: {
        // Force all links to open in new tab + drop referrer
        a: (tagName, attribs) => ({
            tagName: 'a',
            attribs: {
                ...attribs,
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
            },
        }),
    },
};

function sanitizeMailHtml(html: string): string {
    if (!html) return '';
    return sanitizeHtml(html, SANITIZE_OPTS);
}

function deriveSnippet(text: string | undefined, html: string | undefined): string {
    const src = (text ?? '').trim() || (html ? html.replace(/<[^>]+>/g, ' ') : '');
    return src.replace(/\s+/g, ' ').slice(0, 240);
}

function classifySpecialUse(box: {path: string; specialUse?: string; flags?: Set<string>}): string | null {
    if (box.specialUse) return box.specialUse;
    const path = box.path.toLowerCase();
    if (path === 'inbox') return '\\Inbox';
    if (/sent/.test(path)) return '\\Sent';
    if (/draft/.test(path)) return '\\Drafts';
    if (/trash|deleted/.test(path)) return '\\Trash';
    if (/junk|spam/.test(path)) return '\\Junk';
    if (/archive/.test(path)) return '\\Archive';
    return null;
}

function parseAddressList(input: ParsedMail['from'] | ParsedMail['to'] | ParsedMail['cc']): AddressObj[] {
    if (!input) return [];
    const arr = Array.isArray(input) ? input : [input];
    const out: AddressObj[] = [];
    for (const a of arr) {
        if (!a) continue;
        if ('value' in a && Array.isArray(a.value)) {
            for (const v of a.value) {
                if (v.address) out.push({name: v.name || null, address: v.address});
            }
        }
    }
    return out;
}

// ── IMAP client factory ──────────────────────────────────────────────────

function buildImapClient(account: MailAccount, password: string): ImapFlow {
    return new ImapFlow({
        host: account.imapHost,
        port: account.imapPort,
        secure: account.imapSecure,
        auth: {user: account.username, pass: password},
        logger: false,
    });
}

function buildSmtpTransport(account: MailAccount, password: string): Transporter {
    return nodemailer.createTransport({
        host: account.smtpHost,
        port: account.smtpPort,
        secure: account.smtpSecure,
        auth: {user: account.username, pass: password},
    });
}

// ── Service ──────────────────────────────────────────────────────────────

class MailService {
    /** Returns true when MAIL_USER + MAIL_PASSWORD are set in env. */
    isConfigured(): boolean {
        return !!(env.MAIL_USER && env.MAIL_PASSWORD);
    }

    /** Resolves the password for an account from env. Throws if missing. */
    private getPasswordFor(account: MailAccount): string {
        // Currently single-account: env MAIL_PASSWORD pairs with MAIL_USER.
        // Multi-account v2 will store encrypted secrets per account.
        if (account.email !== env.MAIL_USER) {
            throw new BadRequestError(
                `No credentials for ${account.email} (only ${env.MAIL_USER} configured)`,
            );
        }
        if (!env.MAIL_PASSWORD) throw new BadRequestError('MAIL_PASSWORD missing');
        return env.MAIL_PASSWORD;
    }

    /**
     * Returns the active account, auto-bootstrapping from env on first call.
     * Returns null when MAIL_* not configured — callers should respond 503.
     */
    async getOrCreateActiveAccount(): Promise<MailAccount | null> {
        if (!this.isConfigured()) return null;
        const email = env.MAIL_USER!;
        let account = await prisma.mailAccount.findUnique({where: {email}});
        if (!account) {
            account = await prisma.mailAccount.create({
                data: {
                    email,
                    username: email,
                    displayName: env.MAIL_DISPLAY_NAME ?? null,
                    imapHost: env.MAIL_IMAP_HOST,
                    imapPort: env.MAIL_IMAP_PORT,
                    smtpHost: env.MAIL_SMTP_HOST,
                    smtpPort: env.MAIL_SMTP_PORT,
                    isActive: true,
                },
            });
            logger.info(`[mail] bootstrapped account ${email}`);
        }
        return account;
    }

    async listAccounts() {
        const accounts = await prisma.mailAccount.findMany({
            orderBy: {createdAt: 'asc'},
            select: {
                id: true, email: true, displayName: true, isActive: true,
                lastSyncAt: true, signature: true, createdAt: true,
            },
        });
        return accounts;
    }

    /**
     * Full sync: refresh folder list + new messages in each folder.
     * Cheap-and-cheerful — runs synchronously per folder. Good enough for
     * one mailbox; for many accounts queue per-account syncs.
     */
    async sync(accountId?: number): Promise<{folders: number; newMessages: number}> {
        const account = accountId
            ? await prisma.mailAccount.findUnique({where: {id: accountId}})
            : await this.getOrCreateActiveAccount();
        if (!account) throw new BadRequestError('Mail not configured');

        const password = this.getPasswordFor(account);
        const client = buildImapClient(account, password);
        let foldersTouched = 0;
        let newMessages = 0;

        try {
            await client.connect();
            const list = await client.list();
            for (const box of list) {
                if (box.flags?.has('\\Noselect')) continue;
                const specialUse = classifySpecialUse(box);
                const folder = await prisma.mailFolder.upsert({
                    where: {accountId_path: {accountId: account.id, path: box.path}},
                    update: {
                        name: box.name ?? box.path,
                        specialUse,
                    },
                    create: {
                        accountId: account.id,
                        path: box.path,
                        name: box.name ?? box.path,
                        specialUse,
                    },
                });
                foldersTouched++;

                // Skip Drafts (we manage drafts in DB) and All Mail (Gmail dup)
                if (specialUse === '\\Drafts' || /\[Gmail\]\/All Mail/i.test(box.path)) continue;

                const added = await this.syncFolder(client, account, folder.id, box.path);
                newMessages += added;
            }

            await prisma.mailAccount.update({
                where: {id: account.id},
                data: {lastSyncAt: new Date()},
            });
        } catch (err: any) {
            logger.error(`[mail] sync failed: ${err.message}`);
            throw err;
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }

        return {folders: foldersTouched, newMessages};
    }

    private async syncFolder(
        client: ImapFlow,
        account: MailAccount,
        folderId: number,
        path: string,
    ): Promise<number> {
        const lock = await client.getMailboxLock(path);
        let added = 0;
        try {
            const status = await client.status(path, {messages: true, unseen: true, uidNext: true, uidValidity: true});

            // Find the highest UID we already have stored
            const lastStored = await prisma.mailMessage.findFirst({
                where: {accountId: account.id, folderId},
                orderBy: {uid: 'desc'},
                select: {uid: true},
            });
            const lastUid = lastStored?.uid ?? 0;

            // Refresh flags on a sliding window of recent messages (last 200 stored)
            const recent = await prisma.mailMessage.findMany({
                where: {accountId: account.id, folderId},
                orderBy: {uid: 'desc'},
                take: 200,
                select: {uid: true, isSeen: true, isFlagged: true},
            });
            if (recent.length > 0) {
                const uidList = recent.map((r) => r.uid).join(',');
                try {
                    for await (const msg of client.fetch({uid: uidList}, {flags: true, uid: true}, {uid: true})) {
                        const flags = msg.flags ? Array.from(msg.flags) : [];
                        await prisma.mailMessage.updateMany({
                            where: {accountId: account.id, folderId, uid: Number(msg.uid)},
                            data: {
                                isSeen: flags.includes('\\Seen'),
                                isFlagged: flags.includes('\\Flagged'),
                                isAnswered: flags.includes('\\Answered'),
                                flags: flags as Prisma.InputJsonValue,
                            },
                        });
                    }
                } catch (err: any) {
                    logger.warn(`[mail] flag refresh failed for ${path}: ${err.message}`);
                }
            }

            // Fetch new messages by UID
            const fetchRange = `${lastUid + 1}:*`;
            try {
                for await (const msg of client.fetch(
                    {uid: fetchRange},
                    {envelope: true, flags: true, uid: true, internalDate: true, size: true, bodyStructure: true},
                    {uid: true},
                )) {
                    if (!msg.uid || msg.uid <= lastUid) continue;

                    const env_ = msg.envelope;
                    if (!env_) continue;

                    const fromAddr = env_.from?.[0]?.address?.toLowerCase() ?? 'unknown@unknown';
                    const fromName = env_.from?.[0]?.name ?? null;
                    const flags = msg.flags ? Array.from(msg.flags) : [];

                    // Detect attachments cheaply from bodyStructure
                    const hasAttachments = this.bodyStructureHasAttachments(msg.bodyStructure);

                    try {
                        await prisma.mailMessage.create({
                            data: {
                                accountId: account.id,
                                folderId,
                                uid: Number(msg.uid),
                                messageId: env_.messageId ?? null,
                                inReplyTo: env_.inReplyTo ?? null,
                                references: null,
                                threadKey: env_.inReplyTo ?? env_.messageId ?? null,
                                fromName,
                                fromAddr,
                                toAddrs: (env_.to ?? []).map((a) => ({name: a.name ?? null, address: a.address})) as Prisma.InputJsonValue,
                                ccAddrs: (env_.cc ?? []).map((a) => ({name: a.name ?? null, address: a.address})) as Prisma.InputJsonValue,
                                bccAddrs: (env_.bcc ?? []).map((a) => ({name: a.name ?? null, address: a.address})) as Prisma.InputJsonValue,
                                replyTo: (env_.replyTo ?? []).map((a) => ({name: a.name ?? null, address: a.address})) as Prisma.InputJsonValue,
                                subject: env_.subject ?? null,
                                date: env_.date ?? msg.internalDate ?? new Date(),
                                hasAttachments,
                                size: msg.size ?? null,
                                isSeen: flags.includes('\\Seen'),
                                isFlagged: flags.includes('\\Flagged'),
                                isAnswered: flags.includes('\\Answered'),
                                flags: flags as Prisma.InputJsonValue,
                            },
                        });
                        added++;
                    } catch (err: any) {
                        // Likely UID dup — log but keep going
                        if (!/Unique constraint/i.test(err.message)) {
                            logger.warn(`[mail] failed to store uid ${msg.uid}: ${err.message}`);
                        }
                    }
                }
            } catch (err: any) {
                logger.warn(`[mail] new message fetch failed for ${path}: ${err.message}`);
            }

            // Update folder counts
            await prisma.mailFolder.update({
                where: {id: folderId},
                data: {
                    totalCount: status.messages ?? 0,
                    unreadCount: status.unseen ?? 0,
                    uidValidity: status.uidValidity != null ? String(status.uidValidity) : null,
                    uidNext: status.uidNext != null ? String(status.uidNext) : null,
                    lastSyncAt: new Date(),
                },
            });
        } finally {
            lock.release();
        }
        return added;
    }

    private bodyStructureHasAttachments(bs: FetchMessageObject['bodyStructure']): boolean {
        if (!bs) return false;
        const walk = (node: any): boolean => {
            if (!node) return false;
            if (node.disposition === 'attachment') return true;
            if (Array.isArray(node.childNodes)) {
                return node.childNodes.some((c: any) => walk(c));
            }
            return false;
        };
        return walk(bs);
    }

    // ── List & query ────────────────────────────────────────────────────

    async listFolders(accountId: number) {
        return prisma.mailFolder.findMany({
            where: {accountId},
            orderBy: [{specialUse: 'asc'}, {name: 'asc'}],
        });
    }

    async listMessages(params: ListMessagesParams) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, Math.max(1, params.limit ?? 30));
        const skip = (page - 1) * limit;

        // Resolve folder
        let folderId = params.folderId;
        if (!folderId) {
            const path = params.folderPath ?? 'INBOX';
            const folder = await prisma.mailFolder.findUnique({
                where: {accountId_path: {accountId: params.accountId, path}},
            });
            if (!folder) {
                return {items: [], total: 0, page, limit, folder: null};
            }
            folderId = folder.id;
        }

        const where: Prisma.MailMessageWhereInput = {
            accountId: params.accountId,
            folderId,
        };

        if (params.filter === 'unread') where.isSeen = false;
        if (params.filter === 'flagged') where.isFlagged = true;
        if (params.filter === 'attachments') where.hasAttachments = true;

        if (params.search?.trim()) {
            const q = params.search.trim();
            where.OR = [
                {subject: {contains: q, mode: 'insensitive'}},
                {fromAddr: {contains: q, mode: 'insensitive'}},
                {fromName: {contains: q, mode: 'insensitive'}},
                {snippet: {contains: q, mode: 'insensitive'}},
            ];
        }

        const [items, total, folder] = await Promise.all([
            prisma.mailMessage.findMany({
                where,
                orderBy: {date: 'desc'},
                skip,
                take: limit,
                select: {
                    id: true, uid: true, messageId: true,
                    fromName: true, fromAddr: true, toAddrs: true,
                    subject: true, snippet: true, date: true,
                    hasAttachments: true, size: true,
                    isSeen: true, isFlagged: true, isAnswered: true,
                },
            }),
            prisma.mailMessage.count({where}),
            prisma.mailFolder.findUnique({where: {id: folderId}}),
        ]);

        return {items, total, page, limit, folder};
    }

    /**
     * Returns full message body. If body not yet cached, fetches from IMAP,
     * parses with mailparser, sanitizes HTML, and caches in DB.
     */
    async getMessage(messageId: number): Promise<MailMessage & {attachments: Array<{id: number; filename: string | null; contentType: string | null; size: number | null}>}> {
        const msg = await prisma.mailMessage.findUnique({
            where: {id: messageId},
            include: {attachments: {select: {id: true, filename: true, contentType: true, size: true}}},
        });
        if (!msg) throw new NotFoundError('Message not found');

        // Body already cached?
        if (msg.bodyText !== null || msg.bodyHtml !== null) {
            return msg;
        }

        // Lazy-fetch body
        const account = await prisma.mailAccount.findUnique({where: {id: msg.accountId}});
        if (!account) throw new NotFoundError('Account not found');
        const folder = await prisma.mailFolder.findUnique({where: {id: msg.folderId}});
        if (!folder) throw new NotFoundError('Folder not found');

        const password = this.getPasswordFor(account);
        const client = buildImapClient(account, password);

        try {
            await client.connect();
            const lock = await client.getMailboxLock(folder.path);
            try {
                const fetched = await client.fetchOne(String(msg.uid), {source: true, flags: true}, {uid: true});
                if (fetched === false || !fetched.source) throw new NotFoundError('Source not available');
                const parsed = await simpleParser(fetched.source);

                const text = parsed.text ?? null;
                const html = parsed.html ? sanitizeMailHtml(parsed.html as string) : null;
                const snippet = deriveSnippet(text || undefined, html || undefined);

                // Persist attachments metadata + body
                const attachmentRows: Array<{filename: string | null; contentType: string | null; size: number | null; contentId: string | null}> = [];
                for (const att of parsed.attachments ?? []) {
                    attachmentRows.push({
                        filename: att.filename ?? null,
                        contentType: att.contentType ?? null,
                        size: att.size ?? null,
                        contentId: att.contentId ?? null,
                    });
                }

                const flags = fetched.flags ? Array.from(fetched.flags) : [];

                const updated = await prisma.mailMessage.update({
                    where: {id: msg.id},
                    data: {
                        bodyText: text,
                        bodyHtml: html,
                        snippet,
                        isSeen: flags.includes('\\Seen'),
                        flags: flags as Prisma.InputJsonValue,
                        attachments: attachmentRows.length > 0 ? {
                            create: attachmentRows.map((a) => ({
                                filename: a.filename,
                                contentType: a.contentType,
                                size: a.size,
                                contentId: a.contentId,
                            })),
                        } : undefined,
                    },
                    include: {attachments: {select: {id: true, filename: true, contentType: true, size: true}}},
                });
                return updated;
            } finally {
                lock.release();
            }
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }
    }

    /**
     * Fetches a single attachment binary from IMAP. Not cached on disk —
     * streams through. For previews we re-fetch the source and pull by
     * filename match.
     */
    async getAttachment(messageId: number, attachmentId: number): Promise<{filename: string; contentType: string; content: Buffer}> {
        const att = await prisma.mailAttachment.findUnique({where: {id: attachmentId}});
        if (!att || att.messageId !== messageId) throw new NotFoundError('Attachment not found');

        const msg = await prisma.mailMessage.findUnique({where: {id: messageId}});
        if (!msg) throw new NotFoundError('Message not found');
        const account = await prisma.mailAccount.findUnique({where: {id: msg.accountId}});
        if (!account) throw new NotFoundError('Account not found');
        const folder = await prisma.mailFolder.findUnique({where: {id: msg.folderId}});
        if (!folder) throw new NotFoundError('Folder not found');

        const password = this.getPasswordFor(account);
        const client = buildImapClient(account, password);

        try {
            await client.connect();
            const lock = await client.getMailboxLock(folder.path);
            try {
                const fetched = await client.fetchOne(String(msg.uid), {source: true}, {uid: true});
                if (fetched === false || !fetched.source) throw new NotFoundError('Source unavailable');
                const parsed = await simpleParser(fetched.source);
                const match: ParsedAttachment | undefined = (parsed.attachments ?? []).find(
                    (a) => (att.filename && a.filename === att.filename) || (att.contentId && a.contentId === att.contentId),
                );
                if (!match) throw new NotFoundError('Attachment not in source');
                return {
                    filename: match.filename ?? att.filename ?? 'attachment',
                    contentType: match.contentType ?? att.contentType ?? 'application/octet-stream',
                    content: match.content,
                };
            } finally {
                lock.release();
            }
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }
    }

    // ── Mutations: flags + delete ────────────────────────────────────────

    async setSeen(messageId: number, seen: boolean) {
        const msg = await prisma.mailMessage.findUnique({where: {id: messageId}});
        if (!msg) throw new NotFoundError('Message not found');
        await this.modifyFlags(msg, seen ? {add: ['\\Seen']} : {remove: ['\\Seen']});
        return prisma.mailMessage.update({where: {id: messageId}, data: {isSeen: seen}});
    }

    async setFlagged(messageId: number, flagged: boolean) {
        const msg = await prisma.mailMessage.findUnique({where: {id: messageId}});
        if (!msg) throw new NotFoundError('Message not found');
        await this.modifyFlags(msg, flagged ? {add: ['\\Flagged']} : {remove: ['\\Flagged']});
        return prisma.mailMessage.update({where: {id: messageId}, data: {isFlagged: flagged}});
    }

    private async modifyFlags(msg: MailMessage, change: {add?: string[]; remove?: string[]}) {
        const account = await prisma.mailAccount.findUnique({where: {id: msg.accountId}});
        if (!account) return;
        const folder = await prisma.mailFolder.findUnique({where: {id: msg.folderId}});
        if (!folder) return;
        const password = this.getPasswordFor(account);
        const client = buildImapClient(account, password);
        try {
            await client.connect();
            const lock = await client.getMailboxLock(folder.path);
            try {
                if (change.add?.length) {
                    await client.messageFlagsAdd({uid: String(msg.uid)}, change.add, {uid: true});
                }
                if (change.remove?.length) {
                    await client.messageFlagsRemove({uid: String(msg.uid)}, change.remove, {uid: true});
                }
            } finally {
                lock.release();
            }
        } catch (err: any) {
            logger.warn(`[mail] flag modify failed for msg ${msg.id}: ${err.message}`);
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }
    }

    async deleteMessage(messageId: number) {
        const msg = await prisma.mailMessage.findUnique({where: {id: messageId}});
        if (!msg) throw new NotFoundError('Message not found');
        const account = await prisma.mailAccount.findUnique({where: {id: msg.accountId}});
        const folder = await prisma.mailFolder.findUnique({where: {id: msg.folderId}});
        if (!account || !folder) throw new NotFoundError('Mail context missing');

        const password = this.getPasswordFor(account);
        const client = buildImapClient(account, password);
        try {
            await client.connect();
            // Find a Trash folder to move into (if not already in trash)
            const trash = await prisma.mailFolder.findFirst({
                where: {accountId: account.id, specialUse: '\\Trash'},
            });
            const lock = await client.getMailboxLock(folder.path);
            try {
                if (trash && trash.id !== folder.id) {
                    await client.messageMove({uid: String(msg.uid)}, trash.path, {uid: true});
                } else {
                    await client.messageDelete({uid: String(msg.uid)}, {uid: true});
                }
            } finally {
                lock.release();
            }
        } catch (err: any) {
            logger.warn(`[mail] delete failed for msg ${messageId}: ${err.message}`);
            throw err;
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }

        await prisma.mailMessage.delete({where: {id: messageId}});
        return {ok: true};
    }

    // ── Compose / Send ───────────────────────────────────────────────────

    async send(input: SendMailInput, accountId?: number): Promise<{messageId: string; sentMessageId: number | null}> {
        const account = accountId
            ? await prisma.mailAccount.findUnique({where: {id: accountId}})
            : await this.getOrCreateActiveAccount();
        if (!account) throw new BadRequestError('Mail not configured');

        const password = this.getPasswordFor(account);
        const transporter = buildSmtpTransport(account, password);

        // Build threading headers from in-reply-to message
        const headers: Record<string, string> = {};
        let parentMessageRfcId: string | null = null;
        let parentReferences: string | null = null;
        if (input.inReplyToMessageId) {
            const parent = await prisma.mailMessage.findUnique({where: {id: input.inReplyToMessageId}});
            if (parent?.messageId) {
                parentMessageRfcId = parent.messageId;
                parentReferences = parent.references ?? null;
                headers['In-Reply-To'] = parent.messageId;
                const refs = parent.references
                    ? `${parent.references} ${parent.messageId}`
                    : parent.messageId;
                headers['References'] = refs;
            }
        }

        const fromName = account.displayName || account.email;
        const info = await transporter.sendMail({
            from: `"${fromName}" <${account.email}>`,
            to: input.to.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', '),
            cc: input.cc?.length ? input.cc.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', ') : undefined,
            bcc: input.bcc?.length ? input.bcc.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', ') : undefined,
            subject: input.subject,
            text: input.text,
            html: input.html,
            headers,
            attachments: input.attachments?.map((a) => ({
                filename: a.filename,
                path: a.path,
                contentType: a.contentType,
            })),
        });

        // Mark parent as answered
        if (input.inReplyToMessageId) {
            await prisma.mailMessage.update({
                where: {id: input.inReplyToMessageId},
                data: {isAnswered: true},
            }).catch(() => undefined);
        }

        // APPEND to Sent folder so it shows up everywhere
        let sentDbId: number | null = null;
        try {
            sentDbId = await this.appendToSent(account, password, {
                from: `"${fromName}" <${account.email}>`,
                to: input.to,
                cc: input.cc,
                bcc: input.bcc,
                subject: input.subject,
                text: input.text,
                html: input.html,
                inReplyTo: parentMessageRfcId,
                references: parentReferences && parentMessageRfcId
                    ? `${parentReferences} ${parentMessageRfcId}`
                    : parentMessageRfcId,
                rfcMessageId: info.messageId,
            });
        } catch (err: any) {
            logger.warn(`[mail] Sent append failed: ${err.message}`);
        }

        return {messageId: info.messageId, sentMessageId: sentDbId};
    }

    /**
     * Append a sent copy to the IMAP Sent folder (so it shows up in webmail
     * and other clients) AND mirror it in our DB.
     */
    private async appendToSent(
        account: MailAccount,
        password: string,
        m: {
            from: string;
            to: AddressObj[];
            cc?: AddressObj[];
            bcc?: AddressObj[];
            subject: string;
            text?: string;
            html?: string;
            inReplyTo?: string | null;
            references?: string | null;
            rfcMessageId?: string;
        },
    ): Promise<number | null> {
        const sentFolder = await prisma.mailFolder.findFirst({
            where: {accountId: account.id, specialUse: '\\Sent'},
        });
        if (!sentFolder) return null;

        // Build a raw RFC 822 message via nodemailer's compose API
        const composer = nodemailer.createTransport({jsonTransport: true});
        const compiled: any = await composer.sendMail({
            from: m.from,
            to: m.to.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', '),
            cc: m.cc?.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', '),
            bcc: m.bcc?.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', '),
            subject: m.subject,
            text: m.text,
            html: m.html,
            messageId: m.rfcMessageId,
            inReplyTo: m.inReplyTo ?? undefined,
            references: m.references ?? undefined,
        });
        const raw = compiled.message as string;

        const client = buildImapClient(account, password);
        let createdId: number | null = null;
        try {
            await client.connect();
            const appendRes = await client.append(sentFolder.path, raw, ['\\Seen']);
            const uid = appendRes !== false && appendRes?.uid != null ? Number(appendRes.uid) : null;
            if (uid != null) {
                const created = await prisma.mailMessage.create({
                    data: {
                        accountId: account.id,
                        folderId: sentFolder.id,
                        uid,
                        messageId: m.rfcMessageId ?? null,
                        inReplyTo: m.inReplyTo ?? null,
                        references: m.references ?? null,
                        threadKey: m.inReplyTo ?? m.rfcMessageId ?? null,
                        fromName: account.displayName ?? null,
                        fromAddr: account.email,
                        toAddrs: m.to as unknown as Prisma.InputJsonValue,
                        ccAddrs: (m.cc ?? []) as unknown as Prisma.InputJsonValue,
                        bccAddrs: (m.bcc ?? []) as unknown as Prisma.InputJsonValue,
                        subject: m.subject,
                        date: new Date(),
                        bodyText: m.text ?? null,
                        bodyHtml: m.html ? sanitizeMailHtml(m.html) : null,
                        snippet: deriveSnippet(m.text, m.html),
                        hasAttachments: false, // attachments tracking on Sent comes later
                        isSeen: true,
                        isFlagged: false,
                        isAnswered: false,
                    },
                });
                createdId = created.id;
            }
        } finally {
            try { await client.logout(); } catch { /* ignore */ }
        }
        return createdId;
    }

    // ── Drafts (DB-only) ─────────────────────────────────────────────────

    async saveDraft(input: {
        accountId: number;
        id?: number;
        toAddrs?: AddressObj[];
        ccAddrs?: AddressObj[];
        bccAddrs?: AddressObj[];
        subject?: string;
        bodyHtml?: string;
        bodyText?: string;
        inReplyToId?: number;
    }) {
        const data = {
            accountId: input.accountId,
            toAddrs: (input.toAddrs ?? []) as unknown as Prisma.InputJsonValue,
            ccAddrs: input.ccAddrs ? (input.ccAddrs as unknown as Prisma.InputJsonValue) : undefined,
            bccAddrs: input.bccAddrs ? (input.bccAddrs as unknown as Prisma.InputJsonValue) : undefined,
            subject: input.subject ?? null,
            bodyHtml: input.bodyHtml ?? null,
            bodyText: input.bodyText ?? null,
            inReplyToId: input.inReplyToId ?? null,
        };
        if (input.id) {
            return prisma.mailDraft.update({where: {id: input.id}, data});
        }
        return prisma.mailDraft.create({data});
    }

    async listDrafts(accountId: number) {
        return prisma.mailDraft.findMany({
            where: {accountId},
            orderBy: {updatedAt: 'desc'},
        });
    }

    async deleteDraft(id: number) {
        await prisma.mailDraft.delete({where: {id}});
        return {ok: true};
    }

    // ── Contacts autocomplete (from previous senders/recipients) ─────────

    async searchContacts(accountId: number, query: string, limit = 10) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        const rows = await prisma.mailMessage.findMany({
            where: {
                accountId,
                OR: [
                    {fromAddr: {contains: q, mode: 'insensitive'}},
                    {fromName: {contains: q, mode: 'insensitive'}},
                ],
            },
            select: {fromAddr: true, fromName: true},
            distinct: ['fromAddr'],
            orderBy: {date: 'desc'},
            take: limit,
        });
        return rows.map((r) => ({address: r.fromAddr, name: r.fromName}));
    }
}

export default new MailService();

// (Readable used implicitly by IMAP source streams)
export {Readable};
