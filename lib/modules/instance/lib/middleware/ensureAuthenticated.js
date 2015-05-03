/**
 * Module dependencies
 */
var UnauthorizedError = require.main.require('../lib/errors').UnauthorizedError;

/**
 * Module exports
 */
module.exports = ensureAuthenticated;

/**
 * Checks if request is authenticated
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  next(new UnauthorizedError('Authentication required'));
}
