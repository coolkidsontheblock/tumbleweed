import { TopicDetails, TopicName } from "../types/topicTypes"
import { query } from '../database/pg';

// export const postTopicsToDB = async (topicsDetails: TopicDetails) => {

// };

export const getAllTopics = async () => {
  try {
    const allTopics = await query(`SELECT name FROM topcs`);
    const topicNames = allTopics.rows.map((topic: TopicName) => topic.name);
    return topicNames;
  } catch (error) {
    console.error(`There was an error getting the topics from the database: ${error}`);
  }
}

export const getTopicByName = async (topicName: string) => {
  try {
    const topicDetails = await query(`Select 
    name,
    subscribed_consumers,
    publishing_sources
    FROM topics`);
    return topicDetails.rows[0];
  } catch (error) {
    console.error(`There was an error getting that topic from the database: ${error}`);
  }
};
