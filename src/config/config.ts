import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@double2.5i48ses.mongodb.net/master-api`;

/** AWS CONFIG */
const AWS_REGION = process.env.AWS_REGION;
const AWS_COGNITO_POOL_ID = process.env.AWS_COGNITO_POOL_ID;
const AWS_COGNITO_APP_CLIENT_ID = process.env.AWS_COGNITO_APP_CLIENT_ID;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    aws: {
        region: AWS_REGION,
        clientID: AWS_COGNITO_APP_CLIENT_ID,
        poolId: AWS_COGNITO_POOL_ID
    }
};
