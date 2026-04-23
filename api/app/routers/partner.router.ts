import {Router} from 'express';
import {partnerController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

router.get('/', auth, requirePermission('cars', 'view'), partnerController.list);
router.post('/', auth, requirePermission('cars', 'full'), partnerController.create);
router.get('/:id', auth, requirePermission('cars', 'view'), partnerController.getOne);
router.patch('/:id', auth, requirePermission('cars', 'full'), partnerController.update);
router.delete('/:id', auth, requirePermission('cars', 'full'), partnerController.delete);

// Statement / report
router.get('/:id/report', auth, requirePermission('cars', 'view'), partnerController.getReport);
// Export uses ?format=xlsx on the same path to avoid path-extension edge cases
router.get('/:id/report-export', auth, requirePermission('cars', 'view'), partnerController.exportReportXLSX);

export default router;
