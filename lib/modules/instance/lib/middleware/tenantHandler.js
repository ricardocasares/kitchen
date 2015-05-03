/**
 * Module dependencies
 */
var pool = require.main.require('../lib/utils/mongoose-pool');

/**
 * Module exports
 */
module.exports = tenantHandler;

/**
 * Selects database connection based on subdomain
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function tenantHandler (req, res, next) {
  var db = pool.getConnection(req.vhost[0]);
  req.db = db.conn;
  next();
}
