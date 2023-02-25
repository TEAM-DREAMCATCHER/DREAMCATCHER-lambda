import 'dotenv/config';
import express, { Request, Response } from 'express';
import {handler as getAllUsers} from './getAllUsers'

const app = express();

app.get('/', async (req: any, res: any) => {
    try {
        const result = await getAllUsers(req, res)
        res.status(200).send({
            status: result.statusCode,
            body: JSON.parse(result.body)
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }

});

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

