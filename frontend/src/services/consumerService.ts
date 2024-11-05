import axios from 'axios';
import { z } from 'zod';
import { ConsumerDetails } from '../types/types';

const consumerSchemaArray = z.object({
  'message': z.string(),
  'data': z.array(z.string()),
});

const baseUrl = "http://localhost:3001/consumers"

const getConsumers = async () => {
  const res = await axios.get(baseUrl);
  return consumerSchemaArray.parse(res.data);
};

const getConsumer = async (consumer: string) => {
  const res = await axios.get(`${baseUrl}/${consumer}`);
  return res.data;
}

const createConsumer = async (consumerInfo: ConsumerDetails) => {
  const res = await axios.post(baseUrl + '/new_consumer', consumerInfo);
  return res.data;
}

export {
  getConsumers,
  getConsumer,
  createConsumer
}