/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:middleware:logoutHandler');
var UnauthorizedError = require.main.require('./errors').UnauthorizedError;

/**
 * Module exports
 */
module.exports = logoutHandler;

/**
 * Handles user logout
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function logoutHandler (req, res, next) {
  if(req.user) {
    debug('logging out user', req.user.email);
    req.logout();
    res.status(204).send();
  }
  else {
    next(new UnauthorizedError('Authentication required'));
  }
}
