import {Router} from 'express';

import {auditController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Audit-log viewing is now a first-class `audit` permission. The seeded
// Admin role has it; other roles do not by default.
router.get('/', auth, requirePermission('audit', 'view'), auditController.getAll);

export default router;
