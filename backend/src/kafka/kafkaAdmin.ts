import { Kafka } from 'kafkajs';
import { TopicOffsetByPartition } from '../types/topicTypes';
import dotenv from 'dotenv';
import { getAllTopicsFromDB } from '../helpers/topicHelper';
dotenv.config();

const KafkaBrokerEndpoints = process.env.KAFKA_BROKER_ENDPOINTS;

if (!KafkaBrokerEndpoints) {
  throw new Error("Kafka broker endpoints are not defined!");
}

const kafka = new Kafka({
  clientId: 'tumbleweed-admin-fetch',
  brokers: JSON.parse(KafkaBrokerEndpoints),
});

export const getTopicsFromKafka = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics) {
      return [];
    } else {
      return await formatTopics(topics);
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

export const deleteTopicFromKafka = async (topics: string[]) => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    await admin.deleteTopics({
      topics: topics,
      timeout: 5000,
    })
  } catch (error) {
    console.error('Error deleteing kafka topics:', error);
    throw error;
  } finally {
    await admin.disconnect();
  }
};

const formatTopics = async (topics: string[]) => {
  const topicPrefix = 'outbox.event.';
  const outboxTopics = topics.filter((topic: string) => topic.startsWith(topicPrefix));
  const formattedOutboxTopics = outboxTopics.map((topic: string) => topic.replace(topicPrefix, ''));
  const deletedTopics = await findTopicsToDelete(formattedOutboxTopics);
  return formattedOutboxTopics.filter((topic: string) => !deletedTopics.includes(topic));
};

const findTopicsToDelete = async (outboxTopicsFromKafka: string[]) => {
  const topicsInDB = await getAllTopicsFromDB();
  const topicsToDelete = [];

  for (const topic of outboxTopicsFromKafka) {
    if (!topicsInDB.includes(topic)) topicsToDelete.push(topic);
  }

  if (topicsToDelete.length > 0) await deleteTopicFromKafka(topicsToDelete);
  return topicsToDelete;
};

const formatTopicOffsetToMessageCount = (offsets: TopicOffsetByPartition[]) => {
  return offsets.reduce((sum: number, { offset }) => {
    return sum + (Number(offset));
  }, 0);
};

const formatKafkaClusterInfo = (clusterInfo: { brokers: Array<{ nodeId: number; host: string; port: number; }>; controller: number | null; clusterId: string; }) => {
  return clusterInfo.brokers.map(broker => `${broker.host}:${broker.port}`);
};
