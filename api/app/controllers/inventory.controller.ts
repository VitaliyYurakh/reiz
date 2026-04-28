import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import inventoryService from '../services/inventory.service';
import {parseId, parseOptionalId, parsePagination} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {validate, createInventoryItemSchema, updateInventoryItemSchema} from '../validators';

class InventoryController {
    async list(req: Request, res: Response) {
        const {page, limit} = parsePagination(req.query);
        const result = await inventoryService.list({
            page, limit,
            status: req.query.status as string | undefined,
            category: req.query.category as string | undefined,
            locationId: parseOptionalId(req.query.locationId as string | undefined, 'locationId'),
            responsibleUserId: parseOptionalId(req.query.responsibleUserId as string | undefined, 'responsibleUserId'),
            search: req.query.search as string | undefined,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const item = await inventoryService.getOne(parseId(req.params.id));
        if (!item) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Inventory item not found'});
        res.status(StatusCodes.OK).json({item});
    }

    async create(req: Request, res: Response) {
        const data = validate(createInventoryItemSchema, req.body);
        const item = await inventoryService.create(data);
        logAudit({actorId: res.locals.user?.id, entityType: 'InventoryItem', entityId: item.id, action: 'CREATE', after: item, req});
        res.status(StatusCodes.CREATED).json({item});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updateInventoryItemSchema, req.body);
        const item = await inventoryService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'InventoryItem', entityId: id, action: 'UPDATE', after: item, req});
        res.status(StatusCodes.OK).json({item});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await inventoryService.delete(id);
        logAudit({actorId: res.locals.user?.id, entityType: 'InventoryItem', entityId: id, action: 'DELETE', req});
        res.status(StatusCodes.OK).json({msg: 'Inventory item deleted'});
    }

    async stats(_req: Request, res: Response) {
        res.status(StatusCodes.OK).json(await inventoryService.stats());
    }
}

export default new InventoryController();
