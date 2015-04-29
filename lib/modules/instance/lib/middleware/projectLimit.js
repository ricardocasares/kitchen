var ForbiddenError = require.main.require('../lib/errors').ForbiddenError;

module.exports = projectLimit;

function projectLimit (req, res, next) {
  var Project = req.db.Project;
  Project.count({}, function(err, count) {
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
