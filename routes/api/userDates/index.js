const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDates = await db.getUserDates(email);
    res.json(userDates);
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
});

router.post('/', async (req, res) => {
  console.log('Saving date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body || !req.body.name || !req.body.dateId || !req.body.startTime) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDate = req.body;
    const newDate = await db.createUserDate({ email, userDate });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.patch('/', async (req, res) => {
  console.log('Patching date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body || !req.body.id || !req.body.name || !req.body.dateId || !req.body.startTime) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDate = req.body;
    const newDate = await db.updateUserDate({ email, userDate });
    res.status(200);
    res.json(newDate);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.delete('/', async (req, res) => {
  console.log('Deleting date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body || !req.body.dateId) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userDate = req.body;
    const newDate = await db.deleteUserDate({ email, userDate });
    res.status(200);
    res.json(newDate);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
