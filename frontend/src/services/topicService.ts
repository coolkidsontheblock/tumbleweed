import axios from 'axios';
import { z } from 'zod';

const topicSchemaArray = z.object({
  'message': z.string(),
  'data': z.array(z.string()),
});

const baseUrl = "http://localhost:3001/topics"

const getTopics = async () => {
  const res = await axios.get(baseUrl);
  return topicSchemaArray.parse(res.data).data;
  return ['topicPlaceholder1', 'topicPlaceholder2', 'topicPlaceholder3'];
};

export {
  getTopics
}