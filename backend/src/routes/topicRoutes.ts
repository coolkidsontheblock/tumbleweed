import express from 'express';
import { getInfoForAllTopics, addNewTopicsFromKafkaToDB } from '../helpers/topicHelper';
import { getTopicsFromKafka } from '../kafka/kafkaAdmin';

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

export default router;