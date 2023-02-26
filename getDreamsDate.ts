import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getDreamsDate, validateDuplicate } from './mongo-modules';

interface QueryStringParam {
    username: string;
}

interface ModifiedAPIGatewayEvent {
    queryStringParameters: QueryStringParam;
}


export const handler = async (event: ModifiedAPIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const allData = await getDreamsDate()
        return {
            statusCode: 200,
            body: JSON.stringify(allData)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};