import express from 'express';
import { getInfoForAllTopics, addNewTopicsFromKafkaToDB, getTopicByName, deleteTopicFromDB } from '../helpers/topicHelper';
import { getTopicsFromKafka, deleteTopicFromKafka } from '../kafka/kafkaAdmin';
import { TopicError } from '../utils/errors';
import { deleteConnectorByName, deleteReplicationSlot } from '../helpers/sourceHelper';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const allTopics = await getTopicsFromKafka();
    console.log(allTopics);
    if (allTopics.length === 0) {
      return res.status(200).send({
        message: "No topics found.",
        data: []
      });
    }
    
    await addNewTopicsFromKafkaToDB(allTopics);
    const topicInfo = await getInfoForAllTopics(allTopics);
      
    res.status(200).send({
      message: `${allTopics.length} topics Found.`,
      data: topicInfo,
    });
  } catch (error) {
    console.error(`There was an error getting all topics: ${error}`);
    next(error);
  }
});

router.delete('/:topic_name', async (req, res, next) => {
  try {
    const topicName = req.params.topic_name;
    const topic = await getTopicByName(topicName);
    if (!topic) {
      throw new TopicError("No Topic by that name exists", 404);
    } else {
      await deleteTopicFromKafka([`outbox.event.${topicName}`]);
      await deleteTopicFromDB(topicName);
      res.status(201).send(`Topic '${topicName}' deleted!`);
    }
  } catch (error) {
    next(error);
  }
});

export default router;