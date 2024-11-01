export interface PGSourceDetails {
  source_id: string,
  name: string,
  plugin_name: string,
  database_hostname: string,
  database_port: number,
  database_user: string,
  database_password: string,
  database_dbname: string,
  database_server_name: string
}

export type PGDetailsNoPW = Omit<PGSourceDetails, "database_password">;

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
    'tombstone.on.delete': string;
    'topic.prefix': string;
    'transforms': string;
    'transforms.outbox.type': string;
    'transforms.outbox.table.fields.additional.placement': string;
    'transforms.outbox.table.expand.json.payload': string;
    'value.converter': string;
    'heartbeat.action.query': string;
    'heartbeat.interval.ms': number;
    'publication.name': string;
  }
}

export interface DataBaseConnector extends DebeziumConnector {
  date_created: Date;
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