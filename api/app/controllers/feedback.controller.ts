import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import feedbackService from '../services/feedback.service';

class FeedbackController {
    async booking(req: Request, res: Response) {
        try {
            const result = await feedbackService.createBookingRequest(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: result,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async contacts(req: Request, res: Response) {
        try {
            const result = await feedbackService.createContactRequest(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: result,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async rents(req: Request, res: Response) {
        try {
            const result = await feedbackService.createCallbackRequest(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: result,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async invest(req: Request, res: Response) {
        try {
            const result = await feedbackService.createInvestRequest(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: result,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async rentsBusiness(req: Request, res: Response) {
        try {
            const result = await feedbackService.createBusinessRequest(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: result,
            });
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }
}

export default new FeedbackController();
