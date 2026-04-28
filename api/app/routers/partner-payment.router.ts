import {Router} from 'express';
import partnerPaymentController from '../controllers/partner-payment.controller';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Permission scoped to `finance` (it's an income-side ledger entry).
router.get('/stats',  auth, requirePermission('finance', 'view'), partnerPaymentController.stats);
router.get('/',       auth, requirePermission('finance', 'view'), partnerPaymentController.listForPartner);
router.post('/',      auth, requirePermission('finance', 'full'), partnerPaymentController.create);
router.get('/:id',    auth, requirePermission('finance', 'view'), partnerPaymentController.getOne);
router.patch('/:id',  auth, requirePermission('finance', 'full'), partnerPaymentController.update);
router.delete('/:id', auth, requirePermission('finance', 'full'), partnerPaymentController.delete);

export default router;
