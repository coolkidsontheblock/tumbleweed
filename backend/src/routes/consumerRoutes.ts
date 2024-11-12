import { validateConsumerData } from '../helpers/validation';
import express from 'express';
import { getAllConsumerInfo, postConsumerToDB, getAllConsumersByName, deleteConsumerByName, getConsumerConnectionURI, formatDateForFrontend } from '../helpers/consumerHelper';
import { ConsumerDetails } from '../types/consumerTypes';
import { getKafkaBrokerEndpoints } from '../kafka/kafkaAdmin'
import { addtoTopicsDB, deleteConsumerFromSubscribedTopics, deleteSubscriberlessTopics } from '../helpers/topicHelper';
import { HttpError } from '../utils/errors';
import { createKafkaClientId } from '../helpers/uuid';

const router = express.Router();

router.get('/', async (req, res, next) => {  
  try {
    const consumerInfo = await getAllConsumerInfo();

    res.status(200).send({
      message: `${consumerInfo.length} Consumers Found.`,
      data: consumerInfo
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Get Info for Single Consumer Route =>
// URL Encode Spaces with %20 when making request -> ex. consumers/newest%20Great%20Service
// router.get('/:consumer_name', async (req, res, next) => {
//   try {
//     const consumerName = req.params.consumer_name;
//     const consumer = await getAllConsumersByName(consumerName);
//     if (!consumer) {
//       throw new Error("No Consumer by that name exists");
//     } else {

//       const consumerInfo: ConsumerDetails = {
//         name: consumer.name,
//         description: consumer.description,
//         tumbleweed_endpoint: consumer.tumbleweed_endpoint,
//         kafka_client_id: consumer.kafka_client_id,
//         kafka_broker_endpoints: consumer.kafka_broker_endpoints,
//         kafka_group_id: consumer.kafka_group_id,
//         subscribed_topics: consumer.subscribed_topics,
//         received_message_count: consumer.received_message_count,
//         date_created: formatDateForFrontend(consumer.date_created)
//       }
//       res.status(200).send({
//         message: `Consumer '${consumer.name}' Found.`,
//         data: consumerInfo,
//       });
//     }
//   } catch (error) {
//     console.error(`There was an error finding the consumer: ${error}`);
//     next(error);
//   }
// });

// POST a new consumer route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
router.post('/new_consumer', async (req, res, next) => {
  try {
    const consumerData = req.body;
    validateConsumerData(consumerData);

    const kafkaBrokerEndpoints = await getKafkaBrokerEndpoints();
    const tumbleweedEndpoint = await getConsumerConnectionURI(consumerData.kafka_group_id);
    const kafkaClientId = createKafkaClientId(consumerData.kafka_group_id);
    const newConsumer = await postConsumerToDB(consumerData, kafkaBrokerEndpoints, tumbleweedEndpoint, kafkaClientId);
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
    const consumer = await getAllConsumersByName(consumerName);

    if (!consumer) {
      throw new HttpError("No Consumer by that name exists", 404);
    } else {
      
      await deleteConsumerByName(consumerName);
      await deleteConsumerFromSubscribedTopics(consumerName);
      // await deleteSubscriberlessTopics();  
      res.status(201).send(`Consumer '${consumer.name}' deleted!`);
    }
  } catch (error) {
    console.error(`There was an error deleting the consumer: ${error}`);
    next(error);
  }
});

export default router;