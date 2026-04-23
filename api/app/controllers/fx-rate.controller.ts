import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import fxRateService from '../services/fx-rate.service';

class FxRateController {
    async getRate(req: Request, res: Response) {
        const {currency} = req.query;
        if (!currency || typeof currency !== 'string') {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'currency query param required'});
        }
        const result = await fxRateService.getRate(currency, req.query.date as string | undefined);
        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: `No rate available for ${currency}`});
        }
        return res.status(StatusCodes.OK).json(result);
    }

    async listToday(_req: Request, res: Response) {
        const rates = await fxRateService.listToday();
        return res.status(StatusCodes.OK).json({rates});
    }
}

export default new FxRateController();
