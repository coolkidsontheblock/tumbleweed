import axios from 'axios';
import { z } from 'zod';

const TopicDataSchema = z.object({
  name: z.string(),
  topic_message_count: z.number(),
  subscribed_consumers: z.array(z.string()),
  subscriber_count: z.number(),
  date_added: z.string(),
});

const topicSchemaArray = z.object({
  'message': z.string(),
  'data': TopicDataSchema
});

const topicsSchemaArray = z.object({
  'data': z.array(z.string())
});

const baseUrl = "http://localhost:3001/topics"

const getTopics = async () => {
  const res = await axios.get(baseUrl);
  return topicsSchemaArray.parse(res.data).data;
};

const getTopic = async (topicName: string) => {
  const res = await axios.get(`${baseUrl}/${topicName}`);
  return topicSchemaArray.parse(res.data);
}

export {
  getTopics, getTopic
}