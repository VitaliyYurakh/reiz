import {Router} from 'express';

import {carController} from '../controllers';
import {auth, multer} from '../middleware';

const router = Router();

router.get('/', carController.getAll);
router.get('/:id', carController.getOne);
router.post('/', auth, carController.create);
router.post('/:id/photo', auth, multer, carController.addCarPhoto);
router.patch('/:id/tariff', auth, carController.updateRentalTariff);
router.patch('/:id/rule', auth, carController.updateCountingRule);
router.patch('/:id', auth, carController.updateOne);
router.delete('/:id/photo', auth, carController.deleteCarPhoto); // видаляти і файл і добавити :photoId
router.delete('/:id', auth, carController.deleteOne);

export default router;
