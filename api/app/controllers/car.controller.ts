import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {carService} from '../services';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createCarSchema, updateCarSchema, tariffSchema, countingRuleSchema, carCityAvailabilitySchema, validate} from '../validators';

class CarController {
    async getAll(req: Request, res: Response) {
        const citySlug = req.query.citySlug as string | undefined;
        const cars = await carService.getAll(citySlug);
        return res.status(StatusCodes.OK).json({cars});
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params;
        const car = await carService.getOne(parseId(id));
        return res.status(StatusCodes.OK).json({car});
    }

    async create(req: Request, res: Response) {
        const {data} = validate(createCarSchema, req.body);
        const car = await carService.createOne(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: car.id, action: 'CREATE', after: car, req});
        return res.status(StatusCodes.OK).json({car});
    }

    async updateOne(req: Request, res: Response) {
        const {data} = validate(updateCarSchema, req.body);
        const {id} = req.params;
        const before = await carService.getOne(parseId(id));
        const car = await carService.updateOne(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'UPDATE', before, after: car, req});
        return res.status(StatusCodes.OK).json({car});
    }

    async updateRentalTariff(req: Request, res: Response) {
        const {data} = validate(tariffSchema, req.body);
        const {id} = req.params;

        await carService.updateRentalTariff(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'UPDATE', after: {tariff: data}, req});
        return res.status(StatusCodes.OK).json();
    }

    async addCarPreviewPhoto(req: Request, res: Response) {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
        }
        const file = req.file.filename;
        const {id} = req.params;

        const url = await carService.addCarPreviewPhoto(parseId(id), file);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'UPDATE', after: {previewPhoto: url}, req});
        return res.status(StatusCodes.OK).json({url});
    }

    async addCarPhoto(req: Request, res: Response) {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
        }
        const {type, alt} = req.body as {type: 'MOBILE' | 'PC'; alt: string};
        const file = req.file.filename;
        const {id} = req.params;

        const url = await carService.addCarPhoto(parseId(id), {
            type,
            url: file,
            alt,
        });

        logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseId(id), action: 'CREATE', after: {type, alt, url}, req});
        return res.status(StatusCodes.OK).json({url});
    }

    async updateCountingRule(req: Request, res: Response) {
        const {data} = validate(countingRuleSchema, req.body);
        const {id} = req.params;
        await carService.updateCountingRule(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'UPDATE', after: {countingRule: data}, req});
        return res.status(StatusCodes.OK).json();
    }

    async updatePhotoCar(req: Request, res: Response) {
        const {alt, photoId}: {alt: string; photoId: string} = req.body;

        await carService.updatePhotoCar(parseId(photoId), alt);

        logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseId(photoId), action: 'UPDATE', after: {alt}, req});
        return res.status(StatusCodes.OK).json();
    }

    async deleteCarPhoto(req: Request, res: Response) {
        const {photoId} = req.params;

        await carService.deleteCarPhoto(parseId(photoId as string));

        logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseId(photoId as string), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json();
    }

    async getCityAvailability(req: Request, res: Response) {
        const {id} = req.params;
        const availability = await carService.getCityAvailability(parseId(id));
        return res.status(StatusCodes.OK).json({availability});
    }

    async updateCityAvailability(req: Request, res: Response) {
        const {data} = validate(carCityAvailabilitySchema, req.body);
        const {id} = req.params;
        await carService.updateCityAvailability(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'UPDATE', after: {cityAvailability: data}, req});
        return res.status(StatusCodes.OK).json();
    }

    async getConfigurationOptions(req: Request, res: Response) {
        const options = await carService.getConfigurationOptions();
        return res.status(StatusCodes.OK).json({options});
    }

    async deleteOne(req: Request, res: Response) {
        const {id} = req.params;
        const before = await carService.getOne(parseId(id));
        await carService.deleteOne(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseId(id), action: 'DELETE', before, req});
        return res.status(StatusCodes.OK).json();
    }
}

export default new CarController();
