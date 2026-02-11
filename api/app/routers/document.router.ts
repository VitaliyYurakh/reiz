import {Router} from 'express';

import {documentController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('rentals', 'view'), documentController.getByRental);
router.post('/generate', auth, requirePermission('rentals', 'full'), documentController.generate);
router.get('/:id/download', auth, requirePermission('rentals', 'view'), documentController.download);
router.delete('/:id', auth, requirePermission('rentals', 'full'), documentController.delete);

export default router;
