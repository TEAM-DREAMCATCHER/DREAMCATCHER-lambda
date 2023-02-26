import {
    APIGatewayEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    Context
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { getUser } from './mongo-modules';

interface Claims {
    sub: string;
    iat: number;
    exp: number;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { username, password } = event.queryStringParameters || {};

        if (!username || !password) {
            return {
                statusCode : 400,
                body : 'Username or password parameter is required'
            };
        }
        const userData = await getUser(username);
        if (!userData) {
            return {
                statusCode : 400,
                body : JSON.stringify({
                    message : 'Not existing user.',
                    result : false,
                })
            };
        } else if (userData.username !== username || userData.password !== password) {
            return {
                statusCode : 400,
                body : JSON.stringify({
                    message : 'Not existing user.',
                    result : false,
                })
            };
        }

        const claims: Claims = {
            sub : username,
            iat : Math.floor(Date.now() / 1000),
            exp : Math.floor(Date.now() / 1000) + (60 * 60) // Expires in 1 hour
        };

        const token = jwt.sign(claims, process.env.JWT_SECRET);
        console.log(token);

        // result(JSON.stringify({ token }));
        return {
            statusCode : 200,
            body : JSON.stringify({ token })
        };
    } catch (error) {
        console.error('Error generating token:', error);
        return {
            statusCode : 500,
            body : 'Internal Server Error'
        };
    }
};
