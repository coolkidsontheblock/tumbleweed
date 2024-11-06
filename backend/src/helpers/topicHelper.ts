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

export const addTopicsAndConsumerToDB = async ({name: consumerName, subscribed_topics}: ConsumerTopicDetails) => {
  const existingTopics = await getAllTopics();
  try {
    await query(`INSERT INTO topics (
      name,
      subcribed_consumers)
      VALUES ($1, $2)`,
      [name, subscribed_topics]);
  } catch (error) {
    console.error(`There was an error adding topics to the database: ${error}`);
  }
};

// {
//       "name": "Wednesday Morning Service 6",
//       "endpoint_url": "localhost:3001",
//       "subscribed_topics": [
//           "products",
//           "orders"
//       ]
// }


// 1. Insert Topics only if not already in table
  // if new topic then no consumers so just insert directly
// 2. Add consumer name to subsrbied array only if not in array already
  // if old topic then append consumer and don't add topic
// 3. 