import { PGSourceDetails, DebeziumConnector, PGDetailsNoPW } from "../types/sourceTypes";
import { ConsumerDetails, ConsumerName } from "../types/consumerTypes";
import { query } from '../database/pg';

export const getAllConsumers = async () => {
  try {
    const consumers = await query(`SELECT name FROM consumers`);
    const consumerNames = consumers.rows.map((consumer: ConsumerName) => consumer.name);
    return consumerNames;
  } catch (error) {
    console.error(`There was an error getting the consumers to the database: ${error}`);
  }
};

export const getConsumerByName = async (name: string) => {
  try {
    const consumerDetails: { rows: ConsumerDetails[] } = await query(`SELECT 
      name,
      description,
      endpoint_URL,
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

export const postConsumerToDB = async (consumerData: ConsumerDetails, kafkaBrokerEndpoints: string[]) => {
  try {
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
        kafkaBrokerEndpoints,
        consumerData.kafka_group_id,
        consumerData.subscribed_topics,
      ]);
    return newConsumer.rows[0];
  } catch (error) {
    throw error + ' when adding new consumer to DB';
  }
};