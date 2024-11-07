import express from 'express';
import { getTopicByName } from '../helpers/topicHelper';
import { getTopicsFromKafka, getTopicOffset } from '../kafka/kafkaAdmin';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allTopics = await getTopicsFromKafka();
    res.status(200).send({
      message: `${allTopics.length} topics Found.`,
      data: allTopics,
    });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error getting all topics: ${error}`);
  }
})

// Not quite finished!
// fix bad route if not found
router.get('/:topic_name', async (req, res) => {
  const topicPrefix = 'outbox.event.';
  try {
    const topicName = req.params.topic_name;

    if (await getTopicsFromKafka())



    const fullTopicName = topicPrefix + req.params.topic_name;
    const topicMessageCount = await getTopicOffset(fullTopicName);
    // const topicInfo = await getTopicByName(topicName);
    res.status(200).send({
      message: `Topic '${topicName}' Found.`,
      // data: topicInfo,
      topic_message_count: topicMessageCount,
    });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error getting the topic: ${error}`);
  }
});

export default router;