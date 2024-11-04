import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW } from "../types/connectorTypes";
import { ConsumerDetails } from "../types/consumerTypes";
import { query } from '../database/pg';

export const getAllConsumers = async () => {
  try {
    const consumers = await query(`GET name FROM consumers`)
    return consumers;
    
  } catch (error) {
    
  }
};

export const postConsumerToDB = async (consumerData: ConsumerDetails) => {
  try {
    const brokerEndpointsArray = consumerData.kafka_broker_endpoints.split(',').map(ele => ele.trim());
    const subscribedTopicsArray = consumerData.subscribed_topics.split(',').map(ele => ele.trim());
    const newConsumer = await query(`INSERT INTO consumers (
      name,
      description,
      endpoint_URL,
      kafka_client_id,
      kafka_broker_endpoints,
      kafka_group_id,
      subscribed_topics)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING name, 
      endpoint_url,
      subscribed_topics`,
      [
        consumerData.name,
        consumerData.description,
        consumerData.endpoint_URL,
        consumerData.kafka_client_id,
        brokerEndpointsArray,
        consumerData.kafka_group_id,
        subscribedTopicsArray,
      ]);
      return newConsumer.rows[0];
  } catch (error) {
    console.error(`There was an error adding a new consumer to the database: ${error}`);
  }
};
