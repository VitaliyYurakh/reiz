import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import feedbackService from '../services/feedback.service';
import {bookingRequestSchema, contactRequestSchema, callbackRequestSchema, businessRequestSchema, investRequestSchema, validate} from '../validators';

class FeedbackController {
    async booking(req: Request, res: Response) {
        const data = validate(bookingRequestSchema, req.body);
        const result = await feedbackService.createBookingRequest(data);
        return res.status(StatusCodes.CREATED).json({success: true, data: result});
    }

    async contacts(req: Request, res: Response) {
        const data = validate(contactRequestSchema, req.body);
        const result = await feedbackService.createContactRequest(data);
        return res.status(StatusCodes.CREATED).json({success: true, data: result});
    }

    async rents(req: Request, res: Response) {
        const data = validate(callbackRequestSchema, req.body);
        const result = await feedbackService.createCallbackRequest(data);
        return res.status(StatusCodes.CREATED).json({success: true, data: result});
    }

    async invest(req: Request, res: Response) {
        const data = validate(investRequestSchema, req.body);
        const result = await feedbackService.createInvestRequest(data);
        return res.status(StatusCodes.CREATED).json({success: true, data: result});
    }

    async rentsBusiness(req: Request, res: Response) {
        const data = validate(businessRequestSchema, req.body);
        const result = await feedbackService.createBusinessRequest(data);
        return res.status(StatusCodes.CREATED).json({success: true, data: result});
    }
}

export default new FeedbackController();
