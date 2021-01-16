const dates = require('./api/dates');
const adminRouter = require('./api/admin/datePlan');
const auth = require('./api/auth');
const tags = require('./api/tags');
const activities = require('./api/activities');
const neighborhoods = require('./api/neighborhoods');
const userDates = require('./api/userDates');
const likedDates = require('./api/likedDates');
const thumbnail = require('./api/thumbnail');
const comments = require('./api/comments');
const users = require('./api/users');
const login = require('./login');
const logout = require('./logout');

module.exports = (app) => {
  app.use('/api/dates', dates);
  app.use('/api/auth', auth);
  app.use('/api/tags', tags);
  app.use('/api/activities', activities);
  app.use('/api/neighborhoods', neighborhoods);
  app.use('/api/userDates', userDates);
  app.use('/api/likedDates', likedDates);
  app.use('/api/thumbnail', thumbnail);
  app.use('/api/comments', comments);
  app.use('/api/users', users);
  app.use('/login', login);
  app.use('/logout', logout);
  app.use('/api/admin', adminRouter);
};
