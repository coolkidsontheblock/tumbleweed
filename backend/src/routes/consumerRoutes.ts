import { validateConsumerData } from '../helpers/validation';
import express from 'express';
import { getAllConsumerInfo,
  postConsumerToDB,
  getAllConsumersByName,
  deleteConsumerByName,
  getConsumerConnectionURI,
  formatDateForFrontend
} from '../helpers/consumerHelper';
import { getKafkaBrokerEndpoints } from '../kafka/kafkaAdmin'
import { addtoTopicsToDBWithConsumer, deleteConsumerFromSubscribedTopics } from '../helpers/topicHelper';
import { HttpError } from '../utils/errors';

const router = express.Router();

router.get('/', async (_, res, next) => {  
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

router.post('/new_consumer', async (req, res, next) => {
  try {
    const consumerData = req.body;
    validateConsumerData(consumerData);

    const kafkaBrokerEndpoints = await getKafkaBrokerEndpoints();
    const tumbleweedEndpoint = await getConsumerConnectionURI(consumerData.kafka_group_id);
    const newConsumer = await postConsumerToDB(consumerData, kafkaBrokerEndpoints, tumbleweedEndpoint);
    await addtoTopicsToDBWithConsumer(newConsumer);

    res.status(201).send({
      message: 'Consumer created',
      data: {...newConsumer, date_created: formatDateForFrontend(newConsumer.date_created)}

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
      res.status(201).send(`Consumer '${consumer.name}' deleted!`);
    }
  } catch (error) {
    console.error(`There was an error deleting the consumer: ${error}`);
    next(error);
  }
});

export default router;
