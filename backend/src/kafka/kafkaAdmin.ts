import { Kafka } from 'kafkajs';
import { TopicName, TopicOffsetByPartition } from '../types/topicTypes';
import dotenv from 'dotenv';
import { format } from 'path';
dotenv.config();

const KafkaBrokerEndpoints = process.env.KAFKA_BROKER_ENDPOINTS;

if (!KafkaBrokerEndpoints) {
  throw new Error("Kafka broker endpoints are not defined!");
}

const kafka = new Kafka({
  clientId: 'tumbleweed-topic-fetch',
  brokers: JSON.parse(KafkaBrokerEndpoints),
});

export const getTopicsFromKafka = async () => {
  const admin = kafka.admin();
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

export const getTopicMessageCount = async (topic: string) => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const offsets = await admin.fetchTopicOffsets(topic);
    return formatTopicOffsetToMessageCount(offsets);
  } catch (error) {
    console.error('Error fetching topic offset:', error);
    throw error;
  } finally {
    await admin.disconnect();
  }
};

export const getKafkaBrokerEndpoints = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const clusterInfo = await admin.describeCluster();
    return formatKafkaClusterInfo(clusterInfo);
  } catch (error) {
    console.error('Error fetching kafka cluster info:', error);
    throw error;
  } finally {
    await admin.disconnect();
  }
};

const formatTopics = (topics: string[]) => {
  const topicPrefix = 'outbox.event.';
  const outboxTopics = topics.filter((topic: string) => topic.startsWith(topicPrefix));
  return outboxTopics.map((topic: string) => topic.replace(topicPrefix, ''));
};

const formatTopicOffsetToMessageCount = (offsets: TopicOffsetByPartition[]) => {
  return offsets.reduce((sum: number, { offset }) => {
    return sum + (Number(offset) - 1);
  }, 0);
};

const formatKafkaClusterInfo = (clusterInfo: { brokers: Array<{ nodeId: number; host: string; port: number; }>; controller: number | null; clusterId: string; }) => {
  return clusterInfo.brokers.map(broker => `${broker.host}:${broker.port}`);
};