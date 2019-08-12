const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('../db');

const googleConfig = require('./google-config');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });
  passport.use(new GoogleStrategy({
    clientID: googleConfig.clientId,
    clientSecret: googleConfig.clientSecret,
    callbackURL: '/login/google/callback',
  },
  (token, refreshToken, profile, done) => {
    /* EXAMPLE: profile._json: {
      sub: '12345',
      name: 'Guy Person',
      given_name: 'Guy',
      family_name: 'Person',
      picture: 'https://somewhere.com/guy-person.jpg',
      email: 'guyperson@gmail.com',
      email_verified: true,
      locale: 'en'
    } */
    const profileData = profile._json; // eslint-disable-line no-underscore-dangle
    db.userLogin(profileData);
    done(null, {
      profile: profileData,
      token,
    });
  }));
};
