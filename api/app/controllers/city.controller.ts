import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import cityService from '../services/city.service';

class CityController {
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const search = req.query.search as string | undefined;

            const result = await cityService.getAll({page, limit, search});

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const city = await cityService.getOne(parseInt(id));

            if (!city) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'City not found'});
            }

            return res.status(StatusCodes.OK).json({city});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const city = await cityService.create(req.body);

            return res.status(StatusCodes.CREATED).json({city});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const city = await cityService.update(parseInt(id), req.body);

            return res.status(StatusCodes.OK).json({city});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await cityService.delete(parseInt(id));

            return res.status(StatusCodes.OK).json({msg: 'City deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // ── Locations ──

    async getLocations(req: Request, res: Response) {
        try {
            const cityId = parseInt(req.params.id);
            const locations = await cityService.getLocations(cityId);

            return res.status(StatusCodes.OK).json({locations});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createLocation(req: Request, res: Response) {
        try {
            const cityId = parseInt(req.params.id);
            const location = await cityService.createLocation(cityId, req.body);

            return res.status(StatusCodes.CREATED).json({location});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateLocation(req: Request, res: Response) {
        try {
            const cityId = parseInt(req.params.id);
            const locId = parseInt(req.params.locId);
            const location = await cityService.updateLocation(cityId, locId, req.body);

            return res.status(StatusCodes.OK).json({location});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deleteLocation(req: Request, res: Response) {
        try {
            const cityId = parseInt(req.params.id);
            const locId = parseInt(req.params.locId);
            await cityService.deleteLocation(cityId, locId);

            return res.status(StatusCodes.OK).json({msg: 'Location deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // ── Public ──

    async getAllPublic(_req: Request, res: Response) {
        try {
            const cities = await cityService.getAllPublic();

            return res.status(StatusCodes.OK).json({cities});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new CityController();
