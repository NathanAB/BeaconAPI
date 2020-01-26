const dates = require('./api/dates');
const adminDatePlan = require('./api/admin/datePlan');
const auth = require('./api/auth');
const tags = require('./api/tags');
const neighborhoods = require('./api/neighborhoods');
const userDates = require('./api/userDates');
const login = require('./login');
const logout = require('./logout');

module.exports = (app) => {
  app.use('/api/admin/datePlan', adminDatePlan);
  app.use('/api/dates', dates);
  app.use('/api/auth', auth);
  app.use('/api/tags', tags);
  app.use('/api/neighborhoods', neighborhoods);
  app.use('/api/userDates', userDates);
  app.use('/login', login);
  app.use('/logout', logout);
};
