const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

module.exports = router;
