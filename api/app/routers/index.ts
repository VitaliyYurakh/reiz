import {Router} from 'express';
import {prisma} from '../utils';

import authRouter from './auth.router';
import segmentRouter from './segment.router';
import carRouter from './car.router';
import feedbackRouter from './feedback.router';

const router = Router();
const startedAt = new Date().toISOString();

// ── Health check endpoints (no auth) ──
router.get('/health', (_req, res) => {
    res.json({status: 'healthy', uptime: process.uptime(), startedAt});
});

router.get('/readiness', async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({status: 'ready', database: 'connected'});
    } catch {
        res.status(503).json({status: 'not ready', database: 'disconnected'});
    }
});

router.use('/auth', authRouter);
router.use('/segment', segmentRouter);
router.use('/car', carRouter);
router.use('/feedback', feedbackRouter);

// CRM routers
import clientRouter from './client.router';
import rentalRequestRouter from './rental-request.router';
import reservationRouter from './reservation.router';
import rentalRouter from './rental.router';
import pricingRouter from './pricing.router';
import financeRouter from './finance.router';
import serviceEventRouter from './service-event.router';
import documentRouter from './document.router';
import notificationRouter from './notification.router';
import auditRouter from './audit.router';
import reportRouter from './report.router';
import calendarRouter from './calendar.router';
import cityRouter from './city.router';
import userRouter from './user.router';

router.use('/client', clientRouter);
router.use('/rental-request', rentalRequestRouter);
router.use('/reservation', reservationRouter);
router.use('/rental', rentalRouter);
router.use('/pricing', pricingRouter);
router.use('/finance', financeRouter);
router.use('/service-event', serviceEventRouter);
router.use('/document', documentRouter);
router.use('/notification', notificationRouter);
router.use('/audit', auditRouter);
router.use('/report', reportRouter);
router.use('/calendar', calendarRouter);
router.use('/city', cityRouter);
router.use('/user', userRouter);

export {router};
