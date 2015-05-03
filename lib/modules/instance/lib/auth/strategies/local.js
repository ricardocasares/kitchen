/**
 * Module dependencies
 */
var LocalStrategy = require('passport-local').Strategy;

/**
 * Module exports
 */
module.exports = new LocalStrategy({
    passReqToCallback: true,
  }, function(req, username, password, done) {
    req.db.model('User').findOne({email:username}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: 'Bad credentials'});
      }
      if(user) {
        return done(null, user);
      }
    });
  }
);
