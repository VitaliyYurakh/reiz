import {Router} from 'express';

import {carController} from '../controllers';
import {auth, multer, validateImageFile, requirePermission} from '../middleware';

const router = Router();

// Public read endpoints
router.get('/', carController.getAll);
router.get('/configuration-options', auth, requirePermission('cars', 'view'), carController.getConfigurationOptions);
router.get('/:id', carController.getOne);

// Protected mutation endpoints
router.post('/', auth, requirePermission('cars', 'full'), carController.create);
router.post('/:id/photo', auth, requirePermission('cars', 'full'), multer, validateImageFile, carController.addCarPhoto);
router.patch('/:id/preview', auth, requirePermission('cars', 'full'), multer, validateImageFile, carController.addCarPreviewPhoto);
router.patch('/:id/photo', auth, requirePermission('cars', 'full'), multer, validateImageFile, carController.updatePhotoCar);
router.patch('/:id/tariff', auth, requirePermission('cars', 'full'), carController.updateRentalTariff);
router.patch('/:id/rule', auth, requirePermission('cars', 'full'), carController.updateCountingRule);
router.patch('/:id', auth, requirePermission('cars', 'full'), carController.updateOne);
router.delete('/:id/photo/:photoId', auth, requirePermission('cars', 'full'), carController.deleteCarPhoto);
router.delete('/:id', auth, requirePermission('cars', 'full'), carController.deleteOne);

export default router;
