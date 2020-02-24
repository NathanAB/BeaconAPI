const Router = require('express-promise-router');

const db = require('../../../../db');
const { ADMINS } = require('../utils');

const router = new Router();

router.post('/datePlan', async (req, res) => {
  console.log('Creating new date plan:', req.body);
  // if (!req.session.token) {
  //   res.cookie('token', '');
  //   res.sendStatus(401);
  // }

  // try {
  //   if (!req.body || !req.body.name || !req.body.description) {
  //     res.sendStatus(400);
  //   }

  //   const newDate = await db.createDatePlan({ date: req.body });
  //   res.status(201);
  //   res.json(newDate);
  // } catch (err) {
  //   res.sendStatus(500);
  //   console.error(err);
  // }
});

router.patch('/datePlan', async (req, res) => {
  console.log('Patching date plan:', req.body);
  try {
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

    if (!req.body || !req.body.name || !req.body.description) {
      return res.sendStatus(400);
    }

    await db.updateDatePlan({ date: req.body });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});


module.exports = router;
