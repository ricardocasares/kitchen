/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:middleware:ensureAuthorized');
var ForbiddenError = require.main.require('./errors').ForbiddenError;

module.exports = function() {
  var roles = arguments;
  var length = roles.length;

  function userHasRole(userRoles) {
    for(var i = 0; i < length; i++) {
      if(userRoles[roles[i]] === true) {
        debug('user %s %s, proceding', userRoles.email, roles[i]);
        return true;
      }
    }
  }

  return function ensureAuthorized(req, res, next) {
    if(userHasRole(req.user)) {
      return next();
    }
    debug('user %s is not authorized to perform this action', req.user.name);
    return next(new ForbiddenError('Not enough privileges'));
  };
};
