import {Router} from 'express';

import {rentalRequestController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('requests', 'view'), rentalRequestController.getAll);
router.get('/:id', auth, requirePermission('requests', 'view'), rentalRequestController.getOne);
router.post('/', auth, requirePermission('requests', 'full'), rentalRequestController.create);
router.patch('/:id', auth, requirePermission('requests', 'full'), rentalRequestController.update);
router.post('/:id/approve', auth, requirePermission('requests', 'full'), rentalRequestController.approve);
router.post('/:id/reject', auth, requirePermission('requests', 'full'), rentalRequestController.reject);

export default router;
