import express from 'express';
import cors from 'cors';
import sourceRouter from './routes/sourceRoutes';
import consumerRouter from './routes/consumerRoutes';
import topicRouter from './routes/topicRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/sources', sourceRouter);
app.use('/consumers', consumerRouter);
app.use('/topics', topicRouter);

export default app;