import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
dotenv.config();

const KafkaBrokerEndpointsString = process.env.KAFKA_BROKER_ENDPOINTS;

if (!KafkaBrokerEndpointsString) {
  throw new Error("Kafka broker endpoints are not defined");
}
const KafkaBrokerEndpoints: string[] = JSON.parse(KafkaBrokerEndpointsString);

const kafka = new Kafka({
  clientId: 'sse-test-client',
  brokers: KafkaBrokerEndpoints,
});

export const createConsumer = async (group_id: string, topics: string[]) => {
    const consumer = await kafka.consumer({ groupId: group_id })
    try {
        await consumer.connect();
        await Promise.all(topics.map(topic => consumer.subscribe({ topic, fromBeginning: true})));
        console.log('Consumer successfully created and connected!');
        return consumer;
    } catch (error) {
        console.error(`There was an error creating the consumer: ${error}`);
    }
};

export const consumeMessages = async (consumer: Consumer, endpoint: string, res: Response) => {
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