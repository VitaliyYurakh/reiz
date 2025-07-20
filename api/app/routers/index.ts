import {Router} from 'express';

import authRouter from './auth.router';
import segmentRouter from './segment.router';
import carRouter from './car.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/segment', segmentRouter);
router.use('/car', carRouter);

export {router};
