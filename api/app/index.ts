import {config} from 'dotenv';
import express from 'express';
import cors from 'cors';
import {logger} from './utils';
import {router} from './routers';

config();

const startServer = async () => {
    try {
        const app = express();
        const port = process.env.PORT || 3000;
        app.use(cors());
        app.use(express.json());
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
