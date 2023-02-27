import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getDreamsDate, getUser } from './mongo-modules';
import jwt from 'jsonwebtoken';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const token = event.headers.authorization?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let username = decoded.sub;
        const userData = await getUser(username)
        if (userData?.username !== username || userData?.username === undefined) {
            return {
                statusCode:401,
                body: JSON.stringify({
                    message: 'Invalid credentials.',
                    result: false,
                })
            }
        }
        const allData = await getDreamsDate()
        return {
            statusCode: 200,
            body: JSON.stringify(allData)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode : 401,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};