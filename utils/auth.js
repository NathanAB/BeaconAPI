/* eslint-disable camelcase, no-underscore-dangle */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const db = require('../db');
const constants = require('../constants');

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || console.error('Missing Google client id!'),
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || console.error('Missing Google client secret!'),
};
const facebookConfig = {
  clientId: process.env.FACEBOOK_CLIENT_ID || console.error('Missing Facebook client id!'),
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || console.error('Missing Facebook client secret!'),
};

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
    callbackURL: `${constants.API_URL}/login/google/callback`,
  },
  async (token, refreshToken, profile, done) => {
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
    const profileData = profile._json;
    const user = await db.getOrSetUser(profileData);
    done(null, {
      profile: { ...profileData, ...profile._json, id: user.id },
      token,
    });
  }));


  /* --- FACEBOOK --- */
  passport.use(new FacebookStrategy({
    clientID: facebookConfig.clientId,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: `${constants.API_URL}/login/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'photos'],
  }, async (token, refreshToken, profile, done) => {
    /* EXAMPLE: profile: {
      id: '116503069752664',
      name: {
        familyName: 'Bakirci',
        givenName: 'Nathan',
      },
      emails: [ { value: 'nathanb92@gmail.com' } ],
      provider: 'facebook',
      _json: {
        id: '116503069752664',
        email: 'nathanb92@gmail.com',
        last_name: 'Bakirci',
        first_name: 'Nathan'
      }
    } */
    const { first_name, last_name, email } = profile._json;
    const picture = profile._json.picture.data.url;
    const profileData = {
      name: `${first_name} ${last_name}`, given_name: first_name, family_name: last_name, email, picture,
    };
    const user = await db.getOrSetUser(profileData);
    done(null, {
      profile: { ...profileData, id: user.id },
      token,
    });
  }));
};
