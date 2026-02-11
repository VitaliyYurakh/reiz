import {NextFunction, Request, Response} from 'express';

const parsePagination = (req: Request, res: Response, next: NextFunction) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    res.locals.pagination = {page, limit, skip: (page - 1) * limit};

    next();
};

export default parsePagination;
