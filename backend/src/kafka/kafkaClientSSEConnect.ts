import { Response } from 'express';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { getKafkaBrokerEndpoints } from '../kafka/kafkaAdmin';
import { incrementDBMessageCount } from '../helpers/consumerHelper';

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
        console.error('There was an error creating the consumer');
    }
};

export const consumeMessages = async (consumer: Consumer, res: Response, consumerName: string) => {
    try {
      await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          const stringPayload = (message.value?.toString()) || null
          if (!stringPayload) {
            throw new Error('Error: payload does not exist!')
          }

          const payload = JSON.parse(stringPayload).payload.payload;
          const formattedTopic = topic.replace("outbox.event.", "");
          const msg = { payload, topic: formattedTopic };
          res.write(`data: ${JSON.stringify(msg)}\n\n`);
          incrementDBMessageCount(consumerName);

          await consumer.commitOffsets([{ 
            topic, 
            partition, 
            offset: (parseInt(message.offset) + 1).toString()
          }]);
        },
      });
    } catch (error) {
      console.error(`There was an error consuming messages: ${error}`);
      return null;
    }
};
