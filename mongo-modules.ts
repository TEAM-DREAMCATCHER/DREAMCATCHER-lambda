import { connectToDatabase } from './mongodb';

export async function getAllUsers() {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('Users').find().toArray();
        return data;
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}

export async function validateDuplicate(username) {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('Users').findOne({ username : username });
        return data;
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}