const productionConfig = {
  APP_URL: 'https://www.beacondates.com',
  API_URL: 'https://api.beacondates.com',
};

const stagingConfig = {
  APP_URL: 'https://app-staging.beacondates.com',
  API_URL: 'https://api-staging.beacondates.com',
};

const localConfig = {
  APP_URL: 'http://local.beacondates.com:3000',
  API_URL: 'http://local.beacondates.com:3000',
};

switch (process.env.APP_ENV) {
  case 'production':
    module.exports = productionConfig;
    break;
  case 'staging':
    module.exports = stagingConfig;
    break;
  default:
    module.exports = localConfig;
}
