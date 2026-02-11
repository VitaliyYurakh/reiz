import {Router} from 'express';

import {pricingController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Price calculation
router.post('/calculate', auth, pricingController.calculate.bind(pricingController));

// Rate plans
router.get('/rate-plan', pricingController.getAllRatePlans.bind(pricingController));
router.post('/rate-plan', auth, requirePermission('pricing', 'full'), pricingController.createRatePlan.bind(pricingController));
router.patch('/rate-plan/:id', auth, requirePermission('pricing', 'full'), pricingController.updateRatePlan.bind(pricingController));
router.delete('/rate-plan/:id', auth, requirePermission('pricing', 'full'), pricingController.deleteRatePlan.bind(pricingController));

// Add-ons
router.get('/add-on', pricingController.getAllAddOns.bind(pricingController));
router.post('/add-on', auth, requirePermission('pricing', 'full'), pricingController.createAddOn.bind(pricingController));
router.patch('/add-on/:id', auth, requirePermission('pricing', 'full'), pricingController.updateAddOn.bind(pricingController));
router.delete('/add-on/:id', auth, requirePermission('pricing', 'full'), pricingController.deleteAddOn.bind(pricingController));

// Coverage packages
router.get('/coverage-package', pricingController.getAllCoveragePackages.bind(pricingController));
router.post('/coverage-package', auth, requirePermission('pricing', 'full'), pricingController.createCoveragePackage.bind(pricingController));
router.patch('/coverage-package/:id', auth, requirePermission('pricing', 'full'), pricingController.updateCoveragePackage.bind(pricingController));
router.delete('/coverage-package/:id', auth, requirePermission('pricing', 'full'), pricingController.deleteCoveragePackage.bind(pricingController));

export default router;
