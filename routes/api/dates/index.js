const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const dates = await db.getAllDates();
  res.json(dates);
});

module.exports = router;
