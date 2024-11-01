import axios from 'axios';
import { z } from 'zod';
import { Source } from '../types/types';

const sourceSchema = z.object({
  id: z.number(),
  'database.hostname': z.string(),
  'database.port': z.number(),
  'database.user': z.string(),
  'database.dbname': z.string(),
  'database.server.name': z.string(),
});

const sourceSchemaArray = z.array(sourceSchema);

const baseUrl = "http://localhost:3001/sources"

const getSources = async () => {
  const res = await axios.get(baseUrl);
  console.log(res)
  return sourceSchemaArray.parse(res.data);
};

const createSource = async (sourceInfo: Source) => {
  const res = await axios.post(baseUrl + '/new_source', sourceInfo);
  return res.data;
}

export {
  getSources,
  createSource
};