import {Router} from 'express';

import {segmentController} from '../controllers';

const router = Router();

router.get('/', segmentController.getAll);

export default router;
