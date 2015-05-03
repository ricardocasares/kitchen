/**
 * Module dependencies
 */
var debug = require('debug')('app:middleware:loginHandler');
var passport = require('passport');
var UnauthorizedError = require.main.require('../lib/errors').UnauthorizedError;

/**
 * Module exports
 */
module.exports = loginHandler;

/**
 * Handles user login
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function loginHandler(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    debug('authenticating user', user.email);
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new UnauthorizedError(info));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
}
