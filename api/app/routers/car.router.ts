import {Router} from 'express';

import {carController} from '../controllers';
import {auth, multer, validateImageFile, requirePermission} from '../middleware';

const router = Router();

// Public read endpoints
router.get('/', carController.getAll);
router.get('/configuration-options', auth, requirePermission('cars', 'view'), carController.getConfigurationOptions);

// Service-due list (cars whose currentOdometer >= nextServiceMileageKm) — fleet ops use this in dashboard.
router.get('/service-due', auth, requirePermission('service', 'view'), carController.listDueForService);

// City availability (must be before /:id)
router.get('/:id/city-availability', auth, requirePermission('cars', 'view'), carController.getCityAvailability);
router.put('/:id/city-availability', auth, requirePermission('cars', 'full'), carController.updateCityAvailability);

// Block / unblock + maintenance schedule
router.post('/:id/block', auth, requirePermission('cars', 'full'), carController.block);
router.post('/:id/unblock', auth, requirePermission('cars', 'full'), carController.unblock);
router.patch('/:id/maintenance', auth, requirePermission('service', 'full'), carController.updateMaintenance);

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
