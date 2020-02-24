const Router = require('express-promise-router');
const datePlan = require('./datePlan');
const { ADMINS } = require('./utils');

const router = new Router();

const checkAdmin = (req, res, next) => {
  if (!req.session || !req.session.passport || !req.session.passport.user) {
    console.error('Missing auth data attempting to execute admin action');
    return res.sendStatus(401);
  }

  const { email } = req.session.passport.user.profile;

  if (!ADMINS.includes(email)) {
    console.error(`Non-admin ${email} is attempting to execute admin action!`);
    return res.sendStatus(403);
  }

  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  next();
};

router.use(checkAdmin);
router.use(datePlan);

module.exports = router;
