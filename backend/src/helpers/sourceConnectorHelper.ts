import { PostgresSourceDetails, DebeziumConnector } from "../types/connectorTypes"
import shortUuid from 'short-uuid';

const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_';

export const getConfigData = (sourceDetails: PostgresSourceDetails): DebeziumConnector => {
  return {
  "name": sourceDetails.connectorName,
    "config": {
        "plugin.name": "pgoutput",
        "database.hostname": sourceDetails.hostname,
        "database.port": sourceDetails.port,
        "database.user": sourceDetails.user,
        "database.password": sourceDetails.password,
        "database.dbname": sourceDetails.dbname,
        "database.server.name": sourceDetails.serverName,
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "table.include.list": "public.outbox",
        "tombstone.on.delete": "false",
        "slot.name": `tumbleweed_${shortUuid(VALID_CHARS).generate()}`,
        "transforms": "outbox",
        "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
        "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
        "transforms.outbox.table.expand.json.payload": "true",
        "value.converter": "org.apache.kafka.connect.storage.StringConverter",
        "topic.prefix": "app",
        "heartbeat.action.query": "INSERT INTO heartbeat (timestamp, hostname) VALUES (now(), 'Nicks sweeter heartbeat')",
        "heartbeat.interval.ms": 300000,
        "publication.name": "dbz_publication"
    }
  }
};
