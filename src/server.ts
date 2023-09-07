import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
// @ts-ignore
import CognitoExpress from 'cognito-express';
import { config } from './config/config';
import Logger from './library/Logging';
import authorRoutes from './routes/Author';
import AWS from 'aws-sdk';
AWS.config.region = config.aws.region; // e.g., us-east-1

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

    //Initializing CognitoExpress constructor
    const cognitoExpress = new CognitoExpress({
        region: 'us-east-1',
        cognitoUserPoolId: config.aws.poolId,
        tokenUse: 'access', //Possible Values: access | id
        tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
    });

    //Our middleware that authenticates all APIs under our Router
    router.use(function (req, res, next) {
        //I'm passing in the access token in header under key accessToken
        let accessTokenFromClient = req.headers.bearerToken;

        //Fail if token not present in header.
        if (!accessTokenFromClient) return res.status(401).send('Access Token missing from header');

        cognitoExpress.validate(accessTokenFromClient, function (err: any, response: any) {
            //If API is not authenticated, Return 401 with error message.
            if (err) return res.status(401).send(err);

            //Else API has been authenticated. Proceed.
            res.locals.user = response;

            next();
        });
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
