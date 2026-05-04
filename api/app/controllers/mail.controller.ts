import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {z} from 'zod';
import mailService from '../services/mail.service';
import {parseId, parseOptionalId, BadRequestError} from '../utils';
import {validate} from '../validators';
import {logAudit} from '../middleware';

// ── Validators ─────────────────────────────────────────────────────────

const addressSchema = z.object({
    name: z.string().nullable().optional(),
    address: z.string().email(),
});

const sendSchema = z.object({
    to: z.array(addressSchema).min(1, 'At least one recipient required'),
    cc: z.array(addressSchema).optional(),
    bcc: z.array(addressSchema).optional(),
    subject: z.string().min(1).max(998),
    text: z.string().optional(),
    html: z.string().optional(),
    inReplyToMessageId: z.number().int().positive().optional(),
});

const draftSchema = z.object({
    id: z.number().int().positive().optional(),
    toAddrs: z.array(addressSchema).optional(),
    ccAddrs: z.array(addressSchema).optional(),
    bccAddrs: z.array(addressSchema).optional(),
    subject: z.string().optional(),
    bodyHtml: z.string().optional(),
    bodyText: z.string().optional(),
    inReplyToId: z.number().int().positive().optional(),
});

// ── Multer for compose attachments (memory + later moved to /uploads/mail) ─

const MAX_ATTACHMENTS = 10;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25 MB

const mailUploadsDir = path.resolve('./uploads/mail-outgoing');
if (!fs.existsSync(mailUploadsDir)) fs.mkdirSync(mailUploadsDir, {recursive: true});

