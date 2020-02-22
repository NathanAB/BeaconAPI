const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const activities = await db.getAllActivities();
  res.json(activities);
});

module.exports = router;
