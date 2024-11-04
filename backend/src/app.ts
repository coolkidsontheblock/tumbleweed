import express from 'express';
import cors from 'cors';
import sourceRouter from './routes/sourceRoutes';
import consumerRouter from './routes/consumerRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/sources', sourceRouter);
app.use('/consumers', consumerRouter);


export default app;