const sanitizeName = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, mailUploadsDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeName(file.originalname)}`),
});

export const mailAttachmentsUpload = multer({
    storage,
    limits: {fileSize: MAX_TOTAL_SIZE, files: MAX_ATTACHMENTS},
}).array('attachments', MAX_ATTACHMENTS);

class MailController {
    async accounts(_req: Request, res: Response) {
        const accounts = await mailService.listAccounts();
        // Bootstrap on first call if empty
        if (accounts.length === 0 && mailService.isConfigured()) {
            await mailService.getOrCreateActiveAccount();
            const fresh = await mailService.listAccounts();
            return res.status(StatusCodes.OK).json({accounts: fresh, configured: true});
        }
        res.status(StatusCodes.OK).json({accounts, configured: mailService.isConfigured()});
    }

    async sync(req: Request, res: Response) {
        const accountId = parseOptionalId(req.body?.accountId, 'accountId');
        const result = await mailService.sync(accountId);
        res.status(StatusCodes.OK).json(result);
    }

    async folders(req: Request, res: Response) {
        const accountId = parseId(req.query.accountId as string);
        const folders = await mailService.listFolders(accountId);
        res.status(StatusCodes.OK).json({folders});
    }

    async unreadCount(_req: Request, res: Response) {
        const count = await mailService.getUnreadInboxCount();
        res.status(StatusCodes.OK).json({count});
    }

    async messages(req: Request, res: Response) {
        const accountId = parseId(req.query.accountId as string);
        const folderPath = (req.query.folder as string) ?? 'INBOX';
        const folderId = parseOptionalId(req.query.folderId as string, 'folderId');
        const page = parseOptionalId(req.query.page as string, 'page');
        const limit = parseOptionalId(req.query.limit as string, 'limit');
        const search = req.query.search as string | undefined;
        const filterRaw = (req.query.filter as string) ?? 'all';
        const filter = ['all', 'unread', 'flagged', 'attachments'].includes(filterRaw)
            ? (filterRaw as 'all' | 'unread' | 'flagged' | 'attachments')
            : 'all';

        const result = await mailService.listMessages({
            accountId, folderPath, folderId, page, limit, search, filter,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const msg = await mailService.getMessage(id);
        // Auto-mark seen on open
        if (!msg.isSeen) {
            await mailService.setSeen(id, true).catch(() => undefined);
        }
        res.status(StatusCodes.OK).json({message: msg});
    }

    async getAttachment(req: Request, res: Response) {
        const messageId = parseId(req.params.id);
        const attachmentId = parseId(req.params.aid);
        const att = await mailService.getAttachment(messageId, attachmentId);
        res.setHeader('Content-Type', att.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(att.filename)}"`);
        res.send(att.content);
    }

    async patch(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const body = req.body ?? {};
        if (typeof body.isSeen === 'boolean') {
            const msg = await mailService.setSeen(id, body.isSeen);
            return res.status(StatusCodes.OK).json({message: msg});
        }
        if (typeof body.isFlagged === 'boolean') {
            const msg = await mailService.setFlagged(id, body.isFlagged);
            return res.status(StatusCodes.OK).json({message: msg});
        }
        throw new BadRequestError('Nothing to update');
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const before = await mailService.getMessage(id).catch(() => null);
        const result = await mailService.deleteMessage(id);
        await logAudit({
            actorId: res.locals.user?.id,
            entityType: 'mail_message',
            entityId: id,
            action: 'delete',
            before: before ? {subject: before.subject, fromAddr: before.fromAddr, date: before.date} : null,
            req,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async deleteBulk(req: Request, res: Response) {
        const raw = req.body?.ids;
        if (!Array.isArray(raw) || raw.length === 0) {
            throw new BadRequestError('Body must include non-empty `ids` array');
        }
        const ids = raw.map((v) => Number(v)).filter((n) => Number.isInteger(n) && n > 0);
        if (ids.length === 0) {
            throw new BadRequestError('No valid message ids provided');
        }
        const result = await mailService.deleteMessages(ids);
        await logAudit({
            actorId: res.locals.user?.id,
            entityType: 'mail_message',
            entityId: ids[0],
            action: 'delete_bulk',
            after: {requested: ids.length, succeeded: result.succeeded.length, failed: result.failed.length},
            req,
        });
        // 200 even if some failed — UI uses succeeded/failed lists to react.
        res.status(StatusCodes.OK).json(result);
    }

    async send(req: Request, res: Response) {
        // Body fields come as strings via multipart/form-data; parse JSON fields
        const raw = req.body ?? {};
        const parsed = {
            to: raw.to ? JSON.parse(raw.to) : [],
            cc: raw.cc ? JSON.parse(raw.cc) : undefined,
            bcc: raw.bcc ? JSON.parse(raw.bcc) : undefined,
            subject: raw.subject,
            text: raw.text,
            html: raw.html,
            inReplyToMessageId: raw.inReplyToMessageId ? Number(raw.inReplyToMessageId) : undefined,
        };
        const data = validate(sendSchema, parsed);

        const files = (req.files as Express.Multer.File[] | undefined) ?? [];
        const attachments = files.map((f) => ({
            filename: f.originalname,
            path: f.path,
            contentType: f.mimetype,
        }));

        const accountId = raw.accountId ? Number(raw.accountId) : undefined;
        try {
            const result = await mailService.send({...data, attachments}, accountId);
            // Audit every outbound mail — recipient list, subject, attachment
            // count and (if reply) the parent message id. Body intentionally
            // not stored to keep audit log lean.
            await logAudit({
                actorId: res.locals.user?.id,
                entityType: 'mail_message',
                entityId: 0,
                action: 'send',
                after: {
                    to: data.to.map((r) => r.address),
                    cc: data.cc?.map((r) => r.address),
                    subject: data.subject,
                    inReplyToMessageId: data.inReplyToMessageId ?? null,
                    attachments: attachments.length,
                },
                req,
            });
            res.status(StatusCodes.OK).json(result);
        } finally {
            // Cleanup uploaded attachments after send
            for (const f of files) {
                fs.unlink(f.path, () => undefined);
            }
        }
    }

    async drafts(req: Request, res: Response) {
        const accountId = parseId(req.query.accountId as string);
        const drafts = await mailService.listDrafts(accountId);
        res.status(StatusCodes.OK).json({drafts});
    }

    async saveDraft(req: Request, res: Response) {
        const data = validate(draftSchema, req.body);
        const accountId = req.body.accountId ? Number(req.body.accountId) : undefined;
        if (!accountId) throw new BadRequestError('accountId required');
        const draft = await mailService.saveDraft({accountId, ...data});
        res.status(StatusCodes.OK).json({draft});
    }

    async deleteDraft(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await mailService.deleteDraft(id);
        res.status(StatusCodes.OK).json({ok: true});
    }

    async contacts(req: Request, res: Response) {
        const accountId = parseId(req.query.accountId as string);
        const q = (req.query.q as string) ?? '';
        const contacts = await mailService.searchContacts(accountId, q);
        res.status(StatusCodes.OK).json({contacts});
    }
}

export default new MailController();
