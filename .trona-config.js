const { Client } = require('pg');
const { resolve } = require('path');
const { CommonConfiguration } = require('@solid-soda/config');

const config = new CommonConfiguration(resolve(__dirname, './.env'));

const client = new Client({
  user: config.getStringOrThrow('DB_USER'),
  database: config.getStringOrThrow('DB_NAME'),
  password: config.getStringOrThrow('DB_PASSWORD'),
  port: config.getStringOrThrow('DB_PORT'),
  host: config.getStringOrThrow('DB_HOST'),
  ssl: config.isProd()
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
