import {Router} from 'express';

import {authController} from '../controllers';
import {auth} from '../middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check', auth, authController.checkAuth);
router.get('/me', auth, authController.me);

// 2FA — opt-in TOTP. All routes require an already-authed session;
// 2FA enrollment happens AFTER login with password.
router.get('/2fa/status', auth, authController.totpStatus);
router.post('/2fa/setup', auth, authController.totpSetup);
router.post('/2fa/enable', auth, authController.totpEnable);
router.post('/2fa/disable', auth, authController.totpDisable);

export default router;
