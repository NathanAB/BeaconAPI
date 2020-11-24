const Router = require('express-promise-router');

const db = require('../../../db');

const router = new Router();

router.post('/', async (req, res) => {
  const { body } = req;
  console.log('Submitting comment');

  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!body || !body.dateId || !body.content) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const { dateId, content } = req.body;
    await db.addComment({ email, dateId, content });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.delete('/', async (req, res) => {
  const { body } = req;
  console.log('Deleting comment');

  if (!req.session.token) {
    res.cookie('token', '');
    return res.sendStatus(401);
  }

  if (!body || !body.commentId) {
    return res.sendStatus(400);
  }

  try {
    const { email } = req.session.passport.user.profile;
    const { commentId } = req.body;
    await db.deleteComment({ email, commentId });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
