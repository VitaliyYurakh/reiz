import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import calendarService from '../services/calendar.service';

class CalendarController {
    async getData(req: Request, res: Response) {
        try {
            const from = req.query.from as string;
            const to = req.query.to as string;
            const carIdsParam = req.query.carIds as string | undefined;

            if (!from || !to) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'from and to query params are required'});
            }

            const carIds = carIdsParam
                ? carIdsParam.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id))
                : undefined;

            const data = await calendarService.getData(from, to, carIds);

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new CalendarController();
