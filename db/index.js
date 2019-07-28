const { Client } = require('pg')

const dbConfig = require('./db-config.json');

const dbUrl = dbConfig.dbUrl || '';

const client = new Client({
  connectionString: dbUrl,
  ssl: true,
});
client.connect()

module.exports = client;
