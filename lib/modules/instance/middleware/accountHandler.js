/**
 * Module dependencies
 */
var cfg = require.main.require('./config').mongo;
var debug = require('debug')('app:instance:middleware:accountHandler');
var pool = require.main.require('./utils/mongoose-pool');
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
  var db = pool.getConnection(cfg.db);
  var Account = db.conn.model('Account');
  Account.findOne({ subdomain: req.vhost[0] }, function(err, account) {
    if(err) {
      debug(err);
      return next(err);
    }
    if(!account) {
      debug(req.vhost[0], 'account not found');
      return next(new NotFoundError('Account not found'));
    }
    
    debug(
      'selecting database %s for account %s',
      account.database,
      account.name
    );
    req.db = pool.getConnection(account.database).conn;
    req.account = account;    
    next();
  });
}
