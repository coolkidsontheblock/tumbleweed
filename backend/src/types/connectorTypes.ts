export interface PostgresSourceDetails {
  hostname: string;
  port: number;
  user: string;
  password: string;
  dbname: string;
  serverName: string;
  connectorName: string;
}

export interface DebeziumConnector {
  name: string;
  config: {
    'connector.class': string;
    'plugin.name': string;
    'database.hostname': string;
    'database.port': number;
    'database.user': string;
    'database.password': string;
    'database.dbname': string;
    'database.server.name': string;
    'table.include.list': string;
    'slot.name': string;
    'topic.prefix': string;
    'transforms': string;
    'transforms.outbox.type': string;
    'transforms.outbox.route.topic.replacement': string;
    'transforms.outbox.table.fields.additional.placement': string;
    'transforms.outbox.table.expand.json.payload': string;
    'value.converter': string;
    'heartbeat.action.query': string;
    'heartbeat.interval.ms': number;
    'publication.name': string;
  }
}

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