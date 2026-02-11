import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import reportService from '../services/report.service';
import notificationService from '../services/notification.service';

class ReportController {
    async dashboard(req: Request, res: Response) {
        try {
            const data = await reportService.getDashboard();

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async revenue(req: Request, res: Response) {
        try {
            const from = req.query.from as string;
            const to = req.query.to as string;

            if (!from || !to) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
            }

            const data = await reportService.getRevenue(from, to);

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async fleetUtilization(req: Request, res: Response) {
        try {
            const from = req.query.from as string;
            const to = req.query.to as string;
            const segmentId = req.query.segmentId ? Number(req.query.segmentId) : undefined;

            if (!from || !to) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
            }

            const data = await reportService.getFleetUtilization(from, to, segmentId);

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async overdue(req: Request, res: Response) {
        try {
            const data = await reportService.getOverdue();

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async notifications(req: Request, res: Response) {
        try {
            const data = await reportService.getNotifications();

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async search(req: Request, res: Response) {
        try {
            const q = (req.query.q as string) || '';
            const data = await reportService.search(q);

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async notifyOverdue(req: Request, res: Response) {
        try {
            const data = await reportService.getOverdue();

            if (data.items.length === 0) {
                return res.status(StatusCodes.OK).json({msg: 'Немає прострочених оренд', sent: 0});
            }

            let sent = 0;
            const errors: string[] = [];

            for (const rental of data.items) {
                try {
                    const clientName = `${rental.client.firstName} ${rental.client.lastName}`.trim();
                    await notificationService.send('overdue_reminder', {
                        recipient: rental.client.phone || rental.client.email || 'admin',
                        variables: {
                            clientName,
                            carName: `${rental.car.brand} ${rental.car.model}`,
                            plateNumber: rental.car.plateNumber || '',
                            returnDate: new Date(rental.returnDate).toLocaleDateString('uk-UA'),
                            overdueDays: String(rental.overdueDays),
                            rentalId: String(rental.id),
                        },
                    });
                    sent++;
                } catch (err: any) {
                    errors.push(`Rental #${rental.id}: ${err.message}`);
                }
            }

            return res.status(StatusCodes.OK).json({
                total: data.items.length,
                sent,
                errors: errors.length > 0 ? errors : undefined,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new ReportController();
