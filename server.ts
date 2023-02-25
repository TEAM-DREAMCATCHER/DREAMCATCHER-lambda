import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getAllUsers } from './getAllUsers';
import { handler as validateDuplicate } from './vaildateDuplicate';

const app = express();

app.get('/', async (req: any, res: any) => {
    try {
        const result = await getAllUsers(req, res);
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

app.get('/api/user/dupUsername', async (req: any, res: any) => {
    req.queryStringParameters = { username : req.query.username };
    const result = await validateDuplicate(req, res);
    res.status(result.statusCode).send({
        body : JSON.parse(result.body)
    });
});

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

