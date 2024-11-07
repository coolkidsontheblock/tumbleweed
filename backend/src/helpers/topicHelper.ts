import { TopicDetails, TopicName } from "../types/topicTypes";
import { ConsumerTopicDetails } from "../types/consumerTypes";
import { query } from '../database/pg';

const getAllTopics = async () => {
  try {
    const allTopics = await query(`SELECT name FROM topics`);
    const topicNames = allTopics.rows.map((topic: TopicName) => topic.name);
    return topicNames;
  } catch (error) {
    console.error(`There was an error getting the topics from the database: ${error}`);
  }
}

export const getTopicByName = async (topicName: string) => {
  try {
    const topicDetails = await query(`SELECT 
    name,
    subscribed_consumers,
    publishing_sources
    FROM topics`);
    return topicDetails.rows[0];
  } catch (error) {
    console.error(`There was an error getting that topic from the database: ${error}`);
  }
};

// If topic exists append consumer name to subscribed_consumers column in topics table
const addConsumerToTopicsTableInDB = async (consumerName: string, topic: string) => {
  try {
      await query(`UPDATE topics SET subscribed_consumers = array_append(subscribed_consumers, $1) WHERE name = $2`,
        [consumerName, topic]);
  } catch (error) {
    console.error(`There was an error adding a subscribed consumer to the topic table in the database: ${error}`);
  }
};

// If topic does not exist in the database add topic and consumer to topics table 
const addTopicsAndConsumersToDB = async (consumerName: string, topic: string) => {
  try {
      await query(`INSERT INTO topics (
        name,
        subscribed_consumers)
        VALUES ($1, $2)`,
        [topic, [consumerName]]);
  } catch (error) {
    console.error(`There was an error adding topics to the database: ${error}`);
  }
};

export const AddtoTopicsDB = async ({name: consumerName, subscribed_topics}: ConsumerTopicDetails) => {
  const existingTopics = await getAllTopics();

  for (const topic of subscribed_topics) {
    if (existingTopics.includes(topic)) {
      await addConsumerToTopicsTableInDB(consumerName, topic);
    } else {
      await addTopicsAndConsumersToDB(consumerName, topic);
    }
  }
};
