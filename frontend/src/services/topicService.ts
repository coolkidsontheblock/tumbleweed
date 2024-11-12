import axios from 'axios';
import { z } from 'zod';

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

const path = import.meta.env.VITE_API_URL + "/api/topics";

const getTopics = async () => {
  const res = await axios.get(path);
  return AllTopicsSchemaArray.parse(res.data);
};

export {
  getTopics, 
}