const Router = require('express-promise-router');

const CONSTANTS = require('../../constants');

const router = new Router();

router.get('/', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(CONSTANTS.APP_URL);
});

module.exports = router;
