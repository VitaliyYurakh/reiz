import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import {segmentService} from '../services';

class SegmentController {
    async getAll(req: Request, res: Response) {
        try {
            const segments = await segmentService.getAll();

            return res.status(StatusCodes.OK).json({segments});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }
}

export default new SegmentController();
