import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW } from "../types/sourceTypes"
import shortUuid from 'short-uuid';
import { query } from '../database/pg';
import { hashPassword } from "./encrypt";

const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_';

export const getConfigData = (sourceDetails: PGSourceDetails): DebeziumConnector => {
  return {
    "name": sourceDetails.name,
    "config": {
      "plugin.name": "pgoutput",
      "database.hostname": sourceDetails.database_hostname,
      "database.port": sourceDetails.database_port,
      "database.user": sourceDetails.database_user,
      "database.password": sourceDetails.database_password,
      "database.dbname": sourceDetails.database_dbname,
      "database.server.name": sourceDetails.database_server_name,
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "table.include.list": "public.outbox",
      "tombstone.on.delete": "false",
      "slot.name": `tumbleweed_${shortUuid(VALID_CHARS).generate()}`,
      "transforms": "outbox",
      "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
      "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false",
      "topic.prefix": "app",
      "heartbeat.action.query": `INSERT INTO heartbeat (timestamp, hostname) VALUES (now(), dbname: ${sourceDetails.database_dbname}, user: ${sourceDetails.database_user})`,
      "heartbeat.interval.ms": 300000,
      "publication.name": "dbz_publication"
    }
  }
};

export const postConfigDataToDB = async (source: DebeziumConnector) => {
  try {
    const hashedPassword = await hashPassword(source.config["database.password"]);
    const newConnector: { rows: PGDetailsNoPW[] } = await query(`INSERT INTO connectors (
      name, 
      plugin_name,
      database_hostname,
      database_port,
      database_user,
      database_password,
      database_dbname,
      database_server_name,
      connector_class,
      table_include_list,
      tombstone_on_delete,
      slot_name,
      transforms,
      transforms_outbox_type,
      transforms_outbox_table_fields_additional_placement,
      value_converter_schemas_enable,
      value_converter,
      topic_prefix,
      heartbeat_action_query,
      heartbeat_interval_ms,
      publication_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING name, 
      plugin_name,
      database_hostname,
      database_port,
      database_user,
      database_dbname,
      database_server_name`,
      [
        source.name,
        source.config["plugin.name"],
        source.config["database.hostname"],
        source.config["database.port"],
        source.config["database.user"],
        hashedPassword,
        source.config["database.dbname"],
        source.config["database.server.name"],
        source.config["connector.class"],
        source.config["table.include.list"],
        source.config["tombstone.on.delete"],
        source.config["slot.name"],
        source.config["transforms"],
        source.config["transforms.outbox.type"],
        source.config["transforms.outbox.table.fields.additional.placement"],
        source.config["value.converter.schemas.enable"],
        source.config["value.converter"],
        source.config["topic.prefix"],
        source.config["heartbeat.action.query"],
        source.config["heartbeat.interval.ms"],
        source.config["publication.name"],
      ]);
    return newConnector.rows[0];
  } catch (error) {
    console.error(`There was an error adding a new connector to the database: ${error}`);
    // Add some rollback validation in debezium fails?
  }
};

export const getConnectorByName = async (name: string) => {
  try {
    const sourceDetails: { rows: PGDetailsNoPW[] } = await query(`SELECT name, 
      plugin_name, 
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name 
      FROM connectors WHERE name = $1`,
      [name]);
    return sourceDetails.rows[0];
  } catch (error) {
    console.error(`There was an error retreiving connector from the database: ${error}`);
  }
};

export const deleteConnectorByName = async (name: string) => {
  try {
    await query(`DELETE FROM connectors WHERE name = $1`,
      [name]);
  } catch (error) {
    console.error(`There was an error deleting connector from the database: ${error}`);
  }
}