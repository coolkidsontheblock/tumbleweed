import express from 'express';
import cors from 'cors';
import kafkaRouter from './routes/kafkaRoutes';
import { errorHandler } from './middlewares/errorHandler';

// const kafkaPort = process.env.PORT || 4001;

const kafkaApp = express();

kafkaApp.use(cors());
kafkaApp.use(express.json());


kafkaApp.use('/tumbleweed', kafkaRouter);
kafkaApp.use(errorHandler);


// let kafkaServer: http.Server;

// if (require.main === module) {
  // kafkaServer = kafkaApp.listen(kafkaPort, () => {
  //   console.log(`[KafkaServer]: Kafka Server is running on PORT ${kafkaPort} in ${process.env.NODE_ENV === 'production' ? 'production mode' : 'development mode'}`);
  // });
// }

// KAFKA_BROKER_ENDPOINTS="localhost:29092, localhost:39092, localhost:49092"

export { kafkaApp };