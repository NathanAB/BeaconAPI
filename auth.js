const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const googleConfig = require('./google-config');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy({
    clientID: googleConfig.clientId,
    clientSecret: googleConfig.clientSecret,
    callbackURL: '/login/google/callback',
  },
  (token, refreshToken, profile, done) => done(null, {
    profile,
    token,
  })));
};
