import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getUser } from './getAllUsers';
import { handler as validateDuplicate } from './vaildateDuplicate';
import { handler as signup } from './signup';
import {handler as makeToken } from './login'
import { handler as getDreamsDate } from './getDreamsDate';

const app = express();

// 유저 조회
app.get('/', async (req: any, res: any) => {
    try {
        req.queryStringParameters = { username : req.query.username };
        const result = await getUser(req, res);
        res.status(result.statusCode).send({
            body : JSON.parse(result.body)
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
});

// 아이디 중복 검사
app.get('/api/user/dupUsername', async (req: any, res: any) => {
    try {
        req.queryStringParameters = { username : req.query.username };
        const result = await validateDuplicate(req, res);
        res.status(result.statusCode).send({
            body : JSON.parse(result.body)
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }

});

// 회원가입
app.post('/api/user/signup', async (req: any, res: any) => {
    try {
        req.queryStringParameters = {
            username : req.query.username,
            password : req.query.password,
        };
        const result = await signup(req, res);
        console.log(result)
        res.status(result.statusCode).send({
            body : JSON.parse(result.body)
        })
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
})

// 로그인
app.post('/api/user/login', async (req: any, res: any) => {
    try {
        req.queryStringParameters = {
            username : req.query.username,
            password : req.query.password,
        };
        const result = await signup(req, res);
        res.status(result.statusCode).send({
            body : JSON.parse(result.body)
        })
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
})

// token 만들기
app.post('/api/token', async (req: any, res: any) => {
    try {
        req.queryStringParameters = { username : req.query.username };
        const result = await makeToken(req, res)
        console.log(result)
        res.status(200).send(result)
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
})

// 날짜 순 글 가져오기
app.get('/api/community/date', async (req: any, res: any) => {
    try {
        const data = await getDreamsDate(req, res);
        res.status(200).send({
            result: true,
            body: JSON.parse(data.body)
        })
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
})

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

