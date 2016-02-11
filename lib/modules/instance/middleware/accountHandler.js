/**
 * Module dependencies
 */
var cfg = require.main.require('./config');
var manager = require.main.require('./utils/mongoose-manager');
var debug = require('debug')('app:instance:middleware:accountHandler');
var NotFoundError = require.main.require('./errors').NotFoundError;

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
  var db = manager.getConnection(cfg.mongo);
  var Account = db.conn.model('Account');
  Account.findOne({ hostname: req.hostname }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug(req.hostname, 'account not found');
      return next(new NotFoundError('Account not found'));
    }
    
    debug('database connection request for account %s', account.hostname);
    req.db = manager.getConnection(account.mongo).conn;
    req.account = account;    
    next();
  });
}
