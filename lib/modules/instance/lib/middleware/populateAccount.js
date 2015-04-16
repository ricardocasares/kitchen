/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var debug = require('debug')('app:middleware:populateAccount');
var accountSchema = require.main.require('../lib/schemas/Account');
var projectSchema = require.main.require('../lib/schemas/Project');
var cfg = require.main.require('../lib/config').mongo;
var NotFoundError = require.main.require('../lib/errors').NotFoundError;

/**
 * Module exports
 */

module.exports = populateAccount;

/**
 * Module variables
 */


/**
 * Gets the account
 * @param  {Request}   req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function} next Callback
 */

function populateAccount (req, res, next) {
  req.sub = req.vhost[0];
  var Account = connection.model('Account');
  Account.findOne({ subdomain: req.sub }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug(req.sub, 'account not found');
      return next(new NotFoundError('Account not found'));
    }
    debug('using account', account.name);
    req.account = account;
    next();
  });
}
