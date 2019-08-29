const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
    return;
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDates = await db.getUserDates(email);
    res.json(userDates);
  } catch (err) {
    res.sendStatus(401);
    console.error(err);
  }
});

router.post('/', async (req, res) => {
  console.log('Saving date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
  }

  if (!req.body || !req.body.name || !req.body.dateId || !req.body.startTime) {
    res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDate = req.body;
    const newDate = await db.createUserDate({ email, userDate });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.patch('/', async (req, res) => {
  console.log('Patching date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
  }

  if (!req.body || !req.body.id || !req.body.name || !req.body.dateId || !req.body.startTime) {
    res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDate = req.body;
    const newDate = await db.updateUserDate({ email, userDate });
    res.status(200);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

module.exports = router;
