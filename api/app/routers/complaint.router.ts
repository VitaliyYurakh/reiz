import {Router} from 'express';
import {complaintController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Admin endpoints — auth required
router.get('/', auth, requirePermission('rentals', 'view'), complaintController.list);
router.get('/stats', auth, requirePermission('rentals', 'view'), complaintController.stats);
router.get('/:id', auth, requirePermission('rentals', 'view'), complaintController.getOne);
router.patch('/:id', auth, requirePermission('rentals', 'full'), complaintController.update);
router.post('/:id/message', auth, requirePermission('rentals', 'full'), complaintController.addMessage);

export default router;
