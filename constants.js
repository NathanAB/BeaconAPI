const productionConfig = {
  APP_URL: 'https://app.beacondates.com',
  API_URL: 'https://api.beacondates.com',
};

const stagingConfig = {
  APP_URL: 'https://app-staging.beacondates.com',
  API_URL: 'https://api-staging.beacondates.com',
};

const localConfig = {
  APP_URL: 'https://local.beacondates.com',
  API_URL: 'https://local.beacondates.com',
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
