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
    const likedDates = await db.getLikedDates(email);
    res.json(likedDates);
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
});

router.post('/', async (req, res) => {
  console.log('Liking date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body || !req.body.dateId) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const { dateId } = req.body;
    await db.likeDate({ email, dateId });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.delete('/', async (req, res) => {
  console.log('Unliking date:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body || !req.body.dateId) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const { dateId } = req.body;
    await db.unlikeDate({ email, dateId });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
