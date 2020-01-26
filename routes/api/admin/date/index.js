const Router = require('express-promise-router');

const db = require('../../../../db');
const { ADMINS } = require('../utils');

const router = new Router();

router.put('/', async (req, res) => {
  console.log('Creating new date plan:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
  }

  if (!req.body || !req.body.name || !req.body.dateId || !req.body.startTime) {
    res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;

    if (!ADMINS.includes(email)) {
      res.sendStatus(403);
      console.error(`Non-admin ${email} is attempting to execute admin action`);
    }

    const userDate = req.body;
    const newDate = await db.createUserDate({ email, userDate });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});


module.exports = router;
