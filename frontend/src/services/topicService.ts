import axios from 'axios';
import { z } from 'zod';

const TopicDataSchema = z.object({
  name: z.string(),
  topic_message_count: z.number(),
  subscribed_consumers: z.array(z.string()),
  subscriber_count: z.number(),
  date_added: z.string(),
});

const TopicSchemaArray = z.object({
  'message': z.string(),
  'data': TopicDataSchema
});

const AllTopicsDataSchema = z.object({
  topic: z.string(),
  subscribed_consumers: z.array(z.string()),
  date_added: z.string(),
  message_count: z.number()
});

const AllTopicsSchemaArray = z.object({
  'message': z.string(),
  'data': z.array(AllTopicsDataSchema)
});

const baseUrl = "http://localhost:3001/api/topics"

const getTopics = async () => {
  const res = await axios.get(baseUrl);
  return AllTopicsSchemaArray.parse(res.data);
};

const getTopic = async (topicName: string) => {
  const res = await axios.get(`${baseUrl}/${topicName}`);
  return TopicSchemaArray.parse(res.data);
}

export {
  getTopics, getTopic
}