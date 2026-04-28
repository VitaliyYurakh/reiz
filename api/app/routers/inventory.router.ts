import {Router} from 'express';
import inventoryController from '../controllers/inventory.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/stats', auth, requirePermission('service', 'view'), inventoryController.stats);
router.get('/', auth, requirePermission('service', 'view'), inventoryController.list);
router.post('/', auth, requirePermission('service', 'full'), inventoryController.create);
router.get('/:id', auth, requirePermission('service', 'view'), inventoryController.getOne);
router.patch('/:id', auth, requirePermission('service', 'full'), inventoryController.update);
router.delete('/:id', auth, requirePermission('service', 'full'), inventoryController.delete);

export default router;
