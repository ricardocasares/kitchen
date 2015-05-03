/**
 * Module dependencies
 */
var cfg = require.main.require('../lib/config').mongo;
var debug = require('debug')('app:middleware:accountHandler');
var pool = require.main.require('../lib/utils/mongoose-pool');
var NotFoundError = require.main.require('../lib/errors').NotFoundError;

/**
 * Module exports
 */
module.exports = accountHandler;

/**
 * Gets the account
 * @param  {Request}   req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function} next Callback
 */
function accountHandler (req, res, next) {
  var db = pool.getConnection(cfg.db);
  var Account = db.conn.model('Account');
  Account.findOne({ database: req.vhost[0] }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug(req.vhost[0], 'account not found');
      return next(new NotFoundError('Account not found'));
    }
    debug('using account', account.name);
    req.account = account;
    next();
  });
}
