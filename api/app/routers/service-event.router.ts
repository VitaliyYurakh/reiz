import {Router} from 'express';

import {serviceEventController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('service', 'view'), serviceEventController.getAll);
router.get('/:id', auth, requirePermission('service', 'view'), serviceEventController.getOne);
router.post('/', auth, requirePermission('service', 'full'), serviceEventController.create);
router.patch('/:id', auth, requirePermission('service', 'full'), serviceEventController.update);
router.delete('/:id', auth, requirePermission('service', 'full'), serviceEventController.delete);

export default router;
