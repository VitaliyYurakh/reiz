import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import pricingService from '../services/pricing.service';
import {parseId} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {createRatePlanSchema, updateRatePlanSchema, createAddOnSchema, updateAddOnSchema, createCoveragePackageSchema, updateCoveragePackageSchema, calculatePricingSchema, validate} from '../validators';

class PricingController {
    // --- Rate Plans ---

    async getAllRatePlans(req: Request, res: Response) {
        const ratePlans = await pricingService.getRatePlans();
        return res.status(StatusCodes.OK).json({ratePlans});
    }

    async createRatePlan(req: Request, res: Response) {
        const data = validate(createRatePlanSchema, req.body);
        const ratePlan = await pricingService.createRatePlan(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'RatePlan', entityId: ratePlan.id, action: 'CREATE', after: ratePlan, req});
        return res.status(StatusCodes.CREATED).json({ratePlan});
    }

    async updateRatePlan(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateRatePlanSchema, req.body);
        const ratePlan = await pricingService.updateRatePlan(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'RatePlan', entityId: parseId(id), action: 'UPDATE', after: ratePlan, req});
        return res.status(StatusCodes.OK).json({ratePlan});
    }

    async deleteRatePlan(req: Request, res: Response) {
        const {id} = req.params;
        await pricingService.softDeleteRatePlan(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'RatePlan', entityId: parseId(id), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Rate plan deleted'});
    }

    // --- Add-Ons ---

    async getAllAddOns(req: Request, res: Response) {
        const addOns = await pricingService.getAddOns();
        return res.status(StatusCodes.OK).json({addOns});
    }

    async createAddOn(req: Request, res: Response) {
        const data = validate(createAddOnSchema, req.body);
        const addOn = await pricingService.createAddOn(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'AddOn', entityId: addOn.id, action: 'CREATE', after: addOn, req});
        return res.status(StatusCodes.CREATED).json({addOn});
    }

    async updateAddOn(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateAddOnSchema, req.body);
        const addOn = await pricingService.updateAddOn(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'AddOn', entityId: parseId(id), action: 'UPDATE', after: addOn, req});
        return res.status(StatusCodes.OK).json({addOn});
    }

    async deleteAddOn(req: Request, res: Response) {
        const {id} = req.params;
        await pricingService.softDeleteAddOn(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'AddOn', entityId: parseId(id), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Add-on deleted'});
    }

    // --- Coverage Packages ---

    async getAllCoveragePackages(req: Request, res: Response) {
        const coveragePackages = await pricingService.getCoveragePackages();
        return res.status(StatusCodes.OK).json({coveragePackages});
    }

    async createCoveragePackage(req: Request, res: Response) {
        const data = validate(createCoveragePackageSchema, req.body);
        const coveragePackage = await pricingService.createCoveragePackage(data);

        logAudit({actorId: res.locals.user?.id, entityType: 'CoveragePackage', entityId: coveragePackage.id, action: 'CREATE', after: coveragePackage, req});
        return res.status(StatusCodes.CREATED).json({coveragePackage});
    }

    async updateCoveragePackage(req: Request, res: Response) {
        const {id} = req.params;
        const data = validate(updateCoveragePackageSchema, req.body);
        const coveragePackage = await pricingService.updateCoveragePackage(parseId(id), data);

        logAudit({actorId: res.locals.user?.id, entityType: 'CoveragePackage', entityId: parseId(id), action: 'UPDATE', after: coveragePackage, req});
        return res.status(StatusCodes.OK).json({coveragePackage});
    }

    async deleteCoveragePackage(req: Request, res: Response) {
        const {id} = req.params;
        await pricingService.softDeleteCoveragePackage(parseId(id));

        logAudit({actorId: res.locals.user?.id, entityType: 'CoveragePackage', entityId: parseId(id), action: 'DELETE', req});
        return res.status(StatusCodes.OK).json({msg: 'Coverage package deleted'});
    }

    // --- Price Calculation ---

    async calculate(req: Request, res: Response) {
        const data = validate(calculatePricingSchema, req.body);
        const result = await pricingService.calculate(data);
        return res.status(StatusCodes.OK).json(result);
    }
}

export default new PricingController();
