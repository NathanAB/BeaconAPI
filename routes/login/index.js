const Router = require('express-promise-router');
const passport = require('passport');

const router = new Router();

router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect('/');
  });

module.exports = router;
