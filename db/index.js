const { Client } = require('pg')

const dbConfig = require('./db-config.json');

const dbUrl = dbConfig.dbUrl || process.env.DATABASE_URL;

const client = new Client({
  connectionString: dbUrl,
  ssl: true,
});
client.connect()

module.exports = client;
