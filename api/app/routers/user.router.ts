import {Router} from 'express';
import {userController} from '../controllers';
import {auth, requirePermission} from '../middleware';

const router = Router();

// User management is gated by the dedicated `users` permission module
// (post-RBAC). Anyone with `users.full` can manage staff — no longer
// hard-pinned to the "Admin" role name.
const requireUsersView = requirePermission('users', 'view');
const requireUsersFull = requirePermission('users', 'full');

router.get('/', auth, requireUsersView, userController.getAll);
router.get('/:id', auth, requireUsersView, userController.getOne);
router.post('/', auth, requireUsersFull, userController.create);
router.patch('/:id', auth, requireUsersFull, userController.update);
router.patch('/:id/password', auth, requireUsersFull, userController.changePassword);
router.delete('/:id', auth, requireUsersFull, userController.remove);

export default router;
