import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW, PGCredentials, PGSourceDetailsWithSlotName } from "../types/sourceTypes"
import { createUUID } from './uuid';
import { query } from '../database/pg';
import { hashPassword } from "./encrypt";
import { DatabaseError } from "../utils/errors";
import { Client } from "pg";
import { formatDateForFrontend } from "./consumerHelper";

const createSourceDBClient = (credentials: PGCredentials) => {
  const client = new Client ({
    user: credentials.database_user,
    password: 'capstoneTeam1',// credentials.database_password,
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
    await findAndKillActiveSlot(slotName, client);
    await client.query('SELECT pg_drop_replication_slot($1)', [slotName]);
    console.log(`Replication slot "${slotName}" dropped successfully.`);
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

export const getReplicationSlotSizeInMB = async (slotName: string, dbCredentials: PGCredentials) => {
  const client = createSourceDBClient(dbCredentials);

  try {
    await client.connect();
    const res = await client.query(`
        SELECT slot_name, restart_lsn, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS wal_size
        FROM pg_replication_slots
        WHERE slot_name = $1`, [slotName]);

    if (res.rows.length > 0) {
        const walSize = res.rows[0].wal_size;
        const walSizeInMB = parseSizeToMB(walSize);
        console.log(`Size of replication slot "${slotName}": ${walSizeInMB} MB`);
        return walSizeInMB;
    } else {
        console.log(`Replication slot "${slotName}" not found.`);
    }
  } catch (err) {
      console.error('Error getting replication slot:', err);
  } finally {
      await client.end();
  }
};

const parseSizeToMB = (size: string): number => {
  const sizeMap: { [key: string]: number } = {
      'kB': 1 / 1024,
      'MB': 1,
      'GB': 1024,
      'TB': 1024 * 1024,
  };

  const match = size.match(/(\d+\.?\d*)\s*(\w+)/);
  if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      return value * (sizeMap[unit] || 0);
  }
  return 0;
}

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
                hostname TEXT NOT NULL,
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
      "slot.name": `tumbleweed_${sourceDetails.name}`,
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
      database_server_name,
      date_created`,
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
    throw new DatabaseError(`There was an error adding a new connector to the database: ${error}`)
    // Add some rollback validation in debezium fails?
  }
};

export const getAllConnectors = async () => {
  try {
    const sourceDetails: { rows: PGDetailsNoPW[] } = await query(`SELECT name, 
      plugin_name, 
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name,
      date_created 
      FROM connectors`);
    return sourceDetails.rows.map((source: PGDetailsNoPW) => ({
      ...source,
      date_created: formatDateForFrontend(source.date_created)}));
  } catch (error) {
    console.error(`There was an error retreiving connector from the database: ${error}`);
  }
};

export const getConnectorByName = async (connector: string) => {
  try {
    const sourceDetails: { rows: PGDetailsNoPW[] } = await query(`SELECT name, 
      plugin_name, 
      database_hostname, 
      database_port, 
      database_user,
      database_dbname, 
      database_server_name,
      date_created 
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
