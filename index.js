const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const auth = require('./auth');

const app = express();

auth(passport);
app.use(cookieSession({
  name: 'session',
  keys: ['123'],
}));
app.use(cookieParser());
app.use(passport.initialize());
app.get('/api/auth', (req, res) => {
  if (req.session.token) {
    res.cookie('token', req.session.token);
    res.json({
      token: req.session.token,
    });
  } else {
    res.cookie('token', '');
    res.sendStatus(401);
  }
});


app.get('/login/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile'],
}));

app.get('/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
