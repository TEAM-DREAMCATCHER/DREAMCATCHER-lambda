import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { validateDuplicate } from './mongo-modules';

interface QueryStringParam {
    username: string;
}

interface ModifiedAPIGatewayEvent {
    queryStringParameters: QueryStringParam;
}


export const handler = async (event: ModifiedAPIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { username } = event.queryStringParameters || {};
        if (typeof username === 'undefined' || username.length === 0) {
            return {
                statusCode : 400,
                body : JSON.stringify({
                    message : 'Missing username.',
                    result : false
                }),
            };
        }
        const data = await validateDuplicate(username);
        if (data === null) {
            return {
                statusCode : 200,
                body : JSON.stringify({
                    message : 'valid username'
                }),
            };
        } else {
            return {
                statusCode : 400,
                body : JSON.stringify({
                    message : 'Invalid username'
                }),
            };
        }


    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};