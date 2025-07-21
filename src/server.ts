import express, { Handler, Request, Response } from 'express';
import { writeFileSync } from 'fs';
import { setUserIp } from './redis';
import { ConfigSchema } from '@mystiker123/config-schema';
import cors from 'cors';

/* ------------------------------------------------------------------ */
/* express app                                                        */
/* ------------------------------------------------------------------ */

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        exposedHeaders: ['user'],
        allowedHeaders: ['Content-Type', 'user'],
    })
);

const createConfig: Handler = async (req: Request, res: Response): Promise<void> => {
    const user: string | undefined = req.get('user');
    if (!user) {
        console.error('user not provided');
        res.status(400);
        return;
    }
    const parsed = ConfigSchema.safeParse(req.body);
    if (!parsed.success) {
        console.error('JSON does not fit schema')
        res.status(400);
        return;
    }
    try {
        writeFileSync(`data/${user}/config.json`, JSON.stringify(parsed.data),'utf-8');
        res.status(200);
    } catch (e) {
        console.error('[config] write failed');
        res.status(500);
    }
}

app.post('/config', createConfig);

/* ------------------------------------------------------------------ */
/* start server                                                       */
/* ------------------------------------------------------------------ */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.log(`🚀  API ready on http://localhost:${PORT}`);
});
