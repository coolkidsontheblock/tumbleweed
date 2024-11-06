import axios from 'axios';
import express from 'express';
import { getAllConsumers, postConsumerToDB, getConsumerByName } from '../helpers/consumerHelper';
import { ConsumerDetails } from '../types/consumerTypes';
import { addTopicsAndConsumerToDB } from '../helpers/topicHelper';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const consumers = await getAllConsumers();

    res.status(200).send({
      message: `${consumers.length} Consumers Found.`,
      data: consumers,
    });
  } catch (error) {
    res.status(404).send(`${error}`)
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

    if (!consumer) {
      throw new Error("No Consumer by that name exists");
    } else {

      const consumerInfo: ConsumerDetails = {
        name: consumer.name,
        description: consumer.description,
        endpoint_URL: consumer.endpoint_URL,
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
    res.status(404).send(`${error}`)
    console.error(`There was an error finding the consumer: ${error}`);
    next(error);
  }
});

// POST a new consumer route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
router.post('/new_consumer', async (req, res, next) => {
  try {
    const consumerData = req.body;
    const KafkaBrokerEndpoints = JSON.parse(process.env.KAFKA_BROKER_ENDPOINTS as string); // using type assertion here.  double check if there is a better way
    const newConsumer = await postConsumerToDB(consumerData, KafkaBrokerEndpoints);
    addTopicsAndConsumerToDB(newConsumer);

    res.status(201).send({
      message: 'Consumer created',
      data: newConsumer,
    });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error adding a new consumer: ${error}`);

    // Optionally: handle a rollback here if needed, e.g., delete any created connector in Debezium
    // Example:
    // if (axiosResponse && axiosResponse.data.name) {
    //   await axios.delete(`${destination}/${axiosResponse.data.name}`);
    // }

    next(error);
  }
});



export default router;