const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const initAuth = require('./utils/auth');
const initRoutes = require('./routes');
const { APP_URL } = require('./constants');

const app = express();

initAuth(passport);

app.use(cookieSession({
  name: 'session',
  keys: ['123'],
}));

app.use(cookieParser());

app.use(passport.initialize());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', APP_URL);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Accept, Accept-Language, Content-Language, Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET, OPTIONS');

  next();
});

app.use(bodyParser.json());

initRoutes(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
