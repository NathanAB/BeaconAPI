const Router = require('express-promise-router');

const db = require('../../../../db');
const { ADMINS } = require('../utils');

const router = new Router();

router.post('/', async (req, res) => {
  console.log('Creating new date plan:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
  }

  try {
    const { email } = req.session.passport.user.profile;

    if (!ADMINS.includes(email)) {
      res.sendStatus(403);
      console.error(`Non-admin ${email} is attempting to execute admin action`);
    }

    if (!req.body || !req.body.name || !req.body.description) {
      res.sendStatus(400);
    }

    const newDate = await db.createDatePlan({ date: req.body });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});


module.exports = router;
