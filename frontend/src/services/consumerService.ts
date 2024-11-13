import axios from 'axios';
import { z } from 'zod';
import { ConsumerInputDetails } from '../types/types';

const consumerDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  tumbleweed_endpoint: z.string(),
  kafka_client_id: z.string(),
  kafka_broker_endpoints: z.array(z.string()),
  kafka_group_id: z.string(),
  subscribed_topics: z.array(z.string()),
  received_message_count: z.number(),
  date_created: z.string() 
})

const consumerSchemaArray = z.object({
  message: z.string(),
  data: z.array(consumerDataSchema)
});

const path = import.meta.env.NODE_ENV === 'production' ? "/api/consumers" : "http://localhost:3001/api/consumers";

const getConsumers = async () => {
  const res = await axios.get(path);
  console.log(res.data)
  return consumerSchemaArray.parse(res.data);
};

const createConsumer = async (consumerDetails: ConsumerInputDetails) => {
  const res = await axios.post(path + '/new_consumer', consumerDetails);
  return res.data;
}

const deleteConsumer = async (consumer: string) => {
  const res = await axios.delete(`${path}/${consumer}`);
  return res.data;
}

export {
  getConsumers,
  createConsumer,
  deleteConsumer
}