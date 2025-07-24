import {Request, Response} from 'express';
import {logger, UserNotFoundError, AccessDenied} from '../utils';
import {authServices} from '../services';
import {StatusCodes} from 'http-status-codes';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const {nickname, pass} = req.body;

            const token = await authServices.loginUser(nickname, pass);

            return res.status(StatusCodes.OK).json({token});
        } catch (error) {
            logger.error(error);

            if (error instanceof UserNotFoundError) {
                return res.status(StatusCodes.FORBIDDEN).json({msg: error.message});
            }

            if (error instanceof AccessDenied) {
                return res.status(StatusCodes.UNAUTHORIZED).json({msg: error.message});
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
        }
    }

    async checkAuth(req: Request, res: Response) {
        try {
            const token = req.header('Authorization');

            await authServices.authenticateUser(token);

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

export default new AuthController();
