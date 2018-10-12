import passport from 'passport';
import {Strategy} from 'passport-oauth2';
import {CONFIG} from '../utils/config.util';

const profileStrategy = new Strategy(
  {
    authorizationURL: CONFIG.app.host + '/oauth/authorize',
    tokenURL: CONFIG.app.host + '/oauth/token',
    clientID: CONFIG.smaug.hejmdalClientId,
    clientSecret: 'foo',
    callbackURL: CONFIG.app.host + '/profile/provider/callback'
  },
  function(token, tokenSecret, profile, done) {
    done(null, token);
  }

);

passport.use('profile', profileStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(userId, done) {
  done(null, {id: userId});
});

export default app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
