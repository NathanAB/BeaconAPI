const Router = require('express-promise-router');

const db = require('../../../../db');
const { ADMINS } = require('../utils');

const router = new Router();

const validateAdmin = (req, res, next) => {
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

router.post('/datePlan', validateAdmin, async (req, res) => {
  console.log('Creating new date plan:', req.body);
  try {
    if (!req.body || !req.body.name || !req.body.description
        || !req.body.sections || !req.body.sections.length) {
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

router.patch('/datePlan', validateAdmin, async (req, res) => {
  console.log('Patching date plan:', req.body);
  try {
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

router.delete('/datePlan', validateAdmin, async (req, res) => {
  console.log('Deleting date plan:', req.body);
  try {
    if (!req.body || !req.body.id) {
      return res.sendStatus(400);
    }

    await db.deleteDatePlan({ date: req.body });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

module.exports = router;
