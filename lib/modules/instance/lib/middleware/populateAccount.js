/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var debug = require('debug')('app:middleware:populateAccount');
var accountSchema = require('../schemas/Account');
var cfg = require.main.require('../lib/config').mongo;
var NotFoundError = require.main.require('../lib/errors').NotFoundError;

/**
 * Module exports
 */

module.exports = populateAccount;

/**
 * Module variables
 */
var db = 'mongodb://' + cfg.host + ':' + cfg.port + '/' + cfg.db;
var connection = mongoose.connect(db);
connection.model('Account', accountSchema);

/**
 * Gets the account
 * @param  {Request}   req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function} next Callback
 */
function populateAccount (req, res, next) {
  var sub = req.sub = req.vhost[0];
  var Account = connection.model('Account');
  Account.findOne({ name: sub }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug(sub, ' account not found');
      return next(new NotFoundError('Account not found'));
    }
    debug('using account', account.name);
    req.account = account;
    next();
  });
}
