import express from 'express';
import cors from 'cors';
import sourceRouter from './routes/sourceRoute';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/sources', sourceRouter);


export default app;