import {StatusCodes} from 'http-status-codes';
import {AccessDenied, CarNotFoundError, logger} from '../utils';
import {Request, Response} from 'express';
import {carService} from '../services';
import {CarPhotoDto, CountingRuleDto, CreateCarDto, TariffDto, UpdateCarDto} from '../types';
import logAudit from '../middleware/audit.middleware';

class CarController {
    async getAll(req: Request, res: Response) {
        try {
            const cars = await carService.getAll();

            return res.status(StatusCodes.OK).json({cars});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const car = await carService.getOne(parseInt(id));

            return res.status(StatusCodes.OK).json({car});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async create(req: Request, res: Response) {
        try {
            console.log('test');
            const {data}: {data: CreateCarDto} = req.body;
            const car = await carService.createOne(data);

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: car.id, action: 'CREATE', after: car, req});
            return res.status(StatusCodes.OK).json({car});
        } catch (error) {
            console.log(error);
            logger.error(error);

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async updateOne(req: Request, res: Response) {
        try {
            const {data}: {data: UpdateCarDto} = req.body;
            const {id} = req.params;
            const before = await carService.getOne(parseInt(id));
            const car = await carService.updateOne(parseInt(id), data);

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseInt(id), action: 'UPDATE', before, after: car, req});
            return res.status(StatusCodes.OK).json({car});
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async updateRentalTariff(req: Request, res: Response) {
        try {
            const {data}: {data: TariffDto[]} = req.body;
            const {id} = req.params;

            await carService.updateRentalTariff(parseInt(id), data);

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseInt(id), action: 'UPDATE', after: {tariff: data}, req});
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async addCarPreviewPhoto(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
            }
            const file = req.file.filename;
            const {id} = req.params;

            const url = await carService.addCarPreviewPhoto(parseInt(id), file);

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseInt(id), action: 'UPDATE', after: {previewPhoto: url}, req});
            return res.status(StatusCodes.OK).json({url});
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async addCarPhoto(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'File is required'});
            }
            const {type, alt}: Omit<CarPhotoDto, 'url'> = req.body;
            const file = req.file.filename;
            const {id} = req.params;

            const url = await carService.addCarPhoto(parseInt(id), {
                type,
                url: file,
                alt,
            });

            logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseInt(id), action: 'CREATE', after: {type, alt, url}, req});
            return res.status(StatusCodes.OK).json({url});
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async updateCountingRule(req: Request, res: Response) {
        try {
            const {data}: {data: CountingRuleDto} = req.body;
            const {id} = req.params;
            await carService.updateCountingRule(parseInt(id), data);

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseInt(id), action: 'UPDATE', after: {countingRule: data}, req});
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async updatePhotoCar(req: Request, res: Response) {
        try {
            const {alt, photoId}: {alt: string; photoId: string} = req.body;

            console.log(req.body);

            await carService.updatePhotoCar(parseInt(photoId), alt);

            logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseInt(photoId), action: 'UPDATE', after: {alt}, req});
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async deleteCarPhoto(req: Request, res: Response) {
        try {
            const {photoId} = req.params;

            await carService.deleteCarPhoto(parseInt(photoId as string));

            logAudit({actorId: res.locals.user?.id, entityType: 'CarPhoto', entityId: parseInt(photoId as string), action: 'DELETE', req});
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof CarNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async getConfigurationOptions(req: Request, res: Response) {
        try {
            const options = await carService.getConfigurationOptions();

            return res.status(StatusCodes.OK).json({options});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async migratePolish(req: Request, res: Response) {
        try {
            const result = await carService.migratePolish();

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async deleteOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const before = await carService.getOne(parseInt(id));
            await carService.deleteOne(parseInt(id));

            logAudit({actorId: res.locals.user?.id, entityType: 'Car', entityId: parseInt(id), action: 'DELETE', before, req});
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            logger.error(error);

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }
}

export default new CarController();
