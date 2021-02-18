const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

router.patch('/', async (req, res) => {
  console.log('Patching user:', req.body);
  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!req.body) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const userData = req.body;
    delete userData.isNew;
    delete userData.isCreator;
    delete userData.id;
    const savedData = await db.updateUser({ email, userData });
    res.status(200);
    res.json(savedData);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
