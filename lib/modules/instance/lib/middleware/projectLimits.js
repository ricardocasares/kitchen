var ForbiddenError = require.main.require('../lib/errors').ForbiddenError;

module.exports = projectLimits;

function projectLimits (req, res, next) {
  req.m.Project.count({}, function(err, count) {
    if(err) {
      return next(err);
    }
    if(count >= req.account.limits.projects) {
      var msg = 'You have reached your ' + req.account.limits.projects + ' project limit.';
      return next(new ForbiddenError(msg));
    }
    next();
  });
}
