module.exports = {
  APP_URL: process.env.NODE_ENV === 'dev'
    ? 'https://local.beacondates.com'
    : 'https://www.beacondates.com',
  API_URL: process.env.NODE_ENV === 'dev'
    ? 'https://local.beacondates.com'
    : 'https://www.beacondates.com',
};
