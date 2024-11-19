import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW, PGCredentials, PGSourceDetailsWithSlotName } from "../types/sourceTypes"
import { query } from '../database/pg';
import { hashPassword } from "./encrypt";
import { DatabaseError } from "../utils/errors";
import { Client } from "pg";
import { formatDateForFrontend } from "./consumerHelper";
import dotenv from 'dotenv';
dotenv.config();

const KafkaBrokerEndpoints = process.env.NODE_ENV === 'production' ?
  process.env.KAFKA_BROKER_ENDPOINTS : 'localhost:29092,localhost:39092,localhost:49092';

if (!KafkaBrokerEndpoints) {
  throw new Error("Kafka broker endpoints are not defined!");
}

const APICURIO_REGISTRY_URL = process.env.NODE_ENV === 'production' ?
  process.env.APICURIO_REGISTRY_URL : 'http://apicurio:8080/apis/registry/v2';

if (!APICURIO_REGISTRY_URL) {
  throw new Error("Apicurio registry URL is not defined!");
}

const createSourceDBClient = (credentials: PGCredentials) => {
  const client = new Client ({
    user: credentials.database_user,
    password: credentials.database_password,
    host: credentials.database_hostname,
    port: credentials.database_port,
    database: credentials.database_dbname,
  });

  return client;
};

export const deleteReplicationSlot = async (slotName: string, dbCredentials: PGCredentials) => {
  const client = createSourceDBClient(dbCredentials);

  try {
    await client.connect();
    const existingSlotName = await client.query(`SELECT * FROM pg_replication_slots where slot_name = $1`, [slotName]);

    if (existingSlotName.rows[0]) {
      await findAndKillActiveSlot(slotName, client);
      await client.query('SELECT pg_drop_replication_slot($1)', [slotName]);
      console.log(`Replication slot "${slotName}" dropped successfully.`);
    }
  } catch (err) {
      console.error('Error dropping replication slot:', err);
  } finally {
      await client.end();
  }
};

const findAndKillActiveSlot = async (slotName: string, client: Client) => {
  const activeSlot = await client.query(`SELECT * FROM pg_replication_slots where active = 'true' AND slot_name = $1`, [slotName]);

  if (activeSlot.rows[0]) {
    const pid = activeSlot.rows[0].active_pid;
    await client.query('SELECT pg_terminate_backend($1)', [pid]);
  }
};

export const createOutboxTableInSource = async (dbCredentials: PGCredentials) => {
  const client = createSourceDBClient(dbCredentials);

  try {
    await client.connect();
    const createOutboxTableQuery = 
    `DO $$
    BEGIN
        IF to_regclass('public.outbox') IS NULL THEN
            CREATE TABLE public.outbox (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                aggregatetype VARCHAR(255) NOT NULL,
                aggregateid VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                payload JSONB NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        END IF;

        IF to_regclass('public.heartbeat') IS NULL THEN
            CREATE TABLE public.heartbeat (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                source TEXT NOT NULL,
                timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        END IF;
    END $$;`
    await client.query(createOutboxTableQuery);
    return { success: true, message: 'Outbox and heartbeat tables were successfully created or already exist.', status: 200};
  } catch (error: any) {
    if (error.code === '42501') {
      return {
        success: false,
        message: 'Insufficient privileges to create tables. Check user permissions.',
        status: 403
      }
    } else {
      return {
        success: false,
        message: 'An unknown error occurred when creating outbox/heartbeat tables',
        status: 500
      }
    }
  } finally {
    await client.end();
  }
}

export const getConfigData = (sourceDetails: PGSourceDetails): DebeziumConnector => {
  const slotName = `tumbleweed_${sourceDetails.name}`;
  
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
      "slot.name": slotName,
      "transforms": "outbox",
      "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
      "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
      "schema.history.internal.kafka.bootstrap.servers": KafkaBrokerEndpoints,
      "schema.history.internal.kafka.topic": "schema-changes.inventory",
      "key.converter": "io.apicurio.registry.utils.converter.ExtJsonConverter",
      "key.converter.apicurio.registry.url": APICURIO_REGISTRY_URL,
      "key.converter.apicurio.registry.auto-register": "true",
      "key.converter.apicurio.registry.find-latest": "true",
      "value.converter": "io.apicurio.registry.utils.converter.ExtJsonConverter",
      "value.converter.apicurio.registry.url": APICURIO_REGISTRY_URL,
      "value.converter.apicurio.registry.auto-register": "true",
      "value.converter.apicurio.registry.find-latest": "true",
      "topic.prefix": "app",
      "heartbeat.action.query": `INSERT INTO heartbeat (timestamp, source) VALUES (now(), '${slotName}')`,
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
      schema_history_internal_kafka_bootstrap_servers,
      schema_history_internal_kafka_topic,
      key_converter,
      key_converter_apicurio_registry_url,
      key_converter_apicurio_registry_auto_register,
      key_converter_apicurio_registry_find_latest,
      value_converter,
      value_converter_apicurio_registry_url,
      value_converter_apicurio_registry_auto_register,
      value_converter_apicurio_registry_find_latest,
      topic_prefix,
      heartbeat_action_query,
      heartbeat_interval_ms,
      publication_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
      RETURNING name, 
      database_hostname,
      database_port,
      database_user,
      database_dbname,
      database_server_name,
      date_created,
      slot_name`,
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
        source.config["schema.history.internal.kafka.bootstrap.servers"],
        source.config["schema.history.internal.kafka.topic"],
        source.config["key.converter"],
        source.config["key.converter.apicurio.registry.url"],
        source.config["key.converter.apicurio.registry.auto-register"],
        source.config["key.converter.apicurio.registry.find-latest"],
        source.config["value.converter"],
        source.config["value.converter.apicurio.registry.url"],
        source.config["value.converter.apicurio.registry.auto-register"],
        source.config["value.converter.apicurio.registry.find-latest"],
        source.config["topic.prefix"],
        source.config["heartbeat.action.query"],
        source.config["heartbeat.interval.ms"],
        source.config["publication.name"],
      ]);
    return newConnector.rows[0];
  } catch (error) {
    console.error('There was an error adding a new connector to the database');
    throw new DatabaseError(`There was an error adding a new connector to the database: ${error}`)
  }
};

export const getAllConnectors = async () => {
  try {
    const sourceDetails: { rows: PGDetailsNoPW[] } = await query(`SELECT name, 
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name,
      date_created,
      slot_name 
      FROM connectors`);
    return sourceDetails.rows.map((source: PGDetailsNoPW) => ({
      ...source,
      date_created: formatDateForFrontend(source.date_created)}));
  } catch (error) {
    console.error('There was an error retreiving connectors from the database');
  }
};

export const getConnectorByName = async (connector: string) => {
  try {
    const sourceDetails: { rows: PGDetailsNoPW[] } = await query(`SELECT name,  
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name,
      date_created,
      slot_name 
      FROM connectors WHERE name = $1`,
      [connector]);
    return sourceDetails.rows[0];
  } catch (error) {
    console.error(`There was an error retreiving connector from the database: ${error}`);
  }
};

export const getConnectorWithSlotNameandPW = async (connector: string) => {
  try {
    const sourceDetails: { rows: PGSourceDetailsWithSlotName[] } = await query(`SELECT name, 
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name,
      database_password,
      slot_name
      FROM connectors WHERE name = $1`,
      [connector]);
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
