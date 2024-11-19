import app from './app';
import { pool } from './database/pg';
import http from 'http';
const PORT = process.env.PORT || 3001;

process.on('exit', () => {
  pool.end(() => {
    console.log('Connection pool has closed');
  });
});

let server: http.Server;

if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`[server]: Server is running on PORT ${PORT} in ${process.env.NODE_ENV === 'production' ? 'production mode' : 'development mode'}`);
  });
}

export { server, app };