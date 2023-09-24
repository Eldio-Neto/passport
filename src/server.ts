import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';
import passport from 'passport';
dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));
server.use(passport.initialize());
server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    const status = err.status ?? 400;// Bad Request
    const error = err.message ?? 'Ocorreu algum erro.';
    res.status(status);     
    res.json({ error});
}
server.use(errorHandler);

server.listen(process.env.PORT);