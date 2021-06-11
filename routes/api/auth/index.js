const Router = require('express-promise-router');
const moment = require('moment');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  if (req.session.token) {
    res.cookie('token', req.session.token);
    const { email } = req.session.passport.user.profile;
    // res.json(req.session.passport.user.profile);
    const user = await db.getCurrentUser(email);

    // Start trial if user is new
    if (!user.dataValues.membershipEnd) {
      const trialEndDate = moment().add(10, 'days').format('YYYY-MM-DD HH:mm:ss');
      db.setMembershipEnd({ email, newEndDate: trialEndDate });
      user.dataValues.membershipEnd = trialEndDate;
    }

    res.json({ ...req.session.passport.user.profile, ...user });
  } else {
    res.cookie('token', '');
    res.sendStatus(401);
  }
});

module.exports = router;
