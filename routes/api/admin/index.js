const Router = require('express-promise-router');
const datePlan = require('./datePlan');
const users = require('./users');
const { ADMINS } = require('./utils');

const router = new Router();

const validateAdmin = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  if (!req.session || !req.session.passport || !req.session.passport.user) {
    console.error('Missing auth data attempting to execute admin action');
    res.sendStatus(401);
    return;
  }

  const { email } = req.session.passport.user.profile;

  if (!ADMINS.includes(email)) {
    console.error(`Non-admin ${email} is attempting to execute admin action!`);
    res.sendStatus(403);
    return;
  }

  console.log(`Admin ${email} is executing an admin action`);

  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
    return;
  }

  next();
};

router.use(validateAdmin);
router.use('/users', users);
router.use('/datePlan', datePlan);

module.exports = router;
