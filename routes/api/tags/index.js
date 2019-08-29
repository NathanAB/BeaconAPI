const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const tags = await db.getAllTags();
  res.json(tags);
});

module.exports = router;
