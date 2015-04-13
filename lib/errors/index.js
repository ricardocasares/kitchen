var subclassError = require('subclass-error');

exports.NotFoundError = subclassError('NotFoundError', { statusCode: 404 });
exports.ForbiddenError = subclassError('ForbiddenError', { statusCode: 403 });
