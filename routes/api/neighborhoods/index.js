const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const neighborhoods = await db.getAllNeighborhoods();
  res.json(neighborhoods);
});

module.exports = router;
