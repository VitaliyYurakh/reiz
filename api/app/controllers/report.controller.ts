import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import reportService from '../services/report.service';
import notificationService from '../services/notification.service';

class ReportController {
    async dashboard(req: Request, res: Response) {
        const data = await reportService.getDashboard();
        return res.status(StatusCodes.OK).json(data);
    }

    async revenue(req: Request, res: Response) {
        const from = req.query.from as string;
        const to = req.query.to as string;

        if (!from || !to) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
        }

        const data = await reportService.getRevenue(from, to);
        return res.status(StatusCodes.OK).json(data);
    }

    async fleetUtilization(req: Request, res: Response) {
        const from = req.query.from as string;
        const to = req.query.to as string;
        const segmentId = req.query.segmentId ? Number(req.query.segmentId) : undefined;

        if (!from || !to) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
        }

        const data = await reportService.getFleetUtilization(from, to, segmentId);
        return res.status(StatusCodes.OK).json(data);
    }

    async overdue(req: Request, res: Response) {
        const data = await reportService.getOverdue();
        return res.status(StatusCodes.OK).json(data);
    }

    async notifications(req: Request, res: Response) {
        const user = res.locals.user;
        const data = await reportService.getNotifications(
            (user.permissions as Record<string, string>) || {},
            user.role,
        );
        return res.status(StatusCodes.OK).json(data);
    }

    async search(req: Request, res: Response) {
        const q = (req.query.q as string) || '';
        const user = res.locals.user;
        const data = await reportService.search(
            q,
            (user.permissions as Record<string, string>) || {},
            user.role,
        );
        return res.status(StatusCodes.OK).json(data);
    }

    async notifyOverdue(req: Request, res: Response) {
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
    }
}

export default new ReportController();
