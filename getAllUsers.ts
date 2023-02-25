import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getAllUsers } from './mongo-modules';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const allData = await getAllUsers();
        return {
            statusCode : 200,
            body : JSON.stringify(allData),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};