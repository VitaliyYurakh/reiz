import {Router} from 'express';
import mailController, {mailAttachmentsUpload} from '../controllers/mail.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

// All mail routes require admin auth + a "mail" permission module.
// Until the permission system gets the "mail" module, gate by "settings"
// (admin-only). Swap to requirePermission('mail', 'view'/'full') once UI
// for permissions is updated.
const requireView = requirePermission('settings', 'view');
const requireFull = requirePermission('settings', 'full');

router.get('/accounts', auth, requireView, mailController.accounts);
router.post('/sync', auth, requireFull, mailController.sync);

router.get('/folders', auth, requireView, mailController.folders);
router.get('/messages', auth, requireView, mailController.messages);
router.get('/messages/:id', auth, requireView, mailController.getOne);
router.get('/messages/:id/attachments/:aid', auth, requireView, mailController.getAttachment);
router.patch('/messages/:id', auth, requireFull, mailController.patch);
router.delete('/messages/:id', auth, requireFull, mailController.delete);

router.post('/send', auth, requireFull, mailAttachmentsUpload, mailController.send);

router.get('/drafts', auth, requireView, mailController.drafts);
router.post('/drafts', auth, requireFull, mailController.saveDraft);
router.delete('/drafts/:id', auth, requireFull, mailController.deleteDraft);

router.get('/contacts', auth, requireView, mailController.contacts);

export default router;
