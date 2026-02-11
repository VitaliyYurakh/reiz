import {Router} from 'express';

import {financeController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Accounts
router.get('/account', auth, requirePermission('finance', 'view'), financeController.getAllAccounts.bind(financeController));
router.post('/account', auth, requirePermission('finance', 'full'), financeController.createAccount.bind(financeController));
router.patch('/account/:id', auth, requirePermission('finance', 'full'), financeController.updateAccount.bind(financeController));

// Transactions
router.get('/transaction', auth, requirePermission('finance', 'view'), financeController.getTransactions.bind(financeController));
router.post('/transaction', auth, requirePermission('finance', 'full'), financeController.createTransaction.bind(financeController));
router.get('/transaction/summary', auth, requirePermission('finance', 'view'), financeController.getSummary.bind(financeController));

// Rental balance
router.get('/rental-balance/:rentalId', auth, requirePermission('finance', 'view'), financeController.getRentalBalance.bind(financeController));

export default router;
