module.exports = {
  APP_URL: process.env.NODE_ENV === 'dev'
    ? 'https://local.beacondates.com'
    : 'https://app.beacondates.com',
  API_URL: process.env.NODE_ENV === 'dev'
    ? 'https://local.beacondates.com'
    : 'https://api.beacondates.com',
};
