const Router = require('express-promise-router');

const db = require('../../../../db');
const { ADMINS } = require('../utils');

const router = new Router();

router.post('/', async (req, res) => {
  console.log('Creating new date plan:', req.body);
  try {
    if (!req.body || !req.body.name || !req.body.description
        || !req.body.sections || !req.body.sections.length) {
      res.sendStatus(400);
    }

    const newDate = await db.createDatePlan({ date: req.body });
    res.status(201);
    res.json(newDate);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.patch('/', async (req, res) => {
  console.log('Patching date plan:', req.body);
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      return res.sendStatus(400);
    }

    await db.updateDatePlan({ date: req.body });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.delete('/', async (req, res) => {
  console.log('Deleting date plan:', req.body);
  try {
    if (!req.body || !req.body.id) {
      return res.sendStatus(400);
    }

    await db.deleteDatePlan({ date: req.body });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

module.exports = router;
