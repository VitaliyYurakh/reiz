import {Router} from 'express';
import rateLimit, {ipKeyGenerator} from 'express-rate-limit';
import mailController, {mailAttachmentsUpload} from '../controllers/mail.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Dedicated `mail` permission module. `view` = read inbox, `full` = send/delete.
// Don't reuse `settings` — that grants every settings-able admin full mailbox
// rights including the ability to spoof outgoing mail from info@reiz.com.ua.
const requireView = requirePermission('mail', 'view');
const requireFull = requirePermission('mail', 'full');

// Both limiters key on the authed user id. The auth middleware runs ahead of
// these so res.locals.user is always set; ipKeyGenerator is just a typed
// fallback that satisfies express-rate-limit v8's IPv6-safety check.
const userKey = (prefix: string) => (req: any, res: any) => {
    const uid = res.locals.user?.id;
    return uid ? `${prefix}:u${uid}` : `${prefix}:${ipKeyGenerator(req.ip ?? '')}`;
};

// Per-user rate limiter for /send — caps phishing blast radius if an admin
// session is hijacked. 30 messages/hour is well above legit usage.
const sendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: userKey('mail-send'),
    message: {msg: 'Send rate limit exceeded — try again later'},
});

// Per-user limiter for /sync (IMAP fetch is expensive; 6/min is more than
// enough for a manual refresh + the 60s auto-poll).
const syncLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: userKey('mail-sync'),
    message: {msg: 'Sync rate limit exceeded — try again in a minute'},
});

router.get('/accounts', auth, requireView, mailController.accounts);
router.post('/sync', auth, requireFull, syncLimiter, mailController.sync);

router.get('/folders', auth, requireView, mailController.folders);
router.get('/messages', auth, requireView, mailController.messages);
router.get('/messages/:id', auth, requireView, mailController.getOne);
router.get('/messages/:id/attachments/:aid', auth, requireView, mailController.getAttachment);
router.patch('/messages/:id', auth, requireFull, mailController.patch);
router.delete('/messages/:id', auth, requireFull, mailController.delete);
// Bulk delete — single endpoint that opens one IMAP connection per (account,
// folder) instead of one per message; required for selecting 30+ rows in the UI.
router.post('/messages/delete-bulk', auth, requireFull, mailController.deleteBulk);

router.post('/send', auth, requireFull, sendLimiter, mailAttachmentsUpload, mailController.send);

router.get('/drafts', auth, requireView, mailController.drafts);
router.post('/drafts', auth, requireFull, mailController.saveDraft);
router.delete('/drafts/:id', auth, requireFull, mailController.deleteDraft);

router.get('/contacts', auth, requireView, mailController.contacts);

export default router;
