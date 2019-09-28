const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');

let googleConfig;
let facebookConfig;

try {
  // eslint-disable-next-line global-require
  googleConfig = require('./google-config');
  // eslint-disable-next-line global-require
  facebookConfig = require('./facebook-config');
} catch (e) {
  console.warn(e); // eslint-disable-line no-console
  googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
  facebookConfig = {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  };
}


module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });


  /* --- GOOGLE --- */
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
    db.getOrSetUser(profileData);
    done(null, {
      profile: profileData,
      token,
    });
  }));


  /* --- FACEBOOK --- */
  passport.use(new FacebookStrategy({
    clientID: facebookConfig.clientId,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: '/login/facebook/callback',
  }, (token, refreshToken, profile, done) => {
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
    const { id, name, emails } = profile;
    console.log('Facebook user', id, name, emails);
    done(null, {
      profile,
      token,
    });
  }));
};
