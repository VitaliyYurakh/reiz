import {Router} from 'express';

import {authController} from '../controllers';
import {auth} from '../middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check', auth, authController.checkAuth);
router.get('/me', auth, authController.me);

export default router;
