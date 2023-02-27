import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getUser, myDreams } from './mongo-modules';
import jwt from 'jsonwebtoken';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const token = event.headers.authorization?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = decoded.sub;
        const userData = await getUser(user)
        if (userData?.username !== user || userData?.username === undefined) {
            return {
                statusCode:401,
                headers: {
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify({
                    message: 'Invalid credentials.',
                    result: false,
                })
            }
        }
        const data = await myDreams(user)
        return {
            statusCode : 200,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body : JSON.stringify(data),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};