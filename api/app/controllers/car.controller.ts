import {StatusCodes} from 'http-status-codes';
import {AccessDenied, CarNotFoundError, logger} from '../utils';
import {Request, Response} from 'express';
import {carService} from '../services';
import {CarPhotoDto, CountingRuleDto, CreateCarDto, TariffDto, UpdateCarDto} from '../types';

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
            const car = await carService.updateOne(parseInt(id), data);

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
            const file = req.file.filename;
            const {id} = req.params;

            const url = await carService.addCarPreviewPhoto(parseInt(id), file);

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
            const {type, alt}: Omit<CarPhotoDto, 'url'> = req.body;
            const file = req.file.filename;
            const {id} = req.params;

            const url = await carService.addCarPhoto(parseInt(id), {
                type,
                url: file,
                alt,
            });

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

    async deleteOne(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await carService.deleteOne(parseInt(id));

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
