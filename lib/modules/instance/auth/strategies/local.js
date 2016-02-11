/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:auth:local');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Module exports
 */
module.exports = new LocalStrategy({
    passReqToCallback: true,
  }, function(req, username, password, done) {
    debug('authenticating user %s', username);
    req.db.model('User').findOne({email: username}, function(err, user) {
      if(err) {
        debug('error authenticating user %s', username);
        return done(err);
      }
      if(!user) {
        debug('error authenticating user %s, bad credentials', username);
        return done(null, false, { message: 'Bad credentials'});
      }
      if(user) {
        debug('authentication succeeded');
        return done(null, user);
      }
    });
  }
);
