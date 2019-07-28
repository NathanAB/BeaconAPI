const dates = require('./dates');

module.exports = app => {
  app.use('/dates', dates)
};
