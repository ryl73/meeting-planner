import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dbConnect } from './db';
import { router } from './routes';
import { errorHandlingMiddleware } from './middleware/errorHandling';

dotenv.config();

const port = Number(process.env.SERVER_PORT) || 3001;

async function startServer() {
    await dbConnect();

    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    );

    app.use('/api', router);

    app.use(errorHandlingMiddleware);

    app.listen(port, () =>
        console.log(`➜ 🎸 Server is listening on http://localhost:${port}`)
    );
}

startServer().then();
