import { validateConsumerData } from '../helpers/validation';
import express from 'express';
import { getAllConsumers, postConsumerToDB, getConsumerByName, deleteConsumerByName, getConsumerConnectionURI } from '../helpers/consumerHelper';
import { ConsumerDetails } from '../types/consumerTypes';
import { getKafkaBrokerEndpoints } from '../kafka/kafkaAdmin'
import { addtoTopicsDB, deleteConsumerFromSubscribedTopics, deleteSubscriberlessTopics } from '../helpers/topicHelper';
import { HttpError } from '../utils/errors';

const router = express.Router();

router.get('/', async (req, res, next) => {  
  try {
    const consumers = await getAllConsumers();

    res.status(200).send({
      message: `${consumers.length} Consumers Found.`,
      data: consumers,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Get Info for Single Consumer Route =>
// URL Encode Spaces with %20 when making request -> ex. consumers/newest%20Great%20Service
router.get('/:consumer_name', async (req, res, next) => {
  try {
    const consumerName = req.params.consumer_name;
    const consumer = await getConsumerByName(consumerName);
    console.log(consumer)
    if (!consumer) {
      throw new Error("No Consumer by that name exists");
    } else {

      const consumerInfo: ConsumerDetails = {
        name: consumer.name,
        description: consumer.description,
        tumbleweed_endpoint: consumer.tumbleweed_endpoint,
        kafka_client_id: consumer.kafka_client_id,
        kafka_broker_endpoints: consumer.kafka_broker_endpoints,
        kafka_group_id: consumer.kafka_group_id,
        subscribed_topics: consumer.subscribed_topics,
        received_message_count: consumer.received_message_count,
        date_created: consumer.date_created
      }
      res.status(200).send({
        message: `Consumer '${consumer.name}' Found.`,
        data: consumerInfo,
      });
    }
  } catch (error) {
    // res.status(404).send(`${error}`)
    console.error(`There was an error finding the consumer: ${error}`);
    next(error);
  }
});

// POST a new consumer route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
router.post('/new_consumer', async (req, res, next) => {
  try {
    const consumerData = req.body;
    validateConsumerData(consumerData);

    const KafkaBrokerEndpoints = await getKafkaBrokerEndpoints();
    const tumbleweedEndpoint = getConsumerConnectionURI(consumerData.kafka_group_id);
    const newConsumer = await postConsumerToDB(consumerData, KafkaBrokerEndpoints, tumbleweedEndpoint);
    await addtoTopicsDB(newConsumer);

    res.status(201).send({
      message: 'Consumer created',
      data: newConsumer,
    });
  } catch (error) {
    console.error(`There was an error adding a new consumer: ${error}`);
    next(error);
  }
});

router.delete('/:consumer_name', async (req, res, next) => {
  try {
    const consumerName = req.params.consumer_name;
    const consumer = await getConsumerByName(consumerName);

    if (!consumer) {
      throw new HttpError("No Consumer by that name exists", 404);
    } else {
      
      await deleteConsumerByName(consumerName);
      await deleteConsumerFromSubscribedTopics(consumerName);
      await deleteSubscriberlessTopics();
      res.status(201).send(`Consumer '${consumer.name}' deleted!`);
    }
  } catch (error) {
    console.error(`There was an error deleting the consumer: ${error}`);
    next(error);
  }
});

export default router;