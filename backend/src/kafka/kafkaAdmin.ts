import { Kafka } from 'kafkajs';
import { TopicName, TopicOffsetByPartition } from '../types/topicTypes';
import dotenv from 'dotenv';
dotenv.config();

const KafkaBrokerEndpointsString = process.env.KAFKA_BROKER_ENDPOINTS;

if (!KafkaBrokerEndpointsString) {
  throw new Error("Kafka broker endpoints are not defined");
}
const KafkaBrokerEndpoints: string[] = JSON.parse(KafkaBrokerEndpointsString);

const kafka = new Kafka({
  clientId: 'tumbleweed-topic-fetch',
  brokers: KafkaBrokerEndpoints,
});

const admin = kafka.admin();

export const getTopics = async () => {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    console.log(topics);
    if (!topics) {
      return [];
    } else {
      return formatTopics(topics);
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  } finally {
    await admin.disconnect();
  }
};

export const getTopicOffset = async (topic: string) => {
  try {
    await admin.connect();
    const offsets = await admin.fetchTopicOffsets(topic);
    return formatTopicOffset(offsets);
  } catch (error) {
    console.error('Error fetching topic offset:', error);
  } finally {
    await admin.disconnect();
  }
};

const formatTopics = (topics: string[]) => {
  const topicPrefix = 'outbox.event.';
  const outboxTopics = topics.filter((topic: string) => topic.startsWith(topicPrefix));
  return outboxTopics.map((topic: string) => topic.replace(topicPrefix, ''));
};

// const formatTopicOffset = (offsets: TopicOffsetByPartition[]) => {
//   offsets.reduce((sum, offset: TopicOffsetByPartition) => {
//     const num = Number(offset.offset) - 1;
//     return sum + 
//   });
// };

const formatTopicOffset = (offsets: TopicOffsetByPartition[]) => {
  return offsets.reduce((sum: number, { offset }) => {
    return sum + (Number(offset) - 1);
  }, 0);
};