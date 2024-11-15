import app from './app';
import { pool } from './database/pg';

const PORT = process.env.PORT || 3001;

process.on('exit', () => {
  pool.end(() => {
    console.log('Connection pool has closed');
  });
});

export const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running on PORT ${PORT} in ${process.env.NODE_ENV === 'production' ? 'production mode' : 'development mode'}`);
});
