import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getUser, signup } from './mongo-modules';
import * as jwt from 'jsonwebtoken';

interface Claims {
    sub: string | undefined;
    iat: number;
    exp: number;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { username, password } = event.queryStringParameters || {};
        const userData = await getUser(username);
        if (userData !== null && userData?.username === username) {
            return {
                statusCode : 400,
                body : JSON.stringify({
                    message : 'Invalid username',
                    result : false,
                }),
            };
        }
        await signup(username, password);

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
            body : JSON.stringify({
                message : 'Created successfully.',
                token : token
            })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};