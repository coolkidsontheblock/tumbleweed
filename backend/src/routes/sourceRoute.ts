import axios from 'axios';
import express from 'express';
import { getConfigData } from '../helpers/sourceConnectorHelper';

const router = express.Router();

router.post('/new_source', async (req, res, next) => {
  try {
    const sourceDetails = req.body;
    const destination = 'http://localhost:8083/connectors';

    await axios.post(destination, getConfigData(sourceDetails), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(getConfigData(sourceDetails));
    res.status(201).send('Connector created');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;


// {
//   "name": "exampledb-connector-cruz",
//   "config": {
//           "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
//           "plugin.name": "pgoutput",
//           "database.hostname": "database-1.cr0kw0occykz.us-east-1.rds.amazonaws.com",
//           "database.port": 5432,
//           "database.user": "postgres",
//           "database.password": "capstoneTeam1",
//           "database.dbname": "testdb",
//           "database.server.name": "postgres",
//           "table.include.list": "public.outbox",
//           "slot.name": "debezium_slot_cruz",
//           "topic.prefix": "app",
//           "transforms": "outbox",
//           "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
//           "transforms.outbox.route.topic.replacement": "orders",
//           "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
//           "transforms.outbox.table.expand.json.payload": "true",
//           "value.converter": "org.apache.kafka.connect.storage.StringConverter",
//           "heartbeat.action.query": "INSERT INTO heartbeat (timestamp,hostname) VALUES (now(), 'cruz')",
//           "heartbeat.interval.ms": 300000,
//           "publication.name": "dbz_publication"
//   }
// }