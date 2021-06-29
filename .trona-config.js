const { Client } = require('pg');

const isProd = process.env.NODE_ENV !== 'production';

if (!isProd) {
  require('dotenv').config();
}

const client = new Client({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  ssl: isProd
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : undefined,
});

client.connect().then(() => {
  console.log(`Connected to ${process.env.DB_NAME}`);
});

module.exports = {
  evolutionsFolderPath: ['evolutions'],
  runQuery(query) {
    return client.query(query).then((result) => result.rows);
  },
};
