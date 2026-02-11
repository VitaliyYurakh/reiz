import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils';
import {Request, Response} from 'express';
import pricingService from '../services/pricing.service';

class PricingController {
    // --- Rate Plans ---

    async getAllRatePlans(req: Request, res: Response) {
        try {
            const ratePlans = await pricingService.getRatePlans();

            return res.status(StatusCodes.OK).json({ratePlans});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createRatePlan(req: Request, res: Response) {
        try {
            const ratePlan = await pricingService.createRatePlan(req.body);

            return res.status(StatusCodes.CREATED).json({ratePlan});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateRatePlan(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const ratePlan = await pricingService.updateRatePlan(parseInt(id), req.body);

            return res.status(StatusCodes.OK).json({ratePlan});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deleteRatePlan(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await pricingService.softDeleteRatePlan(parseInt(id));

            return res.status(StatusCodes.OK).json({msg: 'Rate plan deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Add-Ons ---

    async getAllAddOns(req: Request, res: Response) {
        try {
            const addOns = await pricingService.getAddOns();

            return res.status(StatusCodes.OK).json({addOns});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createAddOn(req: Request, res: Response) {
        try {
            const addOn = await pricingService.createAddOn(req.body);

            return res.status(StatusCodes.CREATED).json({addOn});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateAddOn(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const addOn = await pricingService.updateAddOn(parseInt(id), req.body);

            return res.status(StatusCodes.OK).json({addOn});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deleteAddOn(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await pricingService.softDeleteAddOn(parseInt(id));

            return res.status(StatusCodes.OK).json({msg: 'Add-on deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Coverage Packages ---

    async getAllCoveragePackages(req: Request, res: Response) {
        try {
            const coveragePackages = await pricingService.getCoveragePackages();

            return res.status(StatusCodes.OK).json({coveragePackages});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async createCoveragePackage(req: Request, res: Response) {
        try {
            const coveragePackage = await pricingService.createCoveragePackage(req.body);

            return res.status(StatusCodes.CREATED).json({coveragePackage});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async updateCoveragePackage(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const coveragePackage = await pricingService.updateCoveragePackage(parseInt(id), req.body);

            return res.status(StatusCodes.OK).json({coveragePackage});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async deleteCoveragePackage(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await pricingService.softDeleteCoveragePackage(parseInt(id));

            return res.status(StatusCodes.OK).json({msg: 'Coverage package deleted'});
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    // --- Price Calculation ---

    async calculate(req: Request, res: Response) {
        try {
            const result = await pricingService.calculate(req.body);

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            logger.error(error);

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new PricingController();
