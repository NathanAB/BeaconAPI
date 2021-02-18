const Router = require('express-promise-router');
const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  if (req.session.token) {
    res.cookie('token', req.session.token);
    const { email } = req.session.passport.user.profile;
    // res.json(req.session.passport.user.profile);
    const user = await db.getCurrentUser(email);
    res.json({ ...req.session.passport.user.profile, ...user });
  } else {
    res.cookie('token', '');
    res.sendStatus(401);
  }
});

module.exports = router;
