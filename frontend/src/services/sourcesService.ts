import axios from 'axios';
import { z } from 'zod';
import { SourceInput } from '../types/types';

const singleSourceSchema = z.object({
  message: z.string(),
  data: z.object({
    name: z.string(),
    database_hostname: z.string(),
    database_port: z.number(),
    database_user: z.string(),
    database_dbname: z.string(),
    database_server_name: z.string(),
    plugin_name: z.string(),
    date_created: z.string()
  })
});

const sourceSchemaArray = z.array(z.string());

const baseUrl = "http://localhost:3001/sources"

const getSources = async () => {
  const res = await axios.get(baseUrl);
  return sourceSchemaArray.parse(res.data);
};

const getSource = async (source: string) => {
  const res = await axios.get(`${baseUrl}/${source}`);
  return singleSourceSchema.parse(res.data);
}

const createSource = async (sourceInfo: SourceInput) => {
  const res = await axios.post(baseUrl + '/new_source', sourceInfo);
  return res.data;
}

const deleteSource = async (source: string) => {
  const res = await axios.delete(`${baseUrl}/${source}`);
  return res.data;
}

export {
  getSources,
  createSource,
  getSource,
  deleteSource
};