import {Router} from 'express';
import {feedbackController} from '../controllers';

const router = Router();

router.post('/bookings', feedbackController.booking);
router.post('/contacts', feedbackController.contacts);
router.post('/rents', feedbackController.rents);
router.post('/invest', feedbackController.invest);
router.post('/rents-business', feedbackController.rentsBusiness);

export default router;
