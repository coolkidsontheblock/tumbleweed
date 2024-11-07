export interface PGSourceDetails {
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
    "value.converter.schemas.enable": string;
    'value.converter': string;
    'heartbeat.action.query': string;
    'heartbeat.interval.ms': number;
    'publication.name': string;
  }
}

export interface DataBaseConnector extends DebeziumConnector {
  date_created: Date;
}