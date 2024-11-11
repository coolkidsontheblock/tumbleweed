import express from 'express';
import { createConsumer, consumeMessages, initializeKafka } from '../kafka/kafkaClientSSEConnect';
import dotenv from 'dotenv';
import { Consumer } from 'kafkajs';
import { getConsumerByGroupId, getAllConsumersByName } from '../helpers/consumerHelper';
import { nextTick } from 'process';
import axios from 'axios';
dotenv.config();

const router = express.Router();

router.get('/:groupId', async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const consumerData = await getConsumerByGroupId(groupId)
    if (!consumerData) {
      return res.status(404).send('Consumer not found');
    }

    const topics = consumerData.subscribed_topics.map(topic => `outbox.event.${topic}`);

    initializeKafka(consumerData.kafka_client_id).catch(error => {
      console.error(`Failed to initialize Kafka: ${error}`);
    });

    const consumer = await createConsumer(groupId, topics);
   
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    consumeMessages(consumer as Consumer, res);

    req.on('close', async () => {
      await consumer?.disconnect();
    })
  } catch (error) {
    console.error(`There was an error getting all topics: ${error}`);
    next(error);
  }
})

// router.get('/fake', async (req, res, next) => {
//   try {
//     const getPublicIP = async () => {
//       try {
//         const response = await axios.get('https://api.ipify.org?format=json');
//         console.log(`Your public IP address is: ${response.data.ip}`);
//       } catch (error) {
//         console.error('Error fetching IP address:', error);
//       }
//     };
    
//     getPublicIP();
//   } catch (error) {
//     console.error(`There was an error getting all topics: ${error}`);
//     next(error);
//   }
// })

export default router;