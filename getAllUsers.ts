import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getUser } from './mongo-modules';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { username } = event.queryStringParameters || {};
        const data = await getUser(username);
        return {
            statusCode : 200,
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