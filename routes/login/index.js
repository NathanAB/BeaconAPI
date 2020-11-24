const Router = require('express-promise-router');
const passport = require('passport');

const CONSTANTS = require('../../constants');

const router = new Router();


/* --- GOOGLE --- */
router.get('/google', (req, res, next) => {
  req.session.returnTo = req.param('redirectUrl');
  console.log(req.session.returnTo);
  next();
}, passport.authenticate('google', {
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
    res.redirect(req.session.returnTo || CONSTANTS.APP_URL);
  });


/* --- FACEBOOK --- */
router.get('/facebook', (req, res, next) => {
  req.session.returnTo = req.param('redirectUrl');
  console.log(req.session.returnTo);
  next();
}, passport.authenticate('facebook', {
  scope: ['public_profile', 'email'],
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: CONSTANTS.APP_URL, // TODO: Do something with failure
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect(req.session.returnTo || CONSTANTS.APP_URL);
  });


module.exports = router;
