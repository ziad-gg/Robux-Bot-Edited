const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const client = require('../../index.js');
const { PROJECT_LINK } = require('../../src/Constants.js');

module.exports = function (passport) {
  const scopes = ['identify'];

  passport.use(
    new DiscordStrategy(
      {
        clientID: client.user.id,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: PROJECT_LINK + '/login/api',
        scope: scopes,
      },
      function (accessToken, refreshToken, profile, cb) {
        if (true) {
          return cb(null, profile);
        } else {
          return cb(null, false, {
            message: 'Unauthorised! Please add your client ID to the config!',
          });
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
