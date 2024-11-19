import { app } from './app';
import { pool } from './database/pg';
import { kafkaApp } from './kafkaApp';
import http from 'http';

const tumbleweedPort = process.env.PORT || 3001;
const kafkaPort = process.env.KAFKAPORT || 4001;

process.on('exit', () => {
  pool.end(() => {
    console.log('Connection pool has closed');
  });
});

let tumbleweedServer: http.Server;
let kafkaServer: http.Server;

if (require.main === module) {
  tumbleweedServer = app.listen(tumbleweedPort, () => {
    console.log(`[TumblweedServer]: Tumbleweed Server is running on PORT ${tumbleweedPort} in ${process.env.NODE_ENV === 'production' ? 'production mode' : 'development mode'}`);
  });

  kafkaServer = kafkaApp.listen(kafkaPort, () => {
    console.log(`[KafkaServer]: Kafka Server is running on PORT ${kafkaPort} in ${process.env.NODE_ENV === 'production' ? 'production mode' : 'development mode'}`);
  });
};

export {
  app,
  kafkaApp,
  tumbleweedServer,
  kafkaServer
};
