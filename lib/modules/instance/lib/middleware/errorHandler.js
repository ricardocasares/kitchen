var merge = require('lodash/object/merge');
module.exports = errorHandler;

function errorHandler (err, req, res, next) {
  var error = {
    status: err.status || 500,
    name: err.name || 'ApplicationError',
    message: err.message || 'Internal Server Error'
  };
  
  res
    .status(error.status)
    .json(merge(error, err));
}
