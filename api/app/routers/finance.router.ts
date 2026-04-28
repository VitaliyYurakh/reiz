import {Router} from 'express';

import {financeController, fineController, fxRateController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// Open fines list (for linking FINE_PAYMENT transactions)
router.get('/fine/open', auth, requirePermission('finance', 'view'), fineController.listOpen.bind(fineController));

// FX rate auto-fill (calls НБУ; cached daily in DailyFxRate table)
router.get('/fx-rate', auth, requirePermission('finance', 'view'), fxRateController.getRate.bind(fxRateController));
router.get('/fx-rate/today', auth, requirePermission('finance', 'view'), fxRateController.listToday.bind(fxRateController));

// Accounts
router.get('/account', auth, requirePermission('finance', 'view'), financeController.getAllAccounts.bind(financeController));
router.get('/account/balances', auth, requirePermission('finance', 'view'), financeController.getAccountBalances.bind(financeController));
router.post('/account', auth, requirePermission('finance', 'full'), financeController.createAccount.bind(financeController));
router.patch('/account/:id', auth, requirePermission('finance', 'full'), financeController.updateAccount.bind(financeController));

// Transactions
router.get('/transaction', auth, requirePermission('finance', 'view'), financeController.getTransactions.bind(financeController));
router.post('/transaction', auth, requirePermission('finance', 'full'), financeController.createTransaction.bind(financeController));
router.get('/transaction/summary', auth, requirePermission('finance', 'view'), financeController.getSummary.bind(financeController));

// Inter-account transfer (інкасація / переказ)
router.post('/transfer', auth, requirePermission('finance', 'full'), financeController.transfer.bind(financeController));

// Rental balance
router.get('/rental-balance/:rentalId', auth, requirePermission('finance', 'view'), financeController.getRentalBalance.bind(financeController));

export default router;
