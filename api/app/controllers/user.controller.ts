import {Request, Response} from 'express';
import {logger} from '../utils';
import {userService} from '../services';
import {StatusCodes} from 'http-status-codes';
import logAudit from '../middleware/audit.middleware';
import {createUserSchema, updateUserSchema, changePasswordSchema, validate, ValidationError} from '../validators';

class UserController {
    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAll();
            return res.status(StatusCodes.OK).json(users);
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const user = await userService.getOne(id);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({msg: 'User not found'});
            }
            return res.status(StatusCodes.OK).json(user);
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = validate(createUserSchema, req.body);
            const user = await userService.create(data);
            logAudit({actorId: res.locals.user?.id, entityType: 'User', entityId: user.id, action: 'CREATE', after: user, req});
            return res.status(StatusCodes.CREATED).json(user);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);
            if (error.code === 'P2002') {
                return res.status(StatusCodes.CONFLICT).json({msg: 'User with this email already exists'});
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = validate(updateUserSchema, req.body);
            const before = await userService.getOne(id);
            const user = await userService.update(id, data);
            logAudit({actorId: res.locals.user?.id, entityType: 'User', entityId: id, action: 'UPDATE', before, after: user, req});
            return res.status(StatusCodes.OK).json(user);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const {password} = validate(changePasswordSchema, req.body);
            await userService.changePassword(id, password);
            logAudit({actorId: res.locals.user?.id, entityType: 'User', entityId: id, action: 'UPDATE', after: {passwordChanged: true}, req});
            return res.status(StatusCodes.OK).json({msg: 'Password changed'});
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validation error', errors: error.errors});
            }
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const actorId = res.locals.user?.id;

            // Prevent self-deletion
            if (actorId === id) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: 'Cannot delete your own account'});
            }

            const before = await userService.getOne(id);
            await userService.delete(id);
            logAudit({actorId, entityType: 'User', entityId: id, action: 'DELETE', before, req});
            return res.status(StatusCodes.OK).json({msg: 'User deleted'});
        } catch (error) {
            logger.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Internal server error'});
        }
    }
}

export default new UserController();
