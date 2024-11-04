import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.on('connect', () => {
  console.log('Successfully connected to the Postgres DB!');
});

const query = (text: string, params?: any[]): Promise<any> => {
  return pool.query(text, params);
};

export { pool, query };
