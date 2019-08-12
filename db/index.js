const { Client } = require('pg');

let dbConfig = {};
try {
  // eslint-disable-next-line global-require
  dbConfig = require('./db-config.json');
} catch (e) {
  console.error(e);
}

const dbUrl = dbConfig.dbUrl || process.env.DATABASE_URL;

const client = new Client({
  connectionString: dbUrl,
  ssl: true,
});
client.connect();

const userLogin = async ({ email, name, picture }) => {
  if (!email) {
    throw new Error('Cannot login user - provided email is empty or null', email);
  }

  console.log(`Creating or updating user for login: ${email}`);
  const getUserQuery = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const getUserRes = await client.query(getUserQuery);
  const user = getUserRes.rows[0];

  if (!user) {
    console.log(`User ${email} does not exist, creating...`);
    const createUserQuery = {
      text: 'INSERT INTO users(email, name, image_url, last_login_at) VALUES($1, $2, $3, current_timestamp)',
      values: [email, name, picture],
    };
    await client.query(createUserQuery);
  } else {
    console.log(`User ${email} found, updating...`);
    const updateUserQuery = {
      text: 'UPDATE users SET name = $2, image_url = $3, last_login_at = current_timestamp WHERE email = $1',
      values: [email, name, picture],
    };
    await client.query(updateUserQuery);
  }
};

module.exports = {
  userLogin,
};
