import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import customerService from '../services/customer.service';

class CustomerController {
    async getProfile(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const profile = await customerService.getProfile(clientId);
        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Client not found'});
        }
        res.json(profile);
    }

    async updateProfile(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const updated = await customerService.updateProfile(clientId, req.body);
        res.json(updated);
    }

    async getReservations(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const status = req.query.status as string | undefined;
        const data = await customerService.getReservations(clientId, status);
        res.json(data);
    }

    async getRentals(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const status = req.query.status as string | undefined;
        const data = await customerService.getRentals(clientId, status);
        res.json(data);
    }

    async getFavorites(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const data = await customerService.getFavorites(clientId);
        res.json(data);
    }

    async addFavorite(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const carId = Number(req.params.carId);
        if (isNaN(carId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Invalid carId'});
        }
        const data = await customerService.addFavorite(clientId, carId);
        res.status(StatusCodes.CREATED).json(data);
    }

    async removeFavorite(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const carId = Number(req.params.carId);
        if (isNaN(carId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Invalid carId'});
        }
        await customerService.removeFavorite(clientId, carId);
        res.status(StatusCodes.NO_CONTENT).send();
    }

    async getNotifications(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const data = await customerService.getNotificationPreferences(clientId);
        res.json(data);
    }

    async updateNotifications(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const data = await customerService.updateNotificationPreferences(clientId, req.body);
        res.json(data);
    }

    async requestCancellation(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const reservationId = Number(req.params.id);
        if (isNaN(reservationId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Invalid reservation id'});
        }
        try {
            const result = await customerService.requestCancellation(clientId, reservationId, req.body.reason);
            res.json(result);
        } catch (e: any) {
            res.status(StatusCodes.BAD_REQUEST).json({msg: e.message});
        }
    }

    async getBookingHistory(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const filter = req.query.filter as string | undefined;
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
        const data = await customerService.getBookingHistory(clientId, filter, page, limit);
        res.json(data);
    }

    async getStats(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const data = await customerService.getStats(clientId);
        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'Client not found'});
        }
        res.json(data);
    }

    async exportData(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        const data = await customerService.exportData(clientId);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="my-data-${clientId}.json"`);
        res.json(data);
    }

    async deleteAccount(req: Request, res: Response) {
        const clientId = res.locals.clientId;
        await customerService.deleteAccount(clientId);
        res.json({msg: 'Account deleted successfully'});
    }
}

export default new CustomerController();
