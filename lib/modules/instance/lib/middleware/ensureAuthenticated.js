/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:middleware:ensureAuthenticated');
var UnauthorizedError = require.main.require('./errors').UnauthorizedError;

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
    debug('user %s is authenticated', req.user.email);
    return next();
  }
  debug('user is not authenticated');
  next(new UnauthorizedError('Authentication required'));
}
