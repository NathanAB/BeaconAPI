const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const initAuth = require('./utils/auth');
const initRoutes = require('./routes');

const app = express();

initAuth(passport);

app.use(cookieSession({
  name: 'session',
  keys: ['123'],
}));

app.use(cookieParser());

app.use(passport.initialize());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'app.beacondates.com');
  next();
});

initRoutes(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
