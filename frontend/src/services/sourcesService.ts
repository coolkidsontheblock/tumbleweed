import axios from 'axios';
import { z } from 'zod';

const sourceSchema = z.object({
  id: z.number(),
  'database.hostname': z.string(),
  'database.port': z.number(),
  'database.user': z.string(),
  'database.dbname': z.string(),
  'database.server.name': z.string(),
});

const sourceSchemaArray = z.array(sourceSchema);

const getSources = async () => {
  const res = await axios.get('http://localhost:3000/sources');
  return sourceSchemaArray.parse(res.data);
};

export {
  getSources,
};