import {Router} from 'express';
import serviceAuth from '../middleware/service-auth.middleware';
import customerController from '../controllers/customer.controller';

const router = Router();

// All routes require service auth (Next.js BFF → Express)
router.use(serviceAuth);

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

router.get('/reservations', customerController.getReservations);
router.get('/rentals', customerController.getRentals);
router.get('/booking-history', customerController.getBookingHistory);
router.get('/stats', customerController.getStats);
router.post('/reservations/:id/request-cancel', customerController.requestCancellation);

router.get('/favorites', customerController.getFavorites);
router.post('/favorites/:carId', customerController.addFavorite);
router.delete('/favorites/:carId', customerController.removeFavorite);

router.get('/notifications', customerController.getNotifications);
router.put('/notifications', customerController.updateNotifications);

router.get('/export', customerController.exportData);
router.delete('/account', customerController.deleteAccount);

export default router;
