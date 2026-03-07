import {Router} from 'express';

import {carController} from '../controllers';
import {auth, multer, validateImageFile} from '../middleware';

const router = Router();

router.get('/', carController.getAll);
router.get('/configuration-options', auth, carController.getConfigurationOptions);
router.post('/migrate-polish', auth, carController.migratePolish);
router.get('/:id', carController.getOne);
router.post('/', auth, carController.create);
router.post('/:id/photo', auth, multer, validateImageFile, carController.addCarPhoto);
router.patch('/:id/preview', auth, multer, validateImageFile, carController.addCarPreviewPhoto);
router.patch('/:id/photo', auth, multer, validateImageFile, carController.updatePhotoCar);
router.patch('/:id/tariff', auth, carController.updateRentalTariff);
router.patch('/:id/rule', auth, carController.updateCountingRule);
router.patch('/:id', auth, carController.updateOne);
router.delete('/:id/photo/:photoId', auth, carController.deleteCarPhoto);
router.delete('/:id', auth, carController.deleteOne);

export default router;
