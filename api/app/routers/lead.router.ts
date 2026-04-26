import {Router} from 'express';
import leadController from '../controllers/lead.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('crm', 'view'), leadController.list);
router.get('/stats', auth, requirePermission('crm', 'view'), leadController.stats);
router.post('/', auth, requirePermission('crm', 'full'), leadController.create);
router.post('/bulk-import', auth, requirePermission('crm', 'full'), leadController.bulkImport);
router.get('/:id', auth, requirePermission('crm', 'view'), leadController.getOne);
router.patch('/:id', auth, requirePermission('crm', 'full'), leadController.update);
router.patch('/:id/status', auth, requirePermission('crm', 'full'), leadController.updateStatus);
router.delete('/:id', auth, requirePermission('crm', 'full'), leadController.delete);
router.post('/:id/emails', auth, requirePermission('crm', 'full'), leadController.addEmail);

// Outreach automation triggers (manual run from admin)
router.post('/run/:step', auth, requirePermission('crm', 'full'), leadController.runStep);

export default router;
