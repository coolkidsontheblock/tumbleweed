import axios from 'axios';
import { z } from 'zod';
import { SourceCredentials, SourceInput } from '../types/types';

const singleSourceSchema = z.object({
  name: z.string(),
  database_hostname: z.string(),
  database_port: z.number(),
  database_user: z.string(),
  database_dbname: z.string(),
  database_server_name: z.string(),
  slot_name: z.string(),
  date_created: z.string()
});

const sourceSchemaArray = z.object({
  message: z.string(),
  data: z.array(singleSourceSchema)
});

const path = import.meta.env.VITE_NODE_ENV === 'development' ? "http://localhost:3001/api/sources" : "/api/sources";

const getSources = async () => {
  const res = await axios.get(path);
  return sourceSchemaArray.parse(res.data);
};

const createSource = async (sourceInfo: SourceInput) => {
  const res = await axios.post(path + '/new_source', sourceInfo);
  return res.data;
}

const deleteSource = async (sourceCredentials: SourceCredentials) => {
  const res = await axios.delete(path, { data: sourceCredentials });
  return res.data;
}

export {
  getSources,
  createSource,
  deleteSource
};