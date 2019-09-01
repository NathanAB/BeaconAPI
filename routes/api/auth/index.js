const Router = require('express-promise-router');

const router = new Router();

router.get('/', (req, res) => {
  if (req.session.token) {
    res.cookie('token', req.session.token);
    res.json(req.session.passport.user.profile);
  } else {
    res.cookie('token', '');
    res.sendStatus(401);
  }
});

module.exports = router;
