import {Router} from 'express';
import documentTemplateController from '../controllers/document-template.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('settings', 'view'), documentTemplateController.list);
router.post('/', auth, requirePermission('settings', 'full'), documentTemplateController.create);
router.get('/:id', auth, requirePermission('settings', 'view'), documentTemplateController.getOne);
router.patch('/:id', auth, requirePermission('settings', 'full'), documentTemplateController.update);
router.delete('/:id', auth, requirePermission('settings', 'full'), documentTemplateController.delete);

// Render uses the rentals module since it's typically called from the rental
// detail page; settings users wouldn't need to render contracts.
router.post('/:id/render', auth, requirePermission('rentals', 'view'), documentTemplateController.render);

export default router;
