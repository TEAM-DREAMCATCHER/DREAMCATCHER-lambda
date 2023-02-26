import { connectToDatabase } from './mongodb';
import { ObjectId, WithId } from 'mongodb';

// 전체 유저 가져오기
export async function getUser(username) {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('Users').findOne({
            username : username
        });
        return {
            username : data?.username,
            password : data?.password
        };
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}

// 아이디 중복 검사
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

// 회원가입
export async function signup(username, password) {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('Users').insertOne({
            username : username,
            password : password,
        });
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

// 커뮤니티 날짜 순 가져오기
export async function getDreamsDate() {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('dreams').find({ pri : false }).sort({ createdAt : -1 }).toArray();
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