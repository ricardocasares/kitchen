/**
 * Module dependencies
 */

var debug = require('debug')('app:modules:instance:middleware:errorHandler');
var merge = require('lodash/object/merge');

/**
 * Module exports
 */

module.exports = errorHandler;

/**
 * Handles application errors
 * @param  {Error}   err  Error object
 * @param  {Request}   req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function} next Callback
 */

function errorHandler (err, req, res, next) {
  var error = {
    status: err.status || 500,
    name: err.name || 'ApplicationError',
    message: err.message || 'Internal Server Error'
  };
  // show stack trace in development
  if(process.env.NODE_ENV === 'development') {
    debug(err, '\nRequest body:\n', req.body, '\nRequest params:\n', req.params);
    error.stack = err.stack;
  }
  res
    .status(error.status)
    .json(merge(error, err));
}
