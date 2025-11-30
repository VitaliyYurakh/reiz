import {StatusCodes} from 'http-status-codes';
import {AccessDenied, CarNotFoundError, logger} from '../utils';
import {Request, Response} from 'express';

class FeedbackController {
    async booking(req: Request, res: Response) {
        try {
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async contacts(req: Request, res: Response) {
        try {
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async rents(req: Request, res: Response) {
        try {
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async rentsBusiness(req: Request, res: Response) {
        try {
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }
}

export default new FeedbackController();
