import {Router} from 'express';

import {auditController} from '../controllers';
import {auth, requireRole} from '../middleware';

const router = Router();

router.get('/', auth, requireRole('admin'), auditController.getAll);

export default router;
