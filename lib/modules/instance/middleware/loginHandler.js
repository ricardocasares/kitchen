/**
 * Module dependencies
 */
var passport = require('passport');
var UnauthorizedError = require.main.require('./errors').UnauthorizedError;

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
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new UnauthorizedError(info.message));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
}
