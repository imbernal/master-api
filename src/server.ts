import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logger from './library/Logging';
import authorRoutes from './routes/Author';

const router = express();

/** Connect to Mongo */

mongoose
    .connect(config.mongo.url, { w: 'majority', retryWrites: true })
    .then(() => {
        Logger.info('Connected to mongoDB');
        StartServer();
    })
    .catch((error) => {
        Logger.error('Unable to connect: ');
        Logger.error(error);
    });

/** Only start the server if Mongo Connects */

const StartServer = () => {
    router.use((req, res, next) => {
        /** Log the Request */
        Logger.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}]`);

        res.on('finish', () => {
            /** Log the Response  */
            Logger.info(`Response Code: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    router.use('/authors', authorRoutes);
    /** Error handling */

    router.use((req, res, next) => {
        const error = new Error('not found');
        Logger.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logger.info(`Server is running on port ${config.server.port}`));
};
