// db 연결과 관련된 코드
import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFomatter.js';

const createPool = () => {
  const pool = mysql.createPool({
    ...config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originalQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();
    console.log(`${formatDate(date)} Excuting query: 
      ${sql} ${params ? `${JSON.stringify(params)}` : ``}`);
    return originalQuery.call(pool, sql, params);
  };

  return pool;
};

//const dbPool = createPool();

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default dbPool;
