import {Router} from 'express';

import {authController} from '../controllers';
import {auth} from '../middleware';

const router = Router();

router.post('/login', authController.login);
router.get('/check', auth, authController.checkAuth);

export default router;
