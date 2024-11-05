import axios from 'axios';
import { z } from 'zod';

const baseUrl = "http://localhost:3001/topics"

const getTopics = async () => {
  // const res = await axios.get(baseUrl);
  // return consumerSchemaArray.parse(res.data);
  return ['topicPlaceholder1', 'topicPlaceholder2', 'topicPlaceholder3'];
};

export {
  getTopics
}