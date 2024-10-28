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
        "slot.name": `dumpy_${shortUuid(VALID_CHARS).generate()}`,
        "topic.prefix": "app",
        "transforms": "outbox",
        "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
        "transforms.outbox.route.topic.replacement": "orders",
        "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
        "transforms.outbox.table.expand.json.payload": "true",
        "value.converter": "org.apache.kafka.connect.storage.StringConverter",
        "heartbeat.action.query": "INSERT INTO heartbeat (timestamp, hostname) VALUES (now(), 'I AM THE HOST')",
        "heartbeat.interval.ms": 300000,
        "publication.name": "dbz_publication"
    }
  }
};
