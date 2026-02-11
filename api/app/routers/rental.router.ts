import {Router} from 'express';

import {rentalController, inspectionController, fineController} from '../controllers';
import {auth, multer, requirePermission} from '../middleware';

const router = Router();

// Rental CRUD & lifecycle
router.get('/', auth, requirePermission('rentals', 'view'), rentalController.getAll);
router.get('/:id', auth, requirePermission('rentals', 'view'), rentalController.getOne);
router.post('/', auth, requirePermission('rentals', 'full'), rentalController.create);
router.patch('/:id', auth, requirePermission('rentals', 'full'), rentalController.update);
router.post('/:id/complete', auth, requirePermission('rentals', 'full'), rentalController.complete);
router.post('/:id/cancel', auth, requirePermission('rentals', 'full'), rentalController.cancel);
router.post('/:id/extend', auth, requirePermission('rentals', 'full'), rentalController.extend);

// Inspections (nested under rental)
router.get('/:rentalId/inspection', auth, requirePermission('rentals', 'view'), inspectionController.getByRental);
router.post('/:rentalId/inspection', auth, requirePermission('rentals', 'full'), inspectionController.create);
router.patch('/:rentalId/inspection/:inspId', auth, requirePermission('rentals', 'full'), inspectionController.update);
router.post('/:rentalId/inspection/:inspId/photo', auth, requirePermission('rentals', 'full'), multer, inspectionController.addPhoto);
router.delete('/:rentalId/inspection/:inspId/photo/:photoId', auth, requirePermission('rentals', 'full'), inspectionController.deletePhoto);
router.post('/:rentalId/inspection/:inspId/complete', auth, requirePermission('rentals', 'full'), inspectionController.complete);

// Fines (nested under rental)
router.get('/:rentalId/fine', auth, requirePermission('rentals', 'view'), fineController.getByRental);
router.post('/:rentalId/fine', auth, requirePermission('rentals', 'full'), fineController.create);
router.patch('/:rentalId/fine/:fineId', auth, requirePermission('rentals', 'full'), fineController.update);
router.delete('/:rentalId/fine/:fineId', auth, requirePermission('rentals', 'full'), fineController.delete);
router.post('/:rentalId/fine/:fineId/pay', auth, requirePermission('rentals', 'full'), fineController.markPaid);

export default router;
