const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

const validateCreator = async (req, res, next) => {
  if (!req.session || !req.session.passport || !req.session.passport.user) {
    console.error('Missing auth data attempting to execute admin action');
    res.sendStatus(401);
    return;
  }

  const { email } = req.session.passport.user.profile;
  const user = await db.getUser(email);
  req.userId = user.id;
  if (!user.isCreator) {
    console.error(`Non-date-creator ${email} is attempting to execute date creator action!`);
    res.sendStatus(403);
    return;
  }

  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
    return;
  }

  next();
};

router.get('/', async (req, res) => {
  const dates = await db.getAllDates();
  res.json(dates);
});

router.post('/', validateCreator, async (req, res) => {
  console.log('Creating new date plan:', req.body);
  try {
    if (!req.body || !req.body.name || !req.body.description
        || !req.body.sections || !req.body.sections.length) {
      res.sendStatus(400);
    }

    // Ensure that date creators cannot enable their own dates
    req.body.active = false;
    req.body.creator = req.userId;

    const newDate = await db.createDatePlan({ date: req.body });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.patch('/', validateCreator, async (req, res) => {
  console.log('Patching date plan:', req.body);
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      return res.sendStatus(400);
    }

    const dateObj = await db.getDate(req.body.id);

    // Do not allow date creators to modify active dates
    if (dateObj.active) {
      return res.sendStatus(403);
    }

    req.body.active = false;
    req.body.creator = req.userId;

    await db.updateDatePlan({ date: req.body });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

module.exports = router;
