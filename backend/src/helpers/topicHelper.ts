import { TopicName } from "../types/topicTypes";
import { ConsumerTopicDetails } from "../types/consumerTypes";
import { formatDateForFrontend } from "./consumerHelper";
import { getTopicMessageCount } from "../kafka/kafkaAdmin";
import { query } from '../database/pg';

export const getAllTopicsFromDB = async () => {
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
    date_added
    FROM topics WHERE name = $1`, [topicName]);
    return topicDetails.rows[0];
  } catch (error) {
    console.error(`There was an error getting that topic from the database: ${error}`);
  }
};

const addConsumerToTopicsTableInDB = async (consumerName: string, topic: string) => {
  try {
    await query(`UPDATE topics SET subscribed_consumers = array_append(subscribed_consumers, $1) WHERE name = $2`,
      [consumerName, topic]);
  } catch (error) {
    console.error(`There was an error adding a subscribed consumer to the topic table in the database: ${error}`);
  }
};

const addTopicsAndConsumersToDB = async (consumerName: string, topic: string) => {
  try {
    await query(`INSERT INTO topics (
        name,
        subscribed_consumers)
        VALUES ($1, $2)`,
      [topic, [consumerName]]);
  } catch (error) {
    console.error(`There was an error adding topics and subscribers to the database: ${error}`);
  }
};

export const addNewTopicsFromKafkaToDB = async (topics: string[]) => {
  const existingTopics = await getAllTopicsFromDB();

  try {
    for (const topic of topics) {
      if (!existingTopics.includes(topic)) {
        await query(`INSERT INTO topics (
          name)
          VALUES ($1)`,
        [topic]);
      }
    }
  } catch (error) {
      console.error(`There was an error adding new topics from kafka to the database: ${error}`);
  }
};

export const addtoTopicsToDBWithConsumer = async ({ name: consumerName, subscribed_topics }: ConsumerTopicDetails) => {
  const existingTopics = await getAllTopicsFromDB();

  for (const topic of subscribed_topics) {
    if (existingTopics.includes(topic)) {
      await addConsumerToTopicsTableInDB(consumerName, topic);
    } else {
      await addTopicsAndConsumersToDB(consumerName, topic);
    }
  }
};

export const deleteConsumerFromSubscribedTopics = async (consumerName: string) => {
  const existingTopics = await getSubscribedTopics(consumerName);

  for (const topic of existingTopics) {
    await deleteConsumerFromTopics(consumerName, topic);
  };
};

const deleteConsumerFromTopics = async (consumerName: string, topic: string) => {
  try {
    await query(`UPDATE topics SET subscribed_consumers = array_remove(subscribed_consumers, $1) WHERE name = $2`,
      [consumerName, topic]);
  } catch (error) {
    console.error('There was an error deleting consumer from topic ', error);
  }
};

const getSubscribedTopics = async (consumerName: string) => {
  try {
    const topicNameAndConsumers = await query(`SELECT name, subscribed_consumers FROM topics`);
    const subscribed = topicNameAndConsumers.rows.filter((row: { subscribed_consumers: string[]; }) => {
      if (row.subscribed_consumers.includes(consumerName)) {
        return row;
      }
    });
    return subscribed.map((topic: TopicName) => topic.name);
  } catch (error) {
    console.error('There was an error getting filtered topics for subscribed consumers, ', error)
  }
};

export const getInfoForAllTopics = async (topics: string[]) => {
  const topicPrefix = 'outbox.event.';
  const topicPromises = topics.map(async (topic) => {
    const topicObj = await getSubscribedConsumersAndDate(topic);
    const messageCount = await getTopicMessageCount(`${topicPrefix}${topic}`);
    return {
      topic: topic,
      subscribed_consumers: sortArrayByLowerCase(topicObj.subscribed_consumers),
      date_added: formatDateForFrontend(topicObj.date_added),
      message_count: messageCount
    }
  });
    return await Promise.all(topicPromises);
};

export const getSubscribedConsumersAndDate = async (topic: string) => {
  try {
    const subscribedConsumers = await query(`SELECT subscribed_consumers, date_added FROM topics WHERE name = $1`,
      [topic]);
    return subscribedConsumers.rows[0];
  } catch (error) {
    console.error('There was an error getting the subscribed consumers ', error);
    throw error;
  }
}

export const sortArrayByLowerCase = (array: string[]) => {
  return array.sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();

    if (lowerA < lowerB) {
      return -1;
    } if (lowerA > lowerB) {
      return 1;
    } else {
      return 0;
    };
  });
}

export const deleteSubscriberlessTopics = async () => {
  try {
    const subscriberlessTopics = await findSubscriberlessTopicsInDB();

    for (const topic of subscriberlessTopics) {
      await query(`DELETE FROM topics WHERE name = $1`, [topic]);
    }
  } catch (error) {
    console.error(`There was an error getting that topic from the database: ${error}`);
  }
};

export const deleteTopicFromDB = async (topicName: string) => {
  try {
    await query(`DELETE FROM topics WHERE name = $1`, [topicName]);
  } catch (error) {
    console.error(`There was an error deleting that topic from the database: ${error}`);
  }
};

const findSubscriberlessTopicsInDB = async () => {
  try {
    const subscriberless = await query(`SELECT name FROM topics WHERE subscribed_consumers = '{}'`);
    return subscriberless.rows.map((topic: TopicName) => topic.name);
  } catch (error) {
    console.error('There was an error finding Subscriberless topics ', error);
  }
};
