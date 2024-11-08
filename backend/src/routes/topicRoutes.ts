import express from 'express';
import { getSubscribedConsumersAndDate, sortArrayByLowerCase } from '../helpers/topicHelper';
import { getTopicsFromKafka, getTopicMessageCount } from '../kafka/kafkaAdmin';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const allTopics = await getTopicsFromKafka();
    res.status(200).send({
      message: `${allTopics.length} topics Found.`,
      data: allTopics,
    });
  } catch (error) {
    // res.status(400).send(`${error}`)
    console.error(`There was an error getting all topics: ${error}`);
    next(error);
  }
})

router.get('/:topic_name', async (req, res, next) => {
  const topicPrefix = 'outbox.event.';
  try {
    const topicName = req.params.topic_name;
    const topics = await getTopicsFromKafka();

    if (topics.includes(topicName)) {
      const fullTopicName = topicPrefix + req.params.topic_name;
      const topicMessageCount = await getTopicMessageCount(fullTopicName);
      const topicInfo = await getSubscribedConsumersAndDate(topicName);
      res.status(200).send({
        message: `Topic '${topicName}' Found.`,
        data: {
          name: topicName,
          topic_message_count: topicMessageCount,
          subscribed_consumers: sortArrayByLowerCase(topicInfo.subscribed_consumers),
          subscriber_count: topicInfo.subscribed_consumers.length,
          date_added: topicInfo.date_added,
        }
      });
    } else {
      throw new Error(`Topic '${topicName}' does not exist`);
    }
  } catch (error) {
    // res.status(400).send(`${error}`)
    console.error(`There was an error getting the topic: ${error}`);
    next(error);
  }
});

export default router;