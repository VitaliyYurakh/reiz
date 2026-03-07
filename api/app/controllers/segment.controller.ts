import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {segmentService} from '../services';

class SegmentController {
    async getAll(req: Request, res: Response) {
        const segments = await segmentService.getAll();
        return res.status(StatusCodes.OK).json({segments});
    }
}

export default new SegmentController();
