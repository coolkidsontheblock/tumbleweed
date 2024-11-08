import express from 'express';
import { createConsumer, consumeMessages } from '../kafka/kafkaClientSSEConnect';
import dotenv from 'dotenv';
import { Consumer } from 'kafkajs';
import { getConsumerByGroupId, getConsumerByName } from '../helpers/consumerHelper';
import { nextTick } from 'process';
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

    const consumer = await createConsumer(groupId, topics);
   
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    consumeMessages(consumer as Consumer, res);

    req.on('close', async () => {
      await consumer?.disconnect();
    })
  } catch (error) {
    // res.status(400).send(`${error}`)
    console.error(`There was an error getting all topics: ${error}`);
    next(error);
  }
})

export default router;