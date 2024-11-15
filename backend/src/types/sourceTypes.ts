export interface PGSourceDetails {
  name: string,
  database_hostname: string,
  database_port: number,
  database_user: string,
  database_password: string,
  database_dbname: string,
  database_server_name: string,
  date_created: string
}

export type PGCredentials = Omit<PGSourceDetails, 'name' | 'plugin_name' | 'date_created' | 'database_server_name'>;

export type PGDetailsNoPW = Omit<PGSourceDetails, "database_password">;

export interface PGSourceDetailsWithSlotName extends PGSourceDetails {
  slot_name: string
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
    'tombstone.on.delete': string;
    'topic.prefix': string;
    'transforms': string;
    'transforms.outbox.type': string;
    'transforms.outbox.table.fields.additional.placement': string;
    "schema.history.internal.kafka.bootstrap.servers": string;
    "schema.history.internal.kafka.topic": string;
    "key.converter": string;
    "key.converter.apicurio.registry.url": string;
    "key.converter.apicurio.registry.auto-register": string;
    "key.converter.apicurio.registry.find-latest": string;
    "value.converter": string;
    "value.converter.apicurio.registry.url": string;
    "value.converter.apicurio.registry.auto-register": string;
    "value.converter.apicurio.registry.find-latest": string;
    'heartbeat.action.query': string;
    'heartbeat.interval.ms': number;
    'publication.name': string;
  }
}

export interface DataBaseConnector extends DebeziumConnector {
  date_created: Date;
}
