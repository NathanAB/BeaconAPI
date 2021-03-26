const Router = require('express-promise-router');

const db = require('../../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const users = await db.getAllUsersAdmin();
  res.json(users);
});

router.patch('/', async (req, res) => {
  console.log('Patching user:', req.body);
  try {
    if (!req.body || !req.body.email || !req.body.userData) {
      return res.sendStatus(400);
    }

    await db.updateUser(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

module.exports = router;
