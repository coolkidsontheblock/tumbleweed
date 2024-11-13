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
  brokers: KafkaBrokerEndpoints.split(',')
});

export const createTopicsForKafka = async (topicNames: string[]) => {
  const topicsInKafka = await getTopicsFromKafka();
  const newTopics = topicNames.filter((topic: string) => !topicsInKafka.includes(topic));

  const topics = newTopics.map(topic => ({
    topic: `outbox.event.${topic}`,
    numPartitions: 1,
    replicationFactor: 3
  }));

  const admin = kafka.admin();
 
  try {
    await admin.connect();
    const result = await admin.createTopics({
      validateOnly: false,
      waitForLeaders: false,
      timeout: 5000,
      topics: topics})
    console.log('Topics created successfully:', result);
  } catch (error) {
    console.error('Error creating topics:', error);
  } finally {
    await admin.disconnect();
  }
};

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
    await admin.deleteTopics({topics: topics, timeout: 5000})
  } catch (error) {
    console.error('Error deleting kafka topics:', error);
    throw error;
  } finally {
    await admin.disconnect();
  }
};

const formatTopics = async (topics: string[]) => {
  const topicPrefix = 'outbox.event.';
  const outboxTopics = topics.filter((topic: string) => topic.startsWith(topicPrefix));
  return outboxTopics.map((topic: string) => topic.replace(topicPrefix, ''));
};

// const findTopicsToDelete = async (outboxTopicsFromKafka: string[]) => {
//   const topicsInDB = await getAllTopicsFromDB();
//   const topicsToDelete = [];

//   for (const topic of outboxTopicsFromKafka) {
//     if (!topicsInDB.includes(topic)) topicsToDelete.push(topic);
//   }

//   if (topicsToDelete.length > 0) await deleteTopicFromKafka(topicsToDelete);
//   return topicsToDelete;
// };

const formatTopicOffsetToMessageCount = (offsets: TopicOffsetByPartition[]) => {
  return offsets.reduce((sum: number, { offset }) => {
    return sum + (Number(offset));
  }, 0);
};

const formatKafkaClusterInfo = (clusterInfo: { brokers: Array<{ nodeId: number; host: string; port: number; }>; controller: number | null; clusterId: string; }) => {
  return clusterInfo.brokers.map(broker => `${broker.host}:${broker.port}`);
};
