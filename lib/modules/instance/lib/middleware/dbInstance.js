/**
 * Module dependencies
 */

var cfg = require.main.require('../lib/config').mongo;
var mongoose = require('mongoose');
var debug = require('debug')('app:middleware:dbInstance');

/**
 * Module exports
 */

module.exports = dbInstance; 

/**
 * Module variables
 */

var conns = [];

/**
 * Opens or reuse a database connection based on subdomain
 * @param  {Request}   req  Express request object
 * @param  {Response}  res  Express response object
 * @param  {Function}  next Callback
 */

function dbInstance (req, res, next) {
  var sub = req.sub;
	if (conns[sub]) {
		debug('reusing connection', sub, '...');
		req.db = conns[sub];
	} else {
		debug('creating new connection to', sub, '...');
    var url = 'mongodb://' + cfg.host + ':' + cfg.port + '/' + sub;
		conns[sub] = mongoose.createConnection(url);
		req.db = conns[sub];
	}
	next();
}
