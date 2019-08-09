const dates = require('./dates');
const login = require('./login');

module.exports = (app) => {
  app.use('/api/dates', dates);
  app.use('/api/login', login);
};
