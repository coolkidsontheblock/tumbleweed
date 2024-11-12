import { ConsumerDetails } from "../types/consumerTypes";
import { query } from '../database/pg';
import * as os from 'os';
import { server } from '../index';
import axios from "axios";

export const getAllConsumerInfo = async () => {
  try {
    const consumers = await query(`SELECT
      name,
      description,
      tumbleweed_endpoint,
      kafka_client_id,
      kafka_broker_endpoints,
      kafka_group_id,
      subscribed_topics,
      received_message_count,
      date_created 
      FROM consumers`);
    return consumers.rows.map((consumer: ConsumerDetails)  => ({
      ...consumer, 
      date_created: formatDateForFrontend(consumer.date_created)}))
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

export const getAllConsumersByName = async (name: string) => {
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

export const postConsumerToDB = async (consumerData: ConsumerDetails, kafkaBrokerEndpoints: string[], tumbleweedEndpoint: string, kafkaClientId: string) => {
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
      subscribed_topics,
      date_created`,
      [
        consumerData.name,
        consumerData.description,
        tumbleweedEndpoint,
        kafkaClientId,
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

const getBackendHostAddressAndPort = async () => {
  const serverPort = (server.address() as any).port;
  if (process.env.NODE_ENV === 'production') {
    return await getPublicAddress(serverPort);
  } else {
    return getLocalAddress(serverPort);
  }
}

const getLocalAddress = (serverPort: string) => {
  const interfaces = os.networkInterfaces();

  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    
    if (addresses) {
      for (const addressInfo of addresses) {
        if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
          return `${addressInfo.address}:${serverPort}`;
        }
      }
    }
  }
  return `localhost:${serverPort}`;
}

const getPublicAddress = async (serverPort: string) => {
  const getPublicIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };
  const publicIP = await getPublicIP();
  return `${publicIP}:${serverPort}`;
}

export const getConsumerConnectionURI = async (groupID: string) => {
  const hostAddress = await getBackendHostAddressAndPort();
  return `http://${hostAddress}/tumbleweed/${groupID}`
}

export const formatDateForFrontend = (dateString: string) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZoneName: 'short' 
  };

  return date.toLocaleString('en-US', options);
};