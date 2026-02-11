import {Router} from 'express';

import {reservationController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('reservations', 'view'), reservationController.getAll);
router.get('/:id', auth, requirePermission('reservations', 'view'), reservationController.getOne);
router.post('/', auth, requirePermission('reservations', 'full'), reservationController.create);
router.patch('/:id', auth, requirePermission('reservations', 'full'), reservationController.update);
router.post('/:id/pickup', auth, requirePermission('reservations', 'full'), reservationController.pickup);
router.post('/:id/cancel', auth, requirePermission('reservations', 'full'), reservationController.cancel);
router.post('/:id/no-show', auth, requirePermission('reservations', 'full'), reservationController.noShow);
router.post('/:id/reactivate', auth, requirePermission('reservations', 'full'), reservationController.reactivate);
router.post('/:id/add-on', auth, requirePermission('reservations', 'full'), reservationController.addAddOn);
router.delete('/:id/add-on/:addOnId', auth, requirePermission('reservations', 'full'), reservationController.removeAddOn);

export default router;
