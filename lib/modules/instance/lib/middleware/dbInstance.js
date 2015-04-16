/**
 * Module dependencies
 */

var cfg = require.main.require('../lib/config').mongo;
// var ConnectionPool = require.main.require('../lib/utils/connectionPool');
var debug = require('debug')('app:middleware:dbInstance');

/**
 * Module exports
 */

module.exports = dbInstance; 

/**
 * Module variables
 */

// var connectionPool = new ConnectionPool({
//   poolSize: cfg.poolSize,
//   expiryPeriod: cfg.expiryPeriod,
//   checkPeriod: cfg.checkPeriod
// });

/**
 * Opens or reuse a database connection based on subdomain
 * @param  {Request}   req  Express request object
 * @param  {Response}  res  Express response object
 * @param  {Function}  next Callback
 */

function dbInstance (req, res, next) {
	// if (conns[req.sub]) {
	// 	debug('reusing connection', req.sub, '...');
	// 	req.db = conns[req.sub];
	// } else {
	// 	var url = 'mongodb://' + cfg.host + ':' + cfg.port + '/' + req.account.database;
 //    debug('creating new connection to', url, '...');
	// 	conns[req.sub] = mongoose.createConnection(url);
	// 	req.db = conns[req.sub];
	// }
  // req.db = connectionPool.getConnection(cfg.host, req.sub); 
	next();
}
