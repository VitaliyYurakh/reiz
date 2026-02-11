import {Router} from 'express';

import {reportController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/dashboard', auth, requirePermission('dashboard', 'view'), reportController.dashboard);
router.get('/revenue', auth, requirePermission('reports', 'view'), reportController.revenue);
router.get('/fleet-utilization', auth, requirePermission('reports', 'view'), reportController.fleetUtilization);
router.get('/overdue', auth, requirePermission('reports', 'view'), reportController.overdue);
router.get('/notifications', auth, reportController.notifications);
router.get('/search', auth, reportController.search);
router.post('/overdue/notify', auth, requirePermission('reports', 'full'), reportController.notifyOverdue);

export default router;
