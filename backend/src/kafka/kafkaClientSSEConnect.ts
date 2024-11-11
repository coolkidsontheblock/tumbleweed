import { Request, Response } from 'express';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { getKafkaBrokerEndpoints } from '../kafka/kafkaAdmin';
import { createUUID, createKafkaClientId } from '../helpers/uuid';

let kafka: Kafka;

export const initializeKafka = async (clientId: string) => {
  const brokers = await getKafkaBrokerEndpoints();
  kafka = new Kafka({
    clientId: clientId,
    brokers,
  });
};

export const createConsumer = async (group_id: string, topics: string[]) => {
    const consumer = kafka.consumer({ groupId: group_id })
    try {
        await consumer.connect();
        await Promise.all(topics.map(topic => consumer.subscribe({ topic, fromBeginning: true})));
        console.log('Consumer successfully created and connected!');
        return consumer;
    } catch (error) {
        console.error(`There was an error creating the consumer: ${error}`);
    }
};

export const consumeMessages = async (consumer: Consumer, res: Response) => {
    try {
      await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          const stringPayload = (message.value?.toString()) || null
          if (!stringPayload) {
            throw new Error('Error: payload does not exist!')
          }

          const msg = {
              value: JSON.parse(stringPayload),
              topic: topic,
            };
            res.write(`data: ${JSON.stringify(msg)}\n\n`); // Send message to client
        },
      });
    } catch (error) {
        console.error(`There was an error consuming messages: ${error}`);
        return null;
    }
}; 