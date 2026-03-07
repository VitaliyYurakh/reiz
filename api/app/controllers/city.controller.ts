import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import cityService from '../services/city.service';
import {parseId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createCitySchema, updateCitySchema, createLocationSchema, updateLocationSchema, validate} from '../validators';

class CityController {
    async getAll(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query, 50);
        const search = req.query.search as string | undefined;

        const result = await cityService.getAll({page, limit, search});
        return res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const city = await cityService.getOne(parseId(id));

        if (!city) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: 'City not found'});
        }

        return res.status(StatusCodes.OK).json({city});
    }

    async create(req: Request, res: Response) {
        const data = validate(createCitySchema, req.body);
        const city = await cityService.create(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'City', entityId: city.id, action: 'CREATE', after: city, req});
        return res.status(StatusCodes.CREATED).json({city});
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateCitySchema, req.body);
        const before = await cityService.getOne(parseId(id));
        const city = await cityService.update(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'City', entityId: parseId(id), action: 'UPDATE', before, after: city, req});
        return res.status(StatusCodes.OK).json({city});
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const before = await cityService.getOne(parseId(id));
        await cityService.delete(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'City', entityId: parseId(id), action: 'DELETE', before, req});
        return res.status(StatusCodes.OK).json({msg: 'City deleted'});
    }

    // ── Locations ──

    async getLocations(req: Request, res: Response) {
        const cityId = parseId(req.params.id);
        const locations = await cityService.getLocations(cityId);
        return res.status(StatusCodes.OK).json({locations});
    }

    async createLocation(req: Request, res: Response) {
        const cityId = parseId(req.params.id);
        const data = validate(createLocationSchema, req.body);
        const location = await cityService.createLocation(cityId, data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Location', entityId: location.id, action: 'CREATE', after: location, req});
        return res.status(StatusCodes.CREATED).json({location});
    }

    async updateLocation(req: Request, res: Response) {
        const cityId = parseId(req.params.id);
        const locId = parseId(req.params.locId);
        const data = validate(updateLocationSchema, req.body);
        const location = await cityService.updateLocation(cityId, locId, data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Location', entityId: locId, action: 'UPDATE', after: location, req});
        return res.status(StatusCodes.OK).json({location});
    }

    async deleteLocation(req: Request, res: Response) {
        const cityId = parseId(req.params.id);
        const locId = parseId(req.params.locId);
        await cityService.deleteLocation(cityId, locId);

        logAudit({actorId: res.locals.user?.id, entityType: 'Location', entityId: locId, action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Location deleted'});
    }

    // ── Public ──

    async getAllPublic(_req: Request, res: Response) {
        const cities = await cityService.getAllPublic();
        return res.status(StatusCodes.OK).json({cities});
    }
}

export default new CityController();
