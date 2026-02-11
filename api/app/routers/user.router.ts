import {Router} from 'express';
import {userController} from '../controllers';
import {auth, requireRole} from '../middleware';

const router = Router();

router.get('/', auth, requireRole('admin'), userController.getAll);
router.get('/:id', auth, requireRole('admin'), userController.getOne);
router.post('/', auth, requireRole('admin'), userController.create);
router.patch('/:id', auth, requireRole('admin'), userController.update);
router.patch('/:id/password', auth, requireRole('admin'), userController.changePassword);
router.delete('/:id', auth, requireRole('admin'), userController.remove);

export default router;
