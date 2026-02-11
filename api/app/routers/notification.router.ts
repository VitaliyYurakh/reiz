import {Router} from 'express';

import {notificationController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Templates
router.get('/template', auth, requirePermission('settings', 'view'), notificationController.getAllTemplates.bind(notificationController));
router.post('/template', auth, requirePermission('settings', 'full'), notificationController.createTemplate.bind(notificationController));
router.patch('/template/:id', auth, requirePermission('settings', 'full'), notificationController.updateTemplate.bind(notificationController));

// Logs and sending
router.get('/log', auth, requirePermission('settings', 'view'), notificationController.getLogs.bind(notificationController));
router.post('/send', auth, requirePermission('settings', 'full'), notificationController.send.bind(notificationController));

export default router;
