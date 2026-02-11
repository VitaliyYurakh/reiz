import {Router} from 'express';

import {clientController} from '../controllers';
import {auth, documentUpload, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('clients', 'view'), clientController.getAll);
router.get('/check-duplicates', auth, requirePermission('clients', 'view'), clientController.checkDuplicates);
router.get('/:id', auth, requirePermission('clients', 'view'), clientController.getOne);
router.post('/', auth, requirePermission('clients', 'full'), clientController.create);
router.patch('/:id', auth, requirePermission('clients', 'full'), clientController.update);
router.delete('/:id', auth, requirePermission('clients', 'full'), clientController.delete);
router.patch('/:id/rating', auth, requirePermission('clients', 'full'), clientController.setRating);
router.get('/:id/history', auth, requirePermission('clients', 'view'), clientController.getHistory);
router.post('/:id/document', auth, requirePermission('clients', 'full'), documentUpload, clientController.uploadDocument);
router.delete('/:id/document/:docId', auth, requirePermission('clients', 'full'), clientController.deleteDocument);
router.post('/:id/block', auth, requirePermission('clients', 'full'), clientController.block);
router.post('/:id/unblock', auth, requirePermission('clients', 'full'), clientController.unblock);

export default router;
