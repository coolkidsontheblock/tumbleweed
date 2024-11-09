import express from 'express';
import cors from 'cors';
import sourceRouter from './routes/sourceRoutes';
import consumerRouter from './routes/consumerRoutes';
import topicRouter from './routes/topicRoutes';
import kafkaRouter from './routes/kafkaRoutes';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/sources', sourceRouter);
app.use('/consumers', consumerRouter);
app.use('/topics', topicRouter);
app.use('/tumbleweed', kafkaRouter);
app.use(errorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

export default app;