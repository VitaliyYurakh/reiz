import {config} from 'dotenv';
import express from 'express';
import cors from 'cors';
import {logger} from './utils';
import {router} from './routers';
import path from 'node:path';

config();

const startServer = async () => {
    try {
        const app = express();
        const port = process.env.PORT || 3000;
        const pathToUploads = path.resolve('./uploads/');
        console.log({pathToUploads});
        app.use(cors());
        app.use(express.json());
        app.use('/static', express.static(pathToUploads));
        app.use('/api', router);

        app.listen(port, async () => {
            logger.info(`Example app listening on port ${port}`);
        });
    } catch (error) {
        logger.fatal(error);
        process.exit(1);
    }
};

startServer();
