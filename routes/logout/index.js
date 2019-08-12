const Router = require('express-promise-router');

const router = new Router();

router.get('/', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;
