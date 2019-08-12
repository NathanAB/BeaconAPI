const dates = require('./api/dates');
const auth = require('./api/auth');
const login = require('./login');
const logout = require('./logout');

module.exports = (app) => {
  app.use('/api/dates', dates);
  app.use('/api/auth', auth);
  app.use('/login', login);
  app.use('/logout', logout);
};
