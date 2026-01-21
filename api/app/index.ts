import {config} from 'dotenv';
config({ override: true }); // Override existing env vars with values from .env

import express from 'express';
import cors from 'cors';
import {logger} from './utils';
import {router} from './routers';
import path from 'node:path';

const startServer = async () => {
    try {
        const app = express();
        const port = process.env.PORT || 3000;
        const pathToUploads = path.resolve('./uploads/');
        app.use(cors());
        app.use(express.json());
        app.use('/static', express.static(pathToUploads));
        app.use('/api', router);

        app.use((req, res, next) => {
            console.log('Incoming request:', req.method, req.url);
            next();
        });

        app.listen(port, async () => {
            logger.info(`Example app listening on port ${port}`);
        });
    } catch (error) {
        logger.fatal(error);
        process.exit(1);
    }
};

startServer();
