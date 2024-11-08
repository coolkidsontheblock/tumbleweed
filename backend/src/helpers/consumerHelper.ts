import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW } from "../types/sourceTypes";
import { ConsumerDetails, ConsumerName } from "../types/consumerTypes";
import { query } from '../database/pg';
import * as os from 'os';
import { server } from '../index';

export const getAllConsumers = async () => {
  try {
    const consumers = await query(`SELECT name FROM consumers`);
    const consumerNames = consumers.rows.map((consumer: ConsumerName) => consumer.name);
    return consumerNames;
  } catch (error) {
    console.error(`There was an error getting the consumers to the database: ${error}`);
  }
};

export const getConsumerByGroupId = async (groupId: string) => {
  try {
    const consumerDetails: { rows: ConsumerDetails[] } = await query(`SELECT 
      name,
      description,
      tumbleweed_endpoint,
      kafka_client_id,
      kafka_broker_endpoints,
      kafka_group_id,
      subscribed_topics,
      received_message_count,
      date_created 
      FROM consumers WHERE kafka_group_id = $1`,
      [groupId]);

    return consumerDetails.rows[0];
  } catch (error) {
    console.error(`There was an error retreiving consumer from the database: ${error}`);
  }
};

export const getConsumerByName = async (name: string) => {
  try {
    const consumerDetails: { rows: ConsumerDetails[] } = await query(`SELECT 
      name,
      description,
      tumbleweed_endpoint,
      kafka_client_id,
      kafka_broker_endpoints,
      kafka_group_id,
      subscribed_topics,
      received_message_count,
      date_created 
      FROM consumers WHERE name = $1`,
      [name]);

    return consumerDetails.rows[0];
  } catch (error) {
    console.error(`There was an error retreiving consumer from the database: ${error}`);
  }
};

export const postConsumerToDB = async (consumerData: ConsumerDetails, kafkaBrokerEndpoints: string[], tumbleweedEndpoint: string) => {
  try {
    const newConsumer = await query(`INSERT INTO consumers (
      name,
      description,
      tumbleweed_endpoint,
      kafka_client_id,
      kafka_broker_endpoints,
      kafka_group_id,
      subscribed_topics)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING name, 
      subscribed_topics`,
      [
        consumerData.name,
        consumerData.description,
        tumbleweedEndpoint,
        consumerData.kafka_client_id,
        kafkaBrokerEndpoints,
        consumerData.kafka_group_id,
        consumerData.subscribed_topics,
      ]);
    return newConsumer.rows[0];
  } catch (error) {
    throw error + ' when adding new consumer to DB';
  }
};

export const deleteConsumerByName = async (name: string) => {
  try {
    await query(`DELETE FROM consumers WHERE name = $1`,
      [name]);
  } catch (error) {
    console.error(`There was an error deleting connector from the database: ${error}`);
    throw error;
  }
}

const getBackendHostAddressAndPort = () => {
  const portFromServer = (server.address() as any).port;
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    
    if (addresses) {
      for (const addressInfo of addresses) {
        if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
          return `${addressInfo.address}:${portFromServer}`;
        }
      }
    }
  }
  
  return `localhost:${portFromServer}`; // fallback
}

export const getConsumerConnectionURI = (groupID: string) => {
  const hostAddress = getBackendHostAddressAndPort();
  return `${hostAddress}/tumbleweed/${groupID}`
}