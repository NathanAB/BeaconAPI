const Router = require('express-promise-router');
const passport = require('passport');

const CONSTANTS = require('../../constants');

const router = new Router();

router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: CONSTANTS.APP_URL, // TODO: Do something with failure
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect(CONSTANTS.APP_URL);
  });

module.exports = router;
