import express from 'express';
import { createConsumer, consumeMessages } from '../kafka/kafkaClientSSEConnect';
import dotenv from 'dotenv';
import { Consumer } from 'kafkajs';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const consumer = await createConsumer("sse-test-group-id", ['outbox.event.orders', 'outbox.event.products']) as Consumer;
    consumeMessages(consumer, "http://localhost:4001", res);

    req.on('close', () => {
      consumer.disconnect(); // Disconnect the consumer when the client disconnects
  });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error getting all topics: ${error}`);
  }
})

export default router;