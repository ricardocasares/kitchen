/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:middleware:projectLimit');
var ForbiddenError = require.main.require('./errors').ForbiddenError;

/**
 * Module exports
 */
module.exports = projectLimit;

/**
 * Check project creation limits
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function projectLimit (req, res, next) {
  var Project = req.db.model('Project');
  Project.count({}, function(err, count) {
    if(err) {
      return next(err);
    }
    if(count >= req.account.limits.projects) {
      debug(
        'project limit for account %s reached (limit was %s)',
        req.account.name,
        req.account.limits.projects
      );
      var msg = 'You have reached your ' + req.account.limits.projects + ' project limit.';
      return next(new ForbiddenError(msg));
    }
    next();
  });
}
