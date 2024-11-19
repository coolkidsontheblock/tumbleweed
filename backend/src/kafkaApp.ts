import express from 'express';
import cors from 'cors';
import kafkaRouter from './routes/kafkaRoutes';
import { errorHandler } from './middlewares/errorHandler';

const kafkaApp = express();

kafkaApp.use(cors());
kafkaApp.use(express.json());
kafkaApp.use('/tumbleweed', kafkaRouter);
kafkaApp.use(errorHandler);

export { kafkaApp };
