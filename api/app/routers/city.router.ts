import {Router} from 'express';

import {cityController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Public route (no auth)
router.get('/public', cityController.getAllPublic);

// Admin routes
router.get('/', auth, requirePermission('locations', 'view'), cityController.getAll);
router.post('/', auth, requirePermission('locations', 'full'), cityController.create);
router.get('/:id', auth, requirePermission('locations', 'view'), cityController.getOne);
router.patch('/:id', auth, requirePermission('locations', 'full'), cityController.update);
router.delete('/:id', auth, requirePermission('locations', 'full'), cityController.delete);

// Location sub-routes
router.get('/:id/location', auth, requirePermission('locations', 'view'), cityController.getLocations);
router.post('/:id/location', auth, requirePermission('locations', 'full'), cityController.createLocation);
router.patch('/:id/location/:locId', auth, requirePermission('locations', 'full'), cityController.updateLocation);
router.delete('/:id/location/:locId', auth, requirePermission('locations', 'full'), cityController.deleteLocation);

export default router;
