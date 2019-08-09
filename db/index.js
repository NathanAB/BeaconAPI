const { Client } = require('pg');

let dbConfig = {};
try {
  dbConfig = require('./db-config.json');
} catch (e) {}

const dbUrl = dbConfig.dbUrl || process.env.DATABASE_URL;

const client = new Client({
  connectionString: dbUrl,
  ssl: true,
});
client.connect();

module.exports = client;
