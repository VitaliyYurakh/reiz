import {Router} from 'express';

import {calendarController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('calendar', 'view'), calendarController.getData);

export default router;
