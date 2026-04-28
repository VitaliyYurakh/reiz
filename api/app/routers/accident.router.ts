import {Router} from 'express';
import accidentController from '../controllers/accident.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/stats', auth, requirePermission('service', 'view'), accidentController.stats);
router.get('/', auth, requirePermission('service', 'view'), accidentController.list);
router.post('/', auth, requirePermission('service', 'full'), accidentController.create);
router.get('/:id', auth, requirePermission('service', 'view'), accidentController.getOne);
router.patch('/:id', auth, requirePermission('service', 'full'), accidentController.update);
router.delete('/:id', auth, requirePermission('service', 'full'), accidentController.delete);

export default router;
