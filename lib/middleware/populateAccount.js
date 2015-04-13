/**
 * Module dependencies
 */

var debug = require('debug')('app:middleware:populateAccount');
var errors = require('../errors');

/**
 * Module exports
 */

module.exports = populateAccount;

/**
 * Gets the account
 * @param  {Request}   req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function} next Callback
 */
function populateAccount (req, res, next) {
  req.m.Account.findOne({ name: req.sub }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug('account not found');
      return next(new errors.NotFoundError('concha del mono'));
    }
    debug('using account', account);
    req.account = account;
    next();
  });
}
